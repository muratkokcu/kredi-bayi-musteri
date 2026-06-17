import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Info,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { getModel } from "@/data/arac-taksonomisi";
import { MobileShell } from "../mobile-shell";

const tiguan = getModel("volkswagen", "tiguan");
const tiguanName = `Volkswagen ${tiguan?.model ?? "Tiguan"}`;
const tiguanVariant = `1.5 TSI · ${tiguan?.varyantlar[0] ?? "1.5 TSI"} DSG`;

const ARAC_FIYATI = 1_250_000;
const PESINAT = 250_000;
const VADE = 48;
const FAIZ = 1.89;

function formatTRY(value: number): string {
  return `₺${new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 0,
  }).format(Math.round(value))}`;
}

function formatPercent(value: number): string {
  return `%${value.toLocaleString("tr-TR")}`;
}

function annuity(loan: number, monthlyRate: number, months: number): number {
  if (monthlyRate === 0) {
    return loan / months;
  }
  return (loan * monthlyRate) / (1 - (1 + monthlyRate) ** -months);
}

interface PlanOption {
  desc: string;
  id: string;
  title: string;
}

const PLAN_OPTIONS: PlanOption[] = [
  { id: "esit", title: "Eşit Taksit", desc: "Sabit aylık ödeme" },
  { id: "azalan", title: "Azalan Taksit", desc: "Önce yüksek, sonra düşük" },
  { id: "ozel", title: "Özel Plan", desc: "Kendi planını oluştur" },
];

// Hand-drawn amortization bars (12 quarters over the 48-month vade).
const BARS = [
  { id: "q1", h: 96 },
  { id: "q2", h: 90 },
  { id: "q3", h: 84 },
  { id: "q4", h: 78 },
  { id: "q5", h: 71 },
  { id: "q6", h: 64 },
  { id: "q7", h: 57 },
  { id: "q8", h: 50 },
  { id: "q9", h: 42 },
  { id: "q10", h: 34 },
  { id: "q11", h: 25 },
  { id: "q12", h: 16 },
];

interface OtherPlan {
  desc: string;
  icon: typeof TrendingDown;
  id: string;
  title: string;
}

const OTHER_PLANS: OtherPlan[] = [
  {
    id: "azalan",
    icon: TrendingDown,
    title: "Azalan Taksit",
    desc: "İlk taksitler yüksek, zamanla azalır",
  },
  {
    id: "ozel",
    icon: Wallet,
    title: "Özel Plan Oluştur",
    desc: "Taksit ve vadeyi kendin belirle",
  },
];

