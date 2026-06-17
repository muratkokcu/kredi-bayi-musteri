interface Stage {
  /** 0..1 width fraction of this stage's TOP edge within the funnel band */
  frac: number;
  label: string;
  pct: string;
  sub?: string;
  value: string;
}

/**
 * Centered tapering funnel. Each stage is a trapezoid whose top edge matches
 * its own fraction and whose bottom edge matches the next stage's fraction,
 * so the segments connect into one continuous funnel. Fill fades top→bottom.
 */
export function FunnelChart({
  stages,
  color = "var(--color-bank)",
}: {
  stages: Stage[];
  color?: string;
}) {
  const band = 200; // viewBox reference width; svg scales to its container
  const rowH = 50;
  const tail = 0.86; // bottom edge of the last segment relative to its top

  return (
    <div className="flex flex-col gap-1.5">
      {stages.map((s, i) => {
        const topW = s.frac;
        const botW = stages[i + 1]?.frac ?? s.frac * tail;
        const top = band * topW;
        const bot = band * botW;
        const opacity = 0.82 - i * 0.18;
        return (
          <div className="flex items-center gap-3" key={s.label}>
            <div className="w-[112px] shrink-0">
              <div className="font-medium text-[13px] text-ink leading-4">
                {s.label}
              </div>
              {s.sub && (
                <div className="text-[11px] text-ink-muted leading-4">
                  {s.sub}
                </div>
              )}
            </div>
            <svg
              aria-hidden="true"
              className="min-w-0 flex-1"
              height={rowH}
              preserveAspectRatio="none"
              viewBox={`0 0 ${band} ${rowH}`}
            >
              <polygon
                fill={color}
                opacity={opacity}
                points={`${(band - top) / 2},2 ${(band + top) / 2},2 ${(band + bot) / 2},${rowH - 2} ${(band - bot) / 2},${rowH - 2}`}
              />
            </svg>
            <div className="w-[64px] shrink-0 text-right">
              <div className="font-bold text-[15px] text-ink tabular-nums leading-5">
                {s.value}
              </div>
              <div className="font-semibold text-[12px] text-bank-700 leading-4">
                {s.pct}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
