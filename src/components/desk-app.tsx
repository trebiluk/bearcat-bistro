import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState, lazy, Suspense, memo } from "react";
import {
  Apple,
  Bus,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileDown,
  ListChecks,
  MoreHorizontal,
  Phone,
  Printer,
  Sun,
  UtensilsCrossed,
  Warehouse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLegalBar } from "@/components/civil-rights";
import { HelpButton, HintBar, HelpView, TourDock } from "@/components/tutorial";
import {
  ALTS,
  ALLERGY,
  BAG,
  BREAKFAST,
  CEP,
  CHANGE,
  CHEF_CHOICE,
  CONTACT,
  ENTREE_OPTIONS,
  FRUITS,
  FIRST_STUDENT,
  ICONS,
  LEGAL_FULL,
  LEGAL_SHORT,
  MILKS,
  MONTHS,
  OVS,
  SIDES,
  VEGS,
  YEAR_DAYS,
  type CatalogItem,
} from "@/lib/data";
import {
  collectReds,
  cycleWeek,
  handMap,
  resolvedLine,
  schoolDate,
  surplusItems,
  ticketJobs,
  useDesk,
  weekDates,
  weekShortages,
  type DayEdit,
  type View,
} from "@/lib/store";
import { EMPTY_DAY, fullBits, isSlimBits, slimBits } from "@/lib/backup";
import { LANG_LINE } from "@/lib/locales";
import { monthReleased } from "@/lib/family-menu";
import { printDue, warnCopy } from "@/lib/print-due";
import { choiceOptions, countHas, countKey, countTotal } from "@/lib/counts";
import { BRAND } from "@/lib/brand";
import {
  clearBackupFolder,
  folderApiOk,
  listBackupFiles,
  loadBackupFolder,
  pickBackupFolder,
  readBackupFile,
  rememberedFolderName,
} from "@/lib/folder";
import { MENU_PAGE, SCHOOLS, schoolOf, type SchoolId } from "@/lib/schools";
import { APP_VERSION, versionLabel } from "@/lib/version";
import { mergeInbox, patchInbox } from "@/lib/inbox";
import { listSignups, setSignupStatus, type BagSignup } from "@/lib/signups";
import { addDays, cn, fmtShort, iso, packDateOf, parseIso, parseRoster, sundayOf } from "@/lib/utils";

const NutritionLab = lazy(() => import("@/components/nutrition-lab").then((m) => ({ default: m.NutritionLab })));
const LogView = lazy(() => import("@/components/changelog").then((m) => ({ default: m.LogView })));
const DebugView = lazy(() => import("@/components/debug-tools").then((m) => ({ default: m.DebugView })));
const BrandKitView = lazy(() => import("@/components/brand-kit").then((m) => ({ default: m.BrandKitView })));

function familyHtml() {
  return import("@/lib/family-html");
}

function menuFeed() {
  return import("@/lib/menu-feed");
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

const KITCHEN: { id: View; label: string; icon: typeof Sun }[] = [
  { id: "desk", label: "Today", icon: Sun },
  { id: "counts", label: "Counts", icon: Phone },
  { id: "stock", label: "Stock", icon: Warehouse },
  { id: "line", label: "Tickets", icon: ListChecks },
  { id: "trips", label: "Bags", icon: Bus },
];

const TOGGLE_CHOICES = [
  { value: "Follow official", label: "Match the school calendar" },
  { value: "Breakfast only", label: "Half day — breakfast only, no lunch" },
  { value: "Close", label: "No lunch — closed" },
  { value: "PD", label: "No lunch — PD day" },
  { value: "Snow", label: "Snow day — no lunch" },
  { value: "Serve anyway", label: "Serve lunch anyway" },
];

function lookingAt(view: View, printMonth: string) {
  if (view === "print") {
    const [y, m] = printMonth.split("-").map(Number);
    if (!y || !m) return "Lunch flyer";
    return `${new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" })} lunch flyer`;
  }
  const labels: Record<View, string> = {
    desk: "This week's trays",
    counts: "Morning counts",
    stock: "Stock room",
    line: "Kitchen tickets",
    trips: "Field trip bags",
    year: "All-days list",
    learn: "Nutrition lab",
    help: "Help",
    log: "Kitchen log",
    debug: "Debug desk",
    brand: "Brand kit",
    look: "Flyer look",
    print: "Lunch flyer",
  };
  return labels[view];
}

function PlaceBar() {
  const school = useDesk((s) => s.school);
  const setSchool = useDesk((s) => s.setSchool);
  const view = useDesk((s) => s.view);
  const printMonth = useDesk((s) => s.printMonth);
  const here = schoolOf(school);
  const looking = lookingAt(view, printMonth);
  return (
    <div className="place-bar no-print shrink-0 bg-harvest text-cream">
      <p className="sr-only" aria-live="polite">
        Working on {here.name}, grades {here.grades}. Looking at {looking}.
      </p>
      <div className="flex items-center gap-2 px-3 py-1.5 md:px-5 md:py-2">
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto" role="tablist" aria-label="School building">
          {SCHOOLS.map((sc) => {
            const on = school === sc.id;
            const building = sc.name.replace(/^Solvay\s+/, "");
            return (
              <div
                key={sc.id}
                className={cn(
                  "flex h-11 shrink-0 items-center gap-1 rounded-full pl-3 pr-2 md:h-12 md:min-w-[12rem] md:pl-3.5 md:pr-2",
                  on ? "bg-cream text-navy shadow-sm" : "bg-white/15 text-cream hover:bg-white/25",
                )}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-current={on ? "true" : undefined}
                  aria-label={`${sc.name}, grades ${sc.grades}${on ? ", current building" : ""}`}
                  onClick={() => setSchool(sc.id)}
                  className="flex min-w-0 items-center gap-2"
                >
                  <span className="font-display text-xl leading-none tracking-wide md:text-[1.65rem]">{sc.short}</span>
                  <span className="flex min-w-0 flex-col items-start leading-none">
                    <span className="text-[11px] font-semibold md:text-sm">{building}</span>
                    <span className={cn("mt-0.5 text-[10px] font-semibold", on ? "text-harvest-text" : "text-gold")}>{sc.grades}</span>
                  </span>
                </button>
                <HeadcountInput
                  id={sc.id}
                  aria={`${sc.name} headcount`}
                  className={cn("hidden h-7 w-10 md:inline-block", on ? "text-navy" : "text-cream")}
                />
              </div>
            );
          })}
        </div>
        <div className="hidden max-w-[17rem] shrink-0 text-right md:block">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">Looking at</p>
          <p className="font-display text-[1.35rem] leading-none tracking-[0.04em]">{looking}</p>
        </div>
      </div>
      <p className="px-3 pb-1.5 text-sm font-semibold leading-tight md:hidden">{looking}</p>
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  blank,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  blank?: string;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn("field h-10 w-full min-w-0 px-2 text-sm", className)}
    >
      {blank && <option value="">{blank}</option>}
      {value && !options.includes(value) && <option value={value}>{value}</option>}
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex h-10 w-fit shrink-0 items-center gap-2 rounded-full px-3 text-sm font-semibold",
        checked ? "bg-navy text-cream" : "bg-paper text-navy",
      )}
    >
      {label} {checked ? "on" : "off"}
    </button>
  );
}

function Pill({ children, tone = "muted" }: { children: React.ReactNode; tone?: "ok" | "warn" | "bad" | "muted" | "serve" }) {
  const map = {
    ok: "bg-ok-bg text-ok",
    warn: "bg-warn-bg text-warn",
    bad: "bg-bad-bg text-bad",
    muted: "bg-paper text-muted",
    serve: "bg-gold text-navy",
  };
  return <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", map[tone])}>{children}</span>;
}

