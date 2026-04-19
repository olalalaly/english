const STORAGE_KEY = "english-memory-game-progress-v3";
const LEGACY_STORAGE_KEY = "english-memory-game-progress-v2";
const OLDER_STORAGE_KEY = "english-memory-game-progress-v1";
const GROUP_SIZE = 12;
const DEFAULT_RATING = 2;
const MAX_RATING = 5;
const HARD_RATING_THRESHOLD = 2;

const MODES = {
  cards: {
    id: "cards",
    label: "Карточки памяти",
    direction: "English → Russian",
    prompt: "Сначала вспомните перевод по памяти, потом откройте подсказку",
    caption: "Английское слово"
  },
  "write-en": {
    id: "write-en",
    label: "Русский → English",
    direction: "Русский → English",
    prompt: "Смотрите на русский перевод и пишите английский вариант",
    caption: "Русский перевод",
    inputLabel: "Напишите ответ по-английски",
    placeholder: "Введите английское слово или фразу",
    feedbackLabel: "Правильный ответ"
  },
  "write-ru": {
    id: "write-ru",
    label: "English → Русский",
    direction: "English → Русский",
    prompt: "Смотрите на английское слово и пишите перевод по-русски",
    caption: "Английское слово",
    inputLabel: "Напишите ответ по-русски",
    placeholder: "Введите русский перевод",
    feedbackLabel: "Один из правильных переводов"
  }
};

const FREQUENCY_THEME_STEPS = [
  { limit: 0.12, label: "Самые частые слова" },
  { limit: 0.24, label: "Очень частые слова" },
  { limit: 0.38, label: "Частые слова" },
  { limit: 0.5, label: "База для чтения" },
  { limit: 0.64, label: "Средняя частотность" },
  { limit: 0.76, label: "Чуть реже" },
  { limit: 0.88, label: "Редкие слова" },
  { limit: 1, label: "Очень редкие слова" }
];

const READING_STORY_FRAMES = [
  { start: "Chapter {group} opens the same notebook, and I begin with", end: "." },
  { start: "A little later, I repeat", end: " aloud and connect each item to the meaning." },
  { start: "In the next exercise, I write", end: " in short practice lines." },
  { start: "Before the page ends, I review", end: " one more time and carry them into the next chapter." }
];

function getFrequencyTheme(groupNumber, totalGroups) {
  if (totalGroups <= 1) {
    return FREQUENCY_THEME_STEPS[0].label;
  }

  const position = (groupNumber - 1) / (totalGroups - 1);

  return (
    FREQUENCY_THEME_STEPS.find((item) => position <= item.limit) ||
    FREQUENCY_THEME_STEPS[FREQUENCY_THEME_STEPS.length - 1]
  ).label;
}

const preparedWords = (window.WORDS || []).map((entry, index) => {
  const englishVariants = expandEnglishVariants([entry.english, ...(entry.acceptedAnswers || [])]);
  const russianVariants = uniqueValues([
    ...(entry.acceptedRussianAnswers || []),
    entry.russian,
    ...splitRussianVariants(entry.russian)
  ]);

  return {
    ...entry,
    id: makeId(entry.english, index),
    displayEnglish: entry.displayEnglish || entry.english,
    speakText: entry.speakText || entry.english,
    frequencyScore: Number(entry.frequencyScore) || 0,
    acceptedEnglishAnswers: englishVariants.map(normalizeEnglish).filter(Boolean),
    acceptedRussianAnswers: russianVariants.map(normalizeRussian).filter(Boolean),
    groupNumber: entry.group || Math.floor(index / GROUP_SIZE) + 1
  };
});

const wordGroups = buildGroups(preparedWords);
const readingTexts = buildReadingTexts(wordGroups);
const persistent = loadProgress();

const state = {
  view: normalizeView(persistent.settings.view),
  mode: normalizeMode(persistent.settings.mode),
  autoSpeak: persistent.settings.autoSpeak,
  hardOnly: persistent.settings.hardOnly,
  selectedGroup: normalizeSelectedGroup(persistent.settings.selectedGroup),
  ratings: persistent.ratings,
  stats: persistent.stats,
  deck: [],
  index: 0,
  cardRevealed: false,
  answerChecked: false,
  feedback: { type: "", text: "" },
  useAllWordsFallback: false,
  voices: []
};

