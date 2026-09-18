import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function iso(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseIso(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function sundayOf(d: Date) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() - x.getDay());
  return x;
}

export function mondayOf(d: Date) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const wd = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - wd);
  return x;
}

export function addDays(d: Date, n: number) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() + n);
  return x;
}

export function packDateOf(tripDate: string) {
  let d = addDays(parseIso(tripDate), -1);
  for (let i = 0; i < 14; i++) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) return iso(d);
    d = addDays(d, -1);
  }
  return iso(addDays(parseIso(tripDate), -1));
}

export function parseRoster(text: string) {
  return text
    .split(/\n/)
    .map((line) => {
      const parts = line.split(/[|,;\t]/).map((s) => s.trim()).filter(Boolean);
      if (!parts[0]) return null;
      const sw = (parts[1] || "Cheese").toLowerCase();
      const sandwich = /pb|peanut/.test(sw) ? "PB&J" : /other/.test(sw) ? "Other" : "Cheese";
      return { name: parts[0], sandwich, allergy: parts[2] || "" };
    })
    .filter((s): s is { name: string; sandwich: string; allergy: string } => !!s);
}

export function fmtShort(d: Date | string) {
  const x = typeof d === "string" ? parseIso(d) : d;
  return x.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
