const STORAGE_KEY = "english-memory-game-progress-v1";

const preparedWords = (window.WORDS || []).map((entry, index) => ({
  ...entry,
  id: makeId(entry.english, index),
  displayEnglish: entry.displayEnglish || entry.english,
  speakText: entry.speakText || entry.english,
  acceptedAnswers: [entry.english, ...(entry.acceptedAnswers || [])]
}));

const persistent = loadProgress();

const state = {
  mode: "cards",
  autoSpeak: persistent.settings.autoSpeak,
  hardOnly: persistent.settings.hardOnly,
  hardWordIds: new Set(persistent.hardWordIds),
  wordScores: persistent.wordScores,
  stats: persistent.stats,
  cardDeck: [],
  writingDeck: [],
  cardIndex: 0,
  writingIndex: 0,
  cardRevealed: false,
  writingChecked: false,
  feedback: { type: "", text: "" },
  useAllWordsFallback: false,
  voices: []
};

const els = {
  totalWords: document.querySelector("#totalWords"),
  hardWords: document.querySelector("#hardWords"),
  writingAccuracy: document.querySelector("#writingAccuracy"),
  bestStreak: document.querySelector("#bestStreak"),
  modeButtons: Array.from(document.querySelectorAll(".mode-button")),
  autoSpeak: document.querySelector("#autoSpeak"),
  hardOnly: document.querySelector("#hardOnly"),
  shuffleButton: document.querySelector("#shuffleButton"),
  resetButton: document.querySelector("#resetButton"),
  modeLabel: document.querySelector("#modeLabel"),
  promptLabel: document.querySelector("#promptLabel"),
  progressChip: document.querySelector("#progressChip"),
  cardCaption: document.querySelector("#cardCaption"),
  wordText: document.querySelector("#wordText"),
  wordHint: document.querySelector("#wordHint"),
  translationBox: document.querySelector("#translationBox"),
  translationText: document.querySelector("#translationText"),
  writingForm: document.querySelector("#writingForm"),
  answerInput: document.querySelector("#answerInput"),
  feedback: document.querySelector("#feedback"),
  cardActions: document.querySelector("#cardActions"),
  writingActions: document.querySelector("#writingActions"),
  speakCardButton: document.querySelector("#speakCardButton"),
  revealButton: document.querySelector("#revealButton"),
  knowButton: document.querySelector("#knowButton"),
  repeatButton: document.querySelector("#repeatButton"),
  speakWritingButton: document.querySelector("#speakWritingButton"),
  checkButton: document.querySelector("#checkButton"),
  showAnswerButton: document.querySelector("#showAnswerButton"),
  nextButton: document.querySelector("#nextButton"),
  cardsReviewed: document.querySelector("#cardsReviewed"),
  cardsKnown: document.querySelector("#cardsKnown"),
  writingAnswered: document.querySelector("#writingAnswered"),
  currentStreak: document.querySelector("#currentStreak"),
  supportNote: document.querySelector("#supportNote")
};

init();

function init() {
  setupVoices();
  bindEvents();
  els.autoSpeak.checked = state.autoSpeak;
  els.hardOnly.checked = state.hardOnly;
  rebuildDecks();
  render(false);
}