const els = {
  totalWords: document.querySelector("#totalWords"),
  totalGroups: document.querySelector("#totalGroups"),
  averageRating: document.querySelector("#averageRating"),
  writingAccuracy: document.querySelector("#writingAccuracy"),
  viewButtons: Array.from(document.querySelectorAll(".view-button")),
  studyView: document.querySelector("#studyView"),
  textsView: document.querySelector("#textsView"),
  textsChip: document.querySelector("#textsChip"),
  textsNote: document.querySelector("#textsNote"),
  readingGrid: document.querySelector("#readingGrid"),
  modeButtons: Array.from(document.querySelectorAll(".mode-button")),
  groupSelect: document.querySelector("#groupSelect"),
  autoSpeak: document.querySelector("#autoSpeak"),
  hardOnly: document.querySelector("#hardOnly"),
  shuffleButton: document.querySelector("#shuffleButton"),
  resetButton: document.querySelector("#resetButton"),
  modeLabel: document.querySelector("#modeLabel"),
  promptLabel: document.querySelector("#promptLabel"),
  groupChip: document.querySelector("#groupChip"),
  progressChip: document.querySelector("#progressChip"),
  directionChip: document.querySelector("#directionChip"),
  ratingBadge: document.querySelector("#ratingBadge"),
  cardCaption: document.querySelector("#cardCaption"),
  wordText: document.querySelector("#wordText"),
  wordHint: document.querySelector("#wordHint"),
  translationBox: document.querySelector("#translationBox"),
  translationText: document.querySelector("#translationText"),
  answerLabel: document.querySelector("#answerLabel"),
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
  ratingButtons: Array.from(document.querySelectorAll(".rating-button")),
  cardsReviewed: document.querySelector("#cardsReviewed"),
  writingToEnglishAnswered: document.querySelector("#writingToEnglishAnswered"),
  writingToRussianAnswered: document.querySelector("#writingToRussianAnswered"),
  bestStreak: document.querySelector("#bestStreak"),
  supportNote: document.querySelector("#supportNote")
};

init();

function init() {
  populateGroupSelect();
  setupVoices();
  bindEvents();
  els.autoSpeak.checked = state.autoSpeak;
  els.hardOnly.checked = state.hardOnly;
  els.groupSelect.value = state.selectedGroup;
  rebuildDeck();
  render(false);
}

function bindEvents() {
  els.viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (state.view === button.dataset.view) {
        return;
      }

      state.view = button.dataset.view;
      render(false);
      saveProgress();
    });
  });

  els.modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (state.mode === button.dataset.mode) {
        return;
      }

      state.mode = button.dataset.mode;
      resetTurnState();
      state.feedback = { type: "", text: "" };
      render(true);
      saveProgress();
    });
  });

  els.groupSelect.addEventListener("change", () => {
    state.selectedGroup = normalizeSelectedGroup(els.groupSelect.value);
    rebuildDeck();
    state.feedback = { type: "", text: "" };
    render(false);
    saveProgress();
  });

  els.autoSpeak.addEventListener("change", () => {
    state.autoSpeak = els.autoSpeak.checked;
    saveProgress();
  });

  els.hardOnly.addEventListener("change", () => {
    state.hardOnly = els.hardOnly.checked;
    rebuildDeck();
    render(false);
    saveProgress();
  });

  els.shuffleButton.addEventListener("click", () => {
    rebuildDeck();
    state.feedback = {
      type: "info",
      text: state.hardOnly && state.useAllWordsFallback
        ? "В этой группе пока нет слов с низким рейтингом, поэтому показываю все слова выбранной группы."
        : "Слова в выбранной группе перемешаны."
    };
    render(false);
  });

  els.resetButton.addEventListener("click", () => {
    const shouldReset = window.confirm("Сбросить рейтинги слов и всю статистику?");

    if (!shouldReset) {
      return;
    }

    state.ratings = {};
    state.stats = createDefaultStats();
    rebuildDeck();
    state.feedback = {
      type: "info",
      text: "Рейтинги и статистика очищены. Можно начинать заново."
    };
    render(false);
    saveProgress();
  });

  els.speakCardButton.addEventListener("click", speakCurrentWord);
  els.speakWritingButton.addEventListener("click", speakCurrentWord);

  els.revealButton.addEventListener("click", () => {
    state.cardRevealed = true;
    state.feedback = { type: "", text: "" };
    render(false);
  });

  els.knowButton.addEventListener("click", () => markCard(true));
  els.repeatButton.addEventListener("click", () => markCard(false));
  els.checkButton.addEventListener("click", checkWritingAnswer);
  els.showAnswerButton.addEventListener("click", revealWritingAnswer);
  els.nextButton.addEventListener("click", nextWord);

  els.writingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (state.answerChecked) {
      nextWord();
      return;
    }

    checkWritingAnswer();
  });

  els.ratingButtons.forEach((button) => {
    button.addEventListener("click", () => setCurrentRating(Number(button.dataset.rating)));
  });
}

