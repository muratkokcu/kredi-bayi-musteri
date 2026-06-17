import {
  Bell,
  Car,
  Check,
  ChevronLeft,
  Clock,
  Headset,
  Info,
  Percent,
  Phone,
  Wallet,
  X,
} from "lucide-react";
import type { ComponentType } from "react";
import { getModel, kategoriLabel } from "@/data/arac-taksonomisi";
import { MobileShell } from "../mobile-shell";

const tiguan = getModel("volkswagen", "tiguan");
const tiguanName = `Volkswagen ${tiguan?.model ?? "Tiguan"}`;
const tiguanVariant = `1.5 TSI · ${tiguan?.varyantlar[0] ?? "1.5 TSI"} DSG`;
const tiguanSegment = kategoriLabel(tiguan?.kategori ?? "arazi-suv-pick-up");

type StepState = "done" | "active" | "pending";

interface StepItem {
  date: string;
  desc: string;
  id: string;
  state: StepState;
  title: string;
}

const STEPS: StepItem[] = [
  {
    id: "alindi",
    title: "Başvuru Alındı",
    desc: "Başvurunuz başarıyla alındı.",
    date: "10 Mayıs 2025",
    state: "done",
  },
  {
    id: "on-onay",
    title: "Ön Onay",
    desc: "Kredi ön onay süreci sonuçlandı.",
    date: "11 Mayıs 2025",
    state: "done",
  },
  {
    id: "kredi-kontrol",
    title: "Kredi Kontrolü",
    desc: "Belgeleriniz kontrol ediliyor.",
    date: "12 Mayıs 2025",
    state: "done",
  },
  {
    id: "evrak-kontrol",
    title: "Evrak Kontrolü",
    desc: "Yüklediğiniz evraklar inceleniyor.",
    date: "13 Mayıs 2025",
    state: "active",
  },
  {
    id: "banka-onay",
    title: "Banka Onayı",
    desc: "Banka onayı bekleniyor.",
    date: "Beklemede",
    state: "pending",
  },
  {
    id: "arac-teslim",
    title: "Araç Teslimi",
    desc: "Onay sonrası teslimat planlanacaktır.",
    date: "Beklemede",
    state: "pending",
  },
];

interface LoanDetail {
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
  value: string;
}

const LOAN_DETAILS: LoanDetail[] = [
  { icon: Wallet, label: "Kredi Tutarı", value: "₺1.000.000" },
  { icon: Clock, label: "Vade", value: "48 Ay" },
  { icon: Percent, label: "Faiz Oranı", value: "%1,89" },
];

function StepIcon({ state }: { state: StepState }) {
  if (state === "done") {
    return (
      <span className="relative z-10 flex size-7 items-center justify-center rounded-full bg-success text-white">
        <Check size={15} strokeWidth={3} />
      </span>
    );
  }
  if (state === "active") {
    return (
      <span className="relative z-10 flex size-7 items-center justify-center rounded-full bg-cust text-white ring-4 ring-cust-tint">
        <Clock size={15} strokeWidth={2.4} />
      </span>
    );
  }
  return (
    <span className="relative z-10 flex size-7 items-center justify-center rounded-full border-2 border-line-strong bg-surface text-ink-muted">
      <span className="size-2 rounded-full bg-line-strong" />
    </span>
  );
}

