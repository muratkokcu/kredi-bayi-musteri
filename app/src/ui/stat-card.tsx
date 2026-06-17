import type { ReactNode } from "react";
import { Card } from "./card";

type Tone = "bank" | "dealer" | "cust" | "warn" | "teal";

const toneClasses: Record<Tone, string> = {
  bank: "bg-bank-tint text-bank-600",
  dealer: "bg-dealer-tint text-dealer-700",
  cust: "bg-cust-tint text-cust-600",
  warn: "bg-warn-tint text-warn",
  teal: "bg-[#e0f5f3] text-[#0e9488]",
};

interface StatCardProps {
  icon: ReactNode;
  label: string;
  sub?: ReactNode;
  tone?: Tone;
  value: string;
}

/** Compact KPI tile: tinted icon disc + label/value, optional sub line. */
export function StatCard({
  icon,
  label,
  value,
  sub,
  tone = "bank",
}: StatCardProps) {
  return (
    <Card className="px-5 py-4">
      <div className="flex items-center gap-3">
        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-full ${toneClasses[tone]}`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <div className="truncate text-[12.5px] text-ink-muted">{label}</div>
          <div className="font-bold text-[22px] text-ink leading-7 tracking-tight">
            {value}
          </div>
        </div>
      </div>
      {sub && <div className="mt-2.5 text-[12px] text-ink-muted">{sub}</div>}
    </Card>
  );
}
