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

const READING_BLUEPRINTS = [
  {
    title: "Ужин И Ферма",
    template: `
The [[0]] was strong when I saw an [[1]] bowl of [[3]] near a hot [[4]]. The dish looked like a bright [[5]] of colors.

On the farm, the old machine could [[2|mutilate]] a hand, so we stayed away from the [[6]]. One [[7]] animal could not run, but the [[8]] cook said the meal would [[9|cost]] a lot, the table would [[10|fit]] the whole family, and everyone would still [[11|get]] enough food.
`
  },
  {
    title: "Вечер На Диване",
    template: `
On [[1]] night, we sat on the [[3]] and watched a good [[1]]. The old [[2]] looked dusty, but the story was still clear.

One rude man tried to [[0|hit on]] my friend, and she told him, "[[4]]." Another person shouted, "[[5]]," but we said, "[[6]]." It is hard to [[7|maintain]] peace in a room like that, yet I still [[8|admire]] my calm friend. I do not [[9|envy]] her, and our friendship has a long [[10]] because people like her [[11|contribute]] so much.
`
  },
  {
    title: "Плохая Кухня",
    template: `
The best [[0]] for a dirty kitchen is simple cleaning. During [[1]], a child learns why a [[4]] full of old soup and white [[3]] can smell [[5]].

If someone [[6|casts]] trash on the floor, I get [[2]]. A rich man may [[7|possess]] great [[8]], but without real [[11]], he will not [[9|gather]] people around him and will still use [[10]] words.
`
  },
  {
    title: "Странный Музей",
    template: `
At the [[2]] stage of the museum job, I felt [[4]] because a worker had [[5]] through an old model and exposed dry [[6]] inside.

The room [[8]] to our office was quiet, and I had to [[9|investigate]] papers for [[10]] while I [[11|stirred]] soup in a cup. One artist sent a small [[7]] instead of a real [[3]], and I felt [[1]] pride for him; [[0]], I kept the piece.
`
  },
  {
    title: "Дом У Озера",
    template: `
We went to the [[0]] in a [[1]] while a [[2]] moved far away. I wanted to [[3|catch]] a fish, but then I heard a [[4]] near the reeds.

The [[5]] group stopped, and one boy tried to [[6|punch]] the side of the boat in fear. We told him to [[7|get rid of]] the heavy [[8]] box and to [[9|pay a visit to]] the old man who lived by the [[11]]. Near his door, a [[10]] grew alone.
`
  },
  {
    title: "Тест У Сосны",
    template: `
After rain, a [[0]] lay under the [[10]] tree. My [[11]] laughed at a [[1]] hole in the road, but a [[2]] only sees the surface.

At school, one rude [[3]] missed the [[4]] in the game. The kind [[7]] beside me said, "[[5]]," when I sneezed and, "[[6]]," before my test. I ate [[8]] with [[9]] in the morning.
`
  },
  {
    title: "Семейный Десерт",
    template: `
My [[0]] and [[1]] came for lunch. We ate [[2]] on bread and a hot [[7]] with [[5]].

Later we made a cake with sweet [[4]], cold [[6]], and bright [[9]]. A child hit his [[3]] on a [[8]] near the [[10]], so I had to [[11|pound]] ice into small pieces.
`
  },
  {
    title: "Урок Географии",
    template: `
Our teacher did not [[0|persecute]] us; her [[1]] simply meant that we had to stay [[4]] and do the work. She told us not to [[2|shun]] the quiet boy and asked me to [[3|snip]] a map from paper.

First we drew a [[6]] of stars, then a line from the [[8]] to the [[9]], with the [[10]] in the middle. A black [[11]] sat on the window while we talked about the [[7]] of a train [[5]] outside.
`
  },
  {
    title: "Космос И Булка",
    template: `
In my [[11]], I keep a space book in the [[9]] beside a fresh [[8]]. It shows [[1]], [[2]], [[0]], and [[3]] under the same [[4]].

The pages explain the [[5]] and the [[6]] in simple words. One small [[7]] in the book made me smile: after all that science, the writer told the reader not to [[10|loaf]] but to keep learning.
`
  },
  {
    title: "Теплая Комната",
    template: `
Our small room felt [[3]] because a [[4]] with a [[5]] sat by the fire. Her [[6]] face became [[2]] when a wet [[0]] ran in.

It was a [[1]], dirty and tired, and its fur looked [[7]] under the light. Still, cleaning it was [[8]], because it began to [[9|give off]] a soft smell of soap. I gave the bowl a [[10]], but the floor stayed [[11]].
`
  },
  {
    title: "Шумная Команда",
    template: `
During my [[10]], a problem began to [[3|occur]] in our team [[11]]. One loud [[7]] tried to [[2|retard]] every task and did not stop [[5|bothering]] people.

We made a [[6]] and, [[9]], everyone wanted less noise and more light. Too much [[8]] of private data would be a [[4]], because it could hurt our [[0]] peace. A calm leader with [[1]] patience fixed it.
`
  },
  {
    title: "Карта И Небо",
    template: `
A [[0]] stood on the [[1]] while we studied a world map. We marked the [[2]], [[3]], [[4]], and [[5]] with blue lines.

Later at night we looked for [[6]], [[7]], [[8]], and [[9]] in a book. My little brother wore paper [[10]] and said he felt [[11]].
`
  },
  {
    title: "Старый Клуб",
    template: `
At the old [[1]], the [[10]] took a [[0]] of tea and looked at a broken door. Someone had used a [[2]] and a [[6]] to open it, and the lock began to [[7|snap]].

Inside we found [[8]] trash, bad food, and one [[5]] asleep on a [[9]] chair. His [[4]] note on the wall made everyone quiet. The [[3]] of the mess would be hard, and the rain made conditions more [[11]].
`
  },
  {
    title: "Летний Двор",
    template: `
The children kept [[2]] in the yard, and one boy loved to [[3|skylark]] until dinner. Their [[4]] felt endless, almost like [[0]], but the old teacher said it came from the [[5]] of summer joy.

Over a warm [[10]], she helped us [[11|acquaint]] the new girl with the group. Soon even the [[8]] on the fence seemed [[7]] to listen. No one wanted the ugly [[6]], and no one tried to [[9|beat]] anyone in the game. That was much less [[1]] than before.
`
  },
  {
    title: "Птицы До Ком. Часа",
    template: `
Before [[0]], the [[7]] and the [[8]] flew back to a [[9]] above our door. Their home looked [[1]], and on cold nights they seemed to [[3|snuggle]] together.

One child asked if he could [[2|hop in]] the truck, but he waited for my [[4]]. Inside, a broken [[6]] made a [[11]] sound, yet the small birds still seemed to [[5|thrive]] on a soft [[10]] of leaves.
`
  },
  {
    title: "Работа В Долине",
    template: `
During our [[4]] in the mountain [[9]], rain became a real [[0]]. The path was [[6]], so I told my friend not to [[1|nag]] the tired horse and to check its [[2]].

We had to [[8|lug]] boxes down the hill while a small [[7]] opened on a bush. A sudden [[5]] came when a [[10]] group passed nearby, but our simple [[11]] plan helped us stay calm. [[3]], we had practiced it.
`
  },
  {
    title: "Лагерь У Ягод",
    template: `
The road was full of [[0]], and a [[1]] dog watched our camp with clear [[2]]. [[3]], the morning felt tense.

Still, it was [[5]] for our [[7]] to [[6|kneel]] before a meal. One loud [[8]] refused, and the chief began to [[9|condemn]] him, but an old bell seemed to [[10|herald]] peace instead. We chose a sweet [[11]] from the bush and moved on.
`
  },
  {
    title: "Снег И Память",
    template: `
A [[0]] began, yet my grandfather spoke about an [[1]] who loved winter walks. [[2]] the snow, he would [[3|strike]] a drum and send a [[4]] into the gray sky.

A [[5]] and a [[6]] often stood near the river. After his death, the family felt deep [[7]] and had to [[8|grieve]], but we did not [[9|get lost]] in the storm. We learned that [[10]] is not [[11]]; real happiness needs care and movement.
`
  },
  {
    title: "Тихая Тропа",
    template: `
On a quiet [[2]] path, I felt [[0]] and began to [[1|reminisce]] about old trips. It was easy to fall into a daily [[3]], but the clean air helped me [[4|unthink]] that habit.

The lake looked [[5]], the small house of [[6]] smelled sweet, and far away someone played a [[7]].
`
  }
];

