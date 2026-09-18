import { startTransition } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BAG, CATALOG, CHEF_CHOICE, CLOSED, FIRST_STUDENT, LAST_STUDENT, YEAR_DAYS, cycleEntree, officialStatus, type CatalogItem } from "./data";
import {
  districtSeed,
  downloadBackup,
  EMPTY_DAY,
  emptyDay,
  mergeDurable,
  parseBackup,
  PERSIST_KEY,
  persistSlice,
  persistStorage,
  readShadow,
  scheduleShadow,
  toBackup,
  flushPersist,
  type DayEdit,
  type DurableSlice,
  type FlyerCopy,
  type LogRow,
  type Toggle,
} from "./backup";
import { loadBackupFolder, writeBackupFile } from "./folder";
import { addDays, iso, mondayOf, packDateOf, parseIso } from "./utils";
import { cafeFromCounts, countKey, type CountSheet } from "./counts";
import { schoolOf, type SchoolId } from "./schools";
import { loadTutorial, saveTutorial } from "./tutorial";

export function schoolDate(d = new Date()) {
  const t = iso(d);
  if (t < FIRST_STUDENT) return FIRST_STUDENT;
  if (t > LAST_STUDENT) return LAST_STUDENT;
  return t;
}

export type View = "desk" | "year" | "stock" | "print" | "look" | "line" | "trips" | "debug" | "help" | "brand" | "counts" | "log" | "learn";
export type { DayEdit, LogRow, Toggle };

function sliceOf(s: DurableSlice): DurableSlice {
  return {
    savedAt: s.savedAt,
    headcount: s.headcounts?.[s.school] ?? s.headcount,
    headcounts: s.headcounts,
    days: s.days,
    cycle: s.cycle,
    defaults: s.defaults,
    items: s.items,
    log: s.log,
    icons: s.icons,
    tasks: s.tasks,
    checks: s.checks,
    trips: s.trips,
    counts: s.counts,
    copy: s.copy,
    school: s.school,
    menus: s.menus,
  };
}

interface State {
  view: View;
  selectedDate: string;
  selectedItem: string;
  headcount: number;
  headcounts: Record<SchoolId, number>;
  weekMonday: string;
  printMonth: string;
  days: Record<string, DayEdit>;
  cycle: string[][];
  defaults: DurableSlice["defaults"];
  items: CatalogItem[];
  log: LogRow[];
  icons: Record<string, [string, string, string]>;
  tasks: DurableSlice["tasks"];
  checks: DurableSlice["checks"];
  trips: DurableSlice["trips"];
  counts: Record<string, CountSheet>;
  copy: FlyerCopy;
  school: SchoolId;
  menus: DurableSlice["menus"];
  savedAt: string;
  lastExportAt: string;
  tutorialOn: boolean;
  tutorialStep: number;
  go: (view: View, extra?: { date?: string; item?: string }) => void;
  setHeadcount: (id: SchoolId, n: number) => void;
  setWeekMonday: (s: string) => void;
  setPrintMonth: (s: string) => void;
  patchDay: (date: string, patch: Partial<DayEdit>) => void;
  setCycle: (w: number, d: number, name: string) => void;
  setDefault: (k: keyof DurableSlice["defaults"], v: string) => void;
  patchCopy: (patch: Partial<FlyerCopy>) => void;
  setSchool: (id: SchoolId) => void;
  setMonthCopy: (month: string, patch: { title?: string; honor?: string }) => void;
  patchItem: (name: string, patch: Partial<CatalogItem>) => void;
  addItem: (item: CatalogItem) => void;
  addLog: (row: Omit<LogRow, "id">) => void;
  setIcons: (month: string, icons: [string, string, string]) => void;
  patchTask: (id: string, patch: Partial<DurableSlice["tasks"][number]>) => void;
  addTask: (task: DurableSlice["tasks"][number]) => void;
  removeTask: (id: string) => void;
  toggleCheck: (date: string, id: string) => void;
  addTrip: (trip: Omit<DurableSlice["trips"][number], "id">) => void;
  patchTrip: (id: string, patch: Partial<DurableSlice["trips"][number]>) => void;
  removeTrip: (id: string) => void;
  setCount: (date: string, school: SchoolId, name: string, n: number) => void;
  clearCounts: (date: string, school: SchoolId) => void;
  exportBackup: () => void;
  importBackup: (raw: unknown) => void;
  resetDesk: () => void;
  setTutorial: (on: boolean) => void;
  setTutorialStep: (n: number) => void;
}

