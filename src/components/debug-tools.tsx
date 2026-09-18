import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { BACKUP_VERSION, PERSIST_KEY, SHADOW_KEY, districtSeed } from "@/lib/backup";
import { BRAND } from "@/lib/brand";
import { FIRST_STUDENT, LAST_STUDENT, YEAR_DAYS } from "@/lib/data";
import { SCHOOLS } from "@/lib/schools";
import { schoolDate, useDesk } from "@/lib/store";
import { cn } from "@/lib/utils";
import { APP_CHANNEL, APP_NAME, APP_VERSION, selfCheck, storageReport, versionLabel } from "@/lib/version";

export function DebugView() {
  const view = useDesk((s) => s.view);
  const selectedDate = useDesk((s) => s.selectedDate);
  const printMonth = useDesk((s) => s.printMonth);
  const headcount = useDesk((s) => s.headcount);
  const headcounts = useDesk((s) => s.headcounts);
  const days = useDesk((s) => s.days);
  const items = useDesk((s) => s.items);
  const log = useDesk((s) => s.log);
  const trips = useDesk((s) => s.trips);
  const counts = useDesk((s) => s.counts);
  const school = useDesk((s) => s.school);
  const savedAt = useDesk((s) => s.savedAt);
  const lastExportAt = useDesk((s) => s.lastExportAt);
  const copy = useDesk((s) => s.copy);
  const go = useDesk((s) => s.go);
  const fileRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState("");
  const [tick, setTick] = useState(0);
  const [keysOpen, setKeysOpen] = useState(false);
  const checks = useMemo(() => selfCheck(), [tick]);
  const store = useMemo(() => storageReport(), [tick]);
  const snow = Object.values(days).filter((d) => d?.toggle === "Snow").length;
  const swaps = Object.values(days).filter((d) => d?.unplanned).length;
  const edited = Object.keys(days).filter((k) => {
    const d = days[k];
    return d && (d.entree || d.second || d.chefPick || d.toggle !== "Follow official" || d.served || d.unplanned || d.record);
  }).length;
  const failed = checks.filter((c) => !c.ok).length;

  const report = {
    app: APP_NAME,
    version: APP_VERSION,
    channel: APP_CHANNEL,
    school,
    schoolDate: schoolDate(),
    view,
    selectedDate,
    printMonth,
    headcounts,
    editedDays: edited,
    snow,
    unplanned: swaps,
    items: items.length,
    log: log.length,
    trips: trips.length,
    countSheets: Object.keys(counts || {}).length,
    weekCol: copy.weekCol,
    orient: copy.orient,
    savedAt,
    lastExportAt,
    storage: store,
    checks,
    href: typeof window !== "undefined" ? window.location.href : "",
    ua: typeof navigator !== "undefined" ? navigator.userAgent : "",
  };

  async function copyReport() {
    const text = JSON.stringify(report, null, 2);
    try {
      await navigator.clipboard.writeText(text);
      setCopied("Copied");
    } catch {
      window.prompt("Copy this report", text);
      setCopied("Shown");
    }
  }

  return (
    <div className="h-full min-h-0 overflow-auto p-3 md:p-4">
      <div className="mx-auto max-w-xl space-y-3">
        <header className="rounded-2xl bg-navy px-4 py-4 text-cream">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-harvest">{BRAND.kicker}</p>
          <h1 className="font-display text-3xl leading-none">{APP_NAME}</h1>
          <p className="mt-1 text-sm text-cream/70">
            {APP_VERSION} · {APP_CHANNEL} · {school.toUpperCase()}
          </p>
        </header>

        <section className="rounded-2xl border border-line bg-cream p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-2xl">Health</h2>
            <span className={cn("rounded-full px-3 py-1 text-sm font-semibold", failed ? "bg-bad-bg text-bad" : "bg-ok-bg text-ok")}>
              {failed ? `${failed} fail` : "All ok"}
            </span>
          </div>
          <ul className="mt-2 space-y-1 text-sm">
            {checks.map((c) => (
              <li key={c.name} className="flex items-start gap-2 py-1">
                <span className={cn("mt-0.5 w-10 shrink-0 rounded-full text-center text-[11px] font-semibold", c.ok ? "bg-ok-bg text-ok" : "bg-bad-bg text-bad")}>
                  {c.ok ? "OK" : "FAIL"}
                </span>
                <span className="min-w-0 flex-1 leading-snug">{c.name}</span>
                <span className="max-w-[40%] truncate text-right text-xs text-muted">{c.detail}</span>
              </li>
            ))}
          </ul>
          <button className="mt-2 text-sm text-harvest" onClick={() => setTick((n) => n + 1)}>
            Run again
          </button>
        </section>

        <section className="rounded-2xl border border-line bg-cream p-4 shadow-[var(--shadow-card)]">
          <h2 className="font-display text-2xl">This desk</h2>
          <dl className="mt-2 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
            {[
              ["Date", schoolDate()],
              ["Open", `${selectedDate.slice(5)}`],
              ["Flyer", printMonth],
              ["Edits", String(edited)],
              ["Snow", String(snow)],
              ["Swaps", String(swaps)],
              ["Trips", String(trips.length)],
              ["Counts", String(Object.keys(counts || {}).length)],
              ["Stock", String(items.length)],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-paper px-3 py-2">
                <dt className="text-[11px] text-muted">{k}</dt>
                <dd className="font-semibold tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-sm">
            Plates {SCHOOLS.map((s) => `${s.short} ${headcounts[s.id]}`).join(" · ")} · using {headcount}
          </p>
          <p className="text-xs text-muted">Saved {savedAt ? savedAt.slice(0, 16).replace("T", " ") : "seed"} · backup {lastExportAt ? lastExportAt.slice(0, 16).replace("T", " ") : "never"}</p>
        </section>

        <section className="rounded-2xl border border-line bg-cream p-4 shadow-[var(--shadow-card)]">
          <h2 className="font-display text-2xl">Tools</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="primary" onClick={() => useDesk.getState().exportBackup()}>
              Download backup
            </Button>
            <Button onClick={() => fileRef.current?.click()}>Restore</Button>
            <Button onClick={copyReport}>Copy report {copied && `· ${copied}`}</Button>
            <Button onClick={() => go("print")}>Back to menu</Button>
            <Button onClick={() => go("log")}>Open log</Button>
            <Button
              className="col-span-2"
              variant="danger"
              onClick={() => {
                if (!window.confirm("Clear this browser’s edits and reload the baked 2026–27 year?")) return;
                useDesk.getState().resetDesk();
                setTick((n) => n + 1);
              }}
            >
              Reset this browser
            </Button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              try {
                useDesk.getState().importBackup(JSON.parse(await file.text()));
                setTick((n) => n + 1);
              } catch {
                window.alert("That file is not a Solvay lunch backup.");
              }
            }}
          />
          <p className="mt-3 text-xs text-muted">
            Reset does not delete the baked calendar. Backup JSON is the safe copy. {YEAR_DAYS.length} weekdays · {FIRST_STUDENT}–{LAST_STUDENT}. Seed {districtSeed().items.length} SKUs.
          </p>
        </section>

        <section className="rounded-2xl border border-line bg-cream p-4 shadow-[var(--shadow-card)]">
          <button type="button" className="flex w-full items-center justify-between text-left" onClick={() => setKeysOpen((o) => !o)}>
            <h2 className="font-display text-2xl">Storage</h2>
            <span className="text-sm text-muted">{keysOpen ? "Hide" : "Show keys"}</span>
          </button>
          <p className="mt-1 text-xs text-muted">
            {PERSIST_KEY} · shadow {SHADOW_KEY} · backup v{BACKUP_VERSION} · {Math.round(store.bytes / 1024)} KB
          </p>
          {keysOpen && (
            <ul className="mt-2 break-all font-mono text-xs">
              {store.keys.map((k) => (
                <li key={k} className="border-t border-line py-1">{k}</li>
              ))}
              {!store.keys.length && <li className="text-muted">None yet.</li>}
            </ul>
          )}
        </section>
        <p className="pb-6 text-center text-xs text-muted">{versionLabel()} · Ctrl+Shift+D</p>
      </div>
    </div>
  );
}
