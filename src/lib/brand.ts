/** Locked Bearcat Bistro kit. Do not restyle the app off-book. */
export const BRAND_LOCK = "2026.09.06-soft" as const;

export const BRAND = {
  name: "Bearcat Bistro",
  kicker: "Solvay UFSD",
  tagline: "Home of the Bearcats",
  meals: "Breakfast & lunch",
  lock: BRAND_LOCK,
} as const;

export const COLORS = {
  navy: { hex: "#13243C", name: "Bistro Navy", use: "Header, wordmark, flyer mast" },
  navy2: { hex: "#1C3454", name: "Night Navy", use: "Weekend cells, hover" },
  harvest: { hex: "#E05D32", name: "Harvest", use: "Primary accent, pills, print" },
  harvestDeep: { hex: "#C44D28", name: "Harvest Deep", use: "Hover on harvest" },
  harvestText: { hex: "#B84420", name: "Harvest Text", use: "Links and small type on cream (AA)" },
  gold: { hex: "#FFF1E6", name: "Peach Gold", use: "Editable fields, hints, breakfast bar" },
  cream: { hex: "#FBF7F2", name: "Cream", use: "Cards, panels, flyer paper" },
  paper: { hex: "#F3EFE8", name: "Warm Paper", use: "App background" },
  ink: { hex: "#243044", name: "Ink", use: "Body type" },
  muted: { hex: "#4F5E72", name: "Slate", use: "Helper type — WCAG AA on cream" },
  line: { hex: "#E4DBD0", name: "Warm Line", use: "Hairline borders" },
  ok: { hex: "#2A7A52", name: "Kitchen Green", use: "In stock" },
  warn: { hex: "#C56A2B", name: "Order Amber", use: "Reorder" },
  bad: { hex: "#A63D4C", name: "Flag Rose", use: "Out / errors — never shout red" },
} as const;

export const TYPE = {
  display: { family: "Bebas Neue", fallback: "Arial Narrow, Impact, sans-serif", use: "Wordmark, month name, flyer days" },
  sans: { family: "Barlow", fallback: "Segoe UI, system-ui, sans-serif", use: "UI, body, tickets, family page" },
  ui: "Sentence case. Rounded pills. No all-caps chrome except the wordmark and flyer month.",
} as const;

export const SHAPE = {
  radiusSm: "8px",
  radiusMd: "12px",
  radiusLg: "16px",
  pill: "999px",
  shadow: "0 1px 2px rgba(19,36,60,.04), 0 10px 28px -18px rgba(19,36,60,.28)",
} as const;

export const RULES = [
  "The logo is the wordmark. Solvay UFSD in Harvest, Bearcat Bistro in Cream Bebas on Navy. No lettermark, no mascot clip-art.",
  "Harvest is an accent bar, not a fill. Navy is the bar. Cream is the room.",
  "Gold left bar = the only place staff type. Gray is locked.",
  "Pills for chrome. Sharp rectangle only on the printed flyer grid.",
  "Do not use the old neon #F15A24, black-navy #071A36, or a standalone B/S glyph.",
  "USDA legal, CEP, OVS, and allergen lines stay readable and unstyled as art.",
  "Family page and kitchen tickets share this kit. No second look.",
] as const;

export const CANVA = {
  navy: COLORS.navy.hex,
  harvest: COLORS.harvest.hex,
  gold: COLORS.gold.hex,
  cream: COLORS.cream.hex,
  fonts: "Bebas Neue (headings), Barlow (body)",
} as const;
