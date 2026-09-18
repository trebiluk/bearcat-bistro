import type { SchoolId } from "./schools";

export type CountSheet = {
  at: string;
  rows: Record<string, number>;
};

export function countKey(school: SchoolId, date: string) {
  return `${school}|${date}`;
}

export function countTotal(sheet?: CountSheet | null) {
  if (!sheet) return 0;
  return Object.values(sheet.rows).reduce((n, v) => n + (Number(v) || 0), 0);
}

export function countHas(sheet?: CountSheet | null) {
  return countTotal(sheet) > 0;
}

export function choiceOptions(
  date: string,
  school: SchoolId,
  line: { status: string; entree: string; chef: boolean; chefPick: string; second: string },
) {
  const names: string[] = [];
  if (line.status === "Serve") {
    names.push(line.chef && line.chefPick ? line.chefPick : line.entree);
    if (line.second) names.push(line.second);
  }
  const dow = new Date(+date.slice(0, 4), +date.slice(5, 7) - 1, +date.slice(8, 10)).getDay();
  if (school === "ses") {
    if (dow === 1) names.push("Tuna sandwich");
    if (dow === 2) names.push("Turkey & cheese");
    if (dow === 3) names.push("Ham & cheese");
    names.push("PB&J", "Cheese sandwich");
  } else if (school === "sms") {
    names.push("Deli bar", "Chicken patty", "Spicy chicken", "PB&J", "Cheese sandwich");
  } else {
    names.push("Deli bar", "Chicken patty", "Spicy chicken", "Yogurt parfait", "Entrée salad", "PB&J");
  }
  return [...new Set(names.filter(Boolean))];
}

export function cafeFromCounts(
  date: string,
  school: SchoolId,
  headcount: number,
  bags: number,
  sheet?: CountSheet | null,
) {
  if (countHas(sheet)) {
    return { cafe: countTotal(sheet), counted: true as const, rows: sheet!.rows };
  }
  return { cafe: Math.max(0, headcount - bags), counted: false as const, rows: {} as Record<string, number> };
}
