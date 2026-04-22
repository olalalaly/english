(function extendWordsBatch63() {
  window.WORDS = window.WORDS || [];
  window.GROUP_THEME_OVERRIDES = {
    ...(window.GROUP_THEME_OVERRIDES || {}),
    ...{
  "63": "Самые популярные слова",
  "64": "Популярные слова",
  "65": "Популярные слова",
  "66": "Популярные слова",
  "67": "Популярные слова",
  "68": "Популярные слова",
  "69": "Популярные слова",
  "70": "Менее популярные слова",
  "71": "Менее популярные слова",
  "72": "Менее популярные слова",
  "73": "Менее популярные слова",
  "74": "Менее популярные слова",
  "75": "Менее популярные слова",
  "76": "Менее популярные слова",
  "77": "Менее популярные слова"
}
  };

  const updates = {
  "eager": {
    "russian": "жаждущий; стремящийся; нетерпеливый"
  },
  "grief": {
    "russian": "горе; скорбь; печаль"
  },
  "tryna": {
    "russian": "пытаюсь; собираюсь; стараюсь",
    "speakText": "trying to"
  },
  "lil'": {
    "russian": "разговорное сокращение; маленький; крошечный",
    "speakText": "little"
  },
  "hath": {
    "russian": "устаревшая форма глагола иметь; имеет; обладает",
    "speakText": "has"
  },
  "'bout": {
    "russian": "насчет; про; около",
    "speakText": "about"
  },
  "to offend": {
    "russian": "оскорблять; обижать; задевать; шокировать"
  },
  "enchanted": {
    "russian": "очарованный; зачарованный; околдованный"
  },
  "rapture": {
    "russian": "восторг; упоение; исступленная радость"
  },
  "fondness": {
    "russian": "нежность; привязанность; симпатия"
  },
  "infatuation": {
    "russian": "влюбленность; ослепленное увлечение; помешательство"
  },
  "compassionate": {
    "russian": "сострадательный; сочувственный; милосердный"
  },
  "relieved": {
    "russian": "испытавший облегчение; успокоенный; обрадованный"
  },
  "affectionate": {
    "russian": "ласковый; нежный; любящий"
  },
  "longing": {
    "russian": "тоска; томление; сильное желание"
  },
  "misery": {
    "russian": "несчастье; страдание; нищета"
  },
  "indeed": {
    "russian": "действительно; в самом деле; и правда"
  },
  "lane": {
    "russian": "полоса; дорожка; переулок"
  },
  "pest": {
    "russian": "вредитель; надоеда; паразит"
  },
  "amused": {
    "russian": "позабавленный; развеселенный; довольный"
  },
  "to suspend": {
    "russian": "приостанавливать; подвешивать; временно отстранять"
  },
  "to assume": {
    "russian": "предполагать; допускать; принимать на себя"
  }
};
  window.WORDS = window.WORDS.map((word) => {
    const update = updates[word.english.toLowerCase()];
    return update ? { ...word, ...update } : word;
  });

  const rawEntries = [
  [
    "to go over",
    "verb",
    "просматривать; разбирать; повторять",
    {}
  ],
  [
    "to take off",
    "phrasal verb",
    "снимать; взлетать; резко уходить",
    {}
  ],
  [
    "to keep up",
    "phrasal verb",
    "не отставать; поддерживать темп; продолжать",
    {}
  ],
  [
    "to head out",
    "phrasal verb",
    "выходить; отправляться; уходить",
    {}
  ],
  [
    "to pick up",
    "phrasal verb",
    "подбирать; забирать; улавливать",
    {}
  ],
  [
    "to come to hate",
    "verb",
    "постепенно возненавидеть; начать ненавидеть; прийти к ненависти",
    {}
  ],
  [
    "civil",
    "adjective",
    "гражданский; вежливый; штатский",
    {}
  ],
  [
    "effort",
    "noun",
    "усилие; старание; попытка",
    {}
  ],
  [
    "to pass a law",
    "verb phrase",
    "принять закон; утвердить закон; провести закон",
    {}
  ],
  [
    "equipment",
    "noun",
    "оборудование; снаряжение; техника",
    {}
  ],
  [
    "school of fish",
    "noun phrase",
    "косяк рыб; стая рыб; группа рыб",
    {
      "acceptedAnswers": [
        "a school of fish"
      ]
    }
  ],
  [
    "to supply",
    "verb",
    "снабжать; поставлять; обеспечивать",
    {}
  ],
  [
    "to handle",
    "verb",
    "справляться с; обращаться с; обрабатывать",
    {}
  ],
  [
    "alive",
    "adjective",
    "живой; находящийся в живых; полный жизни",
    {}
  ],
  [
    "toward",
    "preposition",
    "к; по направлению к; в сторону",
    {}
  ],
  [
    "domestic",
    "adjective",
    "домашний; внутренний; бытовой",
    {}
  ],
  [
    "attorney",
    "noun",
    "адвокат; юрист; поверенный",
    {}
  ],
  [
    "to blow up",
    "phrasal verb",
    "взрывать; взрываться; раздувать",
    {}
  ],
  [
    "severe",
    "adjective",
    "серьезный; суровый; тяжелый",
    {}
  ],
  [
    "legislation",
    "noun",
    "законодательство; законы; правовые нормы",
    {}
  ],
  [
    "assembly room",
    "noun phrase",
    "актовый зал; зал собраний; сборочный зал",
    {
      "acceptedAnswers": [
        "an assembly room"
      ]
    }
  ],
  [
    "to blind",
    "verb",
    "ослеплять; лишать зрения; затмевать",
    {}
  ],
  [
    "blind",
    "adjective",
    "слепой; незрячий; закрытый",
    {}
  ],
  [
    "comparison",
    "noun",
    "сравнение; сопоставление; параллель",
    {}
  ],
  [
    "line-of-sight",
    "noun",
    "линия обзора; прямая видимость; линия прицела",
    {
      "readingEnglish": "line of sight",
      "speakText": "line of sight",
      "acceptedAnswers": [
        "line of sight"
      ]
    }
  ],
  [
    "regardless",
    "adverb",
    "несмотря ни на что; все равно; безотносительно",
    {}
  ],
  [
    "circuit",
    "noun",
    "цепь; схема; маршрут",
    {}
  ],
  [
    "to wage",
    "verb",
    "вести; развязывать; проводить",
    {}
  ],
  [
    "rear",
    "noun/adjective",
    "задняя часть; тыл; задний",
    {}
  ],
  [
    "to capture",
    "verb",
    "захватывать; ловить; фиксировать",
    {}
  ],
  [
    "sake",
    "noun",
    "ради; благо; польза",
    {}
  ],
  [
    "possession",
    "noun",
    "владение; обладание; собственность",
    {}
  ],
  [
    "occasion",
    "noun",
    "случай; повод; событие",
    {}
  ],
  [
    "labour lawyer",
    "noun phrase",
    "трудовой юрист; юрист по трудовому праву; адвокат по трудовым спорам",
    {}
  ],
  [
    "fraud",
    "noun",
    "мошенничество; обман; афера",
    {}
  ],
  [
    "railway station",
    "noun phrase",
    "железнодорожная станция; вокзал; ж д станция",
    {
      "acceptedAnswers": [
        "a railway station"
      ]
    }
  ],
  [
    "railroad",
    "noun",
    "железная дорога; железнодорожный путь; железнодорожная линия",
    {}
  ],
  [
    "sacrifice",
    "noun/verb",
    "жертва; самопожертвование; жертвовать",
    {}
  ],
  [
    "awkward",
    "adjective",
    "неловкий; неуклюжий; неудобный",
    {}
  ],
  [
    "inquiry",
    "noun",
    "запрос; расследование; наведение справок",
    {
      "acceptedAnswers": [
        "an inquiry"
      ]
    }
  ],
  [
    "warrant",
    "noun",
    "ордер; основание; гарантия",
    {
      "acceptedAnswers": [
        "a warrant"
      ]
    }
  ],
  [
    "bullet",
    "noun",
    "пуля; снаряд; патрон",
    {
      "acceptedAnswers": [
        "a bullet"
      ]
    }
  ],
  [
    "shed",
    "noun",
    "сарай; навес; хозпостройка",
    {
      "acceptedAnswers": [
        "a shed"
      ]
    }
  ],
  [
    "controversial",
    "adjective",
    "спорный; неоднозначный; противоречивый",
    {}
  ],
  [
    "burden",
    "noun",
    "бремя; груз; ноша",
    {}
  ],
  [
    "to sink",
    "verb",
    "тонуть; погружаться; опускаться",
    {}
  ],
  [
    "to wind one's way towards",
    "verb phrase",
    "пробираться к; петлять к; медленно продвигаться к",
    {}
  ],
  [
    "assignment",
    "noun",
    "задание; назначение; поручение",
    {
      "acceptedAnswers": [
        "an assignment"
      ]
    }
  ],
  [
    "to rat out",
    "phrasal verb",
    "выдать; настучать на; сдать",
    {}
  ],
  [
    "surveillance",
    "noun",
    "наблюдение; слежка; надзор",
    {}
  ],
  [
    "attendance",
    "noun",
    "посещаемость; присутствие; явка",
    {}
  ],
  [
    "scratch",
    "noun/verb",
    "царапина; чесать; царапать",
    {}
  ],
  [
    "preliminary",
    "adjective",
    "предварительный; начальный; вводный",
    {}
  ],
  [
    "torture",
    "noun/verb",
    "пытка; мучение; истязать",
    {}
  ],
  [
    "pursuit",
    "noun",
    "преследование; погоня; стремление",
    {}
  ],
  [
    "to urge",
    "verb",
    "побуждать; настойчиво советовать; подгонять",
    {}
  ],
  [
    "eternal",
    "adjective",
    "вечный; бессмертный; бесконечный",
    {}
  ],
  [
    "to rebel",
    "verb",
    "восставать; бунтовать; сопротивляться",
    {}
  ],
  [
    "rebel",
    "noun",
    "бунтарь; мятежник; повстанец",
    {
      "acceptedAnswers": [
        "a rebel"
      ]
    }
  ],
  [
    "spectacular",
    "adjective",
    "зрелищный; впечатляющий; эффектный",
    {}
  ],
  [
    "allegedly",
    "adverb",
    "якобы; предположительно; по сообщениям",
    {}
  ],
  [
    "to withdraw",
    "verb",
    "отзывать; выводить; снимать",
    {}
  ],
  [
    "to accomplish",
    "verb",
    "достигать; выполнять; осуществлять",
    {}
  ],
  [
    "sophisticated",
    "adjective",
    "сложный; утонченный; изощренный",
    {}
  ],
  [
    "opposing",
    "adjective",
    "противоположный; враждебный; противостоящий",
    {}
  ],
  [
    "to ferry",
    "verb",
    "переправлять; возить; перевозить",
    {}
  ],
  [
    "ferry",
    "noun",
    "паром; переправа; паромное судно",
    {
      "acceptedAnswers": [
        "a ferry"
      ]
    }
  ],
  [
    "jerk",
    "noun",
    "придурок; рывок; хам",
    {
      "acceptedAnswers": [
        "a jerk"
      ]
    }
  ],
  [
    "steep",
    "adjective",
    "крутой; резкий; отвесный",
    {}
  ],
  [
    "entrepreneur",
    "noun",
    "предприниматель; бизнесмен; делец",
    {}
  ],
  [
    "asylum",
    "noun",
    "убежище; приют; психиатрическая лечебница",
    {}
  ],
  [
    "assembled",
    "participle",
    "собранный; составленный; смонтированный",
    {}
  ],
  [
    "prosecutor",
    "noun",
    "прокурор; обвинитель; государственный обвинитель",
    {}
  ],
  [
    "to dodge",
    "verb",
    "уклоняться; уворачиваться; избегать",
    {}
  ],
  [
    "stern",
    "adjective",
    "суровый; строгий; жесткий",
    {}
  ],
  [
    "unaware",
    "adjective",
    "не знающий; не подозревающий; не осознающий",
    {}
  ],
  [
    "in close proximity",
    "phrase",
    "в непосредственной близости; рядом; вплотную",
    {}
  ],
  [
    "mistress",
    "noun",
    "любовница; хозяйка; госпожа",
    {}
  ],
  [
    "fragile",
    "adjective",
    "хрупкий; ломкий; нежный",
    {}
  ],
  [
    "token",
    "noun",
    "жетон; символ; знак",
    {}
  ],
  [
    "compression",
    "noun",
    "сжатие; компрессия; сдавливание",
    {}
  ],
  [
    "sting",
    "noun/verb",
    "жало; укус; ужалить",
    {}
  ],
  [
    "trout",
    "noun",
    "форель; речная форель; рыба форель",
    {}
  ],
  [
    "to bypass",
    "verb",
    "обходить; миновать; обводить",
    {}
  ],
  [
    "bypass",
    "noun",
    "обходной путь; объезд; шунт",
    {}
  ],
  [
    "amusing",
    "adjective",
    "забавный; смешной; занятный",
    {}
  ],
  [
    "supplying",
    "participle",
    "снабжающий; поставляющий; обеспечивающий",
    {}
  ],
  [
    "moron",
    "noun",
    "идиот; дурак; тупица",
    {
      "acceptedAnswers": [
        "a moron"
      ]
    }
  ],
  [
    "beacon",
    "noun",
    "маяк; сигнальный огонь; ориентир",
    {
      "acceptedAnswers": [
        "a beacon"
      ]
    }
  ],
  [
    "wrath",
    "noun",
    "гнев; ярость; бешенство",
    {}
  ],
  [
    "to revive",
    "verb",
    "оживлять; возрождать; приходить в себя",
    {}
  ],
  [
    "to wander",
    "verb",
    "бродить; блуждать; скитаться",
    {}
  ],
  [
    "ant colony",
    "noun phrase",
    "муравьиная колония; колония муравьев; муравейник",
    {
      "acceptedAnswers": [
        "an ant colony"
      ]
    }
  ],
  [
    "to chew up",
    "phrasal verb",
    "разжевывать; жевать; портить",
    {}
  ],
  [
    "to chew off",
    "phrasal verb",
    "отгрызать; откусывать; сгрызать",
    {}
  ],
  [
    "to assemble",
    "verb",
    "собирать; монтировать; созывать",
    {}
  ],
  [
    "flock of birds",
    "noun phrase",
    "стая птиц; птичья стая; группа птиц",
    {
      "acceptedAnswers": [
        "a flock of birds"
      ]
    }
  ],
  [
    "warp",
    "noun",
    "искривление; деформация; перекос",
    {}
  ],
  [
    "furnace",
    "noun",
    "печь; топка; горн",
    {}
  ],
  [
    "rice paddy",
    "noun phrase",
    "рисовое поле; рисовая плантация; затопленное поле",
    {}
  ],
  [
    "acquaintance",
    "noun",
    "знакомый; знакомство; осведомленность",
    {}
  ],
  [
    "to indulge",
    "verb",
    "потакать; позволять себе; баловать",
    {}
  ],
  [
    "herd of cows",
    "noun phrase",
    "стадо коров; коровье стадо; группа коров",
    {
      "acceptedAnswers": [
        "a herd of cows"
      ]
    }
  ],
  [
    "marvelous",
    "adjective",
    "чудесный; удивительный; великолепный",
    {}
  ],
  [
    "lingerie",
    "noun",
    "женское белье; нижнее белье; белье",
    {}
  ],
  [
    "to oversee",
    "verb",
    "надзирать; контролировать; присматривать",
    {}
  ],
  [
    "to descend",
    "verb",
    "спускаться; опускаться; снижаться",
    {}
  ],
  [
    "to wink",
    "verb",
    "подмигивать; моргать; мигать",
    {}
  ],
  [
    "to get stoned",
    "verb phrase",
    "обкуриться; сильно опьянеть; быть под кайфом",
    {}
  ],
  [
    "gradient",
    "noun",
    "градиент; уклон; плавный переход",
    {}
  ],
  [
    "ape-like",
    "adjective",
    "обезьяноподобный; похожий на обезьяну; грубый",
    {
      "readingEnglish": "ape like",
      "speakText": "ape like",
      "acceptedAnswers": [
        "ape like"
      ]
    }
  ],
  [
    "vaguely",
    "adverb",
    "смутно; туманно; неясно",
    {}
  ],
  [
    "stump",
    "noun",
    "пень; обрубок; культя",
    {}
  ],
  [
    "hideous",
    "adjective",
    "отвратительный; ужасный; уродливый",
    {}
  ],
  [
    "glitch",
    "noun",
    "сбой; глюк; ошибка",
    {}
  ],
  [
    "cabbage soup",
    "noun phrase",
    "суп из капусты; капустный суп; щи",
    {}
  ],
  [
    "to blackmail",
    "verb",
    "шантажировать; вымогать; давить компроматом",
    {}
  ],
  [
    "cheeky devil",
    "noun phrase",
    "нахал; озорник; дерзкий тип",
    {}
  ],
  [
    "to contemplate",
    "verb",
    "размышлять; созерцать; обдумывать",
    {}
  ],
  [
    "constrained",
    "adjective",
    "скованный; ограниченный; стесненный",
    {}
  ],
  [
    "retribution",
    "noun",
    "возмездие; расплата; кара",
    {}
  ],
  [
    "guerrilla",
    "noun",
    "партизан; боец сопротивления; герилья",
    {}
  ],
  [
    "anguish",
    "noun",
    "тоска; мучение; душевная боль",
    {}
  ],
  [
    "torment",
    "noun/verb",
    "мука; мучение; терзать",
    {}
  ],
  [
    "suction",
    "noun",
    "всасывание; тяга; присасывание",
    {}
  ],
  [
    "noticeably",
    "adverb",
    "заметно; ощутимо; явно",
    {}
  ],
  [
    "unilateral",
    "adjective",
    "односторонний; единоличный; однобокий",
    {}
  ],
  [
    "to ponder",
    "verb",
    "размышлять; обдумывать; взвешивать",
    {}
  ],
  [
    "alteration",
    "noun",
    "изменение; переделка; правка",
    {}
  ],
  [
    "eyewitness",
    "noun",
    "очевидец; свидетель; наблюдатель",
    {
      "acceptedAnswers": [
        "an eyewitness"
      ]
    }
  ],
  [
    "lobe",
    "noun",
    "доля; мочка; лопасть",
    {}
  ],
  [
    "perch",
    "noun",
    "насест; окунь; жердочка",
    {}
  ],
  [
    "extortion",
    "noun",
    "вымогательство; шантаж; выбивание денег",
    {}
  ],
  [
    "cello",
    "noun",
    "виолончель; смычковый инструмент; струнный инструмент",
    {}
  ],
  [
    "to rupture",
    "verb",
    "разрывать; прорывать; разрываться",
    {}
  ],
  [
    "raccoon",
    "noun",
    "енот; полоскун; ночной зверек",
    {}
  ],
  [
    "precarious",
    "adjective",
    "ненадежный; шаткий; рискованный",
    {}
  ],
  [
    "lovable",
    "adjective",
    "обаятельный; милый; вызывающий любовь",
    {}
  ],
  [
    "lice",
    "noun",
    "вши; платяные вши; паразиты",
    {}
  ],
  [
    "northbound",
    "adjective",
    "идущий на север; северного направления; направляющийся к северу",
    {}
  ],
  [
    "to act cranky",
    "verb phrase",
    "капризничать; ворчать; вести себя раздраженно",
    {}
  ],
  [
    "hornet",
    "noun",
    "шершень; крупная оса; злой человек",
    {}
  ],
  [
    "treachery",
    "noun",
    "предательство; вероломство; измена",
    {}
  ],
  [
    "polka-dot dress",
    "noun phrase",
    "платье в горошек; платье в точку; платье с гороховым узором",
    {
      "speakText": "polka dot dress",
      "acceptedAnswers": [
        "polka dot dress"
      ]
    }
  ],
  [
    "untimely",
    "adjective",
    "несвоевременный; неуместный; преждевременный",
    {}
  ],
  [
    "to relinquish",
    "verb",
    "отказываться от; уступать; сдавать",
    {}
  ],
  [
    "to dispense",
    "verb",
    "выдавать; распределять; обходиться без",
    {}
  ],
  [
    "juncture",
    "noun",
    "момент; этап; переломный пункт",
    {}
  ],
  [
    "to wither",
    "verb",
    "увядать; сохнуть; чахнуть",
    {}
  ],
  [
    "indiscriminate",
    "adjective",
    "неразборчивый; неизбирательный; беспорядочный",
    {}
  ],
  [
    "blistering",
    "adjective",
    "палящий; обжигающий; резкий",
    {}
  ],
  [
    "searing",
    "adjective",
    "жгучий; палящий; мучительный",
    {}
  ],
  [
    "to divulge",
    "verb",
    "раскрывать; разглашать; выдавать",
    {}
  ],
  [
    "shoal of fish",
    "noun phrase",
    "косяк рыб; стая рыб; множество рыб",
    {
      "acceptedAnswers": [
        "a shoal of fish"
      ]
    }
  ],
  [
    "countenance",
    "noun",
    "лицо; выражение лица; облик",
    {}
  ],
  [
    "whitewater",
    "noun",
    "бурная вода; порожистая вода; стремнина",
    {}
  ],
  [
    "tightened bowels",
    "noun phrase",
    "спазм кишечника; напряжение в животе; сведенный живот",
    {}
  ],
  [
    "to constrain",
    "verb",
    "сковывать; ограничивать; стеснять",
    {}
  ],
  [
    "to molest",
    "verb",
    "домогаться; приставать; трогать",
    {}
  ],
  [
    "to get creamed",
    "verb phrase",
    "быть разгромленным; сильно получить; потерпеть сокрушительное поражение",
    {}
  ],
  [
    "judicious",
    "adjective",
    "рассудительный; благоразумный; взвешенный",
    {}
  ],
  [
    "scrumptious",
    "adjective",
    "восхитительный; очень вкусный; шикарный",
    {}
  ],
  [
    "viral inoculation",
    "noun phrase",
    "вирусная прививка; вирусная инокуляция; введение вируса",
    {}
  ],
  [
    "bighorn",
    "noun",
    "снежный баран; толсторог; горный баран",
    {
      "speakText": "big horn"
    }
  ],
  [
    "paddled",
    "verb",
    "греб; шлепал; бил плашмя",
    {}
  ],
  [
    "straitjacket",
    "noun",
    "смирительная рубашка; жесткое ограничение; тесные рамки",
    {}
  ],
  [
    "to engrave",
    "verb",
    "гравировать; вырезать; наносить надпись",
    {}
  ],
  [
    "turgid",
    "adjective",
    "набухший; опухший; напыщенный",
    {}
  ],
  [
    "to itemize",
    "verb",
    "перечислять по пунктам; детализировать; расписывать",
    {}
  ],
  [
    "to regale",
    "verb",
    "угощать; развлекать рассказами; потчевать",
    {}
  ],
  [
    "sweetcorn",
    "noun",
    "сладкая кукуруза; кукуруза; зерна кукурузы",
    {
      "speakText": "sweet corn"
    }
  ],
  [
    "to sophisticate",
    "verb",
    "усложнять; делать более изощренным; утончать",
    {}
  ]
];
  const GROUP_START = 63;
  const GROUP_SIZE = 12;
  const BASE_SCORE = 5.74;
  const SCORE_STEP = 0.02;

  const additions = rawEntries.map(([english, partOfSpeech, russian, extras], index) => {
    const safeExtras = extras || {};
    const readingEnglish = safeExtras.readingEnglish || (english.startsWith("to ") ? english.slice(3) : english);

    return {
      english,
      displayEnglish: `${english} (${partOfSpeech})`,
      partOfSpeech,
      russian,
      readingEnglish,
      speakText: safeExtras.speakText || english,
      acceptedAnswers: safeExtras.acceptedAnswers || [],
      group: GROUP_START + Math.floor(index / GROUP_SIZE),
      frequencyScore: Number((BASE_SCORE - index * SCORE_STEP).toFixed(3))
    };
  });

  window.WORDS.push(...additions);
})();
