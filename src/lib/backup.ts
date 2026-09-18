import type { CatalogItem, LineTask } from "./data";
import { CATALOG, CYCLE, DEFAULTS, LINE_TEMPLATE, MONTH_ICONS } from "./data";
import { cloneCycle, schoolOf, type SchoolId } from "./schools";
import type { CountSheet } from "./counts";

export const PERSIST_KEY = "solvay-lunch-v1";
export const SHADOW_KEY = "solvay-lunch-shadow";
export const BACKUP_VERSION = 1 as const;

export type Toggle = "Follow official" | "Close" | "PD" | "Serve anyway" | "Breakfast only" | "Snow";

export interface DayEdit {
  toggle: Toggle;
  entree: string;
  second: string;
  side: string;
  side2: string;
  veg: string;
  fruit: string;
  milk: string;
  served: string;
  chefPick: string;
  unplanned: boolean;
  record: string;
}

export interface StudentBag {
  name: string;
  sandwich: string;
  allergy: string;
}

export interface Trip {
  id: string;
  date: string;
  group: string;
  count: number;
  time: string;
  bags: boolean;
  note: string;
  teacher: string;
  dest: string;
  students: StudentBag[];
}

export interface LogRow {
  id: string;
  date: string;
  item: string;
  inn: number;
  out: number;
  adj: number;
  note: string;
}

export interface BackupFile {
  version: typeof BACKUP_VERSION;
  savedAt: string;
  headcount: number;
  headcounts: Record<SchoolId, number>;
  days: Record<string, DayEdit>;
  cycle: string[][];
  defaults: typeof DEFAULTS;
  items: CatalogItem[];
  log: LogRow[];
  icons: Record<string, [string, string, string]>;
  tasks: LineTask[];
  checks: Record<string, Record<string, boolean>>;
  trips: Trip[];
  counts: Record<string, CountSheet>;
  copy: FlyerCopy;
  school: SchoolId;
  menus: Record<SchoolId, SchoolPack>;
}

export type DurableSlice = Omit<BackupFile, "version">;

export type SchoolPack = {
  days: Record<string, DayEdit>;
  cycle: string[][];
  alts: string;
};

export function emptyMenus(): Record<SchoolId, SchoolPack> {
  return {
    ses: { days: {}, cycle: cloneCycle("ses"), alts: schoolOf("ses").alts },
    sms: { days: {}, cycle: cloneCycle("sms"), alts: schoolOf("sms").alts },
    shs: { days: {}, cycle: cloneCycle("shs"), alts: schoolOf("shs").alts },
  };
}

export type JournalKind = "note" | "snow" | "chef" | "calendar" | "app" | "print" | "count";

export interface JournalEntry {
  id: string;
  date: string;
  kind: JournalKind;
  title: string;
  body: string;
  school?: SchoolId | "all";
}

export type FlyerBits = {
  cepBar: boolean;
  alts: boolean;
  breakfast: boolean;
  ovs: boolean;
  allergy: boolean;
  change: boolean;
  contact: boolean;
  legal: "short" | "full";
  langs: boolean;
};

export function fullBits(): FlyerBits {
  return { cepBar: true, alts: true, breakfast: true, ovs: true, allergy: true, change: true, contact: true, legal: "full", langs: true };
}

export function slimBits(): FlyerBits {
  return { cepBar: true, alts: false, breakfast: false, ovs: false, allergy: false, change: false, contact: false, legal: "short", langs: true };
}

export function isSlimBits(b: FlyerBits | undefined) {
  if (!b) return false;
  return b.cepBar && !b.alts && !b.breakfast && !b.ovs && !b.allergy && !b.change && !b.contact && b.legal === "short";
}

export function mergeBits(partial?: Partial<FlyerBits> | null): FlyerBits {
  return { ...fullBits(), ...(partial ?? {}) };
}

export interface FlyerCopy {
  alts: string;
  breakfast: string;
  contact: string;
  weekCol: boolean;
  months: Record<string, { title: string; honor: string }>;
  released: Record<string, boolean>;
  sent: Record<string, string>;
  orient: "landscape" | "portrait";
  journal: JournalEntry[];
  bits: FlyerBits;
}

export function emptyCopy(): FlyerCopy {
  return { alts: "", breakfast: "", contact: "", weekCol: true, months: {}, released: {}, sent: {}, orient: "landscape", journal: [], bits: fullBits() };
}

export const EMPTY_DAY: DayEdit = Object.freeze({
  toggle: "Follow official",
  entree: "",
  second: "",
  side: "",
  side2: "",
  veg: "",
  fruit: "",
  milk: "",
  served: "",
  chefPick: "",
  unplanned: false,
  record: "",
});

export function emptyDay(): DayEdit {
  return { ...EMPTY_DAY };
}