export const useDesk = create<State>()(
  persist(
    (set, get) => {
      const seed = districtSeed();
      return {
        view: "print" as View,
        selectedDate: schoolDate(),
        selectedItem: CATALOG[0].name,
        headcount: seed.headcounts[seed.school],
        headcounts: seed.headcounts,
        weekMonday: iso(mondayOf(parseIso(schoolDate()))),
        printMonth: schoolDate().slice(0, 7),
        days: seed.days,
        cycle: seed.cycle,
        defaults: seed.defaults,
        items: seed.items,
        log: seed.log,
        icons: seed.icons,
        tasks: seed.tasks,
        checks: seed.checks,
        trips: seed.trips,
        counts: seed.counts,
        copy: seed.copy,
        school: seed.school,
        menus: seed.menus,
        savedAt: "",
        lastExportAt: "",
        tutorialOn: loadTutorial().on,
        tutorialStep: loadTutorial().step,
        go: (view, extra) => {
          startTransition(() => {
            set((s) => ({
              view,
              selectedDate: extra?.date ?? s.selectedDate,
              selectedItem: extra?.item ?? s.selectedItem,
              weekMonday: extra?.date ? iso(mondayOf(parseIso(extra.date))) : s.weekMonday,
              printMonth: extra?.date ? extra.date.slice(0, 7) : s.printMonth,
            }));
          });
        },
        setHeadcount: (id, n) =>
          set((s) => {
            const headcounts = { ...s.headcounts, [id]: n };
            return { headcounts, headcount: headcounts[s.school], savedAt: new Date().toISOString() };
          }),
        setWeekMonday: (s) => set({ weekMonday: s }),
        setPrintMonth: (s) => set({ printMonth: s }),
        patchDay: (date, patch) =>
          set((s) => {
            const days = { ...s.days, [date]: { ...(s.days[date] ?? emptyDay()), ...patch } };
            return {
              days,
              menus: { ...s.menus, [s.school]: { ...s.menus[s.school], days } },
              savedAt: new Date().toISOString(),
            };
          }),
        setCycle: (w, d, name) =>
          set((s) => {
            const cycle = s.cycle.map((row) => [...row]);
            cycle[w][d] = name;
            return {
              cycle,
              menus: { ...s.menus, [s.school]: { ...s.menus[s.school], cycle } },
              savedAt: new Date().toISOString(),
            };
          }),
        setDefault: (k, v) =>
          set((s) => ({ defaults: { ...s.defaults, [k]: v }, savedAt: new Date().toISOString() })),
        patchCopy: (patch) =>
          set((s) => {
            const copy = { ...s.copy, ...patch };
            return {
              copy,
              menus: { ...s.menus, [s.school]: { ...s.menus[s.school], alts: copy.alts } },
              savedAt: new Date().toISOString(),
            };
          }),
        setSchool: (id) => {
          startTransition(() => {
            set((s) => {
              if (id === s.school) return s;
              const menus = {
                ...s.menus,
                [s.school]: { days: s.days, cycle: s.cycle, alts: s.copy.alts },
              };
              const pack = menus[id] ?? { days: {}, cycle: schoolOf(id).cycle.map((r) => [...r]), alts: schoolOf(id).alts };
              return {
                school: id,
                menus,
                days: pack.days,
                cycle: pack.cycle,
                copy: { ...s.copy, alts: pack.alts },
                headcount: s.headcounts[id],
                savedAt: new Date().toISOString(),
              };
            });
          });
        },
        setMonthCopy: (month, patch) =>
          set((s) => ({
            copy: {
              ...s.copy,
              months: {
                ...s.copy.months,
                [month]: { title: s.copy.months[month]?.title ?? "", honor: s.copy.months[month]?.honor ?? "", ...patch },
              },
            },
            savedAt: new Date().toISOString(),
          })),
        patchItem: (name, patch) =>
          set((s) => ({
            items: s.items.map((it) => (it.name === name ? { ...it, ...patch } : it)),
            savedAt: new Date().toISOString(),
          })),
        addItem: (item) =>
          set((s) => ({ items: [...s.items, item], savedAt: new Date().toISOString() })),
        addLog: (row) =>
          set((s) => ({
            log: [{ ...row, id: String(Date.now()) }, ...s.log],
            savedAt: new Date().toISOString(),
          })),
        setIcons: (month, icons) =>
          set((s) => ({ icons: { ...s.icons, [month]: icons }, savedAt: new Date().toISOString() })),
        patchTask: (id, patch) =>
          set((s) => ({
            tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
            savedAt: new Date().toISOString(),
          })),
        addTask: (task) => set((s) => ({ tasks: [...s.tasks, task], savedAt: new Date().toISOString() })),
        removeTask: (id) =>
          set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id), savedAt: new Date().toISOString() })),
        toggleCheck: (date, id) =>
          set((s) => {
            const day = { ...(s.checks[date] ?? {}) };
            day[id] = !day[id];
            return { checks: { ...s.checks, [date]: day }, savedAt: new Date().toISOString() };
          }),
        addTrip: (trip) =>
          set((s) => ({
            trips: [...s.trips, { ...trip, teacher: trip.teacher || "", dest: trip.dest || "", students: trip.students ?? [], id: String(Date.now()) }],
            savedAt: new Date().toISOString(),
          })),
        patchTrip: (id, patch) =>
          set((s) => ({
            trips: s.trips.map((t) => (t.id === id ? { ...t, ...patch } : t)),
            savedAt: new Date().toISOString(),
          })),
        removeTrip: (id) => set((s) => ({ trips: s.trips.filter((t) => t.id !== id), savedAt: new Date().toISOString() })),
        setCount: (date, school, name, n) =>
          set((s) => {
            const key = countKey(school, date);
            const prev = s.counts[key] ?? { at: "", rows: {} };
            return {
              counts: {
                ...s.counts,
                [key]: { at: new Date().toISOString(), rows: { ...prev.rows, [name]: n } },
              },
              savedAt: new Date().toISOString(),
            };
          }),
        clearCounts: (date, school) =>
          set((s) => {
            const next = { ...s.counts };
            delete next[countKey(school, date)];
            return { counts: next, savedAt: new Date().toISOString() };
          }),
        exportBackup: () => {
          flushPersist();
          const slice = sliceOf(get());
          const file = toBackup(slice);
          void (async () => {
            try {
              const folder = await loadBackupFolder();
              if (folder) await writeBackupFile(folder, file);
              else downloadBackup(slice);
            } catch {
              downloadBackup(slice);
            }
            set({ lastExportAt: file.savedAt, savedAt: file.savedAt });
          })();
        },
        importBackup: (raw) => {
          const merged = mergeDurable(parseBackup(raw));
          set({ ...merged, savedAt: new Date().toISOString() });
        },
        resetDesk: () => {
          const seed = districtSeed();
          set({ ...seed, savedAt: new Date().toISOString(), lastExportAt: "" });
        },
        setTutorial: (on) => {
          const step = get().tutorialStep;
          saveTutorial(on, step);
          set({ tutorialOn: on });
        },
        setTutorialStep: (n) => {
          const on = get().tutorialOn;
          saveTutorial(on, n);
          set({ tutorialStep: n });
        },
      };
    },
    {
      name: PERSIST_KEY,
      storage: persistStorage(),
      partialize: (s) => ({
        ...persistSlice(s),
        lastExportAt: s.lastExportAt,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<DurableSlice> & { lastExportAt?: string };
        const fromShadow = typeof window !== "undefined" && !p.days ? readShadow() : null;
        const merged = mergeDurable(p.days || p.items ? p : fromShadow);
        return {
          ...current,
          ...merged,
          lastExportAt: p.lastExportAt ?? current.lastExportAt,
        };
      },
    },
  ),
);

