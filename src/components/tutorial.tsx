import { CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";
import { useDesk } from "@/lib/store";
import { HELP_PAGES, TOUR, saveTutorial } from "@/lib/tutorial";
import { cn } from "@/lib/utils";

export function HelpButton({ on }: { on: boolean }) {
  const go = useDesk((s) => s.go);
  return (
    <button
      type="button"
      className={cn(
        "flex h-9 items-center gap-1 rounded-full px-2 text-sm font-semibold md:px-3",
        on ? "bg-cream/15 text-cream" : "text-cream/80 hover:bg-white/10",
      )}
      aria-label="Help and tutorial"
      onClick={() => go("help")}
    >
      <CircleHelp className="size-5" strokeWidth={2} />
      <span className="hidden sm:inline">Help</span>
    </button>
  );
}

export function HintBar({ text }: { text: string }) {
  const on = useDesk((s) => s.tutorialOn);
  if (!on) return null;
  return (
    <div className="no-print truncate border-b border-line bg-gold/80 px-3 py-1.5 text-xs leading-snug text-navy md:px-4 md:py-2.5 md:text-sm">
      <span className="kicker mr-2">Hint</span>
      {text}
    </div>
  );
}

export function TourDock() {
  const on = useDesk((s) => s.tutorialOn);
  const step = useDesk((s) => s.tutorialStep);
  const setTutorial = useDesk((s) => s.setTutorial);
  const setTutorialStep = useDesk((s) => s.setTutorialStep);
  const go = useDesk((s) => s.go);
  if (!on) return null;
  const cur = TOUR[Math.min(step, TOUR.length - 1)] ?? TOUR[0];
  const last = step >= TOUR.length - 1;

  function jump(n: number) {
    const next = TOUR[n];
    setTutorialStep(n);
    if (next) go(next.view);
  }

  return (
    <div className="no-print pointer-events-none absolute inset-x-0 bottom-16 z-40 flex justify-center px-3 md:bottom-10">
      <div className="pointer-events-auto w-full max-w-2xl rounded-2xl border border-line bg-cream p-5 text-navy shadow-[var(--shadow-card)]">
        <p className="text-xs font-semibold tracking-wide text-harvest">
          Tutorial {step + 1} / {TOUR.length}
        </p>
        <h2 className="font-display text-3xl leading-none tracking-[0.03em]">{cur.title}</h2>
        <p className="mt-2 text-base leading-relaxed text-ink/90">{cur.body}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button size="sm" disabled={step === 0} onClick={() => jump(step - 1)}>
            Back
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              if (last) {
                setTutorial(false);
                saveTutorial(false, 0);
                go("print");
              } else jump(step + 1);
            }}
          >
            {last ? "Done — start using it" : "Next"}
          </Button>
          <button
            type="button"
            className="ml-auto text-sm text-muted"
            onClick={() => {
              setTutorial(false);
              saveTutorial(false, step);
            }}
          >
            Keep hints, hide this box
          </button>
        </div>
      </div>
    </div>
  );
}

export function HelpView() {
  const tutorialOn = useDesk((s) => s.tutorialOn);
  const setTutorial = useDesk((s) => s.setTutorial);
  const setTutorialStep = useDesk((s) => s.setTutorialStep);
  const go = useDesk((s) => s.go);

  return (
    <div className="h-full min-h-0 overflow-auto p-4">
      <div className="mx-auto max-w-3xl space-y-4">
        <header className="rounded-2xl bg-navy px-5 py-5 text-cream">
          <p className="font-display text-xs tracking-[0.32em] text-harvest">{BRAND.kicker}</p>
          <h1 className="font-display text-5xl leading-none tracking-[0.04em]">How to use {BRAND.name}</h1>
          <p className="mt-2 max-w-xl text-base text-cream/85">
            Tutorial mode paints yellow hints while you work. The tour walks through each button. You can leave hints on all year.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="primary"
              onClick={() => {
                setTutorial(true);
                setTutorialStep(0);
                go("help");
              }}
            >
              Start tour
            </Button>
            <Button
              onClick={() => setTutorial(!tutorialOn)}
              className={tutorialOn ? "bg-harvest text-cream" : "bg-cream text-navy"}
            >
              Hints {tutorialOn ? "on" : "off"}
            </Button>
            <Button onClick={() => go("print")}>Open menu</Button>
          </div>
        </header>

        <section className="sheet border-l-[3px] border-harvest bg-gold p-4 text-navy">
          <h2 className="font-display text-2xl">The two-minute version</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-base leading-relaxed">
            <li>Pin this app in Edge. Same login every day.</li>
            <li>Menu: pick the building on the harvest bar (Elementary, Middle, or High), click a day, print that flyer.</li>
            <li>Kitchen: tickets, stock, bags.</li>
            <li>⋯ → Choose folder on the shared drive. Save once a week.</li>
          </ol>
        </section>

        {HELP_PAGES.map((p) => (
          <section key={p.title} className="sheet p-4">
            <h2 className="font-display text-2xl tracking-[0.06em]">{p.title}</h2>
            <ul className="mt-2 space-y-2 text-base leading-relaxed">
              {p.body.map((line) => (
                <li key={line} className="border-l-4 border-harvest pl-3">
                  {line}
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="sheet p-4">
          <h2 className="font-display text-2xl">Tour stops</h2>
          <ol className="mt-2 space-y-2">
            {TOUR.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  className="w-full rounded-xl border-l-[3px] border-harvest bg-gold/50 px-3 py-3 text-left hover:bg-gold"
                  onClick={() => {
                    setTutorial(true);
                    setTutorialStep(i);
                    go(s.view);
                  }}
                >
                  <span className="font-display text-lg tracking-[0.08em]">
                    {i + 1}. {s.title}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">{s.body}</span>
                </button>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
