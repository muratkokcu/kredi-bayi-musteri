interface ScoreRingProps {
  /** override the arc color (default: threshold tone red/amber/green) */
  color?: string;
  /** hide the numeric label (e.g. very small rings) */
  showValue?: boolean;
  size?: number;
  stroke?: number;
  /** override the background track color (default: --color-line) */
  trackColor?: string;
  /** 0..100 */
  value: number;
}

function toneFor(value: number) {
  if (value >= 80) {
    return "var(--color-success)";
  }
  if (value >= 60) {
    return "var(--color-warn)";
  }
  return "var(--color-danger)";
}

/** Circular score gauge — arc length tracks the value, colored by threshold. */
export function ScoreRing({
  value,
  size = 40,
  stroke = 4,
  showValue = true,
  color,
  trackColor = "var(--color-line)",
}: ScoreRingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  const arc = color ?? toneFor(value);

  return (
    <span
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        aria-hidden="true"
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        width={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={r}
          stroke={trackColor}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={r}
          stroke={arc}
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="round"
          strokeWidth={stroke}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {showValue && (
        <span
          className="absolute font-bold text-ink tabular-nums"
          style={{ fontSize: size * 0.32 }}
        >
          {value}
        </span>
      )}
    </span>
  );
}