function DebouncedText({
  value,
  onCommit,
  multiline,
  delay = 280,
  className,
  placeholder,
  rows = 2,
}: {
  value: string;
  onCommit: (v: string) => void;
  multiline?: boolean;
  delay?: number;
  className?: string;
  placeholder?: string;
  rows?: number;
}) {
  const [text, setText] = useState(value);
  const valueRef = useRef(value);
  const textRef = useRef(text);
  const commitRef = useRef(onCommit);
  commitRef.current = onCommit;
  textRef.current = text;
  if (value !== valueRef.current) {
    valueRef.current = value;
    if (value !== text) {
      setText(value);
      textRef.current = value;
    }
  }
  useEffect(() => {
    if (text === valueRef.current) return;
    const t = window.setTimeout(() => {
      valueRef.current = text;
      commitRef.current(text);
    }, delay);
    return () => window.clearTimeout(t);
  }, [text, delay]);
  useEffect(
    () => () => {
      if (textRef.current !== valueRef.current) {
        commitRef.current(textRef.current);
        valueRef.current = textRef.current;
      }
    },
    [],
  );
  if (multiline) {
    return <textarea className={className} rows={rows} placeholder={placeholder} value={text} onChange={(e) => setText(e.target.value)} />;
  }
  return <input className={className} placeholder={placeholder} value={text} onChange={(e) => setText(e.target.value)} />;
}

function HeadcountInput({ id, aria, className }: { id: SchoolId; aria: string; className?: string }) {
  const stored = useDesk((s) => s.headcounts[id]);
  const [v, setV] = useState(String(stored));
  const storedRef = useRef(stored);
  if (stored !== storedRef.current) {
    storedRef.current = stored;
    if (String(stored) !== v) setV(String(stored));
  }
  useEffect(() => {
    const n = Number(v) || 0;
    if (n === storedRef.current) return;
    const t = window.setTimeout(() => {
      storedRef.current = n;
      useDesk.getState().setHeadcount(id, n);
    }, 400);
    return () => window.clearTimeout(t);
  }, [v, id]);
  return (
    <input
      type="number"
      min={0}
      aria-label={aria}
      value={v}
      onFocus={() => useDesk.getState().setSchool(id)}
      onChange={(e) => setV(e.target.value)}
      className={cn(
        "ml-1 rounded-full border-0 bg-transparent p-0 text-center text-sm font-semibold tabular-nums outline-none",
        className,
      )}
    />
  );
}

function bagsFromRoster(text: string) {
  return parseRoster(text).map((row) => ({
    name: row.name,
    sandwich: row.sandwich === "PB&J" ? "PB&J" : row.sandwich === "Other" ? "Other" : BAG.sandwich,
    allergy: row.allergy,
  }));
}

