import { useId } from "react";
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  color?: string;
  data: number[];
  height?: number;
  /** Accepted for API compatibility; Recharts shows an interactive tooltip. */
  highlight?: number;
  highlightLabel?: string;
  highlightValue?: string;
  labels: string[];
  yTicks?: string[];
}

/** Compact axis/tooltip number, e.g. 42000 → "42K", 1.25M → "1,3M". */
function compact(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString("tr-TR", { maximumFractionDigits: 1 })}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `${Math.round(value / 1000)}K`;
  }
  return value.toLocaleString("tr-TR");
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  label?: string;
  payload?: { value: number }[];
}) {
  if (!(active && payload && payload.length > 0)) {
    return null;
  }
  return (
    <div className="rounded-lg border border-line-strong bg-surface px-2.5 py-1.5 shadow-[var(--shadow-pop)]">
      <div className="text-[11px] text-ink-muted">{label}</div>
      <div className="font-bold text-[13px] text-ink tabular-nums">
        {compact(payload[0].value)}
      </div>
    </div>
  );
}

/** Interactive area chart (Recharts), tokenized to match the design. */
export function AreaChart({
  data,
  labels,
  height = 200,
  color = "var(--color-bank)",
}: Props) {
  const id = useId();
  const gradId = `area-grad-${id}`;
  const chartData = data.map((value, i) => ({ label: labels[i] ?? "", value }));

  return (
    <ResponsiveContainer height={height} width="100%">
      <RechartsAreaChart
        data={chartData}
        margin={{ top: 14, right: 12, bottom: 0, left: -8 }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.22} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--color-line)" vertical={false} />
        <XAxis
          axisLine={false}
          dataKey="label"
          tick={{ fill: "var(--color-ink-muted)", fontSize: 12 }}
          tickLine={false}
        />
        <YAxis
          axisLine={false}
          tick={{ fill: "var(--color-ink-muted)", fontSize: 12 }}
          tickFormatter={compact}
          tickLine={false}
          width={44}
        />
        <Tooltip
          content={<ChartTooltip />}
          cursor={{ stroke: "var(--color-line-strong)", strokeDasharray: "4 4" }}
        />
        <Area
          activeDot={{ fill: "#fff", r: 5, stroke: color, strokeWidth: 3 }}
          dataKey="value"
          dot={{ fill: "#fff", r: 3, stroke: color, strokeWidth: 2 }}
          fill={`url(#${gradId})`}
          stroke={color}
          strokeWidth={2.5}
          type="monotone"
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
