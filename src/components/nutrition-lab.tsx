import { useState } from "react";
import { Printer } from "lucide-react";
import { BRAND } from "@/lib/brand";
import {
  BANDS,
  GROUPS,
  LESSONS,
  STANDARDS,
  bandForSchool,
  groupOf,
  lessonsFor,
  ovsCheck,
  plateItems,
  standardById,
  type Band,
  type Group,
} from "@/lib/nutrition";
import { EMPTY_DAY } from "@/lib/backup";
import { MONTHS, OVS, YEAR_DAYS } from "@/lib/data";
import { resolvedLine, schoolDate, useDesk } from "@/lib/store";
import { schoolOf } from "@/lib/schools";
import { cn } from "@/lib/utils";

type Tab = "today" | "lessons" | "lab" | "standards";

export function NutritionLab() {
  const school = useDesk((s) => s.school);
  const days = useDesk((s) => s.days);
  const cycle = useDesk((s) => s.cycle);
  const defaults = useDesk((s) => s.defaults);
  const selectedDate = useDesk((s) => s.selectedDate);
  const go = useDesk((s) => s.go);
  const [band, setBand] = useState<Band>(() => bandForSchool(school));
  const [tab, setTab] = useState<Tab>("today");
  const [lessonId, setLessonId] = useState(lessonsFor(bandForSchool(school))[0]?.id ?? LESSONS[0].id);
  const date = selectedDate || schoolDate();
  const line = resolvedLine(date, days[date] ?? EMPTY_DAY, cycle, defaults, school);
  const plate = line.status === "Serve" ? plateItems(line) : [];
  const lesson = LESSONS.find((l) => l.id === lessonId) ?? LESSONS[0];
  const list = lessonsFor(band);

  return (
    <div className="flex h-full min-h-0 flex-col bg-paper text-ink">
      <header className="no-print shrink-0 border-b border-line bg-cream px-3 py-3 md:px-5">
        <p className="kicker">Classroom · {schoolOf(school).short}</p>
        <h1 className="font-display text-3xl leading-none tracking-[0.03em] md:text-4xl">Nutrition Lab</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted">
          NY Next Generation ELA & Math (Common Core lineage), NYS Health Education 1–3, and USDA MyPlate / NSLP.
          Tied to today’s {schoolOf(school).name} tray.
        </p>
        <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Grade band">
          {BANDS.map((b) => (
            <button
              key={b.id}
              type="button"
              role="tab"
              aria-selected={band === b.id}
              className={cn(
                "h-10 rounded-full px-3 text-sm font-semibold",
                band === b.id ? "bg-navy text-cream" : "bg-paper text-navy",
              )}
              onClick={() => {
                setBand(b.id);
                const next = lessonsFor(b.id)[0];
                if (next) setLessonId(next.id);
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-1" role="tablist" aria-label="Lab">
          {(
            [
              ["today", "Today’s tray"],
              ["lessons", "Lessons"],
              ["lab", "Build a tray"],
              ["standards", "Standards"],
            ] as [Tab, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={cn(
                "h-9 rounded-full px-3 text-sm font-semibold",
                tab === id ? "bg-harvest text-cream" : "text-navy hover:bg-gold",
              )}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            className="ml-auto flex h-9 items-center gap-1 rounded-full px-3 text-sm font-semibold text-navy hover:bg-gold"
            onClick={() => window.print()}
          >
            <Printer className="size-4" /> Sheet
          </button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-auto p-3 md:p-5">
        <div className="no-print">
        {tab === "today" && (
          <TodayPane date={date} status={line.status} plate={plate} band={band} onLab={() => setTab("lab")} onMenu={() => go("print")} />
        )}
        {tab === "lessons" && (
          <LessonPane band={band} list={list} lesson={lesson} onPick={setLessonId} />
        )}
        {tab === "lab" && <TrayLab plate={plate} band={band} status={line.status} />}
        {tab === "standards" && <StandardsPane band={band} />}
        </div>
        <PrintSheet date={date} school={schoolOf(school).name} band={band} plate={plate} lesson={lesson} />
      </div>
    </div>
  );
}

function TodayPane({
  date,
  status,
  plate,
  band,
  onLab,
  onMenu,
}: {
  date: string;
  status: string;
  plate: { name: string; group: Group }[];
  band: Band;
  onLab: () => void;
  onMenu: () => void;
}) {
  const meta = BANDS.find((b) => b.id === band)!;
  const month = MONTHS.find((m) => m.y === Number(date.slice(0, 4)) && m.m === Number(date.slice(5, 7)));
  return (
    <div className="mx-auto max-w-5xl">
      <div className="rounded-2xl bg-navy p-5 text-cream">
        <p className="text-xs font-semibold tracking-[0.2em] text-gold">
          {new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <h2 className="font-display text-4xl leading-none">{status === "Serve" ? "What’s on the tray" : status}</h2>
        <p className="mt-2 text-sm text-cream/80">{meta.voice} {month ? `· ${month.title}` : ""}</p>
      </div>
      {status !== "Serve" ? (
        <p className="mt-4 rounded-2xl bg-cream p-4 text-sm">No lunch tray today. Breakfast-only and closed days still count for health class — talk about why school meals exist.</p>
      ) : (
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {plate.map((p) => (
            <li key={p.name + p.group} className="rounded-2xl bg-cream p-4">
              <p className="text-[11px] font-semibold tracking-wide text-harvest-text">{p.group}</p>
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-muted">{GROUPS.find((g) => g.id === p.group)?.job}</p>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="h-11 rounded-full bg-navy px-4 text-sm font-semibold text-cream" onClick={onLab}>
          Build a tray
        </button>
        <button type="button" className="h-11 rounded-full bg-gold px-4 text-sm font-semibold text-navy" onClick={onMenu}>
          Open the menu
        </button>
      </div>
      <p className="mt-4 text-sm text-muted">{OVS}</p>
    </div>
  );
}

function LessonPane({
  band,
  list,
  lesson,
  onPick,
}: {
  band: Band;
  list: typeof LESSONS;
  lesson: (typeof LESSONS)[number];
  onPick: (id: string) => void;
}) {
  const [q, setQ] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const item = lesson.check[Math.min(q, lesson.check.length - 1)];
  return (
    <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-[280px_1fr]">
      <div className="rounded-2xl bg-cream p-3">
        <p className="px-2 text-[11px] font-semibold tracking-wide text-muted">{list.length} lessons · {BANDS.find((b) => b.id === band)?.grades}</p>
        <ul className="mt-1">
          {list.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                className={cn(
                  "flex w-full items-start rounded-xl px-3 py-2 text-left text-sm",
                  l.id === lesson.id ? "bg-navy text-cream" : "hover:bg-gold",
                )}
                onClick={() => {
                  onPick(l.id);
                  setQ(0);
                  setPicked(null);
                }}
              >
                <span className="font-semibold">{l.title}</span>
                <span className={cn("ml-auto shrink-0 text-xs", l.id === lesson.id ? "text-gold" : "text-muted")}>{l.minutes}m</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <article className="rounded-2xl bg-cream p-5">
        <p className="kicker">{lesson.minutes} minutes</p>
        <h2 className="font-display text-4xl leading-none">{lesson.title}</h2>
        <p className="mt-3 text-lg font-semibold">{lesson.hook}</p>
        <p className="mt-2 text-base">{lesson.do}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {lesson.standards.map((id) => {
            const s = standardById(id);
            return s ? (
              <li key={id} className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-navy">
                {s.code}
              </li>
            ) : null;
          })}
        </ul>
        {item && (
          <div className="mt-5 rounded-2xl bg-paper p-4">
            <p className="text-xs font-semibold tracking-wide text-muted">Check for understanding {q + 1}/{lesson.check.length}</p>
            <p className="mt-1 font-semibold">{item.q}</p>
            <div className="mt-2 grid gap-2">
              {item.a.map((ans, i) => {
                const show = picked !== null;
                const good = i === item.ok;
                return (
                  <button
                    key={ans}
                    type="button"
                    className={cn(
                      "rounded-xl px-3 py-3 text-left text-sm font-semibold",
                      show && good && "bg-ok-bg text-ok",
                      show && picked === i && !good && "bg-bad-bg text-bad",
                      !show && "bg-cream hover:bg-gold",
                    )}
                    onClick={() => setPicked(i)}
                  >
                    {ans}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                className="text-sm font-semibold text-harvest-text"
                onClick={() => {
                  setQ((n) => Math.min(n + 1, lesson.check.length - 1));
                  setPicked(null);
                }}
              >
                Next question
              </button>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

function TrayLab({
  plate,
  band,
  status,
}: {
  plate: { name: string; group: Group }[];
  band: Band;
  status: string;
}) {
  const extras = [
    { name: "Garden salad", group: "Vegetable" as Group },
    { name: "Assorted fruit cups", group: "Fruit" as Group },
    { name: "1% white milk", group: "Dairy" as Group },
    { name: "Carrots", group: "Vegetable" as Group },
    { name: "WG roll", group: "Grain" as Group },
  ];
  const pool = [...plate, ...extras.filter((e) => !plate.some((p) => p.name === e.name))];
  const [picked, setPicked] = useState<string[]>([]);
  const chosen = pool.filter((p) => picked.includes(p.name));
  const result = ovsCheck(chosen);
  const cups = band === "k2" || band === "g35";

  function toggle(name: string) {
    setPicked((p) => (p.includes(name) ? p.filter((x) => x !== name) : [...p, name]));
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h2 className="font-display text-4xl leading-none">Build a tray</h2>
      <p className="mt-1 text-sm text-muted">
        Tap foods to put them on the tray. Offer vs Serve: at least 3 groups, and one must be fruit or vegetable.
      </p>
      {status !== "Serve" && <p className="mt-2 text-sm">No hot line today — practice with the usual sides.</p>}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-cream p-4">
          <p className="text-[11px] font-semibold tracking-wide text-muted">Offered</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {pool.map((p) => (
              <button
                key={p.name}
                type="button"
                aria-pressed={picked.includes(p.name)}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-semibold",
                  picked.includes(p.name) ? "bg-navy text-cream" : "bg-paper text-navy",
                )}
                onClick={() => toggle(p.name)}
              >
                {p.name}
                <span className="ml-2 text-[10px] opacity-70">{p.group}</span>
              </button>
            ))}
          </div>
        </div>
        <div className={cn("rounded-2xl p-4", result.ok ? "bg-ok-bg" : "bg-gold")}>
          <p className="text-[11px] font-semibold tracking-wide">{result.ok ? "Counts" : "Not yet"}</p>
          <p className="mt-1 font-semibold">{result.hint}</p>
          <p className="mt-1 text-sm text-muted">{result.count} groups · fruit/veg {result.produce ? "yes" : "no"}</p>
          <MyPlate picked={chosen.map((c) => c.group)} />
        </div>
      </div>
      {cups && <CupLab />}
    </div>
  );
}

function MyPlate({ picked }: { picked: Group[] }) {
  const has = (g: Group) => picked.includes(g);
  return (
    <div className="mt-4 grid grid-cols-2 gap-1 overflow-hidden rounded-full border-4 border-navy" style={{ aspectRatio: "1" }}>
      {GROUPS.filter((g) => g.id !== "Dairy").map((g) => (
        <div
          key={g.id}
          className="flex items-center justify-center p-2 text-center text-xs font-bold text-cream"
          style={{ background: has(g.id) ? g.color : "#C8C0B4" }}
        >
          {g.kid}
        </div>
      ))}
    </div>
  );
}

function CupLab() {
  const [fill, setFill] = useState(2);
  const labels = ["0", "¼", "½", "¾", "1"];
  return (
    <div className="mt-4 rounded-2xl bg-cream p-4">
      <p className="font-display text-3xl">Cup fractions</p>
      <p className="text-sm text-muted">NY Math 3.NF / 4.NF · A reimbursable fruit or veg serving is ½ cup.</p>
      <div className="mt-3 flex items-end gap-6">
        <div className="relative h-40 w-24 overflow-hidden rounded-b-3xl rounded-t-lg border-4 border-navy bg-paper">
          <div className="absolute inset-x-0 bottom-0 bg-harvest" style={{ height: `${(fill / 4) * 100}%` }} />
        </div>
        <div>
          <p className="font-display text-5xl leading-none">{labels[fill]} cup</p>
          <input
            type="range"
            min={0}
            max={4}
            value={fill}
            aria-label="Cup filled"
            onChange={(e) => setFill(Number(e.target.value))}
            className="mt-3 w-48"
          />
          <p className="mt-2 text-sm">{fill >= 2 ? "This serving can count." : "Fill to ½ cup so it counts."}</p>
        </div>
      </div>
    </div>
  );
}

function StandardsPane({ band }: { band: Band }) {
  const used = new Set(lessonsFor(band).flatMap((l) => l.standards));
  const sets = ["HE", "ELA", "MATH", "USDA", "FACS", "NHES"] as const;
  return (
    <div className="mx-auto max-w-5xl">
      <h2 className="font-display text-4xl leading-none">Standards map</h2>
      <p className="mt-2 text-sm text-muted">
        New York teaches Next Generation ELA and Mathematics (2017), which keep the Common Core architecture
        (informational text, fractions, ratios). Health still uses NYS Standards 1–3. Lunch rules are federal (7 CFR 210/220).
      </p>
      {sets.map((set) => (
        <section key={set} className="mt-4">
          <h3 className="text-sm font-semibold tracking-wide text-harvest-text">{set}</h3>
          <ul className="mt-1 divide-y divide-line rounded-2xl bg-cream">
            {STANDARDS.filter((s) => s.set === set).map((s) => (
              <li key={s.id} className="flex gap-3 px-4 py-3">
                <span className="w-36 shrink-0 text-sm font-semibold">{s.code}</span>
                <span className="text-sm">{s.text}</span>
                {used.has(s.id) && <span className="ml-auto shrink-0 text-xs font-semibold text-ok">In lessons</span>}
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="mt-4 text-xs text-muted">
        {YEAR_DAYS.length} school days baked in this file. Nutrition Lab does not replace a certified health teacher’s curriculum;
        it is a cafeteria-connected supplement.
      </p>
    </div>
  );
}

function PrintSheet({
  date,
  school,
  band,
  plate,
  lesson,
}: {
  date: string;
  school: string;
  band: Band;
  plate: { name: string; group: Group }[];
  lesson: (typeof LESSONS)[number];
}) {
  return (
    <section className="nutrition-sheet mt-8 hidden print:block">
      <p className="kicker">{BRAND.name} · Nutrition Lab</p>
      <h1 className="font-display text-4xl">
        {school} · {BANDS.find((b) => b.id === band)?.label}
      </h1>
      <p>
        {date} · {lesson.title}
      </p>
      <p className="mt-2 font-semibold">{lesson.hook}</p>
      <p>{lesson.do}</p>
      <p className="mt-3 text-sm font-semibold">Today’s tray</p>
      <ul>
        {plate.map((p) => (
          <li key={p.name}>
            {p.group}: {p.name}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm font-semibold">Exit ticket</p>
      <ol>
        {lesson.check.map((c) => (
          <li key={c.q} className="mt-2">
            {c.q}
            <div className="mt-1 h-10 border-b border-navy" />
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs">
        {lesson.standards.map((id) => standardById(id)?.code).filter(Boolean).join(" · ")}
      </p>
    </section>
  );
}


