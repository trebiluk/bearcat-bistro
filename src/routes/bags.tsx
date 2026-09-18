import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { pushInbox } from "@/lib/inbox";
import { submitSignup } from "@/lib/signups";
import { fmtShort, packDateOf, parseRoster } from "@/lib/utils";

export const Route = createFileRoute("/bags")({ component: TeacherBags });

function TeacherBags() {
  const [tripDate, setTripDate] = useState("");
  const [roster, setRoster] = useState("");
  const [sent, setSent] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const students = useMemo(() => parseRoster(roster), [roster]);
  const pack = tripDate ? packDateOf(tripDate) : "";
  const cheese = students.filter((s) => s.sandwich === "Cheese").length;
  const pb = students.filter((s) => s.sandwich === "PB&J").length;

  return (
    <div className="min-h-full bg-paper text-ink">
      <header className="border-b-4 border-harvest bg-navy px-4 py-5 text-cream">
        <p className="font-display text-xs tracking-[0.28em] text-harvest">Bearcat Bistro · Solvay UFSD</p>
        <h1 className="font-display text-3xl tracking-[0.08em]">Bag lunch sign-up</h1>
        <p className="mt-1 max-w-xl text-sm text-cream/85">
          Food services packs bags the school day before the trip. A name paper goes on every bag. Default sandwich is cheese.
        </p>
      </header>
      <main className="mx-auto max-w-xl p-4">
        {sent ? (
          <div className="border-2 border-navy bg-cream p-5">
            <p className="font-display text-xs tracking-[0.2em] text-harvest">Submitted</p>
            <h2 className="font-display text-3xl">You're on the list</h2>
            <p className="mt-2 text-sm leading-relaxed">{sent}</p>
            <Button className="mt-4" variant="primary" onClick={() => setSent("")}>
              Sign up another class
            </Button>
          </div>
        ) : (
          <form
            className="space-y-3 border-2 border-navy bg-cream p-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setErr("");
              if (!students.length) {
                setErr("Add student names, one per line.");
                return;
              }
              const fd = new FormData(e.currentTarget);
              const date = String(fd.get("date") || "");
              const payload = {
                tripDate: date,
                packDate: packDateOf(date),
                teacher: String(fd.get("teacher") || "").trim(),
                group: String(fd.get("group") || "").trim(),
                destination: String(fd.get("dest") || "").trim(),
                pickupTime: String(fd.get("time") || ""),
                students,
              };
              setBusy(true);
              const id = `b${Date.now()}`;
              pushInbox({ ...payload, id, status: "pending" });
              try {
                await submitSignup({ data: payload });
              } catch {
                /* local inbox still has it for the kitchen desk */
              }
              setBusy(false);
              setSent(
                `${students.length} bags for ${payload.group}. Kitchen packs ${fmtShort(payload.packDate)}. Pickup ${payload.pickupTime || "TBA"}. Name papers will be on the bags.`,
              );
            }}
          >
            <p className="bg-gold px-3 py-2 text-sm">
              {tripDate
                ? `Kitchen packs ${fmtShort(pack)} (the school day before). Submit before that morning.`
                : "Pick the trip date. Kitchen packs the last school day before."}
            </p>
            <label className="block text-xs font-semibold">
              Trip date
              <input name="date" type="date" required value={tripDate} onChange={(e) => setTripDate(e.target.value)} className="mt-1 h-10 w-full rounded-sm border border-harvest bg-gold px-2" />
            </label>
            <label className="block text-xs font-semibold">
              Your name
              <input name="teacher" required className="mt-1 h-10 w-full rounded-sm border border-harvest bg-gold px-2" />
            </label>
            <label className="block text-xs font-semibold">
              Class / group
              <input name="group" required placeholder="5th grade · Mrs. Rossi" className="mt-1 h-10 w-full rounded-sm border border-harvest bg-gold px-2" />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="block text-xs font-semibold">
                Destination
                <input name="dest" placeholder="Zoo" className="mt-1 h-10 w-full rounded-sm border border-harvest bg-gold px-2" />
              </label>
              <label className="block text-xs font-semibold">
                Pickup time
                <input name="time" type="time" className="mt-1 h-10 w-full rounded-sm border border-harvest bg-gold px-2" />
              </label>
            </div>
            <label className="block text-xs font-semibold">
              Students — one name per line
              <span className="block font-normal text-muted">Optional: Name | PB&J | allergy</span>
              <textarea
                name="roster"
                required
                rows={10}
                value={roster}
                onChange={(e) => setRoster(e.target.value)}
                placeholder={"Jordan Lee\nSam Ortiz | PB&J\nRiley Chen | Cheese | dairy"}
                className="mt-1 w-full rounded-sm border border-harvest bg-gold p-2 font-sans text-sm"
              />
            </label>
            {students.length > 0 && (
              <p className="text-sm">
                {students.length} bags · {cheese} cheese · {pb} PB&J
                {students.some((s) => s.allergy) ? ` · ${students.filter((s) => s.allergy).length} allergy notes` : ""}
              </p>
            )}
            {err && <p className="text-sm text-bad">{err}</p>}
            <Button type="submit" variant="primary" className="w-full" disabled={busy}>
              {busy ? "Sending…" : "Send to food services"}
            </Button>
            <p className="text-[11px] text-muted">Reimbursable bag: sandwich, fruit, vegetable, milk. Write PB&J only if the student should get peanut butter.</p>
          </form>
        )}
      </main>
    </div>
  );
}