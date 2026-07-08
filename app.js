const CONFIRM_BUTTON_DEFAULT_LABEL = "Confirm 💘";
const CONFIRM_BUTTON_LOADING_LABEL = "Sending…";
const DEFAULT_NO_MESSAGE = "";
const DEFAULT_YES_LABEL = "Yes 💖";
const QUIZ_FEEDBACK_HOLD_MS = 720;
const WOW_REVEAL_HOLD_MS = 900;

const NO_ESCAPE_MESSAGES = [
  "Try Yes 💖",
  "Not that one",
  "Almost… try Yes",
  "The Yes button is waiting",
  "Come on… Yes 💘"
];

const CELEBRATION_EMOJIS = ["💖", "💘", "💕", "💗", "✨", "🌸", "🦋", "⭐", "💝", "💞"];

const activeExperience = resolveActiveExperience(window.location);
let SECRET_LOVING_KEY = activeExperience.secretKey;
let FORMCARRY_ENDPOINT = activeExperience.formcarry;
let QUIZ_QUESTIONS = activeExperience.questions;
let SUCCESS_LINES = activeExperience.successLines;

const SCREEN_MOODS = {
  lock: "mood-lock",
  welcome: "mood-welcome",
  quiz: "mood-quiz",
  wow: "mood-wow",
  question: "mood-question",
  date: "mood-date",
  success: "mood-success"
};

const screens = {
  lock: document.querySelector("#screen-lock"),
  welcome: document.querySelector("#screen-welcome"),
  quiz: document.querySelector("#screen-quiz"),
  wow: document.querySelector("#screen-wow"),
  question: document.querySelector("#screen-question"),
  date: document.querySelector("#screen-date"),
  success: document.querySelector("#screen-success"),
};

const keyForm = document.querySelector("#key-form");
const keyInput = document.querySelector("#love-key");
const keyError = document.querySelector("#key-error");
const startQuizBtn = document.querySelector("#start-quiz");
const quizEyebrow = document.querySelector("#quiz-eyebrow");
const quizEmoji = document.querySelector("#quiz-emoji");
const quizTitle = document.querySelector("#quiz-title");
const quizSubtitle = document.querySelector("#quiz-subtitle");
const quizOptions = document.querySelector("#quiz-options");
const quizFeedback = document.querySelector("#quiz-feedback");
const quizProgressFill = document.querySelector("#quiz-progress-fill");
const quizStepsContainer = document.querySelector("#quiz-steps");
const wowAnswers = document.querySelector("#wow-answers");
const wowCopy = document.querySelector("#wow-copy");
const revealQuestionBtn = document.querySelector("#reveal-question");
const yesBtn = document.querySelector("#yes-btn");
const noBtn = document.querySelector("#no-btn");
const playground = document.querySelector("#button-playground");
const noMessage = document.querySelector("#no-message");
const dateForm = document.querySelector("#date-form");
const dateTimeInput = document.querySelector("#date-time");
const emailInput = document.querySelector("#email");
const noteInput = document.querySelector("#note");
const dateError = document.querySelector("#date-error");
const confirmDateBtn = document.querySelector("#confirm-date-btn");
const dateSummary = document.querySelector("#date-summary");
const successCopy = document.querySelector("#success-copy");
const restartBtn = document.querySelector("#restart-btn");
const celebrationLayer = document.querySelector("#celebration-layer");
const flashLayer = document.querySelector("#flash-layer");
const wowCard = document.querySelector("#screen-wow");
const lockTitle = document.querySelector("#lock-title");
const welcomeTitle = document.querySelector("#welcome-title");
const questionTitle = document.querySelector("#question-title");
const dateTitle = document.querySelector("#date-title");
const successTitle = document.querySelector("#success-title");
const lockSubtitle = document.querySelector("#screen-lock .subtitle");
const welcomeSubtitle = document.querySelector("#screen-welcome .subtitle");
const dateSubtitle = document.querySelector("#screen-date .subtitle");
const experienceBadge = document.querySelector("#experience-badge");

let noAttempts = 0;
let isSubmittingDate = false;
let currentQuizIndex = 0;
let isQuizAdvancing = false;
const quizAnswers = [];

