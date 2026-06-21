/**
 * Bank dashboard — server data extracted from the dashboard screen
 * (roadmap 0.1). Served through the fake service layer (src/services/bank-dashboard)
 * so the screen consumes it via a hook rather than importing this file directly.
 *
 * KPI values, chart input arrays and lists are data; pure UI config (button
 * labels, class names, the period selector) stays inline in the screen.
 * Lives in a .tsx file because the AI insight copy is authored as JSX, kept
 * verbatim from the original screen.
 */
import { Calendar, Car, FileText, TrendingUp, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface DashboardKpi {
  delta: string;
  icon: LucideIcon;
  label: string;
  positive: boolean;
  value: string;
}

export interface DashboardInsight {
  id: string;
  icon: LucideIcon;
  tint: string;
  text: ReactNode;
}

export interface DashboardDealer {
  logo: string;
  name: string;
  count: string;
  conv: number;
}

export interface DashboardFunnelStage {
  label: string;
  sub?: string;
  value: string;
  pct: string;
  frac: number;
}

export interface BankDashboard {
  kpis: DashboardKpi[];
  trend: number[];
  months: string[];
  trendHighlight: number;
  trendHighlightLabel: string;
  trendHighlightValue: string;
  insights: DashboardInsight[];
  dealers: DashboardDealer[];
  funnel: DashboardFunnelStage[];
}

export const BANK_DASHBOARD: BankDashboard = {
  kpis: [
    {
      delta: "12.5%",
      icon: FileText,
      label: "Aktif Kredi Sayısı",
      positive: true,
      value: "245.830",
    },
    {
      delta: "8.7%",
      icon: Users,
      label: "Yüksek Skorlu Müşteri",
      positive: true,
      value: "18.492",
    },
    {
      delta: "3.2%",
      icon: Calendar,
      label: "Bu Ay Biten Krediler",
      positive: false,
      value: "4.231",
    },
    {
      delta: "5.4%",
      icon: TrendingUp,
      label: "Yenileme Dönüşüm Oranı",
      positive: true,
      value: "%32",
    },
  ],
  trend: [
    12_000, 18_000, 22_000, 21_500, 27_000, 31_000, 38_000, 41_000, 33_000,
    30_000, 32_842, 34_000, 31_000,
  ],
  months: [
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
  ],
  trendHighlight: 10,
  trendHighlightLabel: "Nisan 2025",
  trendHighlightValue: "32.842",
  insights: [
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
  ],
  dealers: [
    { logo: "MINI", name: "Doğuş Oto", count: "1.248", conv: 38 },
    { logo: "BO", name: "Borusan Otomotiv", count: "1.102", conv: 35 },
    { logo: "OTO", name: "Otokoç", count: "987", conv: 32 },
    { logo: "PSA", name: "Groupe PSA", count: "765", conv: 28 },
    { logo: "BO", name: "Bayi Otomotiv", count: "612", conv: 25 },
  ],
  funnel: [
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
  ],
};