function Stepper() {
  const steps = [
    { id: "bilgi", label: "Kredi Bilgileri", n: 1 },
    { id: "plan", label: "Ödeme Planı", n: 2 },
    { id: "sonuc", label: "Sonuçlar", n: 3 },
  ];
  const activeIndex = 1;
  return (
    <div className="flex items-center px-5 pb-3">
      {steps.map((s, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        return (
          <div className="flex flex-1 items-center last:flex-none" key={s.id}>
            <div className="flex flex-col items-center gap-1">
              <span
                className={
                  active || done
                    ? "flex size-7 items-center justify-center rounded-full bg-cust font-bold text-[12px] text-white"
                    : "flex size-7 items-center justify-center rounded-full bg-cust-tint font-bold text-[12px] text-cust-600"
                }
              >
                {s.n}
              </span>
              <span
                className={
                  active
                    ? "font-semibold text-[10.5px] text-cust"
                    : "text-[10.5px] text-ink-muted"
                }
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span
                className={
                  done
                    ? "mx-1 h-0.5 flex-1 bg-cust"
                    : "mx-1 h-0.5 flex-1 bg-line"
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function AmortizationChart() {
  return (
    <svg
      aria-hidden="true"
      className="h-28 w-full"
      preserveAspectRatio="none"
      viewBox="0 0 240 110"
    >
      <title>Eşit taksit amortisman grafiği</title>
      <line
        stroke="var(--color-line)"
        strokeWidth={1}
        x1={0}
        x2={240}
        y1={101}
        y2={101}
      />
      {BARS.map((b, i) => {
        const barW = 14;
        const gap = 6;
        const x = 2 + i * (barW + gap);
        const y = 100 - b.h;
        return (
          <g key={b.id}>
            <rect
              fill="var(--color-cust-tint)"
              height={100 - y}
              rx={3}
              width={barW}
              x={x}
              y={y}
            />
            <rect
              fill="var(--color-cust)"
              height={Math.min(100 - y, 22)}
              rx={3}
              width={barW}
              x={x}
              y={y}
            />
          </g>
        );
      })}
    </svg>
  );
}

export function CustomerOdemePlani() {
  const [selectedPlan, setSelectedPlan] = useState("esit");

  const loan = Math.max(ARAC_FIYATI - PESINAT, 0);
  const monthlyRate = FAIZ / 100;
  const taksit = annuity(loan, monthlyRate, VADE);
  const toplamGeriOdeme = taksit * VADE;
  const toplamFaiz = toplamGeriOdeme - loan;

  const summary = [
    { label: "Araç Fiyatı", value: formatTRY(ARAC_FIYATI) },
    { label: "Vade", value: `${VADE} Ay` },
    { label: "Faiz", value: formatPercent(FAIZ) },
    { label: "Aylık Taksit", value: formatTRY(taksit) },
  ];

  return (
    <MobileShell
      bottomBar={
        <div className="border-line border-t bg-surface px-5 pt-3 pb-5">
          <button
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cust py-4 font-semibold text-[15px] text-white shadow-[0_10px_24px_rgba(89,101,240,0.35)]"
            type="button"
          >
            Devam Et <ArrowRight size={18} strokeWidth={2.2} />
          </button>
        </div>
      }
    >
      {/* back header */}
      <div className="flex items-center justify-between px-5 py-3">
        <button
          className="flex size-9 items-center justify-center rounded-full bg-surface text-ink-soft shadow-[var(--shadow-card)]"
          type="button"
        >
          <ChevronLeft size={20} strokeWidth={2.2} />
        </button>
        <div className="text-center">
          <div className="font-bold text-[16px] text-ink">Kredi Simülatörü</div>
          <div className="text-[11px] text-ink-muted">
            Sana en uygun ödeme planını seç
          </div>
        </div>
        <button
          className="flex size-9 items-center justify-center rounded-full bg-surface text-ink-soft shadow-[var(--shadow-card)]"
          type="button"
        >
          <Info size={18} strokeWidth={1.9} />
        </button>
      </div>

      <Stepper />

      <div className="flex flex-col gap-4 px-5 pt-1 pb-6">
        {/* selected vehicle / amount summary */}
        <div className="rounded-2xl bg-surface p-4 shadow-[var(--shadow-card)]">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-cust-tint font-bold text-[13px] text-cust-600">
              VW
            </span>
            <div className="flex-1">
              <div className="font-semibold text-[14px] text-ink">
                {tiguanName}
              </div>
              <div className="text-[11px] text-ink-muted">{tiguanVariant}</div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 border-line border-t pt-3">
            {summary.map((s) => (
              <div key={s.label}>
                <div className="text-[9.5px] text-ink-muted">{s.label}</div>
                <div className="mt-0.5 font-bold text-[12.5px] text-ink">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* plan segmented options */}
        <div>
          <div className="mb-2 font-semibold text-[14px] text-ink">
            Ödeme Planı Seçimi
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-2xl bg-cust-tint p-1.5">
            {PLAN_OPTIONS.map((p) => {
              const on = p.id === selectedPlan;
              return (
                <button
                  className={
                    on
                      ? "flex flex-col items-center gap-0.5 rounded-xl bg-cust px-2 py-2.5 text-white shadow-[0_6px_16px_rgba(89,101,240,0.3)]"
                      : "flex flex-col items-center gap-0.5 rounded-xl px-2 py-2.5 text-ink-soft"
                  }
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  type="button"
                >
                  <span className="font-semibold text-[12.5px]">{p.title}</span>
                  <span
                    className={
                      on
                        ? "text-[9px] text-white/80"
                        : "text-[9px] text-ink-muted"
                    }
                  >
                    {p.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* equal-installment plan card */}
        <div className="rounded-2xl bg-surface p-4 shadow-[var(--shadow-card)]">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-semibold text-[14px] text-ink">
              Eşit Taksit Planı
            </span>
            <span className="rounded-full bg-cust-tint px-2.5 py-1 font-semibold text-[11px] text-cust-600">
              {VADE} Ay
            </span>
          </div>
          <div className="text-[11px] text-ink-muted">
            Vade boyunca her ay aynı tutarda taksit ödersin.
          </div>

          <AmortizationChart />
          <div className="flex items-center justify-between text-[9.5px] text-ink-muted">
            <span>1. Ay</span>
            <span>Anapara + Faiz</span>
            <span>{VADE}. Ay</span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 border-line border-t pt-3">
            <div className="rounded-xl bg-cust-tint p-3">
              <div className="text-[10.5px] text-ink-muted">
                Toplam Geri Ödeme
              </div>
              <div className="mt-0.5 font-bold text-[16px] text-cust-600">
                {formatTRY(toplamGeriOdeme)}
              </div>
            </div>
            <div className="rounded-xl bg-canvas p-3">
              <div className="text-[10.5px] text-ink-muted">Toplam Faiz</div>
              <div className="mt-0.5 font-bold text-[16px] text-ink">
                {formatTRY(toplamFaiz)}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11.5px] text-ink-soft">
            <Calendar className="text-cust" size={15} strokeWidth={1.9} />
            <span>
              Son Taksit Tarihi:{" "}
              <span className="font-semibold text-ink">15.06.2030</span>
            </span>
          </div>
        </div>

        {/* other plans list */}
        <div>
          <div className="mb-2 font-semibold text-[14px] text-ink">
            Diğer Ödeme Planları
          </div>
          <div className="flex flex-col gap-2.5">
            {OTHER_PLANS.map((p) => (
              <button
                className="flex items-center gap-3 rounded-2xl bg-surface p-3.5 text-left shadow-[var(--shadow-card)]"
                key={p.id}
                onClick={() => setSelectedPlan(p.id)}
                type="button"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-cust-tint text-cust">
                  <p.icon size={19} strokeWidth={1.9} />
                </span>
                <div className="flex-1">
                  <div className="font-semibold text-[13.5px] text-ink">
                    {p.title}
                  </div>
                  <div className="text-[11px] text-ink-muted">{p.desc}</div>
                </div>
                <ChevronRight className="text-ink-muted" size={18} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