export function DeskApp() {
  const view = useDesk((s) => s.view);
  const go = useDesk((s) => s.go);
  const days = useDesk((s) => s.days);
  const items = useDesk((s) => s.items);
  const log = useDesk((s) => s.log);
  const cycle = useDesk((s) => s.cycle);
  const defaults = useDesk((s) => s.defaults);
  const weekMonday = useDesk((s) => s.weekMonday);
  const trips = useDesk((s) => s.trips);
  const school = useDesk((s) => s.school);
  const setSchool = useDesk((s) => s.setSchool);
  const headcounts = useDesk((s) => s.headcounts);
  const headcount = headcounts[school];
  const [more, setMore] = useState(false);

  const dDays = useDeferredValue(days);
  const dLog = useDeferredValue(log);
  const dItems = useDeferredValue(items);
  const onMenu = view === "print";
  const onLearn = view === "learn";
  const onKitchen = !onMenu && view !== "help" && view !== "debug" && view !== "brand" && view !== "log" && !onLearn;
  const reds = useMemo(
    () => (onKitchen ? collectReds(dDays, cycle, defaults, dItems, dLog, trips, school) : []),
    [onKitchen, dDays, cycle, defaults, dItems, dLog, trips, school],
  );
  const shorts = useMemo(
    () => (view === "desk" ? weekShortages(weekMonday, headcount, dDays, cycle, defaults, dItems, dLog, trips, school) : []),
    [view, weekMonday, headcount, dDays, cycle, defaults, dItems, dLog, trips, school],
  );
  const tutorialOn = useDesk((s) => s.tutorialOn);
  const printMonth = useDesk((s) => s.printMonth);

  useEffect(() => {
    document.title = `${schoolOf(school).short} · ${lookingAt(view, printMonth)} · ${BRAND.name}`;
  }, [school, view, printMonth]);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("debug") === "1") go("debug");
    if (q.get("help") === "1") go("help");
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        go("debug");
      }
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        const t = e.target as HTMLElement | null;
        if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT")) return;
        e.preventDefault();
        go("help");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <div className="relative flex h-dvh min-h-0 flex-col bg-paper text-ink">
      <a href="#main" className="skip-link no-print">Skip to menu</a>
      <header className="app-bar no-print shrink-0 bg-navy text-cream">
        <div className="flex h-12 items-center gap-2 px-3 md:h-14 md:gap-3 md:px-5">
          <div className="min-w-0 leading-none">
            <p className="hidden text-[10px] font-semibold tracking-[0.22em] text-gold md:block">{BRAND.kicker}</p>
            <p className="truncate font-display text-xl leading-none tracking-[0.04em] md:text-[1.85rem]">{BRAND.name}</p>
          </div>
          <nav className="ml-3 hidden gap-1 md:flex" aria-label="Main">
            <Button variant="nav" aria-current={onMenu ? "page" : undefined} className={cn("rounded-full px-4", onMenu && "bg-cream/15 text-cream")} onClick={() => go("print")}>
              <UtensilsCrossed className="size-4" /> Menu
            </Button>
            <Button variant="nav" aria-current={onKitchen ? "page" : undefined} className={cn("rounded-full px-4", onKitchen && "bg-cream/15 text-cream")} onClick={() => go(onMenu || view === "help" || view === "brand" || onLearn ? "desk" : view)}>
              <ClipboardList className="size-4" /> Kitchen
            </Button>
            <Button variant="nav" aria-current={onLearn ? "page" : undefined} className={cn("rounded-full px-4", onLearn && "bg-cream/15 text-cream")} onClick={() => go("learn")}>
              <Apple className="size-4" /> Learn
            </Button>
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <HelpButton on={view === "help" || tutorialOn} />
            <button className="flex size-11 items-center justify-center text-cream" aria-label="Backup and more" onClick={() => setMore((m) => !m)}>
              <MoreHorizontal className="size-5" />
            </button>
          </div>
        </div>
        {!onMenu && view !== "help" && view !== "brand" && view !== "debug" && view !== "log" && !onLearn && (
          <nav className="hidden gap-1 overflow-x-auto px-2 py-1.5 md:flex md:px-5" aria-label="Kitchen">
            {KITCHEN.map((n) => {
              const Icon = n.icon;
              const on = view === n.id;
              return (
                <button key={n.id} onClick={() => go(n.id)} className={cn("flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 font-sans text-sm font-semibold", on ? "bg-cream/15 text-cream" : "text-cream/70 hover:text-cream")}>
                  <Icon className="size-3.5" strokeWidth={1.75} />{n.label}
                </button>
              );
            })}
            <button onClick={() => go("print", { date: reds[0]?.date })} className="ml-auto flex h-8 shrink-0 items-center rounded-full px-3 text-sm text-gold">
              {reds.length ? `${reds.length} to fix on menu` : "Menu looks clean"}
            </button>
          </nav>
        )}
      </header>
      <PlaceBar />
      {more && (
        <>
          <button type="button" className="no-print fixed inset-0 z-30 bg-navy/40 md:bg-transparent" aria-label="Close menu" onClick={() => setMore(false)} />
          <div className="no-print fixed inset-x-0 bottom-14 z-40 max-h-[75vh] overflow-auto rounded-t-2xl bg-cream p-4 text-navy shadow-[0_-16px_40px_-16px_rgba(19,36,60,0.45)] md:absolute md:right-2 md:top-14 md:bottom-auto md:w-80 md:max-h-[80vh] md:rounded-2xl md:border md:border-line">
            <p className="text-[11px] font-semibold tracking-wide text-muted">Working on {schoolOf(school).name}</p>
            <div className="mt-1 mb-3 flex flex-wrap gap-2">
              {SCHOOLS.map((sc) => (
                <label key={sc.id} className={cn("flex h-10 items-center rounded-full pl-3 pr-1", school === sc.id ? "bg-navy text-cream" : "bg-paper")}>
                  <button type="button" className="text-sm font-semibold" onClick={() => setSchool(sc.id)}>{sc.short} · {sc.grades}</button>
                  <HeadcountInput id={sc.id} aria={`${sc.name} headcount`} className={cn("h-8 w-12", school === sc.id ? "text-cream" : "text-navy")} />
                </label>
              ))}
            </div>
            <BackupBar />
            <FolderPanel />
            <button
              type="button"
              className="mt-2 h-11 w-full rounded-full bg-navy text-sm font-semibold text-cream"
              onClick={() => {
                setMore(false);
                void menuFeed().then((m) => m.downloadMenuFeed(useDesk.getState()));
              }}
            >
              Download menu JSON
            </button>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(["desk", "counts", "line", "stock", "trips", "year", "help", "log", "debug", "brand", "learn", "print"] as View[]).map((id) => (
                <button key={id} className="h-11 rounded-full bg-paper text-sm font-semibold capitalize" onClick={() => { setMore(false); go(id); }}>
                  {id === "desk" ? "Today" : id === "learn" ? "Learn" : id === "print" ? "Menu" : id}
                </button>
              ))}
            </div>
            <p className="mt-3 text-center text-[10px] text-muted">{versionLabel()}</p>
            <div className="mt-2"><SiteLegalBar /></div>
          </div>
        </>
      )}

      <main id="main" tabIndex={-1} className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {view === "print" && <HintBar text="Slim = meals + free + equal opportunity. Click Footer to toggle each block. Gold panel = type here." />}
        {view === "desk" && <HintBar text="Kitchen today: tickets, stock, bags, or jump to the flyer. Click a weekday card to edit that lunch." />}
        {view === "stock" && <HintBar text="In = truck arrived. Out = you used a case. Red means order. Chef’s Choice should pick extras over par." />}
        {view === "line" && <HintBar text="Print both tickets. Same jobs every day unless the menu, a trip, or a morning count changes." />}
        {view === "counts" && <HintBar text="Elementary often calls choice counts before the line opens. Type what they say. Tickets will cook to those numbers." />}
        {view === "trips" && <HintBar text="Pack bags the school day before. Names on papers. Cheese sandwich is the default." />}
        {view === "year" && <HintBar text="This list is for bulk typing. Gold left bar = you may edit. Or go back to Menu and click the day." />}
        {view === "log" && <HintBar text="Add a dated note. Snow days and unplanned Chef’s Choice from the flyer also show up here." />}
        {view === "learn" && <HintBar text="Grade band first. Today’s tray uses the live menu. Print Sheet for a one-page class exit ticket." />}
        <div className="min-h-0 flex-1 overflow-hidden">
          <Suspense fallback={<p className="p-6 text-sm text-muted">Loading…</p>}>
            {view === "desk" && <DeskView reds={reds} shorts={shorts} />}
            {view === "year" && <YearView />}
            {view === "stock" && <StockView />}
            {view === "print" && <PrintView reds={reds} />}
            {view === "line" && <LineView />}
            {view === "counts" && <CountsView />}
            {view === "trips" && <TripsView />}
            {view === "look" && <LookView />}
            {view === "debug" && <DebugView />}
            {view === "help" && <HelpView />}
            {view === "brand" && <BrandKitView />}
            {view === "log" && <LogView />}
            {view === "learn" && <NutritionLab />}
          </Suspense>
        </div>
      </main>
      <TourDock />
      <footer className="no-print hidden h-auto shrink-0 items-center justify-between gap-3 border-t border-line bg-cream px-4 py-2 text-xs text-muted md:flex">
        <SiteLegalBar />
        <span className="truncate">{CONTACT}</span>
        <button className="tabular-nums text-muted/70" onClick={() => go("debug")}>v{APP_VERSION}</button>
        <BackupBar />
      </footer>
      <nav className="no-print flex h-14 shrink-0 border-t border-line bg-cream pb-[env(safe-area-inset-bottom)] md:hidden">
        {([
          { id: "print" as View, label: "Menu", icon: UtensilsCrossed, on: onMenu },
          { id: "desk" as View, label: "Today", icon: Sun, on: view === "desk" },
          { id: "learn" as View, label: "Learn", icon: Apple, on: onLearn },
        ] as const).map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => { setMore(false); go(t.id); }} className={cn("flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 text-xs font-semibold", t.on ? "text-harvest" : "text-muted")}>
              <Icon className="size-5" strokeWidth={t.on ? 2.2 : 1.75} />{t.label}
            </button>
          );
        })}
        <button onClick={() => setMore((m) => !m)} className={cn("flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 text-xs font-semibold", more ? "text-harvest" : "text-muted")}>
          <MoreHorizontal className="size-5" /> More
        </button>
      </nav>
    </div>
  );
}

function BackupBar() {
  const savedAt = useDesk((s) => s.savedAt);
  const lastExportAt = useDesk((s) => s.lastExportAt);
  const fileRef = useRef<HTMLInputElement>(null);
  const folder = rememberedFolderName();
  const stale = lastExportAt && Date.now() - new Date(lastExportAt).getTime() > 7 * 86400000;
  const never = !lastExportAt;
  return (
    <div className="flex shrink-0 items-center gap-2">
      <span className="hidden tabular-nums lg:inline">{savedAt ? `Saved ${new Date(savedAt).toLocaleString()}` : "Embedded year loaded"}</span>
      <button className={cn("rounded-full px-2 py-1 text-sm font-semibold text-navy hover:bg-gold", (stale || never) && "text-harvest-text")} onClick={() => useDesk.getState().exportBackup()}>
        {folder ? "Save to folder" : "Download backup"}
      </button>
      <button className="rounded-full px-2 py-1 text-sm font-semibold text-navy hover:bg-gold" onClick={() => fileRef.current?.click()}>Restore</button>
      <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={async (e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        try { useDesk.getState().importBackup(JSON.parse(await file.text())); } catch { window.alert("That file is not a Solvay lunch backup."); }
      }} />
    </div>
  );
}

function FolderPanel() {
  const [name, setName] = useState(rememberedFolderName());
  const [files, setFiles] = useState<{ name: string; at: number }[]>([]);
  const [msg, setMsg] = useState("");
  if (!folderApiOk()) return <p className="mt-2 text-xs text-muted">This browser cannot pin a network folder. Use Download backup.</p>;
  return (
    <div className="mt-2 rounded-2xl bg-paper p-3 text-sm">
      <p className="font-semibold">{name || "No folder yet"}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button className="rounded-full bg-navy px-3 py-1 text-cream" onClick={async () => {
          try {
            const h = await pickBackupFolder();
            setName(h.name);
            setMsg("Folder pinned.");
          } catch {
            setMsg("Folder not chosen.");
          }
        }}>Choose folder</button>
        <button className="rounded-full bg-cream px-3 py-1" onClick={async () => {
          const h = await loadBackupFolder();
          if (h) setFiles(await listBackupFiles(h));
        }}>List</button>
        <button className="rounded-full bg-cream px-3 py-1" onClick={async () => { await clearBackupFolder(); setName(""); }}>Clear</button>
      </div>
      {msg && <p className="mt-1 text-xs text-muted">{msg}</p>}
      <ul className="mt-2 max-h-24 overflow-auto text-xs">
        {files.map((f) => (
          <li key={f.name}><button className="text-harvest-text underline" onClick={async () => {
            const h = await loadBackupFolder();
            if (!h) return;
            const raw = await readBackupFile(h, f.name);
            if (raw) useDesk.getState().importBackup(raw);
          }}>{f.name}</button></li>
        ))}
      </ul>
    </div>
  );
}