function populateGroupSelect() {
  const options = [
    { value: "all", label: `Все группы · ${preparedWords.length} слов` },
    ...wordGroups.map((group) => ({
      value: group.id,
      label: `${group.label} · ${group.theme} · ${group.words.length} слов`
    }))
  ];

  els.groupSelect.innerHTML = options
    .map((option) => `<option value="${option.value}">${option.label}</option>`)
    .join("");
}

function rebuildDeck() {
  state.deck = shuffle(getActiveWords());
  state.index = 0;
  resetTurnState();
}

function resetTurnState() {
  state.cardRevealed = false;
  state.answerChecked = false;
  els.answerInput.value = "";
  els.answerInput.disabled = false;
}

function getSelectedWords() {
  if (state.selectedGroup === "all") {
    return preparedWords.slice();
  }

  const foundGroup = wordGroups.find((group) => group.id === state.selectedGroup);
  return foundGroup ? foundGroup.words.slice() : wordGroups[0].words.slice();
}

function getActiveWords() {
  state.useAllWordsFallback = false;

  const selectedWords = getSelectedWords();

  if (!state.hardOnly) {
    return selectedWords;
  }

  const filtered = selectedWords.filter((entry) => getRating(entry.id) <= HARD_RATING_THRESHOLD);

  if (filtered.length > 0) {
    return filtered;
  }

  state.useAllWordsFallback = true;
  return selectedWords;
}

function render(shouldAutoSpeak) {
  if (!state.deck.length) {
    rebuildDeck();
  }

  updateViewState();
  updateSummaryStats();
  renderReadingTexts();

  if (state.view !== "study") {
    return;
  }

  const current = getCurrentEntry();
  const mode = MODES[state.mode];

  els.modeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === state.mode);
  });

  els.groupSelect.value = state.selectedGroup;
  updateProgress();
  renderFeedback();
  renderRating(current);

  els.modeLabel.textContent = mode.label;
  els.promptLabel.textContent = mode.prompt;
  els.directionChip.textContent = mode.direction;

  if (state.mode === "cards") {
    renderCardsMode(current);
  } else {
    renderWritingMode(current, mode);
  }

  if (shouldAutoSpeak && state.autoSpeak) {
    speakEntry(current);
  }
}

function updateViewState() {
  els.viewButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.view === state.view);
  });

  els.studyView.classList.toggle("hidden", state.view !== "study");
  els.textsView.classList.toggle("hidden", state.view !== "texts");
}

function updateProgress() {
  const total = state.deck.length || 1;
  const selectedWords = getSelectedWords();
  const currentGroup = wordGroups.find((group) => group.id === state.selectedGroup);

  els.progressChip.textContent = `${state.index + 1} / ${total}`;
  els.groupChip.textContent = state.selectedGroup === "all"
    ? `Все группы · ${selectedWords.length} слов`
    : `${currentGroup.label} · ${currentGroup.theme} · ${selectedWords.length} слов`;
}