function bindEvents() {
  els.modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (state.mode === button.dataset.mode) {
        return;
      }

      state.mode = button.dataset.mode;
      state.feedback = { type: "", text: "" };
      render(true);
      saveProgress();
    });
  });

  els.autoSpeak.addEventListener("change", () => {
    state.autoSpeak = els.autoSpeak.checked;
    saveProgress();
  });

  els.hardOnly.addEventListener("change", () => {
    state.hardOnly = els.hardOnly.checked;
    rebuildDecks();
    render(true);
    saveProgress();
  });

  els.shuffleButton.addEventListener("click", () => {
    rebuildDecks();
    state.feedback = {
      type: "info",
      text: state.hardOnly && state.useAllWordsFallback
        ? "Сложных слов пока нет, поэтому я показала весь набор."
        : "Слова перемешаны."
    };
    render(true);
  });

  els.resetButton.addEventListener("click", () => {
    const shouldReset = window.confirm("Сбросить статистику и список сложных слов?");

    if (!shouldReset) {
      return;
    }

    state.hardWordIds = new Set();
    state.wordScores = {};
    state.stats = createDefaultStats();
    rebuildDecks();
    state.feedback = {
      type: "info",
      text: "Прогресс очищен. Можно начинать заново."
    };
    render(true);
    saveProgress();
  });

  els.speakCardButton.addEventListener("click", () => speakCurrentWord());
  els.speakWritingButton.addEventListener("click", () => speakCurrentWord());

  els.revealButton.addEventListener("click", () => {
    state.cardRevealed = true;
    state.feedback = { type: "", text: "" };
    render(false);
  });

  els.knowButton.addEventListener("click", () => markCard(true));
  els.repeatButton.addEventListener("click", () => markCard(false));

  els.checkButton.addEventListener("click", checkWritingAnswer);
  els.showAnswerButton.addEventListener("click", revealWritingAnswer);
  els.nextButton.addEventListener("click", nextWritingWord);

  els.writingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (state.writingChecked) {
      nextWritingWord();
      return;
    }

    checkWritingAnswer();
  });
}

function rebuildDecks() {
  const sourceWords = getActiveWords();
  state.cardDeck = shuffle(sourceWords);
  state.writingDeck = shuffle(sourceWords);
  state.cardIndex = 0;
  state.writingIndex = 0;
  state.cardRevealed = false;
  state.writingChecked = false;
  els.answerInput.value = "";
}

function getActiveWords() {
  state.useAllWordsFallback = false;

  if (!state.hardOnly) {
    return preparedWords.slice();
  }

  const hardWords = preparedWords.filter((entry) => state.hardWordIds.has(entry.id));

  if (hardWords.length > 0) {
    return hardWords;
  }

  state.useAllWordsFallback = true;
  return preparedWords.slice();
}

function render(shouldAutoSpeak) {
  const current = getCurrentEntry();
  const total = getCurrentDeck().length || 1;
  const index = state.mode === "cards" ? state.cardIndex : state.writingIndex;

  els.modeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === state.mode);
  });

  updateSummaryStats();
  els.progressChip.textContent = `${index + 1} / ${total}`;
  renderFeedback();

  if (state.mode === "cards") {
    renderCardsMode(current);
  } else {
    renderWritingMode(current);
  }

  if (shouldAutoSpeak && state.autoSpeak) {
    speakEntry(current);
  }
}

function renderCardsMode(entry) {
  state.cardRevealed = Boolean(state.cardRevealed);
  els.modeLabel.textContent = "Карточки памяти";
  els.promptLabel.textContent = "Вспомните русский перевод, не открывая подсказку";
  els.cardCaption.textContent = "Английское слово";
  els.wordText.textContent = entry.displayEnglish;
  els.wordHint.textContent = state.cardRevealed
    ? "Отметьте, получилось ли вспомнить перевод без подсказки."
    : "Сначала попробуйте вспомнить перевод сами, потом откройте подсказку.";
  els.translationText.textContent = entry.russian;

  els.translationBox.classList.toggle("hidden", !state.cardRevealed);
  els.writingForm.classList.add("hidden");
  els.cardActions.classList.remove("hidden");
  els.writingActions.classList.add("hidden");
  els.revealButton.classList.toggle("hidden", state.cardRevealed);
  els.knowButton.classList.toggle("hidden", !state.cardRevealed);
  els.repeatButton.classList.toggle("hidden", !state.cardRevealed);
}

function renderWritingMode(entry) {
  els.modeLabel.textContent = "Пиши по-английски";
  els.promptLabel.textContent = "Смотрите на русский перевод и пишите английский вариант";
  els.cardCaption.textContent = "Русский перевод";
  els.wordText.textContent = entry.russian;
  els.wordHint.textContent = "Можно слушать слово сколько угодно раз и потом написать ответ.";
  els.translationBox.classList.add("hidden");
  els.writingForm.classList.remove("hidden");
  els.cardActions.classList.add("hidden");
  els.writingActions.classList.remove("hidden");
  els.nextButton.classList.toggle("hidden", !state.writingChecked);
  els.answerInput.disabled = state.writingChecked;

  if (!state.writingChecked) {
    window.requestAnimationFrame(() => els.answerInput.focus());
  }
}