if (typeof window !== "undefined") {
  let lastAt = "";
  useDesk.subscribe((s) => {
    if (s.savedAt === lastAt) return;
    lastAt = s.savedAt;
    scheduleShadow(sliceOf(s));
  });
}

export function resolvedStatus(date: string, d: DayEdit, school: SchoolId = "sms") {
  if (d.toggle === "Snow") return "Snow";
  if (d.toggle === "Serve anyway") return "Serve";
  if (d.toggle === "Close") return "No School";
  if (d.toggle === "PD") return "PD";
  if (d.toggle === "Breakfast only") return "Breakfast only";
  return officialStatus(date, school);
}

function closedLines(status: string, date: string) {
  if (status === "Snow") return ["Snow day"];
  if (status === "Breakfast only") return ["Half day", "Breakfast only"];
  if (status === "Weekend") return ["Weekend"];
  const note = CLOSED[date]?.note;
  if (note) return [note];
  return [status];
}

const START_UTC = Date.UTC(2026, 8, 7);
const POS_CACHE = new Map<string, { week: number; dow: number }>();

export function cyclePos(date: string) {
  let p = POS_CACHE.get(date);
  if (p) return p;
  const y = +date.slice(0, 4);
  const mo = +date.slice(5, 7);
  const d = +date.slice(8, 10);
  const days = Math.floor((Date.UTC(y, mo - 1, d) - START_UTC) / 86400000);
  const dow = (new Date(Date.UTC(y, mo - 1, d)).getUTCDay() + 6) % 7;
  p = { week: ((Math.floor(days / 7) % 4) + 4) % 4, dow };
  POS_CACHE.set(date, p);
  return p;
}

