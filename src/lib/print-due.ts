import { MONTHS, YEAR_DAYS } from "./data";
import { addDays, iso, parseIso } from "./utils";

export type PrintDue = {
  key: string;
  name: string;
  first: string;
  daysLeft: number;
};

export function printDue(today: string, sent?: Record<string, string>): PrintDue | null {
  const marked = sent || {};
  for (const mo of MONTHS) {
    const key = `${mo.y}-${String(mo.m).padStart(2, "0")}`;
    if (marked[key]) continue;
    const first = YEAR_DAYS.find((d) => d.date.startsWith(key))?.date;
    if (!first) continue;
    const daysLeft = Math.round((parseIso(first).getTime() - parseIso(today).getTime()) / 86400000);
    if (daysLeft > 7) return null;
    if (daysLeft < -3) continue;
    const name = new Date(mo.y, mo.m - 1, 1).toLocaleDateString("en-US", { month: "long" });
    return { key, name, first, daysLeft };
  }
  return null;
}

export function warnCopy(job: PrintDue, copies: { short: string; n: number }[]) {
  const list = copies.map((c) => `${c.short} ${c.n}`).join(" · ");
  const n = copies.reduce((s, c) => s + c.n, 0);
  if (job.daysLeft > 1) {
    return `One week: print the ${job.name} menu for every child (${list}, ${n} papers) and send each school’s PDF.`;
  }
  if (job.daysLeft === 1) {
    return `Tomorrow is the first ${job.name} lunch. Print today: ${list}. Send each PDF.`;
  }
  if (job.daysLeft === 0) {
    return `${job.name} lunches start today. Menu not marked sent — print ${list}.`;
  }
  return `${job.name} already started. Menu not marked sent — print ${list} and send the PDFs.`;
}

export function weekBefore(first: string) {
  return iso(addDays(parseIso(first), -7));
}