function renderCardsMode(entry) {
  els.cardCaption.textContent = MODES.cards.caption;
  els.wordText.textContent = entry.displayEnglish;
  els.wordHint.textContent = state.cardRevealed
    ? "Отметьте, получилось ли вспомнить перевод без подсказки."
    : "Не открывайте перевод сразу. Попробуйте вспомнить его по памяти.";
  els.translationText.textContent = entry.russian;

  els.translationBox.classList.toggle("hidden", !state.cardRevealed);
  els.writingForm.classList.add("hidden");
  els.cardActions.classList.remove("hidden");
  els.writingActions.classList.add("hidden");
  els.revealButton.classList.toggle("hidden", state.cardRevealed);
  els.knowButton.classList.toggle("hidden", !state.cardRevealed);
  els.repeatButton.classList.toggle("hidden", !state.cardRevealed);
}

function renderWritingMode(entry, mode) {
  const isRussianWriting = state.mode === "write-ru";

  els.cardCaption.textContent = mode.caption;
  els.wordText.textContent = isRussianWriting ? entry.displayEnglish : entry.russian;
  els.wordHint.textContent = isRussianWriting
    ? "Слушайте слово и напишите один перевод по-русски."
    : "Слушайте слово и напишите английский вариант без подсказки.";
  els.answerLabel.textContent = mode.inputLabel;
  els.answerInput.placeholder = mode.placeholder;
  els.answerInput.inputMode = isRussianWriting ? "text" : "latin";
  els.answerInput.lang = isRussianWriting ? "ru" : "en";
  els.translationBox.classList.add("hidden");
  els.writingForm.classList.remove("hidden");
  els.cardActions.classList.add("hidden");
  els.writingActions.classList.remove("hidden");
  els.answerInput.disabled = state.answerChecked;
  els.nextButton.classList.toggle("hidden", !state.answerChecked);

  if (!state.answerChecked) {
    window.requestAnimationFrame(() => els.answerInput.focus());
  }
}

function renderRating(entry) {
  const rating = getRating(entry.id);
  els.ratingBadge.textContent = `Знаю на ${rating} / 5`;

  els.ratingButtons.forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.rating) === rating);
  });
}

function renderReadingTexts() {
  const orderedTexts = getOrderedReadingTexts();
  const selectedReading = state.selectedGroup === "all"
    ? null
    : orderedTexts.find((text) => text.id === state.selectedGroup);

  els.textsChip.textContent = `${readingTexts.length} текстов`;
  els.textsNote.textContent = selectedReading
    ? `${selectedReading.groupLabel} показана первой. Все тексты идут как одна учебная история. Наводите курсор на выделенное слово, чтобы увидеть перевод.`
    : "Все тексты идут как одна учебная история. Наводите курсор на выделенное слово, чтобы увидеть перевод. На телефоне можно нажать на слово.";

  els.readingGrid.innerHTML = orderedTexts.map((text) => `
    <article class="reading-card${text.id === state.selectedGroup ? " selected" : ""}">
      <div class="reading-head">
        <h3 class="reading-title">${escapeHtml(text.title)}</h3>
        <span class="reading-meta">${escapeHtml(text.groupLabel)} · ${text.wordCount} слов</span>
      </div>
      ${text.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
    </article>
  `).join("");
}

function getOrderedReadingTexts() {
  if (state.selectedGroup === "all") {
    return readingTexts.slice();
  }

  return readingTexts
    .slice()
    .sort((left, right) => {
      if (left.id === state.selectedGroup) {
        return -1;
      }

      if (right.id === state.selectedGroup) {
        return 1;
      }

      return Number(left.id) - Number(right.id);
    });
}

function markCard(remembered) {
  const entry = getCurrentEntry();
  state.stats.cardsReviewed += 1;

  if (remembered) {
    adjustRating(entry.id, 1);
    bumpStreak(true);
  } else {
    adjustRating(entry.id, -1);
    bumpStreak(false);
  }

  state.feedback = remembered
    ? { type: "success", text: `Отлично. "${entry.displayEnglish}" стало ближе к знакомым словам.` }
    : { type: "info", text: `Слово "${entry.displayEnglish}" осталось в активном повторении.` };

  moveToNextDeckEntry();
  render(state.autoSpeak);
  saveProgress();
}

