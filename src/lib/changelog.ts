import { CLOSED, FIRST_STUDENT, LAST_STUDENT, MONTHS } from "./data";
import type { DayEdit, DurableSlice, JournalEntry } from "./backup";
import { SCHOOLS, type SchoolId } from "./schools";

export const JOURNAL_KINDS = ["note", "snow", "chef", "calendar", "app", "print", "count"] as const;
export type JournalKind = (typeof JOURNAL_KINDS)[number];

const KIND_LABEL: Record<JournalKind, string> = {
  note: "Note",
  snow: "Snow",
  chef: "Chef's Choice",
  calendar: "Calendar",
  app: "App",
  print: "Flyer",
  count: "Counts",
};

export function kindLabel(k: JournalKind) {
  return KIND_LABEL[k] ?? k;
}

/** Baked history from the district calendar and this desk's 2026-09 build. */
export const HISTORY: JournalEntry[] = [
  {
    id: "h-cal-approved",
    date: "2026-08-20",
    kind: "calendar",
    title: "2026–27 district calendar approved",
    body: "Board calendar locked first student day Sep 8, last student day Jun 24. Holidays and PD days baked into this desk.",
    school: "all",
  },
  {
    id: "h-sept-pdfs",
    date: "2026-08-25",
    kind: "print",
    title: "September menus posted",
    body: "Official SES, SMS, and SHS September PDFs published at solvayschools.org/menu. Cycle and entrees in this app match those flyers.",
    school: "all",
  },
  {
    id: "h-first",
    date: FIRST_STUDENT,
    kind: "calendar",
    title: "First student day",
    body: "Lunch service begins. SMS cycle week 1 Tuesday is Chicken Poppers w/ Dippin' Sauce.",
    school: "all",
  },
  {
    id: "h-last",
    date: LAST_STUDENT,
    kind: "calendar",
    title: "Last student day (planned)",
    body: "Last planned lunch. June 25 is PD after students leave.",
    school: "all",
  },
  {
    id: "h-half-ses",
    date: "2026-10-30",
    kind: "calendar",
    title: "SES half day — breakfast only",
    body: "Elementary serves breakfast; no lunch. Middle and high still serve lunch unless marked otherwise.",
    school: "ses",
  },
  {
    id: "h-cep",
    date: "2026-09-01",
    kind: "app",
    title: "CEP / free meals",
    body: "Solvay UFSD participates in CEP. All enrolled students receive breakfast and lunch at no charge. USDA nondiscrimination statement stays on every flyer.",
    school: "all",
  },
  {
    id: "h-app-bistro",
    date: "2026-09-06",
    kind: "app",
    title: "Bearcat Bistro desk 2026.09.07-swift",
    body: "Menu flyer (wide/tall), kitchen tickets, stock, bags, morning counts, family HTML, snow-day and unplanned Chef's Choice records. Three schools: SES, SMS, SHS.",
    school: "all",
  },
  {
    id: "h-place",
    date: "2026-09-23",
    kind: "app",
    title: "Building bar 2026.09.23-place",
    body: "Harvest bar names the building (SES, SMS, or SHS) and the menu on screen. Flyer mast prints the school name above the month.",
    school: "all",
  },
  {
    id: "h-family",
    date: "2026-09-06",
    kind: "app",
    title: "Family page",
    body: "Single-file HTML for parents: this week, month calendar Su–Sa, search, add-to-calendar. Posted months only.",
    school: "all",
  },
];

function closedHistory(): JournalEntry[] {
  return Object.entries(CLOSED)
    .filter(([, v]) => v.note && v.note !== "Before first student day" && v.note !== "After last student day")
    .map(([date, v]) => ({
      id: `closed-${date}`,
      date,
      kind: "calendar" as const,
      title: v.note,
      body: v.status,
      school: "all" as const,
    }));
}

function dayHistory(days: Record<string, DayEdit>, school: SchoolId): JournalEntry[] {
  const out: JournalEntry[] = [];
  for (const [date, d] of Object.entries(days)) {
    if (!d) continue;
    if (d.toggle === "Snow") {
      out.push({
        id: `snow-${school}-${date}`,
        date,
        kind: "snow",
        title: "Snow day",
        body: d.record || "No lunch. Logged after the fact.",
        school,
      });
    }
    if (d.unplanned) {
      out.push({
        id: `chef-${school}-${date}`,
        date,
        kind: "chef",
        title: "Unplanned Chef's Choice",
        body: [d.chefPick, d.record].filter(Boolean).join(" · ") || "Leftover used that day.",
        school,
      });
    }
    if (d.record && d.toggle !== "Snow" && !d.unplanned) {
      out.push({
        id: `rec-${school}-${date}`,
        date,
        kind: "note",
        title: "Kitchen note",
        body: d.record,
        school,
      });
    }
  }
  return out;
}

export function buildChangelog(src: Pick<DurableSlice, "copy" | "days" | "menus" | "counts" | "trips">): JournalEntry[] {
  const user = Array.isArray(src.copy.journal) ? src.copy.journal : [];
  const sent = Object.entries(src.copy.sent || {}).map(([month, when]) => {
    const name = MONTHS.find((m) => `${m.y}-${String(m.m).padStart(2, "0")}` === month);
    const label = name ? new Date(name.y, name.m - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : month;
    return {
      id: `sent-${month}`,
      date: when.slice(0, 10) || month + "-01",
      kind: "print" as const,
      title: `${label} flyer sent`,
      body: "PDF marked sent for printing and backpacks.",
      school: "all" as const,
    };
  });
  const counts = Object.entries(src.counts || {}).map(([key, sheet]) => {
    const [school, date] = key.split("|");
    return {
      id: `count-${key}`,
      date: date || key,
      kind: "count" as const,
      title: `Morning counts · ${(school || "").toUpperCase()}`,
      body:
        Object.entries(sheet.rows)
          .filter(([, n]) => n > 0)
          .map(([k, n]) => `${k} ${n}`)
          .join(" · ") || "Sheet opened.",
      school: (school as SchoolId) || "all",
    };
  });
  const trips = (src.trips || []).map((t) => ({
    id: `trip-${t.id}`,
    date: t.date,
    kind: "note" as const,
    title: `Field trip · ${t.group || t.teacher || "group"}`,
    body: [t.dest, t.bags ? `${t.count || t.students?.length || 0} bags` : "no bags", t.note].filter(Boolean).join(" · "),
    school: "all" as const,
  }));

  const kitchen: JournalEntry[] = [
    ...dayHistory(src.days, "sms"),
    ...SCHOOLS.flatMap((sc) => dayHistory(src.menus[sc.id]?.days ?? {}, sc.id)),
  ];

  const all = [...HISTORY, ...closedHistory(), ...user, ...sent, ...counts, ...trips, ...kitchen];
  const seen = new Set<string>();
  const uniq = all.filter((e) => {
    if (seen.has(e.id)) return false;
    seen.add(e.id);
    return true;
  });
  uniq.sort((a, b) => (a.date === b.date ? a.title.localeCompare(b.title) : b.date.localeCompare(a.date)));
  return uniq;
}

export function newJournalId() {
  return `j-${Date.now().toString(36)}`;
}