export function resolvedLine(date: string, d: DayEdit, cycle: string[][], defaults: DurableSlice["defaults"], school: SchoolId = "sms") {
  const status = resolvedStatus(date, d, school);
  if (status !== "Serve") {
    const lines = closedLines(status, date);
    return {
      status, entree: "", chef: false, pull: "", chefPick: "",
      second: "", side: "", side2: "", veg: "", fruit: "", milk: "",
      lines,
      publicLines: lines,
    };
  }
  const { week, dow } = cyclePos(date);
  const fromCycle = cycle[week]?.[dow] ?? cycleEntree(date);
  const entree = d.unplanned ? CHEF_CHOICE : (d.entree || fromCycle);
  const chef = entree === CHEF_CHOICE || d.unplanned;
  const pull = chef ? d.chefPick : entree;
  const side = d.side || defaults.side;
  const side2 = d.side2 || defaults.side2;
  const veg = d.veg || defaults.veg;
  const fruit = d.fruit || defaults.fruit;
  const milk = d.milk || defaults.milk;
  const head = chef ? (d.chefPick ? `${CHEF_CHOICE} · ${d.chefPick}` : CHEF_CHOICE) : entree;
  const past = date < schoolDate();
  const publicHead = chef
    ? (past && d.chefPick ? `${CHEF_CHOICE} · ${d.chefPick}` : CHEF_CHOICE)
    : entree;
  const lines = [head, d.second, side, side2, veg, fruit, d.served].filter(Boolean);
  const publicLines = [publicHead, d.second, side, side2, veg, fruit, d.served].filter(Boolean);
  return { status, entree, chef, pull, chefPick: d.chefPick, second: d.second, side, side2, veg, fruit, milk, lines, publicLines };
}