function markCard(remembered) {
  const entry = getCurrentEntry();
  state.stats.cardsReviewed += 1;

  if (remembered) {
    state.stats.cardsKnown += 1;
    adjustWordScore(entry.id, 1);
  } else {
    adjustWordScore(entry.id, -1);
  }

  state.cardRevealed = false;
  state.feedback = remembered
    ? { type: "success", text: `Отлично. "${entry.displayEnglish}" отмечено как знакомое.` }
    : { type: "info", text: `Добавила "${entry.displayEnglish}" в сложные слова для повторения.` };

  moveToNextCard();
  render(state.autoSpeak);
  saveProgress();
}

function checkWritingAnswer() {
  if (state.writingChecked) {
    nextWritingWord();
    return;
  }

  const entry = getCurrentEntry();
  const answer = normalizeText(els.answerInput.value);

  if (!answer) {
    state.feedback = { type: "info", text: "Сначала введите ответ, а потом нажмите проверку." };
    render(false);
    return;
  }

  state.stats.writingAnswered += 1;
  const accepted = entry.acceptedAnswers.map(normalizeText);
  const isCorrect = accepted.includes(answer);

  state.writingChecked = true;
  els.answerInput.disabled = true;

  if (isCorrect) {
    state.stats.writingCorrect += 1;
    state.stats.currentStreak += 1;
    state.stats.bestStreak = Math.max(state.stats.bestStreak, state.stats.currentStreak);
    adjustWordScore(entry.id, 2);
    state.feedback = { type: "success", text: `Верно: ${entry.displayEnglish}` };
  } else {
    state.stats.currentStreak = 0;
    adjustWordScore(entry.id, -2);
    state.feedback = { type: "error", text: `Правильный ответ: ${entry.displayEnglish}` };

    if (state.autoSpeak) {
      speakEntry(entry);
    }
  }

  render(false);
  saveProgress();
}

function revealWritingAnswer() {
  if (state.writingChecked) {
    return;
  }

  const entry = getCurrentEntry();
  adjustWordScore(entry.id, -1);
  state.stats.currentStreak = 0;
  state.writingChecked = true;
  els.answerInput.disabled = true;
  state.feedback = { type: "info", text: `Ответ: ${entry.displayEnglish}` };

  if (state.autoSpeak) {
    speakEntry(entry);
  }

  render(false);
  saveProgress();
}

function nextWritingWord() {
  state.writingChecked = false;
  els.answerInput.disabled = false;
  els.answerInput.value = "";
  state.feedback = { type: "", text: "" };

  state.writingIndex += 1;

  if (state.writingIndex >= state.writingDeck.length) {
    state.writingDeck = shuffle(getActiveWords());
    state.writingIndex = 0;
  }

  render(true);
}

function moveToNextCard() {
  state.cardIndex += 1;

  if (state.cardIndex >= state.cardDeck.length) {
    state.cardDeck = shuffle(getActiveWords());
    state.cardIndex = 0;
  }
}

function getCurrentDeck() {
  return state.mode === "cards" ? state.cardDeck : state.writingDeck;
}

function getCurrentEntry() {
  const deck = getCurrentDeck();
  return deck[state.mode === "cards" ? state.cardIndex : state.writingIndex];
}

function adjustWordScore(wordId, delta) {
  const nextScore = Math.max(-6, Math.min(6, (state.wordScores[wordId] || 0) + delta));
  state.wordScores[wordId] = nextScore;

  if (nextScore <= -1) {
    state.hardWordIds.add(wordId);
  } else if (nextScore >= 1) {
    state.hardWordIds.delete(wordId);
  }
}

function speakCurrentWord() {
  speakEntry(getCurrentEntry());
}