export function CustomerBasvuruDurumu() {
  return (
    <MobileShell>
      <div className="flex flex-col pb-8">
        {/* back-header */}
        <div className="flex items-center justify-between px-5 py-3">
          <button
            className="flex size-9 items-center justify-center rounded-full bg-surface text-ink-soft shadow-[var(--shadow-card)]"
            type="button"
          >
            <ChevronLeft size={20} strokeWidth={2.2} />
          </button>
          <span className="font-bold text-[16px] text-ink">Başvuru Durumu</span>
          <button
            className="flex size-9 items-center justify-center rounded-full bg-surface text-ink-soft shadow-[var(--shadow-card)]"
            type="button"
          >
            <Info size={18} strokeWidth={1.9} />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-5 pt-1">
          {/* hero title */}
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h1 className="font-bold text-[20px] text-ink leading-tight">
                Başvurunuz Devam Ediyor 🎉
              </h1>
              <p className="mt-1 text-[12.5px] text-ink-soft leading-5">
                Tüm adımlar tamamlandığında süreci anlık olarak buradan takip
                edebilirsiniz.
              </p>
            </div>
            <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-cust-tint text-cust">
              <Check size={30} strokeWidth={2.4} />
            </span>
          </div>

          {/* vehicle summary card */}
          <div className="rounded-2xl bg-surface p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-start gap-3">
              <span className="flex h-14 w-20 shrink-0 items-center justify-center rounded-xl bg-canvas text-ink-muted">
                <Car size={26} strokeWidth={1.6} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-[15px] text-ink">
                  {tiguanName}
                </div>
                <div className="text-[11.5px] text-ink-muted">
                  {tiguanVariant}
                </div>
                <div className="mt-1 inline-flex items-center rounded-md bg-cust-tint px-2 py-0.5 font-semibold text-[10px] text-cust-600">
                  Kaya Otomotiv · {tiguanSegment}
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-line border-t pt-3">
              <div>
                <div className="text-[10.5px] text-ink-muted">
                  Başvuru Tarihi
                </div>
                <div className="font-semibold text-[12.5px] text-ink">
                  10 Mayıs 2025
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10.5px] text-ink-muted">Başvuru No</div>
                <div className="font-semibold text-[12.5px] text-ink">
                  BAS-2025-00124
                </div>
              </div>
            </div>
          </div>

          {/* stepper timeline */}
          <div className="rounded-2xl bg-surface p-4 shadow-[var(--shadow-card)]">
            <ol className="flex flex-col">
              {STEPS.map((step, index) => {
                const isLast = index === STEPS.length - 1;
                const lineDone = step.state === "done";
                return (
                  <li
                    className="relative flex gap-3 pb-5 last:pb-0"
                    key={step.id}
                  >
                    {isLast ? null : (
                      <span
                        aria-hidden="true"
                        className={`absolute top-7 left-[13px] w-0.5 ${
                          lineDone ? "bg-success" : "bg-line-strong"
                        }`}
                        style={{ bottom: 0 }}
                      />
                    )}
                    <StepIcon state={step.state} />
                    <div className="flex-1 pt-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold text-[13.5px] ${
                              step.state === "pending"
                                ? "text-ink-muted"
                                : "text-ink"
                            }`}
                          >
                            {step.title}
                          </span>
                          {step.state === "active" ? (
                            <span className="rounded-md bg-cust px-2 py-0.5 font-semibold text-[9.5px] text-white">
                              Devam Ediyor
                            </span>
                          ) : null}
                        </div>
                        <span className="shrink-0 text-[10.5px] text-ink-muted">
                          {step.date}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11.5px] text-ink-soft leading-4">
                        {step.desc}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* process notification info card */}
          <div className="flex items-center gap-3 rounded-2xl bg-cust-tint p-3.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-cust text-white">
              <Bell size={17} strokeWidth={1.9} />
            </span>
            <div className="flex-1">
              <div className="font-semibold text-[12.5px] text-ink">
                Süreçle ilgili bildirim
              </div>
              <div className="text-[11px] text-ink-soft leading-4">
                Başvurunuzdaki her gelişmeyi anında bildireceğiz.
              </div>
            </div>
            <button
              className="rounded-lg bg-surface px-3 py-1.5 font-semibold text-[11px] text-cust"
              type="button"
            >
              Bildirim Ayarları
            </button>
          </div>

          {/* loan details */}
          <div className="rounded-2xl bg-surface p-4 shadow-[var(--shadow-card)]">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-semibold text-[14px] text-ink">
                Başvuru Bilgileri
              </span>
              <button
                className="font-semibold text-[12px] text-cust"
                type="button"
              >
                Detayları Gör
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {LOAN_DETAILS.map((d) => (
                <div
                  className="flex flex-col items-center rounded-xl bg-canvas py-3 text-center"
                  key={d.label}
                >
                  <span className="flex size-8 items-center justify-center rounded-lg bg-cust-tint text-cust">
                    <d.icon size={16} strokeWidth={1.9} />
                  </span>
                  <div className="mt-1.5 text-[10px] text-ink-muted">
                    {d.label}
                  </div>
                  <div className="font-bold text-[13px] text-ink">
                    {d.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* dismissible note */}
          <div className="flex items-center gap-2 rounded-2xl bg-cust-tint/60 px-3.5 py-2.5">
            <Info className="shrink-0 text-cust" size={16} strokeWidth={1.9} />
            <span className="flex-1 text-[11px] text-ink-soft leading-4">
              En kısa veya hatalı bilgi olması durumunda sizinle iletişime
              geçeceğiz.
            </span>
            <button className="shrink-0 text-ink-muted" type="button">
              <X size={15} strokeWidth={2.2} />
            </button>
          </div>

          {/* help CTA */}
          <div className="rounded-2xl bg-cust-ink p-4 text-white">
            <div className="font-bold text-[14px]">
              Yardıma mı ihtiyacın var?
            </div>
            <div className="text-[11.5px] text-white/70 leading-4">
              Başvuru sürecinle ilgili sorularını yanıtlayalım.
            </div>
            <div className="mt-3 flex gap-2.5">
              <button
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white py-2.5 font-semibold text-[12.5px] text-cust-ink"
                type="button"
              >
                <Phone size={15} strokeWidth={2.2} />
                Bizi Ara
              </button>
              <button
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/15 py-2.5 font-semibold text-[12.5px] text-white"
                type="button"
              >
                <Headset size={15} strokeWidth={2.2} />
                Canlı Destek
              </button>
            </div>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
