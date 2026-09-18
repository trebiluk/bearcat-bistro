import { emptyDay, type DayEdit, type DurableSlice, type FlyerCopy, type SchoolPack } from "./backup";
import {
  ALLERGY,
  BREAKFAST,
  CEP,
  CHANGE,
  CLOSED,
  CONTACT,
  LEGAL_FULL,
  LEGAL_SHORT,
  MONTHS,
  OVS,
  YEAR_DAYS,
} from "./data";
import { BRAND } from "./brand";
import { SCHOOLS, schoolOf, type SchoolId } from "./schools";
import { resolvedLine, schoolDate } from "./store";
import { iso } from "./utils";

export type FamilyDay = {
  date: string;
  status: string;
  entree: string;
  second: string;
  sides: string[];
  milk: string;
  chef: boolean;
  note: string;
};

export type FamilyPayload = {
  brand: typeof BRAND;
  cep: string;
  ovs: string;
  breakfast: string;
  allergy: string;
  change: string;
  contact: string;
  legalShort: string;
  legalFull: string;
  today: string;
  schools: { id: SchoolId; short: string; name: string; grades: string; alts: string }[];
  months: { key: string; name: string; title: string; honor: string; icons: string[] }[];
  holidays: { date: string; status: string; note: string }[];
  days: Record<SchoolId, Record<string, FamilyDay>>;
};

export function monthReleased(key: string, released: FlyerCopy["released"] | undefined, today = schoolDate()) {
  if (released && key in released) return !!released[key];
  return key <= today.slice(0, 7);
}

export type FamilySource = Pick<DurableSlice, "school" | "days" | "cycle" | "defaults" | "menus" | "copy" | "icons">;

function packOf(src: FamilySource, id: SchoolId): SchoolPack {
  if (id === src.school) {
    return {
      days: src.days,
      cycle: src.cycle,
      alts: src.copy.alts || schoolOf(id).alts,
    };
  }
  return src.menus[id] ?? { days: {}, cycle: schoolOf(id).cycle, alts: schoolOf(id).alts };
}

export function buildFamilyPayload(src: FamilySource): FamilyPayload {
  const today = iso(new Date());
  const schoolToday = schoolDate();
  const months = MONTHS.map((mo) => {
    const key = `${mo.y}-${String(mo.m).padStart(2, "0")}`;
    return {
      key,
      name: new Date(mo.y, mo.m - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      title: src.copy.months[key]?.title || mo.title,
      honor: src.copy.months[key]?.honor || mo.honor,
      icons: src.icons[key] ?? [],
      posted: monthReleased(key, src.copy.released, schoolToday),
    };
  }).filter((m) => m.posted);

  const days = {} as FamilyPayload["days"];
  for (const sc of SCHOOLS) {
    const pack = packOf(src, sc.id);
    const map: Record<string, FamilyDay> = {};
    for (const { date } of YEAR_DAYS) {
      if (!months.some((m) => date.startsWith(m.key))) continue;
      const d: DayEdit = { ...emptyDay(), ...(pack.days[date] ?? {}) };
      const line = resolvedLine(date, d, pack.cycle, src.defaults, sc.id);
      map[date] = {
        date,
        status: line.status,
        entree: line.publicLines[0] || line.status,
        second: line.second,
        sides: [line.side, line.side2, line.veg, line.fruit].filter(Boolean),
        milk: line.milk,
        chef: line.chef,
        note: d.record || (line.status === "Snow" ? "Snow day" : "") || CLOSED[date]?.note || "",
      };
    }
    days[sc.id] = map;
  }

  return {
    brand: BRAND,
    cep: CEP,
    ovs: OVS,
    breakfast: src.copy.breakfast || BREAKFAST,
    allergy: ALLERGY,
    change: CHANGE,
    contact: src.copy.contact || CONTACT,
    legalShort: LEGAL_SHORT,
    legalFull: LEGAL_FULL,
    today,
    schools: SCHOOLS.map((s) => ({
      id: s.id,
      short: s.short,
      name: s.name,
      grades: s.grades,
      alts: packOf(src, s.id).alts || s.alts,
    })),
    months: months.map(({ posted: _p, ...m }) => m),
    holidays: Object.entries(CLOSED)
      .filter(([date, c]) => months.some((m) => date.startsWith(m.key)) && !/before first|after last/i.test(c.note))
      .map(([date, c]) => ({ date, status: c.status, note: c.note })),
    days,
  };
}
