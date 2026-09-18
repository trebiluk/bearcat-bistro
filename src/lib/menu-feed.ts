import { EMPTY_DAY, districtSeed, type DurableSlice } from "./backup";
import { BRAND, COLORS } from "./brand";
import {
  ALLERGY,
  BAG,
  BREAKFAST,
  CEP,
  CHANGE,
  CHEF_CHOICE,
  CLOSED,
  CONTACT,
  FIRST_CYCLE,
  FIRST_STUDENT,
  LAST_STUDENT,
  LEGAL_FULL,
  LEGAL_SHORT,
  MONTHS,
  OVS,
} from "./data";
import { AD3027 } from "./legal";
import { LOCALES } from "./locales";
import { MENU_PAGE, SCHOOLS, schoolOf, type SchoolId } from "./schools";
import { resolvedLine } from "./store";
import { addDays, iso, parseIso } from "./utils";
import type { FamilySource } from "./family-menu";

export const FEED_FORMAT = "bearcat-bistro-menu" as const;
export const FEED_VERSION = 1 as const;
export const FEED_FILENAME = "bearcat-bistro-menu-2026-27.json";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

/** Paste this into the other Grok chat with the JSON. */
export const FEED_PROMPT = `You are building a family-facing Solvay UFSD lunch app. This JSON is the only menu source. Do not scrape PDFs. Do not invent prices, entrees, or closed days.

Rules:
- format is "${FEED_FORMAT}", version ${FEED_VERSION}.
- schools[].id is the key into days (ses, sms, shs).
- days[schoolId] is every calendar day 2026-09-01 through 2027-06-30, Sunday–Saturday.
- If day.serve is true, show day.entree and day.sides. If false, show day.status and day.note. Never put an entree on a closed day.
- Lunch AND breakfast are free (CEP). Never show a price.
- Print legal.full unedited on the website. legal.short is for one-page flyers.
- If day.chef is true, the family label is "Chef's Choice". Do not substitute a food unless chefPick is a non-empty string.
- Daily alternates are schools[].alts — they are every serve day, not a separate calendar.
- 2026-10-30: SES is breakfast only; SMS and SHS serve lunch.
- Brand: navy ${COLORS.navy.hex}, harvest ${COLORS.harvest.hex}, cream ${COLORS.cream.hex}. Wordmark only — no mascot, no lettermark.
- Languages: Easy English, Español, Español cubano, العربية, فارسی, ትግርኛ, Українська, Русский.
- Contact: ${CONTACT}.`;

export type FeedDay = {
  date: string;
  weekday: (typeof WEEKDAYS)[number];
  school: SchoolId;
  status: string;
  serve: boolean;
  meal: "lunch" | "breakfast" | "none";
  entree: string;
  second: string;
  sides: string[];
  milk: string;
  chef: boolean;
  chefPick: string;
  lines: string[];
  note: string;
};

export type MenuFeed = {
  format: typeof FEED_FORMAT;
  version: typeof FEED_VERSION;
  generatedAt: string;
  year: "2026-27";
  prompt: string;
  readme: string;
  district: {
    name: string;
    kicker: string;
    tagline: string;
    menuPage: string;
    contact: string;
    firstStudent: string;
    lastStudent: string;
    firstCycle: string;
    cep: true;
  };
  brand: {
    name: string;
    colors: { navy: string; harvest: string; cream: string; gold: string; ink: string };
    wordmarkOnly: true;
  };
  legal: { short: string; full: string; ad3027: string };
  nutrition: { cep: string; ovs: string; breakfast: string; allergy: string; change: string };
  languages: { id: string; native: string; dir: string; locale: string }[];
  bagLunch: { sandwich: string; fruit: string; veg: string; milk: string; packDayBefore: true; note: string };
  months: { key: string; name: string; title: string; honor: string }[];
  schools: {
    id: SchoolId;
    short: string;
    name: string;
    grades: string;
    alts: string;
    pdf: string;
    cycle: string[][];
  }[];
  closed: { date: string; status: string; note: string }[];
  defaults: { side: string; side2: string; veg: string; fruit: string; milk: string };
  example: { serveDay: FeedDay; closedDay: FeedDay; halfDay: FeedDay };
  days: Record<SchoolId, FeedDay[]>;
};

function packOf(src: FamilySource, id: SchoolId) {
  if (id === src.school) {
    return {
      days: src.days,
      cycle: src.cycle,
      alts: src.copy.alts || schoolOf(id).alts,
    };
  }
  return src.menus[id] ?? { days: {}, cycle: schoolOf(id).cycle, alts: schoolOf(id).alts };
}

function calendarDates(from = "2026-09-01", to = "2027-06-30") {
  const out: string[] = [];
  let d = parseIso(from);
  const end = parseIso(to);
  while (d <= end) {
    out.push(iso(d));
    d = addDays(d, 1);
  }
  return out;
}