function SendMenuBanner() {
  const copy = useDesk((s) => s.copy);
  const patchCopy = useDesk((s) => s.patchCopy);
  const headcounts = useDesk((s) => s.headcounts);
  const job = printDue(schoolDate(), copy.sent);
  if (!job) return null;
  const copies = SCHOOLS.map((s) => ({ short: s.short, n: headcounts[s.id] }));
  return (
    <div className="rounded-2xl bg-gold px-4 py-3 text-navy">
      <p className="font-semibold">{warnCopy(job, copies)}</p>
      <div className="mt-2 flex gap-2">
        <Button size="sm" variant="primary" onClick={() => useDesk.getState().go("print")}>Open flyer</Button>
        <Button size="sm" onClick={() => patchCopy({ sent: { ...copy.sent, [job.key]: schoolDate() } })}>Mark PDF sent</Button>
      </div>
    </div>
  );
}

function MorningCountBanner() {
  const go = useDesk((s) => s.go);
  const school = useDesk((s) => s.school);
  if (school !== "ses") return null;
  return (
    <button type="button" onClick={() => go("counts")} className="rounded-2xl bg-cream px-4 py-3 text-left text-sm">
      Elementary may call counts in the morning. Tap to type them before the line opens.
    </button>
  );
}

function DeskView({ reds, shorts }: { reds: { date: string; hints: string[] }[]; shorts: { name: string; hand: number; need: number; st: string }[] }) {
  const weekMonday = useDesk((s) => s.weekMonday);
  const days = useDesk((s) => s.days);
  const cycle = useDesk((s) => s.cycle);
  const defaults = useDesk((s) => s.defaults);
  const go = useDesk((s) => s.go);
  const trips = useDesk((s) => s.trips);
  const school = useDesk((s) => s.school);
  const dates = weekDates(weekMonday);
  const today = iso(new Date());
  const horizon = iso(addDays(parseIso(weekMonday), 21));
  const near = reds.filter((r) => r.date >= weekMonday && r.date < horizon);
  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-auto p-3 md:p-4">
      <SendMenuBanner />
      <MorningCountBanner />
      <div className="flex items-center gap-2">
        <div className="min-w-0">
          <p className="kicker">{schoolOf(school).short} · {schoolOf(school).grades}</p>
          <h1 className="font-display text-3xl leading-none">This week at {schoolOf(school).name}</h1>
        </div>
        <button className="rounded-full p-2" onClick={() => useDesk.getState().setWeekMonday(iso(addDays(parseIso(weekMonday), -7)))} aria-label="Previous week"><ChevronLeft className="size-5" /></button>
        <button className="rounded-full p-2" onClick={() => useDesk.getState().setWeekMonday(iso(addDays(parseIso(weekMonday), 7)))} aria-label="Next week"><ChevronRight className="size-5" /></button>
        <span className="text-sm text-muted">Cycle {cycleWeek(weekMonday) + 1} · {fmtShort(weekMonday)}</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-5">
        {dates.map((date) => {
          const ln = resolvedLine(date, days[date] ?? EMPTY_DAY, cycle, defaults, school);
          return (
            <button key={date} type="button" onClick={() => go("print", { date })} className={cn("day-card rounded-2xl bg-cream p-3 text-left", date === today && "ring-2 ring-harvest")}>
              <p className="text-xs font-semibold text-muted">{fmtShort(date)}</p>
              <p className="font-semibold">{ln.status === "Serve" ? ln.publicLines[0] : ln.status}</p>
              {ln.status === "Serve" && <p className="text-xs text-muted">{[ln.side, ln.fruit].filter(Boolean).join(" · ")}</p>}
            </button>
          );
        })}
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        <button type="button" onClick={() => go("line")} className="rounded-2xl bg-navy p-4 text-left text-cream">Tickets</button>
        <button type="button" onClick={() => go("stock")} className="rounded-2xl bg-cream p-4 text-left">Stock {shorts.length ? <Pill tone="bad">{shorts.length}</Pill> : null}</button>
        <button type="button" onClick={() => go("trips")} className="rounded-2xl bg-cream p-4 text-left">Bags {trips.filter((t) => dates.includes(t.date) || dates.includes(packDateOf(t.date))).length ? "this week" : ""}</button>
      </div>
      {near.length > 0 && (
        <ul className="rounded-2xl bg-bad-bg p-3 text-sm">
          {near.slice(0, 6).map((r) => (
            <li key={r.date}><button className="text-left font-semibold text-bad" onClick={() => go("print", { date: r.date })}>{r.date}: {r.hints[0]}</button></li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CountsView() {
  const selectedDate = useDesk((s) => s.selectedDate);
  const school = useDesk((s) => s.school);
  const days = useDesk((s) => s.days);
  const cycle = useDesk((s) => s.cycle);
  const defaults = useDesk((s) => s.defaults);
  const counts = useDesk((s) => s.counts);
  const setCount = useDesk((s) => s.setCount);
  const clearCounts = useDesk((s) => s.clearCounts);
  const line = resolvedLine(selectedDate, days[selectedDate] ?? EMPTY_DAY, cycle, defaults, school);
  const opts = choiceOptions(selectedDate, school, line);
  const sheet = counts[countKey(school, selectedDate)];
  return (
    <div className="overflow-auto p-4">
      <h1 className="font-display text-3xl">Morning counts</h1>
      <p className="text-sm text-muted">{schoolOf(school).name} · {selectedDate}. Type what the office calls in.</p>
      <div className="mt-4 grid max-w-md gap-2">
        {opts.map((name) => (
          <label key={name} className="flex items-center justify-between rounded-2xl bg-cream px-3 py-2">
            <span className="text-sm font-semibold">{name}</span>
            <input type="number" min={0} className="field h-10 w-20 text-center" value={sheet?.rows[name] ?? ""} onChange={(e) => setCount(selectedDate, school, name, Number(e.target.value) || 0)} />
          </label>
        ))}
      </div>
      <p className="mt-3 text-sm">Total {countTotal(sheet)}</p>
      {countHas(sheet) && <Button className="mt-2" onClick={() => clearCounts(selectedDate, school)}>Clear count</Button>}
    </div>
  );
}

function YearView() {
  const selectedDate = useDesk((s) => s.selectedDate);
  const days = useDesk((s) => s.days);
  const cycle = useDesk((s) => s.cycle);
  const defaults = useDesk((s) => s.defaults);
  const school = useDesk((s) => s.school);
  const patchDay = useDesk((s) => s.patchDay);
  const go = useDesk((s) => s.go);
  const month = selectedDate.slice(0, 7);
  const rows = YEAR_DAYS.filter((d) => d.date.startsWith(month));
  return (
    <div className="flex h-full min-h-0 flex-col md:grid md:grid-cols-[1fr_320px]">
      <div className="min-h-0 overflow-auto">
        <div className="sticky top-0 z-10 border-b border-line bg-paper px-4 py-2">
          <p className="kicker">{schoolOf(school).short} · {schoolOf(school).grades}</p>
          <h1 className="font-display text-3xl">{schoolOf(school).name} · all days</h1>
          <div className="flex flex-wrap gap-1">
            {MONTHS.map((mo) => {
              const key = `${mo.y}-${String(mo.m).padStart(2, "0")}`;
              return <button key={key} className={cn("rounded-full px-2 py-1 text-sm", key === month ? "bg-navy text-cream" : "bg-cream")} onClick={() => go("year", { date: `${key}-01` })}>{key.slice(5)}</button>;
            })}
          </div>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {rows.map((r) => {
              const ln = resolvedLine(r.date, days[r.date] ?? EMPTY_DAY, cycle, defaults, school);
              return (
                <tr key={r.date} className={cn("border-t border-line cv-row", r.date === selectedDate && "bg-gold")} onClick={() => go("year", { date: r.date })}>
                  <td className="px-3 py-2 tabular-nums">{r.date.slice(5)}</td>
                  <td className="px-2 py-2">{ln.status === "Serve" ? ln.publicLines[0] : ln.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <aside className="border-l-4 border-harvest bg-cream p-3">
        <DayMaker date={selectedDate} />
        <Select className="mt-2" value={days[selectedDate]?.entree || ""} onChange={(v) => patchDay(selectedDate, { entree: v })} options={ENTREE_OPTIONS} blank="Cycle default" />
      </aside>
    </div>
  );
}

function StockView() {
  const items = useDesk((s) => s.items);
  const log = useDesk((s) => s.log);
  const addLog = useDesk((s) => s.addLog);
  const addItem = useDesk((s) => s.addItem);
  const selectedItem = useDesk((s) => s.selectedItem);
  const go = useDesk((s) => s.go);
  const [name, setName] = useState("");
  const hands = useMemo(() => handMap(items, log), [items, log]);
  return (
    <div className="overflow-auto p-4">
      <h1 className="font-display text-3xl">Stock</h1>
      <table className="mt-3 w-full text-sm">
        <thead><tr className="text-left text-muted"><th className="p-2">Item</th><th>On hand</th><th>Par</th><th></th></tr></thead>
        <tbody>
          {items.map((it) => {
            const h = hands.get(it.name) ?? 0;
            const st = h <= 0 ? "OUT" : h < it.reorder ? "ORDER" : h < it.par ? "LOW" : "OK";
            return (
              <tr key={it.name} className={cn("border-t border-line cv-row", selectedItem === it.name && "bg-gold")}>
                <td className="p-2"><button onClick={() => go("stock", { item: it.name })}>{it.name}</button> <Pill tone={st === "OUT" || st === "ORDER" ? "bad" : st === "LOW" ? "warn" : "ok"}>{st}</Pill></td>
                <td>{h}</td>
                <td>{it.par}</td>
                <td className="p-2">
                  <button className="mr-1 rounded-full bg-ok-bg px-2 text-ok" onClick={() => addLog({ date: schoolDate(), item: it.name, inn: 1, out: 0, adj: 0, note: "in" })}>In</button>
                  <button className="rounded-full bg-gold px-2" onClick={() => addLog({ date: schoolDate(), item: it.name, inn: 0, out: 1, adj: 0, note: "out" })}>Out</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <form className="mt-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return; addItem({ name: name.trim(), type: "Entree", source: "Commercial", unit: "cs", per100: 3, par: 4, reorder: 2, opening: 0, location: "Dry" }); setName(""); }}>
        <input className="field h-10 flex-1 px-2" placeholder="Add product" value={name} onChange={(e) => setName(e.target.value)} />
        <Button variant="primary" size="sm">Add</Button>
      </form>
    </div>
  );
}

function ChefPick({ value, onPick }: { date?: string; value: string; onPick: (v: string) => void }) {
  const items = useDesk((s) => s.items);
  const log = useDesk((s) => s.log);
  const extra = surplusItems(items, log).filter((s) => s.extra > 0);
  return (
    <div>
      {extra.length ? (
        <div className="mb-2 flex flex-wrap gap-1">
          {extra.slice(0, 8).map((s) => (
            <button key={s.name} type="button" className={cn("rounded-full px-2 py-1 text-xs font-semibold", value === s.name ? "bg-navy text-cream" : "bg-paper")} onClick={() => onPick(s.name)}>
              {s.name} <span className="opacity-70">+{s.extra}</span>
            </button>
          ))}
        </div>
      ) : <p className="mb-2 text-sm text-muted">No cases over par.</p>}
      <Select value={value} onChange={onPick} options={items.map((i) => i.name)} blank="Pick from stock" />
    </div>
  );
}

function RecordBlock({ date }: { date: string }) {
  const d = useDesk((s) => s.days[date]) ?? EMPTY_DAY;
  const patchDay = useDesk((s) => s.patchDay);
  const past = date < schoolDate();
  if (!past && d.toggle !== "Snow" && !d.unplanned) return null;
  return (
    <div className="mt-3 rounded-2xl bg-paper p-3">
      <p className="text-xs font-semibold tracking-wide text-muted">Record</p>
      <Switch checked={d.toggle === "Snow"} onChange={(v) => patchDay(date, { toggle: v ? "Snow" : "Follow official" })} label="Snow day" />
      <Switch checked={d.unplanned} onChange={(v) => patchDay(date, { unplanned: v })} label="Unplanned Chef’s Choice" />
      <DebouncedText key={date} multiline className="field mt-2 w-full p-2 text-sm" placeholder="What actually happened" value={d.record} onCommit={(v) => patchDay(date, { record: v })} />
    </div>
  );
}

function DayMaker({ date }: { date: string }) {
  const d = useDesk((s) => s.days[date]) ?? EMPTY_DAY;
  const patchDay = useDesk((s) => s.patchDay);
  const cycle = useDesk((s) => s.cycle);
  const defaults = useDesk((s) => s.defaults);
  const school = useDesk((s) => s.school);
  const line = resolvedLine(date, d, cycle, defaults, school);
  return (
    <div className="space-y-2">
      <p className="kicker">{date}</p>
      <h2 className="font-display text-3xl leading-none">{line.status === "Serve" ? (line.chef ? CHEF_CHOICE : line.entree || "Cycle lunch") : line.status}</h2>
      <Select value={d.toggle} onChange={(v) => patchDay(date, { toggle: v as DayEdit["toggle"] })} options={TOGGLE_CHOICES.map((t) => t.value)} />
      {line.status === "Serve" && (
        <>
          <Select value={d.entree} onChange={(v) => patchDay(date, { entree: v })} options={ENTREE_OPTIONS} blank="Use the cycle" />
          {line.chef && <ChefPick value={d.chefPick} onPick={(v) => patchDay(date, { chefPick: v })} />}
          <Select value={d.second} onChange={(v) => patchDay(date, { second: v })} options={ENTREE_OPTIONS} blank="No second entree" />
          <Select value={d.side} onChange={(v) => patchDay(date, { side: v })} options={SIDES} blank={defaults.side} />
          <Select value={d.side2} onChange={(v) => patchDay(date, { side2: v })} options={SIDES} blank={defaults.side2} />
          <Select value={d.veg} onChange={(v) => patchDay(date, { veg: v })} options={VEGS} blank={defaults.veg} />
          <Select value={d.fruit} onChange={(v) => patchDay(date, { fruit: v })} options={FRUITS} blank={defaults.fruit} />
          <Select value={d.milk} onChange={(v) => patchDay(date, { milk: v })} options={MILKS} blank={defaults.milk} />
        </>
      )}
      <RecordBlock date={date} />
    </div>
  );
}

function LookMaker({ month, fallback }: { month: string; fallback: { title: string; honor: string } }) {
  const copy = useDesk((s) => s.copy);
  const setMonthCopy = useDesk((s) => s.setMonthCopy);
  const setIcons = useDesk((s) => s.setIcons);
  const icons = useDesk((s) => s.icons[month] ?? ["", "", ""]);
  const look = copy.months[month] ?? { title: "", honor: "" };
  return (
    <div className="space-y-2">
      <DebouncedText key={`${month}-title`} className="field h-10 w-full px-2" value={look.title} placeholder={fallback.title} onCommit={(v) => setMonthCopy(month, { title: v })} />
      <DebouncedText key={`${month}-honor`} className="field h-10 w-full px-2" value={look.honor} placeholder={fallback.honor} onCommit={(v) => setMonthCopy(month, { honor: v })} />
      <div className="flex flex-wrap gap-1">
        {ICONS.map((ic) => (
          <button key={ic.name} type="button" className="rounded-full bg-paper px-2 py-1 text-lg" onClick={() => {
            const next: [string, string, string] = [icons[1], icons[2], ic.icon];
            setIcons(month, next);
          }}>{ic.icon}</button>
        ))}
      </div>
    </div>
  );
}

function DefaultsMaker() {
  const defaults = useDesk((s) => s.defaults);
  const setDefault = useDesk((s) => s.setDefault);
  return (
    <div className="space-y-2">
      <Select value={defaults.side} onChange={(v) => setDefault("side", v)} options={SIDES} />
      <Select value={defaults.side2} onChange={(v) => setDefault("side2", v)} options={SIDES} />
      <Select value={defaults.veg} onChange={(v) => setDefault("veg", v)} options={VEGS} />
      <Select value={defaults.fruit} onChange={(v) => setDefault("fruit", v)} options={FRUITS} />
      <Select value={defaults.milk} onChange={(v) => setDefault("milk", v)} options={MILKS} />
    </div>
  );
}

function FooterMaker() {
  const copy = useDesk((s) => s.copy);
  const patchCopy = useDesk((s) => s.patchCopy);
  const bits = copy.bits ?? fullBits();
  const keys = ["cepBar", "alts", "breakfast", "ovs", "allergy", "change", "contact", "langs"] as const;
  return (
    <div className="space-y-2">
      {keys.map((k) => (
        <Switch key={k} checked={!!bits[k]} onChange={(v) => patchCopy({ bits: { ...bits, [k]: v } })} label={k} />
      ))}
      <Switch checked={bits.legal === "full"} onChange={(v) => patchCopy({ bits: { ...bits, legal: v ? "full" : "short" } })} label="Full USDA statement on print" />
      <DebouncedText multiline className="field w-full p-2 text-sm" value={copy.alts} placeholder={ALTS} onCommit={(v) => patchCopy({ alts: v })} />
      <DebouncedText multiline className="field w-full p-2 text-sm" value={copy.breakfast} placeholder={BREAKFAST} onCommit={(v) => patchCopy({ breakfast: v })} />
      <DebouncedText className="field h-10 w-full px-2" value={copy.contact} placeholder={CONTACT} onCommit={(v) => patchCopy({ contact: v })} />
    </div>
  );
}

const MemoDayCell = memo(function MenuDayCell({
  date, dayNum, inMonth, on, status, lines, onOpen,
}: {
  date: string; dayNum: number; inMonth: boolean; on: boolean; status: string; lines: string[]; onOpen: (date: string) => void;
}) {
  return (
    <td className="overflow-hidden border-t border-l border-navy/25 p-0 align-top">
      <button type="button" disabled={!inMonth} onClick={() => inMonth && onOpen(date)} className={cn(
        "flex min-h-[4.25rem] w-full flex-col overflow-hidden p-1 text-left md:min-h-[7.5rem] md:p-2.5",
        !inMonth && "bg-closed text-navy/40",
        status === "Breakfast only" && inMonth && "bg-gold text-navy",
        status !== "Serve" && status !== "Breakfast only" && inMonth && "bg-closed text-navy",
        inMonth && "hover:bg-gold/50",
        on && "bg-gold ring-2 ring-inset ring-harvest print:ring-0",
      )}>
        {inMonth && (
          <>
            <span className="menu-date">{dayNum}</span>
            <div className="mt-1 min-h-0 space-y-0.5">
              {lines.map((l, i) => <p key={l} className={i === 0 ? "menu-food-main" : "menu-food-side"}>{l}</p>)}
            </div>
          </>
        )}
      </button>
    </td>
  );
}, (a, b) => a.date === b.date && a.on === b.on && a.status === b.status && a.inMonth === b.inMonth && a.onOpen === b.onOpen && a.lines.length === b.lines.length && a.lines.every((l, i) => l === b.lines[i]));

function PrintView({ reds }: { reds: { date: string; hints: string[] }[] }) {
  const printMonth = useDesk((s) => s.printMonth);
  const setPrintMonth = useDesk((s) => s.setPrintMonth);
  const days = useDesk((s) => s.days);
  const cycle = useDesk((s) => s.cycle);
  const defaults = useDesk((s) => s.defaults);
  const school = useDesk((s) => s.school);
  const copy = useDesk((s) => s.copy);
  const patchCopy = useDesk((s) => s.patchCopy);
  const selectedDate = useDesk((s) => s.selectedDate);
  const go = useDesk((s) => s.go);
  const items = useDesk((s) => s.items);
  const log = useDesk((s) => s.log);
  const trips = useDesk((s) => s.trips);
  const monthMeta = useMemo(() => {
    const [y, m] = printMonth.split("-").map(Number);
    const meta = MONTHS.find((x) => x.y === y && x.m === m) ?? MONTHS[0];
    const first = new Date(y, m - 1, 1);
    return {
      y,
      m,
      meta,
      fm: sundayOf(first),
      monthName: first.toLocaleDateString("en-US", { month: "long" }).toUpperCase(),
    };
  }, [printMonth]);
  const { y, m, meta, fm, monthName } = monthMeta;
  const look = copy.months[printMonth] ?? { title: "", honor: "" };
  const title = look.title || meta.title;
  const honor = look.honor || meta.honor;
  const orient = copy.orient === "portrait" ? "portrait" : "landscape";
  const bits = copy.bits ?? fullBits();
  const [pane, setPane] = useState<"day" | "look" | "defaults" | "footer">("day");
  const [sheet, setSheet] = useState(false);
  const openDay = useCallback((date: string) => {
    setPane("day");
    setSheet(true);
    go("print", { date });
  }, [go]);
  const monthFlags = useMemo(() => {
    if (reds.length) return reds.filter((r) => r.date.startsWith(printMonth));
    return collectReds(days, cycle, defaults, items, log, trips, school, printMonth);
  }, [reds, printMonth, days, cycle, defaults, items, log, trips, school]);
  const grid = useMemo(() => {
    const rows: { w: number; weekStart: Date; cells: { date: string; dayNum: number; inMonth: boolean; status: string; lines: string[] }[] }[] = [];
    for (let w = 0; w < 6; w++) {
      const weekStart = addDays(fm, w * 7);
      const cells = WEEKDAYS.map((_, dow) => {
        const dt = addDays(fm, w * 7 + dow);
        const inMonth = dt.getMonth() === m - 1;
        const date = iso(dt);
        if (!inMonth) return { date, dayNum: dt.getDate(), inMonth, status: "", lines: [] as string[] };
        const ln = resolvedLine(date, days[date] ?? EMPTY_DAY, cycle, defaults, school);
        return { date, dayNum: dt.getDate(), inMonth, status: ln.status, lines: ln.publicLines };
      });
      if (!cells.some((c) => c.inMonth)) continue;
      rows.push({ w, weekStart, cells });
    }
    return rows;
  }, [fm, m, days, cycle, defaults, school]);
  const alts = copy.alts || ALTS;
  const breakfast = copy.breakfast || BREAKFAST;
  const contact = copy.contact || CONTACT;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <style>{`@media print { @page { size: letter ${orient}; margin: 0.22in; } }`}</style>
      <div className="no-print shrink-0 border-b border-line">
        <div className="flex flex-col gap-1.5 px-3 py-2 md:flex-row md:items-center md:gap-2 md:px-4">
          <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
            {MONTHS.map((mo) => {
              const key = `${mo.y}-${String(mo.m).padStart(2, "0")}`;
              return <button key={key} className={cn("h-9 shrink-0 rounded-full px-3 text-sm font-semibold", key === printMonth ? "bg-navy text-cream" : "bg-cream")} onClick={() => setPrintMonth(key)}>{new Date(mo.y, mo.m - 1, 1).toLocaleDateString("en-US", { month: "short" })}</button>;
            })}
          </div>
          <div className="hidden items-center gap-1 md:flex">
            <Switch checked={copy.weekCol} onChange={(v) => patchCopy({ weekCol: v })} label="Week of" />
            <Switch checked={orient === "portrait"} onChange={(v) => patchCopy({ orient: v ? "portrait" : "landscape" })} label="Portrait" />
            <button type="button" className={cn("h-10 shrink-0 rounded-full px-3 text-sm font-semibold", isSlimBits(bits) ? "bg-navy text-cream" : "bg-cream text-muted")} onClick={() => patchCopy({ bits: slimBits() })}>Slim</button>
            <button type="button" className={cn("h-10 shrink-0 rounded-full px-3 text-sm font-semibold", !isSlimBits(bits) ? "bg-navy text-cream" : "bg-cream text-muted")} onClick={() => patchCopy({ bits: fullBits() })}>Full</button>
            <Button size="sm" onClick={() => void familyHtml().then((m) => m.previewFamilyPage(useDesk.getState()))}>Preview</Button>
            <Button size="sm" onClick={() => void familyHtml().then((m) => m.downloadFamilyPage(useDesk.getState()))}><FileDown className="size-4" /> HTML</Button>
            <Button size="sm" onClick={() => void menuFeed().then((m) => m.downloadMenuFeed(useDesk.getState()))}>JSON</Button>
          </div>
          <div className="flex gap-2 md:shrink-0">
            <Button className="min-h-11 flex-1 md:hidden" onClick={() => setSheet(true)}>Edit</Button>
            <Button variant="primary" className="min-h-11 flex-1 md:h-9 md:min-h-9 md:flex-none" size="sm" onClick={() => window.print()}><Printer className="size-4" /> Print</Button>
          </div>
        </div>
      </div>
      {monthFlags.length > 0 && <p className="no-print bg-bad-bg px-4 py-2 text-sm text-bad">{monthFlags.length} days need a look this month.</p>}
      <div className="flex min-h-0 flex-1">
        <div className="min-h-0 flex-1 overflow-auto p-0 md:p-4 print:overflow-visible print:p-0">
          <article className={cn("menu-sheet mx-auto overflow-hidden bg-cream md:rounded-2xl md:border md:border-line print:rounded-none print:border-0", orient === "portrait" ? "max-w-[780px] orient-portrait" : "max-w-[1200px] orient-landscape")}>
            <header className="menu-mast bg-navy text-cream" onClick={() => { setPane("look"); setSheet(true); }}>
              <div className="flex flex-col gap-2 px-4 py-3 md:flex-row md:items-end md:justify-between md:px-5 md:py-4">
                <div>
                  <p className="kicker text-gold">{BRAND.kicker}</p>
                  <p className="menu-wordmark font-display text-xl leading-none tracking-[0.04em] text-cream md:text-2xl">{BRAND.name}</p>
                  <p className="menu-school mt-1 font-display text-[clamp(1.5rem,5.5vw,2.6rem)] leading-[0.88] tracking-[0.03em] text-gold">{schoolOf(school).name} · {schoolOf(school).grades}</p>
                  <p className="menu-month mt-1 font-display text-[clamp(2.4rem,16vw,6.2rem)] leading-[0.82]">{monthName}</p>
                </div>
                <div className="md:text-right">
                  <p className="inline-block rounded-sm bg-harvest px-2.5 py-1 font-display text-lg tracking-[0.12em]">{BRAND.meals} {y}</p>
                  <p className="mt-2 truncate text-sm text-cream/85">{title}</p>
                  <p className="hidden truncate text-[12px] text-gold md:block">{honor}</p>
                </div>
              </div>
            </header>
            {bits.cepBar && (
              <div className="menu-cep bg-harvest px-3 py-2 text-center text-lg font-bold leading-snug text-cream">
                {isSlimBits(bits) ? "Free breakfast and lunch for every student." : `Free breakfast and lunch for every student. ${CEP}`}
              </div>
            )}
            <table className="w-full min-w-0 table-fixed border-t-2 border-navy text-ink">
              <caption className="sr-only">{monthName} {y} lunch calendar, Sunday through Saturday</caption>
              <thead>
                <tr>
                  {copy.weekCol && <th scope="col" className="hidden w-16 bg-navy px-1 py-2 text-left font-display text-sm text-cream md:table-cell">Week</th>}
                  {WEEKDAYS.map((lab) => (
                    <th key={lab} scope="col" className={cn("menu-dow px-0.5 py-2 text-center text-sm font-bold text-cream md:text-lg", lab === "Saturday" || lab === "Sunday" ? "bg-navy-2" : "bg-navy md:bg-harvest")}>
                      <span className="md:hidden">{lab.slice(0, 2)}</span><span className="hidden md:inline">{lab}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grid.map((row) => (
                  <tr key={row.w}>
                    {copy.weekCol && <th className="hidden bg-navy px-2 py-2 text-left font-display text-sm text-cream md:table-cell">{row.weekStart.toLocaleDateString("en-US", { month: "numeric", day: "numeric" })}</th>}
                    {row.cells.map((cell, dow) => (
                      <MemoDayCell key={WEEKDAYS[dow]} date={cell.date} dayNum={cell.dayNum} inMonth={cell.inMonth} on={cell.date === selectedDate && pane === "day"} status={cell.status} lines={cell.lines} onOpen={openDay} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <footer className="space-y-2.5 border-t-4 border-harvest bg-cream px-5 py-4 text-[13px] leading-relaxed">
              <p className="print-daily hidden font-semibold">With lunch every serving day: {defaults.side}; {defaults.side2}; {defaults.veg}; {defaults.fruit}; {defaults.milk}.</p>
              {bits.alts && <button type="button" className="block w-full text-left font-semibold" onClick={() => { setPane("footer"); setSheet(true); }}>{alts}</button>}
              {bits.breakfast && <button type="button" className="menu-breakfast block w-full bg-gold px-3 py-2.5 text-left text-sm font-semibold text-navy" onClick={() => { setPane("footer"); setSheet(true); }}>{breakfast}</button>}
              {bits.ovs && <p>{OVS}</p>}
              {(bits.allergy || bits.change) && <p>{bits.allergy ? ALLERGY : ""} {bits.change ? CHANGE : ""}</p>}
              {bits.contact && <button type="button" className="block w-full bg-navy px-3 py-2 text-left font-display text-lg text-cream" onClick={() => { setPane("footer"); setSheet(true); }}>{contact}</button>}
              <p className="menu-legal text-[11px] leading-relaxed text-navy/80">{bits.legal === "full" ? LEGAL_FULL : LEGAL_SHORT}</p>
              {bits.langs && <p className="text-[12px] font-semibold">{LANG_LINE}</p>}
              <p className="text-[11px] text-muted"><a href={MENU_PAGE} className="underline">District menus</a></p>
            </footer>
          </article>
        </div>
        {sheet && <button type="button" aria-label="Close editor" className="fixed inset-0 z-30 bg-navy/40 md:hidden" onClick={() => setSheet(false)} />}
        <aside className={cn("no-print bg-cream md:static md:max-h-none md:w-80 md:overflow-auto md:border-l-4 md:border-harvest", "fixed inset-x-0 bottom-14 z-40 max-h-[70vh] overflow-auto rounded-t-2xl border-t-4 border-harvest", !sheet && "hidden md:block")}>
          <div className="flex items-center gap-1 p-2">
            {(["day", "look", "defaults", "footer"] as const).map((p) => (
              <button key={p} className={cn("h-9 rounded-full px-3 text-sm font-semibold capitalize", pane === p ? "bg-navy text-cream" : "bg-paper")} onClick={() => setPane(p)}>{p}</button>
            ))}
            <button type="button" className="ml-auto h-9 rounded-full px-3 text-sm font-semibold md:hidden" onClick={() => setSheet(false)}>Done</button>
          </div>
          <div className="space-y-2 border-b border-line px-3 pb-3 md:hidden">
            <p className="kicker">Flyer</p>
            <div className="flex flex-wrap gap-2">
              <Switch checked={copy.weekCol} onChange={(v) => patchCopy({ weekCol: v })} label="Week of" />
              <Switch checked={orient === "portrait"} onChange={(v) => patchCopy({ orient: v ? "portrait" : "landscape" })} label="Portrait" />
              <button type="button" className={cn("h-10 rounded-full px-3 text-sm font-semibold", isSlimBits(bits) ? "bg-navy text-cream" : "bg-paper text-navy")} onClick={() => patchCopy({ bits: slimBits() })}>Slim</button>
              <button type="button" className={cn("h-10 rounded-full px-3 text-sm font-semibold", !isSlimBits(bits) ? "bg-navy text-cream" : "bg-paper text-navy")} onClick={() => patchCopy({ bits: fullBits() })}>Full</button>
            </div>
          </div>
          <div className="p-3">
            {pane === "day" && <DayMaker date={selectedDate.startsWith(printMonth) ? selectedDate : `${printMonth}-01`} />}
            {pane === "look" && <LookMaker month={printMonth} fallback={meta} />}
            {pane === "defaults" && <DefaultsMaker />}
            {pane === "footer" && <FooterMaker />}
            <Switch checked={monthReleased(printMonth, copy.released)} onChange={(v) => patchCopy({ released: { ...copy.released, [printMonth]: v } })} label="Post this month to families" />
          </div>
        </aside>
      </div>
    </div>
  );
}

function LineView() {
  const selectedDate = useDesk((s) => s.selectedDate);
  const days = useDesk((s) => s.days);
  const cycle = useDesk((s) => s.cycle);
  const defaults = useDesk((s) => s.defaults);
  const items = useDesk((s) => s.items);
  const log = useDesk((s) => s.log);
  const headcounts = useDesk((s) => s.headcounts);
  const school = useDesk((s) => s.school);
  const tasks = useDesk((s) => s.tasks);
  const trips = useDesk((s) => s.trips);
  const counts = useDesk((s) => s.counts);
  const checks = useDesk((s) => s.checks);
  const toggleCheck = useDesk((s) => s.toggleCheck);
  const { jobs } = ticketJobs(selectedDate, days[selectedDate] ?? EMPTY_DAY, cycle, defaults, items, log, headcounts[school], tasks, trips, school, counts);
  const cook = jobs.filter((j) => j.role === "Cook");
  const aide = jobs.filter((j) => j.role === "Aide");
  function Ticket({ role, rows }: { role: string; rows: typeof jobs }) {
    return (
      <article className="rounded-2xl border border-line bg-cream p-4 print-daily">
        <p className="kicker">{role} · {selectedDate}</p>
        <h2 className="font-display text-3xl">{schoolOf(school).name} ticket</h2>
        <ul className="mt-3 space-y-2">
          {rows.map((j) => (
            <li key={j.id} className="flex gap-2 text-sm">
              <input type="checkbox" checked={!!checks[selectedDate]?.[j.id]} onChange={() => toggleCheck(selectedDate, j.id)} />
              <span><b>{j.when}.</b> {j.text}</span>
            </li>
          ))}
        </ul>
      </article>
    );
  }
  return (
    <div className="overflow-auto p-4">
      <div className="mb-3 flex gap-2">
        <Button variant="primary" size="sm" onClick={() => window.print()}><Printer className="size-4" /> Print tickets</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Ticket role="Cook" rows={cook} />
        <Ticket role="Aide" rows={aide} />
      </div>
    </div>
  );
}

function TripsView() {
  const trips = useDesk((s) => s.trips);
  const addTrip = useDesk((s) => s.addTrip);
  const patchTrip = useDesk((s) => s.patchTrip);
  const removeTrip = useDesk((s) => s.removeTrip);
  const [inbox, setInbox] = useState<BagSignup[]>([]);
  useEffect(() => {
    listSignups().then((rows) => setInbox(mergeInbox(rows))).catch(() => setInbox(mergeInbox([])));
  }, []);
  const [form, setForm] = useState({ date: schoolDate(), group: "", count: 20, teacher: "", dest: "" });
  return (
    <div className="overflow-auto p-4">
      <h1 className="font-display text-3xl">Field trip bags</h1>
      <p className="text-sm text-muted">Pack the school day before. {BAG.sandwich}, {BAG.fruit}, {BAG.veg}, {BAG.milk}.</p>
      <form className="mt-3 flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); addTrip({ ...form, time: "9:00", bags: true, note: "", students: [] }); }}>
        <input className="field h-10 px-2" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <input className="field h-10 px-2" placeholder="Class / group" value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })} />
        <input className="field h-10 w-20 px-2" type="number" value={form.count} onChange={(e) => setForm({ ...form, count: Number(e.target.value) || 0 })} />
        <input className="field h-10 px-2" placeholder="Teacher" value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })} />
        <Button variant="primary" size="sm">Add trip</Button>
      </form>
      <ul className="mt-4 space-y-2">
        {trips.map((t) => (
          <li key={t.id} className="rounded-2xl bg-cream p-3">
            <p className="font-semibold">{t.date} · {t.group || "Trip"} · {t.count} bags · pack {packDateOf(t.date)}</p>
            <textarea className="field mt-2 w-full p-2 text-sm" rows={3} placeholder="Names, one per line" value={(t.students || []).map((s) => s.name).join("\n")} onChange={(e) => {
              const students = bagsFromRoster(e.target.value);
              patchTrip(t.id, { students, count: students.length || t.count });
            }} />
            <button className="mt-1 text-sm text-bad" onClick={() => removeTrip(t.id)}>Remove</button>
          </li>
        ))}
      </ul>
      {inbox.length > 0 && (
        <div className="mt-4">
          <h2 className="font-display text-2xl">Teacher sign-ups</h2>
          {inbox.map((r) => (
            <p key={r.id} className="text-sm">{r.tripDate} {r.teacher} {r.status}
              <button className="ml-2 text-harvest-text" onClick={() => { void setSignupStatus({ data: { id: r.id, status: "packed" } }); patchInbox(r.id, "packed"); }}>Packed</button>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function LookView() {
  const printMonth = useDesk((s) => s.printMonth);
  const meta = MONTHS.find((m) => `${m.y}-${String(m.m).padStart(2, "0")}` === printMonth) ?? MONTHS[0];
  return (
    <div className="overflow-auto p-4">
      <h1 className="font-display text-3xl">Look</h1>
      <LookMaker month={printMonth} fallback={meta} />
    </div>
  );
}