const EXTRA_READING_BLUEPRINTS = {
  "20": {
    title: "Совет Врача",
    template: `
The doctor gave me a [[0]] with [[1]], and I had to [[4|consider]] my food very carefully. A small [[2]] can turn into [[5]], and soon a person may feel [[6]].

One [[3]] may help for a moment, but the effect can be too [[7]]. In the brain, [[8]] is delicate, and some medicine has an [[9]] effect that may even [[10|enhance]] recovery. I took one [[11]] of water and went home.
`
  },
  "21": {
    title: "Живот И Кухня",
    template: `
My [[0]] and my [[1]] felt better when I stopped trying to [[2|overlook]] simple signs. The doctor saw a [[3]] [[4]] in one [[5]] problem and said she could [[6|alleviate]] the pain.

It sounded [[7]], but the [[8]] of recovery were real. A [[9]] smell came from the old soup, so I had to [[10|fetch]] clean water in a [[11]] and rest.
`
  },
  "22": {
    title: "Тихая Кухня",
    template: `
The child sat on a [[1]] with [[2]] and tried not to [[0|tumble]]. One loud sound was enough to [[3|frighten]] her.

In the kitchen, we had to [[4|alter]] the plan because a broken pipe could [[5|disrupt]] the room. We used the pump to [[6|pump out]] the water, did it [[7]], and kept a [[8]] rhythm. Every [[9]] in the room changed on the [[10]], and that [[11]] made the problem easy to notice.
`
  },
  "23": {
    title: "Шум В Лаборатории",
    template: `
During the [[1]], our team kept a [[0]] mood even when papers flew [[2]]. Small children began [[3|clustering up]], while one voice kept [[4|wavering]] between fear and hope.

A band of [[5]] held the notes together, but [[6]] from the fire stained the page, and black [[7]] spread over the map. I had to [[8|lay out]] the tools, breathe a [[9]], hear the chair [[10|squeak]], and stay [[11]].
`
  },
  "24": {
    title: "Эхо В Пещере",
    template: `
Deep [[0]] the hills, we found a [[5]]. I had to [[2|squint]] at a weak light, then [[10|glance]] at the wall and watch the old drawings [[11|fade]].

One child started to [[6|wail]], another tried to [[7|hold out]] the lamp, and everyone stood [[8]]. I told them not to play [[1]] here, not to [[3|suspend]] the walk, and to [[4|savor]] the quiet air. In the end, I used both hands to [[9|cup]] cold water from the stone.
`
  },
  "25": {
    title: "Ночь На Дороге",
    template: `
We were [[11]] when the [[2]] came. A bright [[3]] crossed the sky, and a white [[4]] moved down the hill. Cold [[0]] covered the road, and everyone felt [[1]].

A [[5]] still tried to work before [[6]], keeping a [[7]] of tea nearby. It was a [[8]] effort [[10]] the wild night. Even the trees looked [[9]] in the storm.
`
  },
  "26": {
    title: "Темная Поездка",
    template: `
There was a strange [[0]] on the road when my [[7]] said, "[[2]]." We did not want to [[1|plunder]] the closed shop; we only wanted to [[3|swallow]] some hot food.

Still, the town felt [[4]], and the [[5]] behind the houses seemed endless. I chose to leave [[6]] while one light began to [[8|shine]]. A leaf moved as if someone wanted to [[9|pat]] my shoulder, then another branch tried to [[10|prick]] my hand, and our old [[11]] fear vanished.
`
  },
  "27": {
    title: "Странный Рисунок",
    template: `
One silly [[8]] at school began when somebody drew an [[3]] and a group of [[4]] on the [[0]]. The picture had too many [[5]], a big [[1]], and even an [[2]] in the corner. A [[6]] from the yard was lying beside the paint.

A teacher said the joke might [[10|offend]] people, and one pupil already felt [[9]]. She told us to [[7|flush the toilet]] after art class, because some children were [[11|scared of]] it, and sent us back to work.
`
  },
  "28": {
    title: "Просто Попросить Помощи",
    template: `
The child wanted to [[0|see his face]] in the mirror, but he also had to [[1|let it out]] and stop hiding his fear. First he had to [[2|pull it out]]: the small toy was stuck under the bed.

In the end, he chose to [[3|ask for help]], and his mother came [[4]] to [[5|release]] the stuck box. They laughed, and the room felt safe again.
`
  }
};

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
    acceptedEnglishAnswers: englishVariants.map(normalizeEnglish).filter(Boolean),
    acceptedRussianAnswers: russianVariants.map(normalizeRussian).filter(Boolean),
    groupNumber: entry.group || Math.floor(index / GROUP_SIZE) + 1
  };
});

