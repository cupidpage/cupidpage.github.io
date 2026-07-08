const createForm = document.querySelector("#create-form");
const experienceIdInput = document.querySelector("#experience-id");
const templateSelect = document.querySelector("#template");
const titleInput = document.querySelector("#title");
const secretKeyInput = document.querySelector("#secret-key");
const formcarryInput = document.querySelector("#formcarry");
const accentInput = document.querySelector("#accent");
const q1TitleInput = document.querySelector("#q1-title");
const q1EmojiInput = document.querySelector("#q1-emoji");
const q1OptionsInput = document.querySelector("#q1-options");
const q2TitleInput = document.querySelector("#q2-title");
const q2EmojiInput = document.querySelector("#q2-emoji");
const q2OptionsInput = document.querySelector("#q2-options");
const createError = document.querySelector("#create-error");
const previewUrlOutput = document.querySelector("#preview-url");
const jsonOutput = document.querySelector("#json-output");
const previewBtn = document.querySelector("#preview-btn");
const downloadBtn = document.querySelector("#download-btn");
const copyBtn = document.querySelector("#copy-btn");

function parseOptions(rawText) {
  return rawText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf("|");
      if (separatorIndex === -1) {
        const slug = line.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        return {
          id: slug || "option",
          label: line,
          reaction: "Nice."
        };
      }

      const id = line.slice(0, separatorIndex).trim();
      const label = line.slice(separatorIndex + 1).trim();
      return {
        id: id || "option",
        label: label || id,
        reaction: "Nice."
      };
    });
}

function normalizeSlug(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildQuestion(id, title, emoji, optionsText, index, total) {
  return {
    id,
    eyebrow: `${index} / ${total}`,
    emoji,
    title,
    subtitle: "",
    options: parseOptions(optionsText)
  };
}

function encodePreviewExperience(experience) {
  const jsonText = JSON.stringify(experience);
  const base64 = btoa(unescape(encodeURIComponent(jsonText)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function buildExperienceFromForm() {
  const slug = normalizeSlug(experienceIdInput.value);
  const q1Options = parseOptions(q1OptionsInput.value);
  const q2Options = parseOptions(q2OptionsInput.value);

  if (!slug) {
    throw new Error("Add an experience id slug.");
  }
  if (q1Options.length < 2 || q2Options.length < 2) {
    throw new Error("Each question needs at least 2 options (id|Label per line).");
  }

  const template = templateSelect.value;
  const title = titleInput.value.trim();
  const isTravel = template === "travel";

  return {
    id: slug,
    template,
    title,
    documentTitle: `${title} ${isTravel ? "✈️" : "💘"}`,
    secretKey: secretKeyInput.value.trim(),
    formcarry: formcarryInput.value.trim(),
    accent: accentInput.value.trim() || "#ff6fae",
    lockTitle: isTravel ? "Ready for a trip?" : "A little secret",
    lockSubtitle: "Enter the key I left for you.",
    welcomeTitle: isTravel ? "Hey wanderer" : "Hi, my love",
    welcomeSubtitle: isTravel
      ? "Help me plan our next adventure."
      : "Help me plan something beautiful.",
    startLabel: isTravel ? "Let’s plan ✨" : "I’m ready ✨",
    wowCopy: isTravel
      ? "Our trip is already sounding perfect."
      : "I already love our date.",
    proposalTitle: isTravel
      ? "Will you travel with me?"
      : "Will you go on a date with me?",
    dateTitle: isTravel ? "When do we go?" : "When?",
    dateSubtitle: "Pick a time that feels right.",
    successTitle: isTravel ? "Adventure locked" : "I love you",
    successLines: isTravel
      ? ["Pack your bags.", "I can’t wait to go.", "See you at the gate."]
      : ["It’s a date.", "I can’t wait.", "See you soon."],
    formSubject: isTravel ? "Travel plan confirmation ✈️" : "Date confirmation 💘",
    questions: [
      buildQuestion("q1", q1TitleInput.value.trim(), q1EmojiInput.value.trim(), q1OptionsInput.value, 1, 2),
      buildQuestion("q2", q2TitleInput.value.trim(), q2EmojiInput.value.trim(), q2OptionsInput.value, 2, 2)
    ]
  };
}

function toExperiencesSnippet(experience) {
  return `  ${experience.id}: ${JSON.stringify(experience, null, 2).replace(/\n/g, "\n  ")}`;
}

function refreshOutputs() {
  createError.textContent = "";

  try {
    const experience = buildExperienceFromForm();
    const previewEncoded = encodePreviewExperience(experience);
    const previewUrl = new URL("index.html", window.location.href);
    previewUrl.searchParams.set("preview", previewEncoded);

    previewUrlOutput.value = previewUrl.toString();
    jsonOutput.value = JSON.stringify(experience, null, 2);
    return experience;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not build experience.";
    createError.textContent = message;
    previewUrlOutput.value = "";
    jsonOutput.value = "";
    return null;
  }
}

function fillTemplateDefaults() {
  const template = templateSelect.value;
  const defaults = template === "travel" ? EXPERIENCES.demo : EXPERIENCES.default;

  if (!titleInput.value) {
    titleInput.value = defaults.title;
  }
  if (!secretKeyInput.value) {
    secretKeyInput.value = defaults.secretKey;
  }
  if (!formcarryInput.value) {
    formcarryInput.value = defaults.formcarry;
  }
  accentInput.value = defaults.accent;

  q1TitleInput.value = defaults.questions[0].title;
  q1EmojiInput.value = defaults.questions[0].emoji;
  q1OptionsInput.value = defaults.questions[0].options
    .map((option) => `${option.id}|${option.label}`)
    .join("\n");

  q2TitleInput.value = defaults.questions[1].title;
  q2EmojiInput.value = defaults.questions[1].emoji;
  q2OptionsInput.value = defaults.questions[1].options
    .map((option) => `${option.id}|${option.label}`)
    .join("\n");

  if (!experienceIdInput.value) {
    experienceIdInput.value = template === "travel" ? "my-travel" : "my-date";
  }

  refreshOutputs();
}

function handlePreviewClick() {
  const experience = refreshOutputs();
  if (!experience || !previewUrlOutput.value) {
    return;
  }
  window.open(previewUrlOutput.value, "_blank", "noopener,noreferrer");
}

function handleDownloadClick() {
  const experience = refreshOutputs();
  if (!experience) {
    return;
  }

  const blob = new Blob([JSON.stringify(experience, null, 2)], {
    type: "application/json"
  });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = `${experience.id}-experience.json`;
  anchor.click();
  URL.revokeObjectURL(objectUrl);
}

async function handleCopyClick() {
  const experience = refreshOutputs();
  if (!experience) {
    return;
  }

  const snippet = toExperiencesSnippet(experience);
  jsonOutput.value = snippet;

  try {
    await navigator.clipboard.writeText(snippet);
    createError.textContent = "Snippet copied. Paste into EXPERIENCES in experiences.js, then redeploy.";
  } catch (error) {
    createError.textContent = "Copy failed — select the snippet and copy manually.";
  }
}

createForm.addEventListener("input", refreshOutputs);
createForm.addEventListener("change", refreshOutputs);
templateSelect.addEventListener("change", fillTemplateDefaults);
previewBtn.addEventListener("click", handlePreviewClick);
downloadBtn.addEventListener("click", handleDownloadClick);
copyBtn.addEventListener("click", handleCopyClick);
createForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handlePreviewClick();
});

fillTemplateDefaults();