export function districtSeed(): DurableSlice {
  return {
    savedAt: "",
    headcount: 350,
    headcounts: { ses: 450, sms: 350, shs: 400 },
    days: {},
    cycle: CYCLE.map((r) => [...r]),
    defaults: { ...DEFAULTS },
    items: CATALOG.map((c) => ({ ...c })),
    log: [],
    icons: { ...MONTH_ICONS },
    tasks: LINE_TEMPLATE.map((t) => ({ ...t })),
    checks: {},
    trips: [],
    counts: {},
    copy: emptyCopy(),
    school: "sms",
    menus: emptyMenus(),
  };
}

export function mergeDurable(partial?: Partial<DurableSlice> | null): DurableSlice {
  const seed = districtSeed();
  const days = { ...seed.days, ...(partial?.days ?? {}) };
  for (const [k, v] of Object.entries(days)) {
    days[k] = { ...emptyDay(), ...v };
  }
  const byName = new Map(seed.items.map((i) => [i.name, i]));
  for (const it of partial?.items ?? []) {
    byName.set(it.name, { ...(byName.get(it.name) ?? it), ...it });
  }
  const cycle =
    partial?.cycle?.length === 4 && partial.cycle.every((r) => r.length === 5)
      ? partial.cycle.map((r) => [...r])
      : seed.cycle;
  const menus = emptyMenus();
  const incoming = partial?.menus;
  if (incoming && typeof incoming === "object") {
    (["ses", "sms", "shs"] as SchoolId[]).forEach((id) => {
      const p = incoming[id];
      if (!p) return;
      const packedDays = { ...p.days };
      for (const [k, v] of Object.entries(packedDays)) packedDays[k] = { ...emptyDay(), ...v };
      menus[id] = {
        days: packedDays,
        cycle: p.cycle?.length === 4 && p.cycle.every((r) => r.length === 5) ? p.cycle.map((r) => [...r]) : menus[id].cycle,
        alts: typeof p.alts === "string" && p.alts ? p.alts : menus[id].alts,
      };
    });
  } else {
    menus.sms = { days, cycle, alts: typeof partial?.copy?.alts === "string" && partial.copy.alts ? partial.copy.alts : menus.sms.alts };
  }
  const school: SchoolId = partial?.school === "ses" || partial?.school === "shs" || partial?.school === "sms" ? partial.school : "sms";
  const pack = menus[school];
  const rawCounts = (partial as { headcounts?: Record<string, number> } | undefined)?.headcounts;
  const fallback = Number(partial?.headcount) > 0 ? Number(partial?.headcount) : 0;
  const headcounts: Record<SchoolId, number> = {
    ses: Number(rawCounts?.ses) > 0 ? Number(rawCounts?.ses) : fallback || 450,
    sms: Number(rawCounts?.sms) > 0 ? Number(rawCounts?.sms) : fallback || 350,
    shs: Number(rawCounts?.shs) > 0 ? Number(rawCounts?.shs) : fallback || 400,
  };
  return {
    savedAt: partial?.savedAt ?? "",
    headcount: headcounts[school],
    headcounts,
    days: pack.days,
    cycle: pack.cycle,
    defaults: { ...seed.defaults, ...partial?.defaults },
    items: [...byName.values()],
    log: Array.isArray(partial?.log) ? partial!.log : [],
    icons: { ...seed.icons, ...partial?.icons },
    tasks: Array.isArray(partial?.tasks) && partial!.tasks.length ? partial!.tasks : seed.tasks,
    checks: partial?.checks && typeof partial.checks === "object" ? partial.checks : {},
    trips: Array.isArray(partial?.trips)
      ? partial!.trips.map((t) => ({
          ...t,
          teacher: t.teacher || "",
          dest: t.dest || "",
          students: t.students ?? [],
        }))
      : [],
    counts: partial?.counts && typeof partial.counts === "object" ? partial.counts : {},
    copy: {
      alts: typeof partial?.copy?.alts === "string" && partial.copy.alts ? partial.copy.alts : pack.alts,
      breakfast: typeof partial?.copy?.breakfast === "string" ? partial.copy.breakfast : "",
      contact: typeof partial?.copy?.contact === "string" ? partial.copy.contact : "",
      weekCol: partial?.copy?.weekCol !== false,
      months: partial?.copy?.months && typeof partial.copy.months === "object" ? partial.copy.months : {},
      released: partial?.copy?.released && typeof partial.copy.released === "object" ? partial.copy.released : {},
      sent: partial?.copy?.sent && typeof partial.copy.sent === "object" ? partial.copy.sent : {},
      orient: partial?.copy?.orient === "portrait" ? "portrait" : "landscape",
      journal: Array.isArray(partial?.copy?.journal) ? partial.copy.journal : [],
      bits: mergeBits(partial?.copy?.bits),
    },
    school,
    menus,
  };
}

export function toBackup(slice: DurableSlice): BackupFile {
  return { version: BACKUP_VERSION, ...slice, savedAt: new Date().toISOString() };
}

