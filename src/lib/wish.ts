// Core wish model, themes and link encoding.
// For the prototype a wish lives entirely inside its link (base64url JSON),
// so no database is needed yet. Later this moves to Supabase with short ids.

export type ThemeId = "birthday" | "diwali";

export interface Wish {
  theme: ThemeId;
  to: string;
  message: string;
  from: string;
}

export interface ThemeInfo {
  id: ThemeId;
  label: string;
  headline: string;
  emoji: string;
  swatch: string;
  messages: string[];
}

export const THEMES: Record<ThemeId, ThemeInfo> = {
  birthday: {
    id: "birthday",
    label: "Birthday Night",
    headline: "Happy Birthday",
    emoji: "🎂",
    swatch: "linear-gradient(135deg, #4c1d95, #db2777)",
    messages: [
      "Another year of you being awesome! Wishing you laughter, cake and everything your heart wants this year.",
      "May this year bring you new adventures, big wins and lots of reasons to smile. Have the best day!",
      "To the person who makes every day brighter: happy birthday! Stay amazing, always.",
    ],
  },
  diwali: {
    id: "diwali",
    label: "Diwali Glow",
    headline: "Happy Diwali",
    emoji: "🪔",
    swatch: "linear-gradient(135deg, #3b0a45, #ea580c)",
    messages: [
      "May the light of a thousand diyas fill your home with joy, peace and prosperity. Happy Diwali!",
      "Wishing you and your family a sparkling Diwali full of sweets, smiles and new beginnings.",
      "Let this Diwali light up every corner of your life with happiness. Shubh Deepavali!",
    ],
  },
};

export const THEME_LIST = Object.values(THEMES);

export const LIMITS = { to: 40, from: 40, message: 280 } as const;

export const DEMO_WISHES: Record<string, Wish> = {
  "demo-birthday": {
    theme: "birthday",
    to: "Riya",
    message: THEMES.birthday.messages[0],
    from: "Your bestie",
  },
  "demo-diwali": {
    theme: "diwali",
    to: "Sharma Family",
    message: THEMES.diwali.messages[1],
    from: "Aman & family",
  },
};

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): string {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function normalizeWish(input: Partial<Wish>): Wish | null {
  const theme = input.theme;
  if (!theme || !(theme in THEMES)) return null;
  const to = clean(input.to, LIMITS.to);
  if (!to) return null;
  return {
    theme,
    to,
    message: clean(input.message, LIMITS.message),
    from: clean(input.from, LIMITS.from),
  };
}

export function encodeWish(wish: Wish): string {
  return toBase64Url(
    JSON.stringify({ v: 1, t: wish.theme, to: wish.to, m: wish.message, f: wish.from }),
  );
}

export function decodeWish(id: string): Wish | null {
  try {
    const data = JSON.parse(fromBase64Url(id));
    if (!data || data.v !== 1) return null;
    return normalizeWish({ theme: data.t, to: data.to, message: data.m, from: data.f });
  } catch {
    return null;
  }
}

export function getWish(id: string): Wish | null {
  return DEMO_WISHES[id] ?? decodeWish(id);
}

// Split text into user-perceived characters so Hindi/Indic names
// (conjuncts, matras) are animated letter by letter without breaking.
export function splitGraphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), (part) => part.segment);
  }
  return Array.from(text);
}