const wordGroups = buildGroups(preparedWords);
const readingTexts = buildReadingTexts(wordGroups, READING_BLUEPRINTS);
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
      label: `${group.label} · ${group.words.length} слов`
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
    : `${currentGroup.label} · ${selectedWords.length} слов`;
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
    ? `${selectedReading.groupLabel} показана первой. Наводите курсор на выделенное слово, чтобы увидеть перевод. На телефоне можно нажать на слово.`
    : "Наводите курсор на выделенное слово, чтобы увидеть перевод. На телефоне можно нажать на слово.";

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
    els.supportNote.textContent = "Сейчас открыты все группы. Для быстрого заучивания лучше выбрать одну группу по 12 слов.";
  } else {
    els.supportNote.textContent = "Рейтинг слова можно менять вручную от 0 до 5, а правильные и неправильные ответы обновляют его автоматически.";
  }
}

function buildReadingTexts(groups, blueprints) {
  return groups.map((group, index) => {
    const blueprint = blueprints[index] || EXTRA_READING_BLUEPRINTS[group.id] || makeFallbackReadingBlueprint(group);

    return {
      id: group.id,
      groupLabel: group.label,
      title: blueprint.title,
      wordCount: group.words.length,
      paragraphs: compileReadingTemplate(blueprint.template, group.words)
    };
  });
}

