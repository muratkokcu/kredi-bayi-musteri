import {
  Cell,
  Funnel,
  FunnelChart as RechartsFunnelChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface Stage {
  /** 0..1 width fraction of this stage's TOP edge within the funnel band */
  frac: number;
  label: string;
  pct: string;
  sub?: string;
  value: string;
}

const ROW_H = 54;
// Side gutters reserved for the (HTML overlay) label / value columns; the
// Recharts funnel is drawn in the band between them.
const LEFT = 124;
const RIGHT = 84;

function FunnelTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: Stage }[];
}) {
  if (!(active && payload && payload.length > 0)) {
    return null;
  }
  const s = payload[0].payload;
  return (
    <div className="rounded-lg border border-line-strong bg-surface px-2.5 py-1.5 shadow-[var(--shadow-pop)]">
      <div className="text-[11px] text-ink-muted">{s.label}</div>
      <div className="font-bold text-[13px] text-ink tabular-nums">
        {s.value} <span className="font-semibold text-bank-700">· {s.pct}</span>
      </div>
    </div>
  );
}

/**
 * Funnel chart: tapering trapezoids drawn by Recharts `<Funnel>` (animated +
 * interactive tooltip), with a crisp HTML overlay carrying the per-stage label
 * (left) and value/pct (right), aligned to the equal-height funnel bands.
 */
export function FunnelChart({
  stages,
  color = "var(--color-bank)",
}: {
  stages: Stage[];
  color?: string;
}) {
  const height = stages.length * ROW_H;

  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer height={height} width="100%">
        <RechartsFunnelChart
          margin={{ top: 4, right: RIGHT, bottom: 4, left: LEFT }}
        >
          <Tooltip content={<FunnelTooltip />} />
          <Funnel
            data={stages}
            dataKey="frac"
            isAnimationActive={false}
            lastShapeType="rectangle"
            nameKey="label"
            stroke="var(--color-surface)"
            strokeWidth={2}
          >
            {stages.map((s, i) => (
              <Cell
                fill={color}
                fillOpacity={Math.max(0.16, 0.85 - i * 0.16)}
                key={s.label}
              />
            ))}
          </Funnel>
        </RechartsFunnelChart>
      </ResponsiveContainer>

      {/* Crisp label / value overlay, aligned to the equal-height bands. */}
      <div className="pointer-events-none absolute inset-0 flex flex-col py-1">
        {stages.map((s) => (
          <div className="flex flex-1 items-center" key={s.label}>
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
            <div className="min-w-0 flex-1" />
            <div className="w-[64px] shrink-0 text-right">
              <div className="font-bold text-[15px] text-ink tabular-nums leading-5">
                {s.value}
              </div>
              <div className="font-semibold text-[12px] text-bank-700 leading-4">
                {s.pct}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