function getUnlockStorageKey() {
  return `pookiePortalUnlocked:${activeExperience.id}`;
}

function applyExperienceTheme(experience) {
  document.title = experience.documentTitle || experience.title || "For You";
  document.body.dataset.experience = experience.id || "default";
  document.body.dataset.template = experience.template || "date-night";
  document.documentElement.style.setProperty("--pink-main", experience.accent || "#ff6fae");
  document.documentElement.style.setProperty("--theme-accent", experience.accent || "#ff6fae");

  if (lockTitle) {
    lockTitle.textContent = experience.lockTitle;
  }
  if (lockSubtitle) {
    lockSubtitle.textContent = experience.lockSubtitle;
  }
  if (welcomeTitle) {
    welcomeTitle.textContent = experience.welcomeTitle;
  }
  if (welcomeSubtitle) {
    welcomeSubtitle.textContent = experience.welcomeSubtitle;
  }
  if (startQuizBtn) {
    startQuizBtn.textContent = experience.startLabel;
  }
  if (questionTitle) {
    questionTitle.textContent = experience.proposalTitle;
  }
  if (dateTitle) {
    dateTitle.textContent = experience.dateTitle;
  }
  if (dateSubtitle) {
    dateSubtitle.textContent = experience.dateSubtitle;
  }
  if (successTitle) {
    successTitle.textContent = experience.successTitle;
  }
  if (wowCopy) {
    wowCopy.textContent = experience.wowCopy;
  }
  if (experienceBadge) {
    experienceBadge.textContent = experience.title;
    experienceBadge.hidden = false;
  }
}

function setMood(screenName) {
  Object.values(SCREEN_MOODS).forEach((moodClass) => {
    document.body.classList.remove(moodClass);
  });
  document.body.classList.add(SCREEN_MOODS[screenName] || "mood-lock");
}

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("is-active"));
  screens[name].classList.add("is-active");
  setMood(name);
}

function setMinimumDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  dateTimeInput.min = now.toISOString().slice(0, 16);
}

