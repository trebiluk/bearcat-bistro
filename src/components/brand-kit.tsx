import { Button } from "@/components/ui/button";
import { BRAND, BRAND_LOCK, CANVA, COLORS, RULES, SHAPE, TYPE } from "@/lib/brand";
import { useDesk } from "@/lib/store";

const SWATCHES = Object.values(COLORS);

export function BrandKitView() {
  const go = useDesk((s) => s.go);
  return (
    <div className="h-full min-h-0 overflow-auto p-4">
      <div className="mx-auto max-w-3xl space-y-4 pb-16">
        <header className="rounded-2xl bg-navy px-6 py-6 text-cream">
          <p className="text-xs font-semibold tracking-[0.28em] text-harvest">{BRAND.kicker}</p>
          <h1 className="font-display text-5xl leading-none">{BRAND.name}</h1>
          <p className="mt-1 text-cream/80">{BRAND.tagline} · kit {BRAND_LOCK}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="primary" onClick={() => window.print()}>
              Print kit
            </Button>
            <Button onClick={downloadBrandKit}>Download HTML</Button>
            <Button onClick={() => go("print")}>Back to menu</Button>
          </div>
        </header>

        <section className="rounded-2xl border border-line bg-cream p-5 shadow-[var(--shadow-card)]">
          <h2 className="font-display text-2xl">Wordmark</h2>
          <div className="mt-3 flex flex-wrap items-end gap-8">
            <div className="rounded-2xl bg-navy px-5 py-4 text-cream">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-harvest">{BRAND.kicker}</p>
              <p className="font-display text-4xl leading-none">{BRAND.name}</p>
            </div>
            <p className="max-w-xs text-sm text-muted">Type is the mark. No orange letter. Favicon is navy with a harvest bar.</p>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-cream p-5 shadow-[var(--shadow-card)]">
          <h2 className="font-display text-2xl">Color</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {SWATCHES.map((c) => (
              <button
                key={c.hex}
                type="button"
                className="rounded-xl border border-line p-2 text-left hover:border-harvest"
                onClick={() => navigator.clipboard.writeText(c.hex)}
                title="Copy hex"
              >
                <span className="block h-12 rounded-lg" style={{ background: c.hex }} />
                <span className="mt-2 block text-sm font-semibold">{c.name}</span>
                <span className="block font-mono text-xs text-muted">{c.hex}</span>
                <span className="mt-1 block text-[11px] leading-snug text-muted">{c.use}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-cream p-5 shadow-[var(--shadow-card)]">
          <h2 className="font-display text-2xl">Type</h2>
          <p className="mt-2 font-display text-4xl leading-none text-navy">Bebas Neue · September</p>
          <p className="mt-2 text-base">{TYPE.display.use}</p>
          <p className="mt-4 text-lg font-semibold">Barlow semibold · Click a day to change lunch.</p>
          <p className="text-sm text-muted">{TYPE.sans.use}</p>
          <p className="mt-3 rounded-xl bg-gold px-3 py-2 text-sm">{TYPE.ui}</p>
          <p className="mt-3 text-sm text-muted">Radius {SHAPE.radiusSm} / {SHAPE.radiusMd} / {SHAPE.radiusLg} · pills {SHAPE.pill}</p>
        </section>

        <section className="rounded-2xl border border-line bg-cream p-5 shadow-[var(--shadow-card)]">
          <h2 className="font-display text-2xl">Rules</h2>
          <ul className="mt-2 space-y-2">
            {RULES.map((r) => (
              <li key={r} className="border-l-[3px] border-harvest pl-3 text-sm leading-relaxed">
                {r}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-line bg-cream p-5 shadow-[var(--shadow-card)]">
          <h2 className="font-display text-2xl">Canva cheat sheet</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Paste these into the district Brand Kit in Canva. Do not pick a brighter orange.
          </p>
          <dl className="mt-3 grid grid-cols-[120px_1fr] gap-y-1 text-sm">
            <dt className="text-muted">Navy</dt>
            <dd className="font-mono">{CANVA.navy}</dd>
            <dt className="text-muted">Harvest</dt>
            <dd className="font-mono">{CANVA.harvest}</dd>
            <dt className="text-muted">Gold</dt>
            <dd className="font-mono">{CANVA.gold}</dd>
            <dt className="text-muted">Cream</dt>
            <dd className="font-mono">{CANVA.cream}</dd>
            <dt className="text-muted">Fonts</dt>
            <dd>{CANVA.fonts}</dd>
          </dl>
        </section>
      </div>
    </div>
  );
}

export function downloadBrandKit() {
  const rows = SWATCHES.map(
    (c) =>
      `<div style="border:1px solid #e4dbd0;border-radius:12px;padding:8px"><div style="height:48px;border-radius:8px;background:${c.hex}"></div><b>${c.name}</b><br/><code>${c.hex}</code><br/><span style="color:#66768a;font-size:12px">${c.use}</span></div>`,
  ).join("");
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>${BRAND.name} brand kit</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;600;700&display=swap"/>
<style>body{font-family:Barlow,sans-serif;background:#f3efe8;color:#243044;margin:0;padding:24px}h1,h2{font-family:"Bebas Neue",sans-serif;font-weight:400} .navy{background:#13243c;color:#fbf7f2;padding:24px;border-radius:16px} .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px;margin-top:12px} .card{background:#fbf7f2;border-radius:16px;padding:20px;margin-top:16px}</style></head>
<body>
<div class="navy"><p style="color:#e05d32;letter-spacing:.28em;font-size:12px">${BRAND.kicker}</p><h1 style="font-size:48px;margin:0">${BRAND.name}</h1><p>Brand kit ${BRAND_LOCK}</p></div>
<div class="card"><h2>Color</h2><div class="grid">${rows}</div></div>
<div class="card"><h2>Type</h2><p style="font-family:'Bebas Neue';font-size:40px;margin:0">Bebas Neue</p><p>Barlow for body and UI. Sentence case. Pills, not bricks.</p></div>
<div class="card"><h2>Canva</h2><p>Navy ${CANVA.navy} · Harvest ${CANVA.harvest} · Gold ${CANVA.gold} · Cream ${CANVA.cream}<br/>${CANVA.fonts}</p><ul>${RULES.map((r) => `<li>${r}</li>`).join("")}</ul></div>
</body></html>`;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([html], { type: "text/html" }));
  a.download = "bearcat-bistro-brand-kit.html";
  a.click();
}