function checkWritingAnswer() {
  if (state.answerChecked) {
    nextWord();
    return;
  }

  const entry = getCurrentEntry();
  const isRussianWriting = state.mode === "write-ru";
  const answer = isRussianWriting
    ? normalizeRussian(els.answerInput.value)
    : normalizeEnglish(els.answerInput.value);

  if (!answer) {
    state.feedback = { type: "info", text: "Сначала введите ответ, а потом нажмите проверку." };
    render(false);
    return;
  }

  const acceptedAnswers = isRussianWriting ? entry.acceptedRussianAnswers : entry.acceptedEnglishAnswers;
  const isCorrect = acceptedAnswers.includes(answer);
  const statsPrefix = isRussianWriting ? "writingToRussian" : "writingToEnglish";

  state.stats[`${statsPrefix}Answered`] += 1;
  state.answerChecked = true;
  els.answerInput.disabled = true;

  if (isCorrect) {
    state.stats[`${statsPrefix}Correct`] += 1;
    adjustRating(entry.id, 1);
    bumpStreak(true);
    state.feedback = {
      type: "success",
      text: `Верно: ${isRussianWriting ? entry.russian : entry.displayEnglish}`
    };
  } else {
    adjustRating(entry.id, -1);
    bumpStreak(false);
    state.feedback = {
      type: "error",
      text: `${MODES[state.mode].feedbackLabel}: ${isRussianWriting ? entry.russian : entry.displayEnglish}`
    };

    if (state.autoSpeak) {
      speakEntry(entry);
    }
  }

  render(false);
  saveProgress();
}

function revealWritingAnswer() {
  if (state.answerChecked) {
    return;
  }

  const entry = getCurrentEntry();
  const isRussianWriting = state.mode === "write-ru";

  adjustRating(entry.id, -1);
  bumpStreak(false);
  state.answerChecked = true;
  els.answerInput.disabled = true;
  state.feedback = {
    type: "info",
    text: `${MODES[state.mode].feedbackLabel}: ${isRussianWriting ? entry.russian : entry.displayEnglish}`
  };

  if (state.autoSpeak) {
    speakEntry(entry);
  }

  render(false);
  saveProgress();
}

function nextWord() {
  state.feedback = { type: "", text: "" };
  moveToNextDeckEntry();
  render(true);
  saveProgress();
}

function moveToNextDeckEntry() {
  state.index += 1;

  if (state.index >= state.deck.length) {
    state.deck = shuffle(getActiveWords());
    state.index = 0;
  }

  resetTurnState();
}

function setCurrentRating(rating) {
  const entry = getCurrentEntry();
  state.ratings[entry.id] = clampRating(rating);
  state.feedback = {
    type: "info",
    text: `Рейтинг для "${entry.displayEnglish}" сохранен: ${getRating(entry.id)} / 5.`
  };

  render(false);
  saveProgress();
}

function getCurrentEntry() {
  return state.deck[state.index] || preparedWords[0];
}

function getRating(wordId) {
  return clampRating(
    Number.isFinite(state.ratings[wordId]) ? state.ratings[wordId] : DEFAULT_RATING
  );
}

function adjustRating(wordId, delta) {
  state.ratings[wordId] = clampRating(getRating(wordId) + delta);
}

function clampRating(value) {
  return Math.max(0, Math.min(MAX_RATING, Number(value) || 0));
}