function pickRandomItem(items) {
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

function triggerFlash() {
  if (!flashLayer) {
    return;
  }

  flashLayer.classList.remove("is-flashing");
  void flashLayer.offsetWidth;
  flashLayer.classList.add("is-flashing");
}

function spawnCelebration(particleCount, mode) {
  if (!celebrationLayer) {
    return;
  }

  const celebrationMode = mode || "fall";

  for (let index = 0; index < particleCount; index += 1) {
    const particle = document.createElement("span");
    particle.className = celebrationMode === "burst"
      ? "celebration-piece is-burst"
      : "celebration-piece";
    particle.textContent = pickRandomItem(CELEBRATION_EMOJIS);
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.setProperty("--drift", `${(Math.random() * 120) - 60}px`);
    particle.style.setProperty("--spin", `${(Math.random() * 720) - 360}deg`);
    particle.style.setProperty("--burst-x", `${(Math.random() * 280) - 140}px`);
    particle.style.setProperty("--burst-y", `${(Math.random() * 240) - 160}px`);
    particle.style.animationDelay = `${Math.random() * 160}ms`;
    particle.style.fontSize = `${1.3 + Math.random() * 1.8}rem`;
    celebrationLayer.appendChild(particle);

    window.setTimeout(() => {
      particle.remove();
    }, 1800);
  }
}

function buildQuizSteps() {
  quizStepsContainer.innerHTML = "";

  QUIZ_QUESTIONS.forEach((question, stepIndex) => {
    const step = document.createElement("span");
    step.className = "quiz-step";
    step.textContent = String(stepIndex + 1);
    quizStepsContainer.appendChild(step);
  });
}

function updateQuizProgress() {
  const totalQuestions = QUIZ_QUESTIONS.length;
  const completedRatio = currentQuizIndex / totalQuestions;
  quizProgressFill.style.width = `${Math.max(12, completedRatio * 100)}%`;

  const quizSteps = quizStepsContainer.querySelectorAll(".quiz-step");
  quizSteps.forEach((step, stepIndex) => {
    step.classList.toggle("is-active", stepIndex === currentQuizIndex);
    step.classList.toggle("is-done", stepIndex < currentQuizIndex);
  });
}

function renderQuizQuestion() {
  const question = QUIZ_QUESTIONS[currentQuizIndex];
  isQuizAdvancing = false;
  quizFeedback.hidden = true;
  quizFeedback.textContent = "";
  quizFeedback.classList.remove("is-popping");

  quizEyebrow.textContent = question.eyebrow;
  quizEmoji.textContent = question.emoji;
  quizTitle.textContent = question.title;
  quizSubtitle.textContent = question.subtitle;
  quizSubtitle.hidden = !question.subtitle;
  quizOptions.innerHTML = "";

  question.options.forEach((option) => {
    const optionButton = document.createElement("button");
    optionButton.type = "button";
    optionButton.className = "quiz-option";
    optionButton.dataset.optionId = option.id;
    optionButton.textContent = option.label;
    optionButton.addEventListener("click", handleQuizOptionClick);
    quizOptions.appendChild(optionButton);
  });

  updateQuizProgress();
  showScreen("quiz");
}

function startQuizFlow() {
  currentQuizIndex = 0;
  quizAnswers.length = 0;
  buildQuizSteps();
  spawnCelebration(12, "burst");
  renderQuizQuestion();
}

function handleQuizOptionClick(event) {
  if (isQuizAdvancing) {
    return;
  }

  const selectedButton = event.currentTarget;
  const question = QUIZ_QUESTIONS[currentQuizIndex];
  const selectedOption = question.options.find(
    (option) => option.id === selectedButton.dataset.optionId
  );

  if (!selectedOption) {
    return;
  }

  isQuizAdvancing = true;

  Array.from(quizOptions.children).forEach((button) => {
    button.disabled = true;
    button.classList.toggle("is-selected", button === selectedButton);
  });

  quizAnswers.push({
    questionId: question.id,
    questionTitle: question.title,
    optionId: selectedOption.id,
    optionLabel: selectedOption.label
  });

  quizFeedback.hidden = false;
  quizFeedback.textContent = selectedOption.reaction;
  quizFeedback.classList.add("is-popping");
  spawnCelebration(10, "burst");

  const nextIndex = currentQuizIndex + 1;
  quizProgressFill.style.width = `${(nextIndex / QUIZ_QUESTIONS.length) * 100}%`;

  window.setTimeout(() => {
    if (nextIndex >= QUIZ_QUESTIONS.length) {
      openWowMoment();
      return;
    }

    currentQuizIndex = nextIndex;
    renderQuizQuestion();
  }, QUIZ_FEEDBACK_HOLD_MS);
}

function openWowMoment() {
  wowAnswers.innerHTML = "";

  quizAnswers.forEach((answer) => {
    const item = document.createElement("li");
    item.textContent = answer.optionLabel;
    wowAnswers.appendChild(item);
  });

  wowCopy.textContent = activeExperience.wowCopy;
  wowCard.classList.remove("is-exploding");
  void wowCard.offsetWidth;
  wowCard.classList.add("is-exploding");

  triggerFlash();
  spawnCelebration(30, "burst");
  spawnCelebration(18);
  showScreen("wow");

  window.setTimeout(() => {
    spawnCelebration(16, "burst");
  }, WOW_REVEAL_HOLD_MS);
}

function revealBigQuestion() {
  triggerFlash();
  spawnCelebration(24, "burst");
  resetNoButton();
  showScreen("question");
}

function unlockPortal(event) {
  event.preventDefault();
  const typedKey = keyInput.value.trim().toLowerCase();

  if (typedKey !== SECRET_LOVING_KEY.toLowerCase()) {
    keyError.textContent = "That’s not it 🥺";
    keyForm.animate([
      { transform: "translateX(0)" },
      { transform: "translateX(-8px)" },
      { transform: "translateX(8px)" },
      { transform: "translateX(0)" }
    ], { duration: 260, iterations: 1 });
    return;
  }

  localStorage.setItem(getUnlockStorageKey(), "true");
  keyError.textContent = "";
  keyInput.value = "";
  triggerFlash();
  spawnCelebration(18, "burst");
  spawnCelebration(16);
  showScreen("welcome");
}

function rectanglesOverlap(firstRect, secondRect) {
  return !(
    firstRect.right <= secondRect.left ||
    firstRect.left >= secondRect.right ||
    firstRect.bottom <= secondRect.top ||
    firstRect.top >= secondRect.bottom
  );
}

function getSafeNoPosition(playgroundRect, noWidth, noHeight, yesRect) {
  const edgePadding = 8;
  const buttonGap = 28;
  const maxX = Math.max(0, playgroundRect.width - noWidth - edgePadding);
  const maxY = Math.max(0, playgroundRect.height - noHeight - edgePadding);

  const yesLocal = {
    left: yesRect.left - playgroundRect.left - buttonGap,
    top: yesRect.top - playgroundRect.top - buttonGap,
    right: yesRect.right - playgroundRect.left + buttonGap,
    bottom: yesRect.bottom - playgroundRect.top + buttonGap
  };

  const fallbackCorners = [
    { left: edgePadding, top: edgePadding },
    { left: maxX, top: edgePadding },
    { left: edgePadding, top: maxY },
    { left: maxX, top: maxY }
  ];

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const left = Math.floor(Math.random() * (maxX + 1));
    const top = Math.floor(Math.random() * (maxY + 1));
    const candidate = {
      left,
      top,
      right: left + noWidth,
      bottom: top + noHeight
    };

    if (!rectanglesOverlap(candidate, yesLocal)) {
      return { left, top };
    }
  }

  for (const corner of fallbackCorners) {
    const candidate = {
      left: corner.left,
      top: corner.top,
      right: corner.left + noWidth,
      bottom: corner.top + noHeight
    };

    if (!rectanglesOverlap(candidate, yesLocal)) {
      return corner;
    }
  }

  return { left: edgePadding, top: edgePadding };
}