export function handMap(items: CatalogItem[], log: LogRow[]) {
  const map = new Map<string, number>();
  for (const it of items) map.set(it.name, it.opening);
  for (const r of log) {
    map.set(r.item, (map.get(r.item) ?? 0) + r.inn - r.out + r.adj);
  }
  return map;
}

export function onHand(name: string, items: CatalogItem[], log: LogRow[], hands?: Map<string, number>) {
  if (hands) return hands.get(name) ?? 0;
  const it = items.find((i) => i.name === name);
  if (!it) return 0;
  return log.reduce((n, r) => (r.item === name ? n + r.inn - r.out + r.adj : n), it.opening);
}

export function statusOf(name: string, items: CatalogItem[], log: LogRow[], hands?: Map<string, number>) {
  const it = items.find((i) => i.name === name);
  if (!it) return "MISSING";
  const h = onHand(name, items, log, hands);
  if (h <= 0) return "OUT";
  if (h < it.reorder) return "ORDER";
  if (h < it.par) return "LOW";
  return "OK";
}

export function flagsFor(
  date: string,
  d: DayEdit,
  line: ReturnType<typeof resolvedLine>,
  items: CatalogItem[],
  log: LogRow[],
  trips: DurableSlice["trips"] = [],
  school: SchoolId = "sms",
  hands?: Map<string, number>,
  names?: Set<string>,
) {
  const out: string[] = [];
  const has = names ?? new Set(items.map((i) => i.name));
  if (line.status === "Serve" && line.chef && !line.chefPick) {
    out.push("RED: Chef's Choice is printed. Pick extra stock to use up.");
  }
  if (line.status === "Serve" && line.chef && line.chefPick && !has.has(line.chefPick)) {
    out.push("RED: Chef pick is not in stock. Add the product or pick another.");
  }
  if (line.status === "Serve" && line.pull && !line.chef && !has.has(line.pull)) {
    out.push("RED: Entree is not in stock list. Add it or pick another.");
  }
  if (line.status === "Serve" && line.pull && statusOf(line.pull, items, log, hands) === "OUT") {
    out.push("RED: Inventory OUT. Receive a truck or pick another lunch.");
  }
  if (d.toggle === "Follow official" && line.status === "Serve" && officialStatus(date, school) !== "Serve") {
    out.push("RED: Official calendar is closed; toggle says serve.");
  }
  if ((d.toggle === "Close" || d.toggle === "PD" || d.toggle === "Snow") && officialStatus(date, school) === "Serve") {
    if (d.toggle !== "Snow") out.push("RED: You closed an in-session day. If it was weather, mark Snow day.");
  }
  const packing = trips.filter((t) => t.bags && packDateOf(t.date) === date);
  if (packing.some((t) => !(t.students && t.students.length))) {
    out.push("RED: Packing bags today with no name papers. Get the roster from the teacher.");
  }
  return out;
}

export function collectReds(
  days: Record<string, DayEdit>,
  cycle: string[][],
  defaults: DurableSlice["defaults"],
  items: CatalogItem[],
  log: LogRow[],
  trips: DurableSlice["trips"],
  school: SchoolId,
  prefix?: string,
) {
  const blank = EMPTY_DAY;
  const hands = handMap(items, log);
  const names = new Set(items.map((i) => i.name));
  const out: { date: string; hints: string[] }[] = [];
  for (const { date } of YEAR_DAYS) {
    if (prefix && !date.startsWith(prefix)) continue;
    const d = days[date] ?? blank;
    const line = resolvedLine(date, d, cycle, defaults, school);
    const hints = flagsFor(date, d, line, items, log, trips, school, hands, names);
    if (hints.length) out.push({ date, hints });
  }
  return out;
}

export function weekDates(monday: string) {
  const m = parseIso(monday);
  return [0, 1, 2, 3, 4].map((i) => iso(addDays(m, i)));
}

export function cycleWeek(date: string) {
  return cyclePos(date).week;
}

