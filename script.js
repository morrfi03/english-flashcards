const IRREGULAR_VERBS = [
  { en: "be", ru: "быть (was/were — been)" },
  { en: "become", ru: "становиться (became — become)" },
  { en: "begin", ru: "начинать (began — begun)" },
  { en: "break", ru: "ломать (broke — broken)" },
  { en: "bring", ru: "приносить (brought — brought)" },
  { en: "buy", ru: "покупать (bought — bought)" },
  { en: "catch", ru: "ловить (caught — caught)" },
  { en: "choose", ru: "выбирать (chose — chosen)" },
  { en: "come", ru: "приходить (came — come)" },
  { en: "do", ru: "делать (did — done)" },
  { en: "drink", ru: "пить (drank — drunk)" },
  { en: "eat", ru: "есть (ate — eaten)" },
  { en: "fall", ru: "падать (fell — fallen)" },
  { en: "feel", ru: "чувствовать (felt — felt)" },
  { en: "find", ru: "находить (found — found)" },
  { en: "get", ru: "получать (got — got/gotten)" },
  { en: "give", ru: "давать (gave — given)" },
  { en: "go", ru: "идти (went — gone)" },
  { en: "have", ru: "иметь (had — had)" },
  { en: "know", ru: "знать (knew — known)" },
  { en: "leave", ru: "покидать (left — left)" },
  { en: "make", ru: "делать (made — made)" },
  { en: "meet", ru: "встречать (met — met)" },
  { en: "pay", ru: "платить (paid — paid)" },
  { en: "put", ru: "класть (put — put)" },
  { en: "read", ru: "читать (read — read)" },
  { en: "say", ru: "говорить (said — said)" },
  { en: "see", ru: "видеть (saw — seen)" },
  { en: "speak", ru: "говорить (spoke — spoken)" },
  { en: "take", ru: "брать (took — taken)" },
  { en: "tell", ru: "рассказывать (told — told)" },
  { en: "think", ru: "думать (thought — thought)" },
  { en: "understand", ru: "понимать (understood — understood)" },
  { en: "write", ru: "писать (wrote — written)" }
];

const WORDS_PHRASES = [
  { en: "Hello", ru: "Привет" },
  { en: "Thank you", ru: "Спасибо" },
  { en: "Please", ru: "Пожалуйста" },
  { en: "Excuse me", ru: "Извините" },
  { en: "How are you?", ru: "Как дела?" },
  { en: "I'm fine, thanks", ru: "Хорошо, спасибо" },
  { en: "What's your name?", ru: "Как тебя зовут?" },
  { en: "Nice to meet you", ru: "Приятно познакомиться" },
  { en: "Good morning", ru: "Доброе утро" },
  { en: "Good night", ru: "Спокойной ночи" },
  { en: "I don't understand", ru: "Я не понимаю" },
  { en: "Can you help me?", ru: "Можешь помочь?" },
  { en: "Where is the bathroom?", ru: "Где туалет?" },
  { en: "How much does it cost?", ru: "Сколько это стоит?" },
  { en: "I would like...", ru: "Я хотел бы..." },
  { en: "See you later", ru: "Увидимся позже" },
  { en: "Have a nice day", ru: "Хорошего дня" },
  { en: "What's the time?", ru: "Который час?" },
  { en: "I'm learning English", ru: "Я изучаю английский" },
  { en: "Do you speak English?", ru: "Вы говорите по-английски?" }
];

let currentDeck = [];
let currentIndex = 0;
let currentMode = "verbs";
let customWords = JSON.parse(localStorage.getItem("customWords") || "[]");

const flashcard = document.getElementById("flashcard");
const frontContent = document.getElementById("front-content");
const backContent = document.getElementById("back-content");
const progressEl = document.getElementById("progress");
const addForm = document.getElementById("add-form");

function loadDeck(mode) {
  currentMode = mode;
  if (mode === "verbs") {
    currentDeck = [...IRREGULAR_VERBS];
    addForm.style.display = "none";
  } else if (mode === "words") {
    currentDeck = [...WORDS_PHRASES];
    addForm.style.display = "none";
  } else {
    currentDeck = [...customWords];
    addForm.style.display = "block";
  }
  if (currentDeck.length === 0 && mode === "custom") {
    currentDeck = [{ en: "Добавьте свои слова", ru: "Используйте форму ниже" }];
  }
  currentIndex = 0;
  showCard();
  updateModeButtons();
}

function showCard() {
  if (currentDeck.length === 0) return;
  const card = currentDeck[currentIndex];
  frontContent.textContent = card.en;
  backContent.textContent = card.ru;
  flashcard.classList.remove("flipped");
  progressEl.textContent = `${currentIndex + 1} / ${currentDeck.length}`;
}

function nextCard() {
  if (currentDeck.length === 0) return;
  currentIndex = (currentIndex + 1) % currentDeck.length;
  showCard();
}

function prevCard() {
  if (currentDeck.length === 0) return;
  currentIndex = (currentIndex - 1 + currentDeck.length) % currentDeck.length;
  showCard();
}

function shuffleDeck() {
  for (let i = currentDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [currentDeck[i], currentDeck[j]] = [currentDeck[j], currentDeck[i]];
  }
  currentIndex = 0;
  showCard();
}

function updateModeButtons() {
  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mode === currentMode);
  });
}

flashcard.addEventListener("click", () => {
  flashcard.classList.toggle("flipped");
});

document.getElementById("next-btn").addEventListener("click", nextCard);
document.getElementById("prev-btn").addEventListener("click", prevCard);
document.getElementById("shuffle-btn").addEventListener("click", shuffleDeck);

document.getElementById("know-btn").addEventListener("click", () => {
  nextCard();
});

document.getElementById("dont-know-btn").addEventListener("click", () => {
  nextCard();
});

document.querySelectorAll(".mode-btn").forEach(btn => {
  btn.addEventListener("click", () => loadDeck(btn.dataset.mode));
});

document.getElementById("add-btn").addEventListener("click", () => {
  const en = document.getElementById("en-input").value.trim();
  const ru = document.getElementById("ru-input").value.trim();
  if (en && ru) {
    customWords.push({ en, ru });
    localStorage.setItem("customWords", JSON.stringify(customWords));
    document.getElementById("en-input").value = "";
    document.getElementById("ru-input").value = "";
    loadDeck("custom");
  }
});

// Init
loadDeck("verbs");