function speakEntry(entry) {
  if (!("speechSynthesis" in window)) {
    state.feedback = { type: "info", text: "В этом браузере озвучка недоступна." };
    render(false);
    return;
  }

  const utterance = new SpeechSynthesisUtterance(entry.speakText);
  utterance.lang = "en-US";
  utterance.rate = 0.95;
  utterance.pitch = 1;

  const selectedVoice = selectVoice(state.voices);
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function setupVoices() {
  if (!("speechSynthesis" in window)) {
    return;
  }

  const syncVoices = () => {
    state.voices = window.speechSynthesis.getVoices();
  };

  syncVoices();
  window.speechSynthesis.addEventListener("voiceschanged", syncVoices);
}

function selectVoice(voices) {
  if (!voices.length) {
    return null;
  }

  const preferredNames = ["Samantha", "Daniel", "Karen", "Moira"];

  return (
    voices.find((voice) => preferredNames.includes(voice.name)) ||
    voices.find((voice) => voice.lang.startsWith("en-US")) ||
    voices.find((voice) => voice.lang.startsWith("en-GB")) ||
    voices.find((voice) => voice.lang.startsWith("en")) ||
    null
  );
}

function renderFeedback() {
  els.feedback.className = "feedback hidden";

  if (!state.feedback.text) {
    return;
  }

  els.feedback.textContent = state.feedback.text;
  els.feedback.classList.remove("hidden");
  els.feedback.classList.add(state.feedback.type || "info");
}

function updateSummaryStats() {
  const accuracy = state.stats.writingAnswered
    ? Math.round((state.stats.writingCorrect / state.stats.writingAnswered) * 100)
    : 0;

  els.totalWords.textContent = preparedWords.length;
  els.hardWords.textContent = state.hardWordIds.size;
  els.writingAccuracy.textContent = `${accuracy}%`;
  els.bestStreak.textContent = state.stats.bestStreak;
  els.cardsReviewed.textContent = state.stats.cardsReviewed;
  els.cardsKnown.textContent = state.stats.cardsKnown;
  els.writingAnswered.textContent = state.stats.writingAnswered;
  els.currentStreak.textContent = state.stats.currentStreak;

  if (!("speechSynthesis" in window)) {
    els.supportNote.textContent = "В этом браузере не нашлась Web Speech API, поэтому озвучка может не работать.";
  } else if (state.hardOnly && state.useAllWordsFallback) {
    els.supportNote.textContent = "Сложных слов пока нет, поэтому в тренировке показываются все слова.";
  } else {
    els.supportNote.textContent = "Слушать слово можно в обоих режимах столько раз, сколько нужно.";
  }
}

function loadProgress() {
  const fallback = {
    hardWordIds: [],
    wordScores: {},
    stats: createDefaultStats(),
    settings: {
      autoSpeak: true,
      hardOnly: false
    }
  };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);

    return {
      hardWordIds: Array.isArray(parsed.hardWordIds) ? parsed.hardWordIds : fallback.hardWordIds,
      wordScores: parsed.wordScores && typeof parsed.wordScores === "object" ? parsed.wordScores : fallback.wordScores,
      stats: {
        ...createDefaultStats(),
        ...(parsed.stats || {})
      },
      settings: {
        autoSpeak: parsed.settings?.autoSpeak ?? fallback.settings.autoSpeak,
        hardOnly: parsed.settings?.hardOnly ?? fallback.settings.hardOnly
      }
    };
  } catch (error) {
    return fallback;
  }
}

function saveProgress() {
  const payload = {
    hardWordIds: [...state.hardWordIds],
    wordScores: state.wordScores,
    stats: state.stats,
    settings: {
      autoSpeak: state.autoSpeak,
      hardOnly: state.hardOnly
    }
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function createDefaultStats() {
  return {
    cardsReviewed: 0,
    cardsKnown: 0,
    writingAnswered: 0,
    writingCorrect: 0,
    currentStreak: 0,
    bestStreak: 0
  };
}

function shuffle(items) {
  const cloned = items.slice();

  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [cloned[index], cloned[randomIndex]] = [cloned[randomIndex], cloned[index]];
  }

  return cloned;
}

function normalizeText(value) {
  return value
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/[-/]/g, " ")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function makeId(text, index) {
  return `${text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "word"}-${index}`;
}
