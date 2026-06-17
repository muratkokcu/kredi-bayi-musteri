import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "./card";

export function KpiCard({
  icon: Icon,
  label,
  value,
  delta,
  positive = true,
  note = "Geçen aya göre",
  accent = "bank",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
  note?: string;
  accent?: "bank" | "dealer" | "cust";
}) {
  const tints: Record<NonNullable<typeof accent>, string> = {
    bank: "bg-bank-tint text-bank-600",
    dealer: "bg-dealer-tint text-dealer-700",
    cust: "bg-cust-tint text-cust-600",
  };
  const tint = tints[accent];

  return (
    <Card className="px-5 py-[18px]">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-[11px]",
            tint
          )}
        >
          <Icon size={19} strokeWidth={2} />
        </div>
        <div className="pt-0.5 font-medium text-[13px] text-ink-soft leading-4">
          {label}
        </div>
      </div>
      <div className="mt-3 font-bold text-[28px] text-ink leading-8 tracking-tight">
        {value}
      </div>
      <div className="mt-2.5 flex items-center gap-1.5 text-[12.5px]">
        <span
          className={cn(
            "inline-flex items-center gap-0.5 font-semibold",
            positive ? "text-success" : "text-danger"
          )}
        >
          {positive ? (
            <ArrowUp size={13} strokeWidth={2.5} />
          ) : (
            <ArrowDown size={13} strokeWidth={2.5} />
          )}
          {delta}
        </span>
        <span className="text-ink-muted">{note}</span>
      </div>
    </Card>
  );
}
