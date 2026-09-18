export const LOCALES = [
  { id: "en", native: "Easy English", dir: "ltr", locale: "en-US" },
  { id: "es", native: "Español", dir: "ltr", locale: "es-US" },
  { id: "es-CU", native: "Español cubano", dir: "ltr", locale: "es-CU" },
  { id: "ar", native: "العربية", dir: "rtl", locale: "ar" },
  { id: "fa", native: "فارسی", dir: "rtl", locale: "fa-IR" },
  { id: "ti", native: "ትግርኛ", dir: "ltr", locale: "ti" },
  { id: "uk", native: "Українська", dir: "ltr", locale: "uk-UA" },
  { id: "ru", native: "Русский", dir: "ltr", locale: "ru-RU" },
] as const;

export type LocaleId = (typeof LOCALES)[number]["id"];

export const LANG_LINE = LOCALES.map((l) => l.native).join(" · ");
