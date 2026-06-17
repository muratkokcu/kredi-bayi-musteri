import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone =
  | "bank"
  | "dealer"
  | "cust"
  | "success"
  | "danger"
  | "warn"
  | "neutral";

const tones: Record<Tone, string> = {
  bank: "bg-bank-tint text-bank-700",
  dealer: "bg-dealer-tint text-dealer-700",
  cust: "bg-cust-tint text-cust-600",
  success: "bg-success-tint text-success",
  danger: "bg-danger-tint text-danger",
  warn: "bg-warn-tint text-warn",
  neutral: "bg-line text-ink-soft",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-2.5 py-1 font-semibold text-[12px]",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function MiniBar({
  value,
  color = "var(--color-bank)",
}: {
  value: number;
  color?: string;
}) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
      <div
        className="h-full rounded-full"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );
}