function compileReadingTemplate(template, words) {
  return template
    .trim()
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\[\[(\d+)(?:\|([^[\]]+))?\]\]/g, (_match, index, customText) => {
      const word = words[Number(index)];
      const visibleText = customText || word?.english || "";

      if (!word) {
        return escapeHtml(visibleText);
      }

      return createGlossWord(word, visibleText);
    }));
}

function createGlossWord(word, visibleText) {
  const translation = word.russian;
  const label = `${visibleText} - ${translation}`;

  return `<span class="gloss-word" tabindex="0" data-translation="${escapeAttribute(translation)}" title="${escapeAttribute(label)}" aria-label="${escapeAttribute(label)}">${escapeHtml(visibleText)}</span>`;
}

function makeFallbackReadingBlueprint(group) {
  const placeholders = group.words.map((_, index) => `[[${index}]]`);
  const chunks = [];

  for (let index = 0; index < placeholders.length; index += 4) {
    chunks.push(placeholders.slice(index, index + 4));
  }

  return {
    title: `Текст Для ${group.label}`,
    template: chunks
      .map((chunk, index) => {
        const intro = index === 0
          ? "In this short story"
          : index === 1
            ? "Later in the same scene"
            : "At the end";

        return `${intro}, we meet ${chunk.join(", ")}.`;
      })
      .join("\n\n")
  };
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

  return [...grouped.values()].sort((left, right) => Number(left.id) - Number(right.id));
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
