import { Link, useLocation } from "@tanstack/react-router";

const PERSONAS = [
  { label: "Banka", to: "/banka/dashboard", dot: "bg-bank", prefix: "/banka" },
  { label: "Bayi", to: "/bayi/ana-sayfa", dot: "bg-dealer", prefix: "/bayi" },
  {
    label: "Müşteri",
    to: "/musteri/ana-sayfa",
    dot: "bg-cust",
    prefix: "/musteri",
  },
];

/** Floating persona switcher, rendered on every route for quick navigation. */
export function PersonaSwitcher() {
  const { pathname } = useLocation();

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-1 rounded-full border border-line-strong bg-surface/95 p-1 shadow-[0_8px_24px_rgba(15,23,42,0.16)] backdrop-blur">
      <span className="px-2 font-semibold text-[10px] text-ink-muted uppercase tracking-wide">
        Persona
      </span>
      {PERSONAS.map((p) => {
        const active = pathname.startsWith(p.prefix);
        return (
          <Link
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold text-[12.5px] transition-colors ${
              active ? "bg-canvas text-ink" : "text-ink-soft hover:bg-canvas/60"
            }`}
            key={p.label}
            to={p.to}
          >
            <span className={`size-2 rounded-full ${p.dot}`} />
            {p.label}
          </Link>
        );
      })}
    </div>
  );
}