export function bagsOn(date: string, trips: DurableSlice["trips"]) {
  return trips.filter((t) => t.date === date && t.bags).reduce((n, t) => n + (Number(t.count) || 0), 0);
}

export function packsOn(date: string, trips: DurableSlice["trips"]) {
  return trips.filter((t) => t.bags && packDateOf(t.date) === date).reduce((n, t) => n + (Number(t.count) || 0), 0);
}

export function needThisWeek(
  name: string,
  monday: string,
  headcount: number,
  days: Record<string, DayEdit>,
  cycle: string[][],
  defaults: DurableSlice["defaults"],
  items: CatalogItem[],
  trips: DurableSlice["trips"] = [],
  school: SchoolId = "sms",
) {
  const it = items.find((i) => i.name === name);
  if (!it || !it.per100) return 0;
  const bagItem = name === BAG.sandwich || name === BAG.fruit || name === BAG.veg || name === BAG.milk;
  let qty = 0;
  for (const date of weekDates(monday)) {
    const line = resolvedLine(date, days[date] ?? EMPTY_DAY, cycle, defaults, school);
    const bags = bagsOn(date, trips);
    if (line.status === "Serve") {
      const cafe = Math.max(0, headcount - bags);
      const hits = [line.pull, line.second, line.side, line.side2, line.veg, line.fruit, line.milk].filter((x) => x === name).length;
      qty += (hits * cafe * it.per100) / 100;
    }
    if (bagItem) qty += (packsOn(date, trips) * it.per100) / 100;
  }
  return qty;
}

export function weekShortages(
  monday: string,
  headcount: number,
  days: Record<string, DayEdit>,
  cycle: string[][],
  defaults: DurableSlice["defaults"],
  items: CatalogItem[],
  log: LogRow[],
  trips: DurableSlice["trips"],
  school: SchoolId,
) {
  const hands = handMap(items, log);
  const byName = new Map(items.map((i) => [i.name, i]));
  const need = new Map<string, number>();
  const add = (name: string, qty: number) => {
    if (!name || qty <= 0) return;
    const it = byName.get(name);
    if (!it?.per100) return;
    need.set(name, (need.get(name) ?? 0) + (qty * it.per100) / 100);
  };
  for (const date of weekDates(monday)) {
    const line = resolvedLine(date, days[date] ?? EMPTY_DAY, cycle, defaults, school);
    const bags = bagsOn(date, trips);
    const packing = packsOn(date, trips);
    if (line.status === "Serve") {
      const cafe = Math.max(0, headcount - bags);
      add(line.pull, cafe);
      add(line.second, cafe);
      add(line.side, cafe);
      add(line.side2, cafe);
      add(line.veg, cafe);
      add(line.fruit, cafe);
      add(line.milk, cafe);
    }
    if (packing) {
      add(BAG.sandwich, packing);
      add(BAG.fruit, packing);
      add(BAG.veg, packing);
      add(BAG.milk, packing);
    }
  }
  return items
    .map((it) => {
      const hand = hands.get(it.name) ?? 0;
      const n = need.get(it.name) ?? 0;
      const st = stockTone(it.name, items, log, n, hands);
      return { ...it, hand, need: n, st };
    })
    .filter((it) => it.st === "OUT" || it.st === "ORDER" || it.st === "SHORT");
}

export function surplusItems(items: CatalogItem[], log: LogRow[]) {
  const hands = handMap(items, log);
  return items
    .filter((i) => i.type === "Entree" || i.type === "USDA case")
    .map((i) => {
      const hand = hands.get(i.name) ?? 0;
      return { ...i, hand, extra: hand - i.par };
    })
    .filter((i) => i.hand > 0)
    .sort((a, b) => b.extra - a.extra || b.hand - a.hand);
}