function feedDay(date: string, school: SchoolId, src: FamilySource): FeedDay {
  const pack = packOf(src, school);
  const d = pack.days[date] ?? EMPTY_DAY;
  const line = resolvedLine(date, d, pack.cycle, src.defaults, school);
  const serve = line.status === "Serve";
  const meal = serve ? "lunch" : line.status === "Breakfast only" ? "breakfast" : "none";
  const weekday = WEEKDAYS[parseIso(date).getDay()];
  return {
    date,
    weekday,
    school,
    status: line.status,
    serve,
    meal,
    entree: serve ? line.publicLines[0] || line.entree : "",
    second: serve ? line.second : "",
    sides: serve ? [line.side, line.side2, line.veg, line.fruit].filter(Boolean) : [],
    milk: serve ? line.milk : "",
    chef: serve && line.chef,
    chefPick: serve && line.chef ? line.chefPick : "",
    lines: line.publicLines,
    note: d.record || CLOSED[date]?.note || (serve ? "" : line.status),
  };
}

export function buildMenuFeed(src: FamilySource = districtSeed()): MenuFeed {
  const dates = calendarDates();
  const days = { ses: [] as FeedDay[], sms: [] as FeedDay[], shs: [] as FeedDay[] };
  for (const id of ["ses", "sms", "shs"] as SchoolId[]) {
    days[id] = dates.map((date) => feedDay(date, id, src));
  }
  const serveDay = days.sms.find((d) => d.date === "2026-09-08")!;
  const closedDay = days.sms.find((d) => d.date === "2026-09-07")!;
  const halfDay = days.ses.find((d) => d.date === "2026-10-30")!;

  return {
    format: FEED_FORMAT,
    version: FEED_VERSION,
    generatedAt: new Date().toISOString(),
    year: "2026-27",
    prompt: FEED_PROMPT,
    readme: [
      "Bearcat Bistro menu feed v1 — Solvay UFSD 2026–27.",
      "Canonical machine-readable lunch calendar. Prefer this over the September PDFs.",
      "days[schoolId] is a full Sunday–Saturday list. Filter with date.startsWith('2026-09') for a month.",
      "serve=true means the lunch line is open. breakfast meal means half day, no lunch.",
      "Re-export from Bearcat Bistro (flyer toolbar → JSON) after the director edits a day.",
    ].join(" "),
    district: {
      name: "Solvay Union Free School District",
      kicker: BRAND.kicker,
      tagline: BRAND.tagline,
      menuPage: MENU_PAGE,
      contact: src.copy.contact || CONTACT,
      firstStudent: FIRST_STUDENT,
      lastStudent: LAST_STUDENT,
      firstCycle: FIRST_CYCLE,
      cep: true,
    },
    brand: {
      name: BRAND.name,
      colors: {
        navy: COLORS.navy.hex,
        harvest: COLORS.harvest.hex,
        cream: COLORS.cream.hex,
        gold: COLORS.gold.hex,
        ink: COLORS.ink.hex,
      },
      wordmarkOnly: true,
    },
    legal: { short: LEGAL_SHORT, full: LEGAL_FULL, ad3027: AD3027 },
    nutrition: {
      cep: CEP,
      ovs: OVS,
      breakfast: src.copy.breakfast || BREAKFAST,
      allergy: ALLERGY,
      change: CHANGE,
    },
    languages: LOCALES.map((l) => ({ id: l.id, native: l.native, dir: l.dir, locale: l.locale })),
    bagLunch: { ...BAG, packDayBefore: true },
    months: MONTHS.map((mo) => ({
      key: `${mo.y}-${String(mo.m).padStart(2, "0")}`,
      name: new Date(mo.y, mo.m - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      title: src.copy.months[`${mo.y}-${String(mo.m).padStart(2, "0")}`]?.title || mo.title,
      honor: src.copy.months[`${mo.y}-${String(mo.m).padStart(2, "0")}`]?.honor || mo.honor,
    })),
    schools: SCHOOLS.map((s) => {
      const pack = packOf(src, s.id);
      return {
        id: s.id,
        short: s.short,
        name: s.name,
        grades: s.grades,
        alts: pack.alts || s.alts,
        pdf: s.pdf,
        cycle: pack.cycle.map((row) => [...row]),
      };
    }),
    closed: Object.entries(CLOSED).map(([date, c]) => ({ date, status: c.status, note: c.note })),
    defaults: { ...src.defaults },
    example: { serveDay, closedDay, halfDay },
    days,
  };
}

export function downloadMenuFeed(src: FamilySource | DurableSlice) {
  const json = JSON.stringify(buildMenuFeed(src), null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = FEED_FILENAME;
  a.click();
  URL.revokeObjectURL(a.href);
  return json;
}