function moveNoButton(event) {
  if (event) {
    event.preventDefault();
  }

  noAttempts += 1;
  noBtn.classList.add("is-running");
  playground.classList.add("is-chasing");

  const playgroundRect = playground.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();
  const noWidth = Math.ceil(noBtn.offsetWidth) || 120;
  const noHeight = Math.ceil(noBtn.offsetHeight) || 52;
  const safePosition = getSafeNoPosition(
    playgroundRect,
    noWidth,
    noHeight,
    yesRect
  );

  noBtn.style.left = `${safePosition.left}px`;
  noBtn.style.top = `${safePosition.top}px`;

  noMessage.hidden = false;
  noMessage.textContent = pickRandomItem(NO_ESCAPE_MESSAGES);
  noMessage.classList.remove("is-popping");
  void noMessage.offsetWidth;
  noMessage.classList.add("is-popping");
}

function handleNoPointerMove(event) {
  moveNoButton(event);
}

function resetNoButton() {
  noAttempts = 0;
  noBtn.classList.remove("is-running");
  noBtn.removeAttribute("style");
  playground.classList.remove("is-chasing");
  noMessage.hidden = true;
  noMessage.textContent = DEFAULT_NO_MESSAGE;
  noMessage.classList.remove("is-popping");
  yesBtn.textContent = DEFAULT_YES_LABEL;
}

function celebrateYes() {
  yesBtn.textContent = "Yes 💖";
  triggerFlash();
  spawnCelebration(28, "burst");
  spawnCelebration(14);
  yesBtn.animate([
    { transform: "scale(1)" },
    { transform: "scale(1.14) rotate(-2deg)" },
    { transform: "scale(1)" }
  ], { duration: 420, iterations: 1 });

  window.setTimeout(() => {
    setMinimumDateTime();
    showScreen("date");
  }, 560);
}