export function stockTone(
  name: string,
  items: CatalogItem[],
  log: LogRow[],
  need: number,
  hands?: Map<string, number>,
) {
  const it = items.find((i) => i.name === name);
  if (!it) return "MISSING" as const;
  const h = onHand(name, items, log, hands);
  if (h <= 0) return "OUT" as const;
  if (need > 0 && h < need) return "SHORT" as const;
  if (h < it.reorder) return "ORDER" as const;
  if (h < it.par) return "LOW" as const;
  if (h > it.par) return "EXTRA" as const;
  return "OK" as const;
}

export function ticketJobs(
  date: string,
  d: DayEdit,
  cycle: string[][],
  defaults: DurableSlice["defaults"],
  items: CatalogItem[],
  log: LogRow[],
  headcount: number,
  tasks: DurableSlice["tasks"],
  trips: DurableSlice["trips"] = [],
  school: SchoolId = "sms",
  counts: Record<string, CountSheet> = {},
) {
  const line = resolvedLine(date, d, cycle, defaults, school);
  const auto: DurableSlice["tasks"] = [];
  const bags = bagsOn(date, trips);
  const packing = packsOn(date, trips);
  const { cafe, counted, rows } = cafeFromCounts(date, school, headcount, bags, counts[countKey(school, date)]);
  if (line.status !== "Serve" && bags === 0 && packing === 0) {
    return {
      line,
      jobs: [{
        id: "off",
        role: "Aide" as const,
        when: "Open" as const,
        text: line.status === "Breakfast only"
          ? "Half day — serve breakfast only. No lunch line."
          : `${line.status} — no lunch line.`,
      }],
    };
  }
  const it = items.find((i) => i.name === line.pull);
  const need = line.pull && it?.per100 ? Math.ceil((cafe * it.per100) / 100) : 0;
  if (line.status === "Serve") {
    auto.push({
      id: "menu",
      role: "Cook",
      when: "Open",
      text: counted
        ? `Morning count in: ${Object.entries(rows).filter(([, n]) => n).map(([k, n]) => `${n} ${k}`).join(" · ")}. Cook to these numbers, not the plate count.`
        : `Cafeteria: ${line.publicLines[0]}. Sides: ${[line.side, line.side2, line.veg, line.fruit].filter(Boolean).join(", ")}. Line headcount ${cafe}${bags ? ` (${bags} on trips)` : ""}.`,
    });
  }
  if (packing) {
    const names = trips
      .filter((t) => t.bags && packDateOf(t.date) === date)
      .map((t) => `${t.count} ${t.group}${t.teacher ? ` / ${t.teacher}` : ""} (trip ${t.date})`)
      .join("; ");
    auto.push({
      id: "bags",
      role: "Cook",
      when: "Open",
      text: `PACK TODAY for tomorrow's trips: ${packing} bags — ${BAG.sandwich}, ${BAG.fruit}, ${BAG.veg}, ${BAG.milk}. Name paper on every bag. ${names}`,
    });
    auto.push({
      id: "bags-aide",
      role: "Aide",
      when: "Open",
      text: `Print name papers. Pack ${packing} bags. Refrigerate overnight. ${names}`,
    });
  }
  if (bags) {
    auto.push({
      id: "bags-out",
      role: "Aide",
      when: "Open",
      text: `${bags} students on trips today. Bags were packed yesterday. Hand to bus/office.`,
    });
  }
  if (line.chef) {
    auto.push({
      id: "chef",
      role: "Cook",
      when: "Open",
      text: line.chefPick
        ? `Chef's Choice — use extra ${line.chefPick}. Pull leftover first.`
        : "Chef's Choice — director must name extra stock before pull.",
    });
  } else if (line.pull && line.status === "Serve") {
    auto.push({
      id: "pull",
      role: "Cook",
      when: "Open",
      text: `Pull about ${need || "—"} case(s) of ${line.pull}. On hand ${onHand(line.pull, items, log)}.`,
    });
  }
  auto.push({
    id: "served",
    role: "Cook",
    when: "Close",
    text: `Cafeteria planned ${cafe}. Packed bags ${packing}. Line served ______  Bags out ______  Leftover ______`,
  });
  return { line, jobs: [...auto, ...tasks] };
}