function bumpStreak(isSuccess) {
  if (isSuccess) {
    state.stats.currentStreak += 1;
    state.stats.bestStreak = Math.max(state.stats.bestStreak, state.stats.currentStreak);
  } else {
    state.stats.currentStreak = 0;
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
  const totalWritingAnswered = state.stats.writingToEnglishAnswered + state.stats.writingToRussianAnswered;
  const totalWritingCorrect = state.stats.writingToEnglishCorrect + state.stats.writingToRussianCorrect;
  const accuracy = totalWritingAnswered
    ? Math.round((totalWritingCorrect / totalWritingAnswered) * 100)
    : 0;
  const totalRatings = preparedWords.reduce((sum, entry) => sum + getRating(entry.id), 0);
  const averageRating = preparedWords.length ? (totalRatings / preparedWords.length).toFixed(1) : "0.0";

  els.totalWords.textContent = preparedWords.length;
  els.totalGroups.textContent = wordGroups.length;
  els.averageRating.textContent = `${averageRating} / 5`;
  els.writingAccuracy.textContent = `${accuracy}%`;
  els.cardsReviewed.textContent = state.stats.cardsReviewed;
  els.writingToEnglishAnswered.textContent = state.stats.writingToEnglishAnswered;
  els.writingToRussianAnswered.textContent = state.stats.writingToRussianAnswered;
  els.bestStreak.textContent = state.stats.bestStreak;

  if (!("speechSynthesis" in window)) {
    els.supportNote.textContent = "В этом браузере не нашлась Web Speech API, поэтому озвучка может не работать.";
  } else if (state.hardOnly && state.useAllWordsFallback) {
    els.supportNote.textContent = "В выбранной группе пока нет слов с рейтингом 0-2, поэтому показываются все слова этой группы.";
  } else if (state.selectedGroup === "all") {
    els.supportNote.textContent = "Сейчас открыты все группы. Они идут от самых частых слов к более редким, поэтому удобнее начинать сверху.";
  } else {
    els.supportNote.textContent = "Рейтинг слова можно менять вручную от 0 до 5, а правильные и неправильные ответы обновляют его автоматически.";
  }
}

function buildReadingTexts(groups) {
  return groups.map((group) => ({
    id: group.id,
    groupLabel: group.label,
    title: group.theme,
    wordCount: group.words.length,
    paragraphs: createReadingParagraphs(group)
  }));
}

function createReadingParagraphs(group) {
  const chunks = [];
  const words = group.words;

  for (let index = 0; index < words.length; index += 3) {
    chunks.push(words.slice(index, index + 3));
  }

  return chunks.map((chunk, index) => {
    const frame = READING_STORY_FRAMES[index] || READING_STORY_FRAMES[READING_STORY_FRAMES.length - 1];
    const start = frame.start.replace("{group}", group.id);
    return `${start} ${formatGlossWordList(chunk)}${frame.end}`;
  });
}

function formatGlossWordList(words) {
  const items = words.map((word) => createGlossWord(word, word.displayEnglish));

  if (items.length === 0) {
    return "";
  }

  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function createGlossWord(word, visibleText) {
  const translation = word.russian;
  const label = `${visibleText} - ${translation}`;

  return `<span class="gloss-word" tabindex="0" data-translation="${escapeAttribute(translation)}" title="${escapeAttribute(label)}" aria-label="${escapeAttribute(label)}">${escapeHtml(visibleText)}</span>`;
}


function loadProgress() {
  const fallback = {
    ratings: {},
    stats: createDefaultStats(),
    settings: {
      view: "study",
      autoSpeak: true,
      hardOnly: false,
      mode: "cards",
      selectedGroup: wordGroups[0]?.id || "all"
    }
  };

  const current = safeJsonParse(window.localStorage.getItem(STORAGE_KEY));

  if (current) {
    return {
      ratings: current.ratings && typeof current.ratings === "object" ? current.ratings : fallback.ratings,
      stats: { ...createDefaultStats(), ...(current.stats || {}) },
      settings: {
        view: current.settings?.view ?? fallback.settings.view,
        autoSpeak: current.settings?.autoSpeak ?? fallback.settings.autoSpeak,
        hardOnly: current.settings?.hardOnly ?? fallback.settings.hardOnly,
        mode: current.settings?.mode ?? fallback.settings.mode,
        selectedGroup: current.settings?.selectedGroup ?? fallback.settings.selectedGroup
      }
    };
  }

  const legacy = safeJsonParse(window.localStorage.getItem(LEGACY_STORAGE_KEY));

  if (legacy) {
    return {
      ratings: legacy.ratings && typeof legacy.ratings === "object" ? legacy.ratings : fallback.ratings,
      stats: { ...createDefaultStats(), ...(legacy.stats || {}) },
      settings: {
        view: "study",
        autoSpeak: legacy.settings?.autoSpeak ?? fallback.settings.autoSpeak,
        hardOnly: legacy.settings?.hardOnly ?? fallback.settings.hardOnly,
        mode: legacy.settings?.mode ?? fallback.settings.mode,
        selectedGroup: legacy.settings?.selectedGroup ?? fallback.settings.selectedGroup
      }
    };
  }

  const older = safeJsonParse(window.localStorage.getItem(OLDER_STORAGE_KEY));

  if (older) {
    const migratedRatings = {};

    Object.entries(older.wordScores || {}).forEach(([wordId, score]) => {
      migratedRatings[wordId] = legacyScoreToRating(score);
    });

    return {
      ratings: migratedRatings,
      stats: {
        ...createDefaultStats(),
        cardsReviewed: older.stats?.cardsReviewed || 0,
        writingToEnglishAnswered: older.stats?.writingAnswered || 0,
        writingToEnglishCorrect: older.stats?.writingCorrect || 0,
        currentStreak: older.stats?.currentStreak || 0,
        bestStreak: older.stats?.bestStreak || 0
      },
      settings: {
        view: "study",
        autoSpeak: older.settings?.autoSpeak ?? fallback.settings.autoSpeak,
        hardOnly: older.settings?.hardOnly ?? fallback.settings.hardOnly,
        mode: "cards",
        selectedGroup: fallback.settings.selectedGroup
      }
    };
  }

  return fallback;
}

function saveProgress() {
  const payload = {
    ratings: state.ratings,
    stats: state.stats,
    settings: {
      view: state.view,
      autoSpeak: state.autoSpeak,
      hardOnly: state.hardOnly,
      mode: state.mode,
      selectedGroup: state.selectedGroup
    }
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function createDefaultStats() {
  return {
    cardsReviewed: 0,
    writingToEnglishAnswered: 0,
    writingToEnglishCorrect: 0,
    writingToRussianAnswered: 0,
    writingToRussianCorrect: 0,
    currentStreak: 0,
    bestStreak: 0
  };
}

function buildGroups(words) {
  const grouped = new Map();

  words.forEach((word) => {
    const id = String(word.groupNumber);

    if (!grouped.has(id)) {
      grouped.set(id, {
        id,
        label: `Группа ${id}`,
        words: []
      });
    }

    grouped.get(id).words.push(word);
  });

  const orderedGroups = [...grouped.values()].sort((left, right) => Number(left.id) - Number(right.id));

  return orderedGroups.map((group, index) => ({
    ...group,
    words: sortWordsByPopularity(group.words),
    theme: getFrequencyTheme(index + 1, orderedGroups.length)
  }));
}

function sortWordsByPopularity(words) {
  return words
    .slice()
    .sort((left, right) => (
      right.frequencyScore - left.frequencyScore ||
      left.displayEnglish.localeCompare(right.displayEnglish)
    ));
}


function shuffle(items) {
  const cloned = items.slice();

  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [cloned[index], cloned[randomIndex]] = [cloned[randomIndex], cloned[index]];
  }

  return cloned;
}

function expandEnglishVariants(items) {
  const variants = [];

  items.forEach((item) => {
    if (!item) {
      return;
    }

    const trimmed = item.trim();

    if (!trimmed) {
      return;
    }

    variants.push(trimmed);

    if (trimmed.toLowerCase().startsWith("to ")) {
      variants.push(trimmed.slice(3));
    }

    if (trimmed.includes("/")) {
      trimmed.split("/").forEach((part) => variants.push(part.trim()));
    }
  });

  return uniqueValues(variants);
}

function splitRussianVariants(value) {
  if (!value) {
    return [];
  }

  return value
    .split(/[;,]/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
}

function uniqueValues(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function normalizeEnglish(value) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[\u2019']/g, "")
    .replace(/[-/]/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeRussian(value) {
  return value
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[\u2019']/g, "")
    .replace(/[-/]/g, " ")
    .replace(/[^a-zа-я0-9\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function makeId(text, index) {
  return `${text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "word"}-${index}`;
}

function safeJsonParse(value) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

function legacyScoreToRating(score) {
  const numericScore = Number(score) || 0;

  if (numericScore <= -4) {
    return 0;
  }

  if (numericScore <= -2) {
    return 1;
  }

  if (numericScore <= 1) {
    return 2;
  }

  if (numericScore <= 3) {
    return 3;
  }

  if (numericScore <= 5) {
    return 4;
  }

  return 5;
}

function normalizeSelectedGroup(value) {
  if (value === "all") {
    return "all";
  }

  return wordGroups.some((group) => group.id === String(value))
    ? String(value)
    : (wordGroups[0]?.id || "all");
}

function normalizeMode(mode) {
  return MODES[mode] ? mode : "cards";
}

function normalizeView(view) {
  return view === "texts" ? "texts" : "study";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}