export function parseBackup(raw: unknown): DurableSlice {
  if (!raw || typeof raw !== "object") throw new Error("Not a Solvay backup file.");
  const o = raw as Record<string, unknown>;
  if (o.version !== 1 && o.state == null) {
    // zustand persist blob { state, version }
  }
  const src = (o.state as DurableSlice) ?? (o as DurableSlice);
  if (!src || typeof src !== "object") throw new Error("Backup is missing menu data.");
  return mergeDurable(src);
}

export function persistSlice(s: DurableSlice) {
  return {
    savedAt: s.savedAt,
    headcounts: s.headcounts,
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
    menus: {
      ...s.menus,
      [s.school]: { days: s.days, cycle: s.cycle, alts: s.copy.alts },
    },
  };
}

export function writeShadow(slice: DurableSlice) {
  try {
    localStorage.setItem(
      SHADOW_KEY,
      JSON.stringify({ version: BACKUP_VERSION, ...persistSlice(slice), savedAt: slice.savedAt || new Date().toISOString() }),
    );
  } catch {
    /* quota */
  }
}

let persistTimer = 0;
let persistQueued: { key: string; value: string } | null = null;
let shadowTimer = 0;
let shadowQueued: DurableSlice | null = null;
let lastShadowAt = "";
let lastPersistAt = "\0";
let idleHandle = 0;

function cancelIdle() {
  if (!idleHandle) return;
  if (typeof cancelIdleCallback === "function") cancelIdleCallback(idleHandle);
  idleHandle = 0;
}

export function flushPersist() {
  if (typeof window === "undefined") return;
  if (persistTimer) {
    window.clearTimeout(persistTimer);
    persistTimer = 0;
  }
  cancelIdle();
  if (persistQueued) {
    try {
      localStorage.setItem(persistQueued.key, persistQueued.value);
    } catch {
      /* quota */
    }
    persistQueued = null;
  }
  if (shadowTimer) {
    window.clearTimeout(shadowTimer);
    shadowTimer = 0;
  }
  if (shadowQueued) {
    writeShadow(shadowQueued);
    shadowQueued = null;
  }
}

function queuePersistWrite(name: string, value: string) {
  persistQueued = { key: name, value };
  if (typeof window === "undefined") return;
  window.clearTimeout(persistTimer);
  persistTimer = window.setTimeout(() => {
    persistTimer = 0;
    const run = () => flushPersist();
    if (typeof requestIdleCallback === "function") {
      cancelIdle();
      idleHandle = requestIdleCallback(run, { timeout: 250 });
    } else {
      run();
    }
  }, 450);
}

/** Persist adapter that skips stringify+write when only the view changed. */
export function persistStorage(): {
  getItem: (name: string) => { state: unknown; version?: number } | null;
  setItem: (name: string, value: { state: unknown; version?: number }) => void;
  removeItem: (name: string) => void;
} {
  return {
    getItem: (name) => {
      try {
        const raw = localStorage.getItem(name);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as { state: unknown; version?: number };
        lastPersistAt = (parsed.state as { savedAt?: string } | null)?.savedAt ?? "";
        return parsed;
      } catch {
        return null;
      }
    },
    setItem: (name, value) => {
      const at = (value?.state as { savedAt?: string } | undefined)?.savedAt ?? "";
      if (at === lastPersistAt) return;
      lastPersistAt = at;
      queuePersistWrite(name, JSON.stringify(value));
    },
    removeItem: (name) => {
      lastPersistAt = "\0";
      try {
        localStorage.removeItem(name);
      } catch {
        /* */
      }
    },
  };
}

export function debouncedStorage(): {
  getItem: (name: string) => string | null;
  setItem: (name: string, value: string) => void;
  removeItem: (name: string) => void;
} {
  return {
    getItem: (name) => {
      try {
        return localStorage.getItem(name);
      } catch {
        return null;
      }
    },
    setItem: (name, value) => {
      queuePersistWrite(name, value);
    },
    removeItem: (name) => {
      try {
        localStorage.removeItem(name);
      } catch {
        /* */
      }
    },
  };
}

export function scheduleShadow(slice: DurableSlice) {
  if (slice.savedAt === lastShadowAt && !shadowQueued) return;
  lastShadowAt = slice.savedAt;
  shadowQueued = slice;
  if (typeof window === "undefined") return;
  window.clearTimeout(shadowTimer);
  shadowTimer = window.setTimeout(() => {
    shadowTimer = 0;
    if (shadowQueued) {
      writeShadow(shadowQueued);
      shadowQueued = null;
    }
  }, 450);
}

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", flushPersist);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushPersist();
  });
}

export function readShadow(): DurableSlice | null {
  try {
    const raw = localStorage.getItem(SHADOW_KEY);
    if (!raw) return null;
    return parseBackup(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function downloadBackup(slice: DurableSlice) {
  const file = toBackup(slice);
  const blob = new Blob([JSON.stringify(file, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  const day = file.savedAt.slice(0, 10);
  a.href = URL.createObjectURL(blob);
  a.download = `solvay-lunch-backup-${day}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  return file.savedAt;
}
