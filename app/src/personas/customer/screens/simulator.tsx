import { Link } from "@tanstack/react-router";
import { Car, Check } from "lucide-react";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { getModel } from "@/data/arac-taksonomisi";
import { MobileShell } from "../mobile-shell";

const tiguan = getModel("volkswagen", "tiguan");
const tiguanName = `Volkswagen ${tiguan?.model ?? "Tiguan"}`;
const tiguanVariant = `${tiguan?.varyantlar[0] ?? "1.5 TSI"} 150 DSG`;

const ARAC_FIYATI = 1_250_000;
const BSMV_RATE = 0.0189;
const SIGORTA_RATE = 0.0587;

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

interface Step {
  id: number;
  label: string;
}

const STEPS: Step[] = [
  { id: 1, label: "Araç Bilgileri" },
  { id: 2, label: "Ödeme Planı" },
  { id: 3, label: "Sonuçlar" },
];

const ACTIVE_STEP = 1;

function StepIndicator() {
  return (
    <div className="flex items-center px-1">
      {STEPS.map((step, index) => {
        const active = step.id === ACTIVE_STEP;
        const done = step.id < ACTIVE_STEP;
        return (
          <div className="flex flex-1 items-center" key={step.id}>
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={
                  active || done
                    ? "flex size-7 items-center justify-center rounded-full bg-cust font-bold text-[12px] text-white"
                    : "flex size-7 items-center justify-center rounded-full bg-cust-tint font-bold text-[12px] text-cust-600"
                }
              >
                {done ? <Check size={14} strokeWidth={2.6} /> : step.id}
              </span>
              <span
                className={
                  active
                    ? "whitespace-nowrap font-semibold text-[10.5px] text-cust"
                    : "whitespace-nowrap text-[10.5px] text-ink-muted"
                }
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 ? (
              <span className="mx-1 mb-5 h-px flex-1 bg-line-strong" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function CustomerSimulator() {
  const [price] = useState(ARAC_FIYATI);
  const [pesinat, setPesinat] = useState(250_000);
  const [vade, setVade] = useState(48);
  const [faiz, setFaiz] = useState(1.89);

  const loan = Math.max(price - pesinat, 0);
  const monthlyRate = faiz / 100;
  const taksit = annuity(loan, monthlyRate, vade);
  const toplamGeriOdeme = taksit * vade;
  const pesinatYuzde = price > 0 ? Math.round((pesinat / price) * 100) : 0;
  const bsmv = loan * BSMV_RATE;
  const sigorta = loan * SIGORTA_RATE;

  return (
    <MobileShell tab="Simülatör">
      <div className="flex flex-col gap-4 px-5 pt-2 pb-6">
        {/* header */}
        <div>
          <h1 className="font-bold text-[20px] text-ink">Kredi Simülatörü</h1>
          <p className="text-[12.5px] text-ink-muted">
            Sana en uygun kredi planını oluştur.
          </p>
        </div>

        {/* step indicator */}
        <StepIndicator />

        {/* vehicle price card */}
        <div className="rounded-2xl bg-surface p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] text-ink-muted">Araç Fiyatı</span>
            <button
              className="font-semibold text-[12px] text-cust"
              type="button"
            >
              Değiştir
            </button>
          </div>
          <div className="mt-1 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-bold text-[24px] text-ink">
                {formatTRY(price)}
              </div>
              <div className="mt-0.5 font-semibold text-[13px] text-ink">
                {tiguanName}
              </div>
              <div className="text-[11.5px] text-ink-muted">
                {tiguanVariant}
              </div>
            </div>
            <span className="flex h-14 w-24 shrink-0 items-center justify-center rounded-xl bg-canvas text-ink-muted">
              <Car size={30} strokeWidth={1.5} />
            </span>
          </div>
        </div>

        {/* sliders */}
        <div className="flex flex-col gap-5 rounded-2xl bg-surface p-4 shadow-[var(--shadow-card)]">
          <div>
            <div className="mb-2 flex items-end justify-between">
              <span className="font-medium text-[13px] text-ink-soft">
                Peşinat
              </span>
              <span className="flex items-baseline gap-1.5">
                <span className="font-bold text-[15px] text-ink">
                  {formatTRY(pesinat)}
                </span>
                <span className="font-semibold text-[11px] text-cust-600">
                  {formatPercent(pesinatYuzde)}
                </span>
              </span>
            </div>
            <Slider
              max={price}
              min={0}
              onValueChange={([v]) => setPesinat(v)}
              step={10_000}
              value={[pesinat]}
            />
          </div>

          <div>
            <div className="mb-2 flex items-end justify-between">
              <span className="font-medium text-[13px] text-ink-soft">
                Kredi Tutarı
              </span>
              <span className="flex items-baseline gap-1.5">
                <span className="font-bold text-[15px] text-ink">
                  {formatTRY(loan)}
                </span>
                <span className="font-semibold text-[11px] text-cust-600">
                  Hesaplanan
                </span>
              </span>
            </div>
            <Slider
              disabled={true}
              max={price}
              min={0}
              step={10_000}
              value={[loan]}
            />
          </div>

          <div>
            <div className="mb-2 flex items-end justify-between">
              <span className="font-medium text-[13px] text-ink-soft">
                Vade
              </span>
              <span className="flex items-baseline gap-1.5">
                <span className="font-bold text-[15px] text-ink">
                  {vade} Ay
                </span>
              </span>
            </div>
            <Slider
              max={60}
              min={12}
              onValueChange={([v]) => setVade(v)}
              step={6}
              value={[vade]}
            />
          </div>

          <div>
            <div className="mb-2 flex items-end justify-between">
              <span className="font-medium text-[13px] text-ink-soft">
                Faiz Oranı
              </span>
              <span className="flex items-baseline gap-1.5">
                <span className="font-bold text-[15px] text-ink">
                  {formatPercent(faiz)}
                </span>
              </span>
            </div>
            <Slider
              max={4}
              min={0.5}
              onValueChange={([v]) => setFaiz(v)}
              step={0.01}
              value={[faiz]}
            />
          </div>
        </div>

        {/* result card */}
        <div className="rounded-2xl bg-cust-ink p-4 text-white">
          <div className="text-center">
            <div className="text-[12px] text-white/70">
              Tahmini Aylık Taksit
            </div>
            <div className="font-bold text-[34px] leading-tight">
              {formatTRY(taksit)}
            </div>
            <div className="mt-1 text-[12px] text-white/70">
              Toplam Geri Ödeme{" "}
              <span className="font-semibold text-white">
                {formatTRY(toplamGeriOdeme)}
              </span>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2 border-white/15 border-t pt-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-white/70">Kredi Tutarı</span>
              <span className="font-semibold text-[12.5px] text-white">
                {formatTRY(loan)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-white/70">BSMV</span>
              <span className="font-semibold text-[12.5px] text-white">
                {formatTRY(bsmv)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-white/70">Sigorta Tahmini</span>
              <span className="font-semibold text-[12.5px] text-white">
                {formatTRY(sigorta)}
              </span>
            </div>
          </div>
        </div>

        {/* continue button */}
        <Link
          className="flex h-[52px] items-center justify-center rounded-2xl bg-cust font-semibold text-[15px] text-white shadow-[var(--shadow-card)]"
          to="/musteri/odeme-plani"
        >
          Devam Et
        </Link>
      </div>
    </MobileShell>
  );
}
