import { Link } from "@tanstack/react-router";
import { CEP } from "@/lib/data";
import { LANG_LINE } from "@/lib/locales";
import { AD3027, LEGAL_SHORT, ndsHtml, NDS_EMAIL, NDS_PHONE } from "@/lib/legal";

export function SiteLegalBar() {
  return (
    <p className="no-print truncate text-[11px] leading-snug text-muted">
      Lunch is free. {LEGAL_SHORT}{" "}
      <Link to="/rights" className="font-semibold text-harvest-text underline">
        Full USDA statement
      </Link>
      {" · "}
      <Link to="/family" className="font-semibold text-harvest-text underline">
        Family menu
      </Link>
    </p>
  );
}

export function CivilRightsPage() {
  return (
    <main className="min-h-dvh bg-paper px-4 py-8 text-navy">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.2em] text-harvest-text">BEARCAT BISTRO</p>
        <h1 className="font-display text-4xl">Civil rights</h1>
        <p className="mt-3 text-lg font-semibold">{CEP}</p>
        <p className="mt-2 text-sm text-muted">
          Need another language? Open the{" "}
          <Link to="/family" className="font-semibold text-harvest-text underline">
            family menu
          </Link>
          . Buttons: {LANG_LINE}.
        </p>
        <div
          className="mt-6 space-y-3 text-sm leading-relaxed [&_a]:text-harvest-text [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: ndsHtml() }}
        />
        <p className="mt-6 text-sm">
          Complaint form:{" "}
          <a className="font-semibold text-harvest-text underline" href={AD3027}>
            Form AD-3027 (PDF)
          </a>
          . Phone {NDS_PHONE}. Email{" "}
          <a className="font-semibold text-harvest-text underline" href={`mailto:${NDS_EMAIL}`}>
            {NDS_EMAIL}
          </a>
          .
        </p>
        <p className="mt-8">
          <Link to="/" className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-cream">
            Back to menu
          </Link>
        </p>
      </div>
    </main>
  );
}