function formatDateTime(value) {
  const date = new Date(value);
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function formatQuizAnswersForEmail() {
  return quizAnswers
    .map((answer) => `${answer.questionTitle}: ${answer.optionLabel}`)
    .join("\n");
}

function buildFormcarryQuizFields() {
  const fields = {
    quiz_answers: formatQuizAnswersForEmail() || "No quiz answers",
    experience_id: activeExperience.id,
    experience_title: activeExperience.title,
    template: activeExperience.template || "date-night"
  };

  quizAnswers.forEach((answer) => {
    fields[answer.questionId] = answer.optionLabel;
  });

  return fields;
}

function isFormcarryConfigured() {
  return Boolean(
    FORMCARRY_ENDPOINT &&
    !FORMCARRY_ENDPOINT.includes("YOUR_FORM_ID")
  );
}

function setDateFormSubmitting(isSubmitting) {
  isSubmittingDate = isSubmitting;
  confirmDateBtn.disabled = isSubmitting;
  confirmDateBtn.textContent = isSubmitting
    ? CONFIRM_BUTTON_LOADING_LABEL
    : CONFIRM_BUTTON_DEFAULT_LABEL;
}

async function sendDateToFormcarry(payload) {
  if (!isFormcarryConfigured()) {
    throw new Error(
      "Formcarry endpoint is missing. Add your form URL in app.js."
    );
  }

  const response = await fetch(FORMCARRY_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(payload)
  });

  let result = null;

  try {
    result = await response.json();
  } catch (parseError) {
    result = null;
  }

  if (!response.ok) {
    const serverMessage =
      result && typeof result.message === "string"
        ? result.message
        : "Couldn’t send. Try again.";
    throw new Error(serverMessage);
  }

  return result;
}

async function confirmDate(event) {
  event.preventDefault();

  if (isSubmittingDate) {
    return;
  }

  dateError.textContent = "";

  const dateTime = dateTimeInput.value;
  const email = emailInput.value.trim();
  const note = noteInput.value.trim();
  const confirmedAt = new Date().toISOString();

  if (!dateTime || !email) {
    dateError.textContent = "Add a time and your email.";
    return;
  }

  const response = {
    dateTime,
    email,
    note,
    confirmedAt,
    formattedDateTime: formatDateTime(dateTime),
    quizAnswers: [...quizAnswers]
  };

  setDateFormSubmitting(true);

  try {
    const quizFields = buildFormcarryQuizFields();
    const choiceSummary = quizAnswers
      .map((answer) => `<br><strong>${escapeHtml(answer.questionTitle)}:</strong> ${escapeHtml(answer.optionLabel)}`)
      .join("");

    await sendDateToFormcarry({
      email,
      date_time: dateTime,
      formatted_date_time: response.formattedDateTime,
      note: note || "No note",
      experience_id: quizFields.experience_id,
      experience_title: quizFields.experience_title,
      template: quizFields.template,
      quiz_answers: quizFields.quiz_answers,
      confirmed_at: confirmedAt,
      subject: activeExperience.formSubject || "Date confirmation 💘",
      ...Object.fromEntries(
        quizAnswers.map((answer) => [answer.questionId, answer.optionLabel])
      )
    });

    localStorage.setItem(
      `pookieDateResponse:${activeExperience.id}`,
      JSON.stringify(response)
    );

    dateSummary.innerHTML = `
      <strong>When:</strong> ${formatDateTime(dateTime)}<br>
      <strong>Email:</strong> ${escapeHtml(email)}${note ? `<br><strong>Note:</strong> ${escapeHtml(note)}` : ""}${choiceSummary}
    `;

    successCopy.textContent = pickRandomItem(SUCCESS_LINES);
    triggerFlash();
    spawnCelebration(36, "burst");
    spawnCelebration(20);
    showScreen("success");
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong. Try again.";
    dateError.textContent = message;
  } finally {
    setDateFormSubmitting(false);
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function restartExperience() {
  resetNoButton();
  currentQuizIndex = 0;
  quizAnswers.length = 0;
  showScreen("welcome");
}

keyForm.addEventListener("submit", unlockPortal);
startQuizBtn.addEventListener("click", startQuizFlow);
revealQuestionBtn.addEventListener("click", revealBigQuestion);
yesBtn.addEventListener("click", celebrateYes);
noBtn.addEventListener("mouseenter", handleNoPointerMove);
noBtn.addEventListener("click", handleNoPointerMove);
noBtn.addEventListener("touchstart", handleNoPointerMove, { passive: false });
dateForm.addEventListener("submit", confirmDate);
restartBtn.addEventListener("click", restartExperience);

applyExperienceTheme(activeExperience);
setMinimumDateTime();
showScreen("lock");
keyInput.focus();
