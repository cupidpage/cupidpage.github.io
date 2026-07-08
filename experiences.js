// Ideation-phase experience configs for GitHub Pages.
// Add a new key here, redeploy, then share: https://cupidpage.github.io/?e=yourKey
// This is not real multi-tenant SaaS — configs live in this static file.

const DEFAULT_FORMCARRY = "https://formcarry.com/s/JTMxGGywkV3";

const EXPERIENCES = {
  default: {
    id: "default",
    template: "date-night",
    title: "For You",
    documentTitle: "For You 💘",
    secretKey: "sudiplovesyou",
    formcarry: DEFAULT_FORMCARRY,
    accent: "#ff6fae",
    lockTitle: "A little secret",
    lockSubtitle: "Enter the key I left for you.",
    welcomeTitle: "Hi, my love",
    welcomeSubtitle: "Help me plan something beautiful.",
    startLabel: "I’m ready ✨",
    wowCopy: "I already love our date.",
    proposalTitle: "Will you go on a date with me?",
    dateTitle: "When?",
    dateSubtitle: "Pick a time that feels right.",
    successTitle: "I love you",
    successLines: [
      "It’s a date.",
      "I can’t wait.",
      "See you soon.",
      "My favorite yes."
    ],
    formSubject: "Date confirmation 💘",
    questions: [
      {
        id: "cuisine",
        eyebrow: "1 / 2",
        emoji: "🍝",
        title: "What cuisine do you want?",
        subtitle: "",
        options: [
          { id: "italian", label: "Italian 🍝", reaction: "Perfect." },
          { id: "japanese", label: "Japanese 🍣", reaction: "Yes." },
          { id: "indian", label: "Indian 🍛", reaction: "Love that." },
          { id: "chinese", label: "Chinese 🥟", reaction: "Noted." },
          { id: "thai", label: "Thai 🍜", reaction: "Great pick." },
          { id: "surprise", label: "Surprise me 🎁", reaction: "I’ve got you." }
        ]
      },
      {
        id: "dessert",
        eyebrow: "2 / 2",
        emoji: "🍰",
        title: "Dessert?",
        subtitle: "",
        options: [
          { id: "cake", label: "Cake 🍰", reaction: "Sweet." },
          { id: "icecream", label: "Ice cream 🍦", reaction: "Cute." },
          { id: "skip", label: "Just us 💕", reaction: "Even better." }
        ]
      }
    ]
  },
  demo: {
    id: "demo",
    template: "travel",
    title: "Travel with me",
    documentTitle: "Travel with me ✈️",
    secretKey: "letsgo",
    formcarry: DEFAULT_FORMCARRY,
    accent: "#14b8a6",
    lockTitle: "Ready for a trip?",
    lockSubtitle: "Enter the travel key I left for you.",
    welcomeTitle: "Hey wanderer",
    welcomeSubtitle: "Help me plan our next adventure.",
    startLabel: "Let’s plan ✨",
    wowCopy: "Our trip is already sounding perfect.",
    proposalTitle: "Will you travel with me?",
    dateTitle: "When do we go?",
    dateSubtitle: "Pick a departure that feels right.",
    successTitle: "Adventure locked",
    successLines: [
      "Pack your bags.",
      "I can’t wait to go.",
      "See you at the gate.",
      "Best yes ever."
    ],
    formSubject: "Travel plan confirmation ✈️",
    questions: [
      {
        id: "destination",
        eyebrow: "1 / 2",
        emoji: "✈️",
        title: "Where should we go?",
        subtitle: "",
        options: [
          { id: "beach", label: "Beach 🏖️", reaction: "Sun mode." },
          { id: "city", label: "City break 🏙️", reaction: "Lights and walks." },
          { id: "mountains", label: "Mountains ⛰️", reaction: "Fresh air." },
          { id: "surprise", label: "Surprise me 🎁", reaction: "I’ve got you." }
        ]
      },
      {
        id: "budget",
        eyebrow: "2 / 2",
        emoji: "💸",
        title: "Budget vibe?",
        subtitle: "",
        options: [
          { id: "cozy", label: "Cozy and simple 🌿", reaction: "Soft trip." },
          { id: "mid", label: "Middle ground ✨", reaction: "Balanced." },
          { id: "treat", label: "Treat ourselves 🥂", reaction: "Yes please." }
        ]
      }
    ]
  }
};

function getExperienceSlugFromLocation(locationObject) {
  const params = new URLSearchParams(locationObject.search);
  const slug = (params.get("e") || params.get("experience") || "default")
    .trim()
    .toLowerCase();
  return slug || "default";
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeExperience(rawExperience, fallbackSlug) {
  const base = deepClone(EXPERIENCES.default);
  const source = rawExperience || {};

  return {
    ...base,
    ...source,
    id: source.id || fallbackSlug || "default",
    questions: Array.isArray(source.questions) && source.questions.length > 0
      ? deepClone(source.questions)
      : base.questions,
    successLines: Array.isArray(source.successLines) && source.successLines.length > 0
      ? [...source.successLines]
      : base.successLines,
    formcarry: source.formcarry || base.formcarry,
    secretKey: source.secretKey || base.secretKey
  };
}

function decodePreviewExperience(encodedValue) {
  if (!encodedValue) {
    return null;
  }

  try {
    const normalized = encodedValue.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const jsonText = decodeURIComponent(escape(atob(padded)));
    return JSON.parse(jsonText);
  } catch (error) {
    console.warn("Could not decode preview experience.", error);
    return null;
  }
}

function resolveActiveExperience(locationObject) {
  const params = new URLSearchParams(locationObject.search);
  const previewEncoded = params.get("preview");

  if (previewEncoded) {
    const previewConfig = decodePreviewExperience(previewEncoded);
    if (previewConfig) {
      return normalizeExperience(
        { ...previewConfig, id: previewConfig.id || "preview" },
        "preview"
      );
    }
  }

  const slug = getExperienceSlugFromLocation(locationObject);
  if (Object.prototype.hasOwnProperty.call(EXPERIENCES, slug)) {
    return normalizeExperience(EXPERIENCES[slug], slug);
  }

  return normalizeExperience(EXPERIENCES.default, "default");
}