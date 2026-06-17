import { useId } from "react";

interface Props {
  color?: string;
  data: number[];
  height?: number;
  /** index of the point to highlight with a tooltip */
  highlight?: number;
  highlightLabel?: string;
  highlightValue?: string;
  labels: string[];
  yTicks?: string[];
}

/** Lightweight hand-drawn area chart (SVG) for pixel control. */
export function AreaChart({
  data,
  labels,
  height = 200,
  highlight,
  highlightLabel,
  highlightValue,
  yTicks = ["50K", "40K", "30K", "20K", "10K"],
  color = "var(--color-bank)",
}: Props) {
  const id = useId();
  const w = 1000;
  const padL = 42;
  const padR = 12;
  const padT = 14;
  const padB = 26;
  const plotW = w - padL - padR;
  const plotH = height - padT - padB;

  const max = Math.max(...data) * 1.12;
  const min = 0;
  const x = (i: number) => padL + (plotW * i) / (data.length - 1);
  const y = (v: number) => padT + plotH - (plotH * (v - min)) / (max - min);

  const line = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d)}`)
    .join(" ");
  const area = `${line} L ${x(data.length - 1)} ${padT + plotH} L ${x(0)} ${padT + plotH} Z`;

  return (
    <svg
      aria-hidden="true"
      className="w-full"
      style={{ height }}
      viewBox={`0 0 ${w} ${height}`}
    >
      <defs>
        <linearGradient id={`g-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.22} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* horizontal gridlines + y labels */}
      {yTicks.map((t, i) => {
        const gy = padT + (plotH * i) / (yTicks.length - 1);
        return (
          <g key={t}>
            <line
              stroke="var(--color-line)"
              strokeWidth={1}
              x1={padL}
              x2={w - padR}
              y1={gy}
              y2={gy}
            />
            <text
              fill="var(--color-ink-muted)"
              fontSize={13}
              textAnchor="end"
              x={padL - 10}
              y={gy + 4}
            >
              {t}
            </text>
          </g>
        );
      })}

      <path d={area} fill={`url(#g-${id})`} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
      />

      {/* data-point markers */}
      {data.map((d, i) => {
        const cx = x(i);
        return (
          <circle
            cx={cx}
            cy={y(d)}
            fill="#fff"
            key={cx}
            r={3.5}
            stroke={color}
            strokeWidth={2}
          />
        );
      })}

      {/* x labels */}
      {labels.map((l, i) => (
        <text
          fill="var(--color-ink-muted)"
          fontSize={13}
          key={l}
          textAnchor="middle"
          x={x(i)}
          y={height - 6}
        >
          {l}
        </text>
      ))}

      {/* highlight point + tooltip */}
      {highlight != null && (
        <>
          <line
            stroke="var(--color-line-strong)"
            strokeDasharray="4 4"
            x1={x(highlight)}
            x2={x(highlight)}
            y1={padT}
            y2={padT + plotH}
          />
          <circle
            cx={x(highlight)}
            cy={y(data[highlight])}
            fill="#fff"
            r={5}
            stroke={color}
            strokeWidth={3}
          />
          {highlightValue && (
            <g
              transform={`translate(${x(highlight) - 56}, ${y(data[highlight]) - 58})`}
            >
              <rect
                fill="#fff"
                height={42}
                rx={9}
                stroke="var(--color-line-strong)"
                width={112}
              />
              <text fill="var(--color-ink-muted)" fontSize={12} x={14} y={18}>
                {highlightLabel}
              </text>
              <text
                fill="var(--color-ink)"
                fontSize={15}
                fontWeight={700}
                x={14}
                y={34}
              >
                {highlightValue}
              </text>
            </g>
          )}
        </>
      )}
    </svg>
  );
}
