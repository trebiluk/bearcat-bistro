import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { JournalEntry, JournalKind } from "@/lib/backup";
import { buildChangelog, kindLabel, newJournalId } from "@/lib/changelog";
import { schoolDate, useDesk } from "@/lib/store";
import { SCHOOLS } from "@/lib/schools";
import { cn, fmtShort } from "@/lib/utils";

const FILTERS: { id: "all" | JournalKind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "calendar", label: "Calendar" },
  { id: "snow", label: "Snow" },
  { id: "chef", label: "Chef" },
  { id: "print", label: "Flyer" },
  { id: "note", label: "Notes" },
  { id: "app", label: "App" },
];

export function LogView() {
  const copy = useDesk((s) => s.copy);
  const days = useDesk((s) => s.days);
  const menus = useDesk((s) => s.menus);
  const counts = useDesk((s) => s.counts);
  const trips = useDesk((s) => s.trips);
  const patchCopy = useDesk((s) => s.patchCopy);
  const go = useDesk((s) => s.go);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState(schoolDate());
  const [kind, setKind] = useState<JournalKind>("note");

  const rows = useMemo(
    () => buildChangelog({ copy, days, menus, counts, trips }),
    [copy, days, menus, counts, trips],
  );
  const shown = filter === "all" ? rows : rows.filter((r) => r.kind === filter);

  function add() {
    const t = title.trim();
    if (!t) return;
    const entry: JournalEntry = {
      id: newJournalId(),
      date,
      kind,
      title: t,
      body: body.trim(),
      school: "all",
    };
    patchCopy({ journal: [entry, ...(copy.journal || [])] });
    setTitle("");
    setBody("");
  }

  function remove(id: string) {
    patchCopy({ journal: (copy.journal || []).filter((e) => e.id !== id) });
  }

  return (
    <div className="h-full min-h-0 overflow-auto p-3 md:p-4">
      <div className="mx-auto max-w-2xl space-y-4 pb-16">
        <header className="rounded-2xl bg-navy px-4 py-4 text-cream">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-harvest">Kitchen record</p>
          <h1 className="font-display text-4xl leading-none">Change log</h1>
          <p className="mt-2 text-sm text-cream/75">
            Dated notes going forward. Snow days, unplanned Chef’s Choice, and flyer-sent dates land here automatically. District holidays are already listed.
          </p>
        </header>

        <section className="sheet p-4">
          <h2 className="font-display text-2xl">Add a dated note</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-[140px_1fr]">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="field h-11 rounded-xl px-3 text-base" />
            <select value={kind} onChange={(e) => setKind(e.target.value as JournalKind)} className="field h-11 rounded-xl px-3 text-base">
              {(["note", "snow", "chef", "print", "calendar"] as JournalKind[]).map((k) => (
                <option key={k} value={k}>
                  {kindLabel(k)}
                </option>
              ))}
            </select>
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What happened"
            className="field mt-2 h-11 w-full rounded-xl px-3 text-base"
          />
          <input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Optional detail"
            className="field mt-2 h-11 w-full rounded-xl px-3 text-base"
          />
          <Button variant="primary" className="mt-3" onClick={add} disabled={!title.trim()}>
            Save to log
          </Button>
        </section>

        <div className="flex gap-1 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                "h-9 shrink-0 rounded-full px-3 text-sm font-semibold",
                filter === f.id ? "bg-navy text-cream" : "bg-cream text-muted",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <ol className="space-y-2">
          {shown.map((e) => (
            <li key={e.id} className="sheet p-3">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-[11px] font-semibold tracking-wide text-harvest">
                  {fmtShort(e.date)} · {kindLabel(e.kind)}
                  {e.school && e.school !== "all" ? ` · ${e.school.toUpperCase()}` : ""}
                </p>
                {e.id.startsWith("j-") && (
                  <button type="button" className="text-xs text-muted" onClick={() => remove(e.id)}>
                    Remove
                  </button>
                )}
              </div>
              <h3 className="font-display text-xl leading-none">{e.title}</h3>
              {e.body && <p className="mt-1 text-sm text-ink">{e.body}</p>}
              {(e.kind === "snow" || e.kind === "chef" || e.kind === "note") && e.date && (
                <button type="button" className="mt-2 text-sm text-harvest" onClick={() => go("print", { date: e.date })}>
                  Open that day →
                </button>
              )}
            </li>
          ))}
        </ol>
        <p className="text-center text-xs text-muted">{shown.length} entries · {SCHOOLS.map((s) => s.short).join(" · ")}</p>
      </div>
    </div>
  );
}
