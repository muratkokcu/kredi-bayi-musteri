import {
  ArrowRight,
  Calendar,
  Car,
  ChevronDown,
  FileText,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { AreaChart } from "../../../ui/area-chart";
import { MiniBar } from "../../../ui/badge";
import { Card, CardHeader } from "../../../ui/card";
import { FunnelChart } from "../../../ui/funnel-chart";
import { KpiCard } from "../../../ui/kpi";
import { BankShell } from "../bank-shell";

const TREND = [
  12_000, 18_000, 22_000, 21_500, 27_000, 31_000, 38_000, 41_000, 33_000,
  30_000, 32_842, 34_000, 31_000,
];
const MONTHS = [
  "Haz",
  "Tem",
  "Ağu",
  "Eyl",
  "Eki",
  "Kas",
  "Ara",
  "Oca",
  "Şub",
  "Mar",
  "Nis",
  "May",
];

const INSIGHTS = [
  {
    id: "upcoming",
    icon: Users,
    tint: "bg-bank-tint text-bank-600",
    text: (
      <>
        Önümüzdeki 90 gün içinde{" "}
        <b className="font-semibold text-bank-600">3.842 müşteri</b> yenileme
        için uygun hale gelecek.
      </>
    ),
  },
  {
    id: "suv",
    icon: Car,
    tint: "bg-dealer-tint text-dealer-700",
    text: (
      <>
        SUV segmentinde dönüşüm oranı{" "}
        <b className="font-semibold text-ink">%18 daha yüksek.</b>
      </>
    ),
  },
  {
    id: "deadline",
    icon: Calendar,
    tint: "bg-warn-tint text-warn",
    text: (
      <>
        Kredi bitişine 60-90 gün kalan müşterilerde teklif kabul oranı{" "}
        <b className="font-semibold text-ink">%24 artıyor.</b>
      </>
    ),
  },
];

const DEALERS = [
  { logo: "MINI", name: "Doğuş Oto", count: "1.248", conv: 38 },
  { logo: "BO", name: "Borusan Otomotiv", count: "1.102", conv: 35 },
  { logo: "OTO", name: "Otokoç", count: "987", conv: 32 },
  { logo: "PSA", name: "Groupe PSA", count: "765", conv: 28 },
  { logo: "KO", name: "Kaya Otomotiv", count: "612", conv: 25 },
];

const FUNNEL = [
  {
    label: "Uygun Müşteri",
    sub: "Skor ≥ 70",
    value: "18.492",
    pct: "%100",
    frac: 1.0,
  },
  { label: "İletişime Geçilen", value: "11.287", pct: "%61", frac: 0.74 },
  { label: "Teklif Gönderilen", value: "6.842", pct: "%37", frac: 0.54 },
  { label: "Kabul Edilen", value: "2.188", pct: "%12", frac: 0.4 },
];

export function BankDashboard() {
  return (
    <BankShell
      actions={
        <button
          className="flex items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-3.5 py-2 font-medium text-[13px] text-ink-soft hover:bg-canvas"
          type="button"
        >
          <Calendar size={16} strokeWidth={1.9} />
          01 Mayıs - 31 Mayıs 2025
          <ChevronDown className="text-ink-muted" size={15} strokeWidth={1.9} />
        </button>
      }
      highlight="Ahmet Bey"
      subtitle="Portföy yenileme fırsatlarınızı ve bayi performansınızı takip edin."
      title="Hoş geldiniz,"
    >
      {/* KPI row */}
      <div className="grid grid-cols-4 gap-5">
        <KpiCard
          delta="12.5%"
          icon={FileText}
          label="Aktif Kredi Sayısı"
          positive
          value="245.830"
        />
        <KpiCard
          delta="8.7%"
          icon={Users}
          label="Yüksek Skorlu Müşteri"
          positive
          value="18.492"
        />
        <KpiCard
          delta="3.2%"
          icon={Calendar}
          label="Bu Ay Biten Krediler"
          positive={false}
          value="4.231"
        />
        <KpiCard
          delta="5.4%"
          icon={TrendingUp}
          label="Yenileme Dönüşüm Oranı"
          positive
          value="%32"
        />
      </div>

      {/* middle row */}
      <div className="mt-5 grid grid-cols-3 gap-5">
        <Card className="col-span-2 pb-5">
          <CardHeader
            action={
              <button
                className="flex items-center gap-1.5 rounded-[9px] border border-line-strong px-3 py-1.5 font-medium text-[12.5px] text-ink-soft"
                type="button"
              >
                Aylık
                <ChevronDown size={14} strokeWidth={2} />
              </button>
            }
            subtitle="Son 12 ayın yenileme fırsatı skoru trendi"
            title="Yenileme Fırsatı Trendi"
          />
          <div className="px-3 pt-3">
            <AreaChart
              data={TREND}
              height={210}
              highlight={10}
              highlightLabel="Nisan 2025"
              highlightValue="32.842"
              labels={MONTHS}
            />
          </div>
        </Card>

        <Card className="pb-5">
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <Zap className="text-bank" size={16} /> AI İçgörüler
              </span>
            }
          />
          <div className="mt-3 flex flex-col gap-4 px-5">
            {INSIGHTS.map((it) => (
              <div className="flex gap-3" key={it.id}>
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-[10px] ${it.tint}`}
                >
                  <it.icon size={17} strokeWidth={1.9} />
                </div>
                <p className="text-[13px] text-ink-soft leading-[18px]">
                  {it.text}
                </p>
              </div>
            ))}
          </div>
          <div className="px-5 pt-4">
            <button
              className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-line-strong py-2.5 font-semibold text-[13px] text-bank-700"
              type="button"
            >
              Tüm İçgörüleri Görüntüle <ArrowRight size={15} />
            </button>
          </div>
        </Card>
      </div>

      {/* bottom row */}
      <div className="mt-5 grid grid-cols-3 gap-5">
        <Card className="col-span-2 pb-3">
          <CardHeader
            action={
              <button
                className="font-semibold text-[12.5px] text-bank-700"
                type="button"
              >
                Tümünü Görüntüle
              </button>
            }
            title="En Aktif Bayiler"
          />
          <div className="mt-4 px-5">
            <div className="grid grid-cols-[1fr_auto_180px] items-center gap-4 border-line border-b pb-2 font-semibold text-[11.5px] text-ink-muted uppercase tracking-wide">
              <span>Bayi Adı</span>
              <span>Teklif Aşamasına Geçen</span>
              <span className="text-right">Dönüşüm Oranı</span>
            </div>
            {DEALERS.map((d) => (
              <div
                className="grid grid-cols-[1fr_auto_180px] items-center gap-4 border-line border-b py-3 last:border-0"
                key={d.name}
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-canvas font-bold text-[9px] text-ink-soft">
                    {d.logo}
                  </div>
                  <span className="font-medium text-[13.5px] text-ink">
                    {d.name}
                  </span>
                </div>
                <span className="text-right font-semibold text-[13.5px] text-ink tabular-nums">
                  {d.count}
                </span>
                <div className="flex items-center gap-2.5">
                  <MiniBar value={d.conv * 2.4} />
                  <span className="w-9 shrink-0 text-right font-semibold text-[13px] text-ink tabular-nums">
                    %{d.conv}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="pb-5">
          <CardHeader title="Yenileme Süreci Funnel" />
          <div className="mt-4 px-5">
            <FunnelChart stages={FUNNEL} />
          </div>
          <div className="px-5 pt-5">
            <button
              className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-line-strong py-2.5 font-semibold text-[13px] text-bank-700"
              type="button"
            >
              Funnel Analizini Görüntüle <ArrowRight size={15} />
            </button>
          </div>
        </Card>
      </div>
    </BankShell>
  );
}
