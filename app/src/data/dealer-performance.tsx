/**
 * Dealer performance & analytics — server data extracted from the performans
 * screen (roadmap 0.1). Served through the fake service layer
 * (src/services/dealer-performance) so the screen consumes it via a hook rather
 * than importing this file directly.
 *
 * KPI values, the funnel/trend/donut chart series and every table/leaderboard
 * row are data; pure UI config (the date-range pill, headers, class names,
 * chart geometry) stays inline in the screen. Lives in a .tsx file because the
 * KPI and speed-stat icons are authored as JSX, kept verbatim from the original
 * screen.
 */
import {
  CircleCheck,
  Clock,
  Coins,
  FileSignature,
  FileText,
  Percent,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import type { ReactNode } from "react";

export interface PerformanceKpi {
  delta: string;
  icon: ReactNode;
  label: string;
  tone: "dealer" | "cust" | "warn" | "teal" | "bank";
  value: string;
}

export interface PerformanceFunnelStage {
  frac: number;
  label: string;
  pct: string;
  value: string;
}

export interface PerformanceStatusRow {
  color: string;
  count: string;
  label: string;
  pct: string;
}

export interface PerformanceSegmentRow {
  kapanan: number;
  oran: string;
  pct: number;
  segment: string;
  teklif: number;
  yanit: string;
}

export interface PerformanceAdvisorRow {
  ad: string;
  initials: string;
  kapanan: number;
  oran: string;
  pct: number;
  teklif: number;
  tone: string;
}

export interface PerformanceVehicleRow {
  ad: string;
  oran: string;
  rank: number;
  teklif: string;
}

export interface PerformanceSpeedStat {
  color: string;
  delta: string;
  icon: ReactNode;
  label: string;
  tint: string;
  value: string;
}

export interface DealerPerformance {
  advisors: PerformanceAdvisorRow[];
  funnelStages: PerformanceFunnelStage[];
  kpis: PerformanceKpi[];
  offerLabels: string[];
  offerTicks: string[];
  offerTrend: number[];
  salesTrend: number[];
  segments: PerformanceSegmentRow[];
  speedStats: PerformanceSpeedStat[];
  status: PerformanceStatusRow[];
  trendLabels: string[];
  vehicles: PerformanceVehicleRow[];
}

export const DEALER_PERFORMANCE: DealerPerformance = {
  kpis: [
    {
      icon: <FileText size={20} strokeWidth={1.9} />,
      label: "Toplam Teklif",
      value: "128",
      delta: "%18,5",
      tone: "dealer",
    },
    {
      icon: <CircleCheck size={20} strokeWidth={1.9} />,
      label: "Kazanılan Teklif",
      value: "32",
      delta: "%23,1",
      tone: "teal",
    },
    {
      icon: <Percent size={20} strokeWidth={1.9} />,
      label: "Kazanma Oranı",
      value: "%25,0",
      delta: "%3,2",
      tone: "cust",
    },
    {
      icon: <Coins size={20} strokeWidth={1.9} />,
      label: "Toplam Teklif Tutarı",
      value: "₺28.450.000",
      delta: "%21,7",
      tone: "warn",
    },
    {
      icon: <ShoppingCart size={20} strokeWidth={1.9} />,
      label: "Kapanan Satışlar",
      value: "18",
      delta: "%12,5",
      tone: "bank",
    },
    {
      icon: <Wallet size={20} strokeWidth={1.9} />,
      label: "Toplam Kazanç",
      value: "₺3.240.000",
      delta: "%15,8",
      tone: "dealer",
    },
  ],
  funnelStages: [
    { label: "Toplam Teklif", value: "128", pct: "%100", frac: 1 },
    { label: "Görüntülenen Teklif", value: "68", pct: "%53,1", frac: 0.78 },
    { label: "Görüşme Aşamasındaki", value: "42", pct: "%32,8", frac: 0.58 },
    { label: "Kabul Edilen", value: "32", pct: "%25,0", frac: 0.4 },
    { label: "Kapanan Satış", value: "18", pct: "%14,1", frac: 0.24 },
  ],
  trendLabels: ["1 May", "8 May", "15 May", "22 May", "31 May"],
  offerTrend: [
    15, 19, 18, 25, 26, 28, 27, 22, 20, 25, 26, 23, 31, 36, 32, 25, 25, 25, 31,
  ],
  salesTrend: [
    3, 5, 6, 9, 11, 10, 9, 7, 6, 8, 9, 8, 13, 18, 15, 11, 11, 12, 15,
  ],
  offerLabels: [
    "1 May",
    "",
    "",
    "8 May",
    "",
    "",
    "15 May",
    "",
    "",
    "22 May",
    "",
    "",
    "",
    "",
    "",
    "31 May",
    "",
    "",
    "",
  ],
  offerTicks: ["40", "30", "20", "10", "0"],
  status: [
    { label: "Taslak", count: "22", pct: "%17,2", color: "#94a3b8" },
    {
      label: "Gönderildi",
      count: "48",
      pct: "%37,5",
      color: "var(--color-dealer)",
    },
    { label: "Görüntülendi", count: "26", pct: "%20,3", color: "#16a34a" },
    { label: "Görüşme", count: "16", pct: "%12,5", color: "#f59e0b" },
    { label: "Kabul", count: "10", pct: "%7,8", color: "#84cc16" },
    { label: "Reddedildi", count: "6", pct: "%4,7", color: "#ef4444" },
  ],
  segments: [
    {
      segment: "SUV",
      teklif: 54,
      oran: "%27,8",
      yanit: "2,1 saat",
      kapanan: 15,
      pct: 100,
    },
    {
      segment: "Sedan",
      teklif: 38,
      oran: "%21,9",
      yanit: "2,6 saat",
      kapanan: 11,
      pct: 73,
    },
    {
      segment: "Hatchback",
      teklif: 18,
      oran: "%22,2",
      yanit: "3,1 saat",
      kapanan: 6,
      pct: 40,
    },
    {
      segment: "Ticari",
      teklif: 14,
      oran: "%28,6",
      yanit: "1,8 saat",
      kapanan: 4,
      pct: 27,
    },
    {
      segment: "Diğer",
      teklif: 10,
      oran: "%10,0",
      yanit: "4,2 saat",
      kapanan: 1,
      pct: 9,
    },
  ],
  advisors: [
    {
      ad: "Mehmet Kaya",
      initials: "MK",
      teklif: 34,
      oran: "%29,4",
      kapanan: 10,
      pct: 100,
      tone: "bg-dealer-tint text-dealer-700",
    },
    {
      ad: "Ayşe Yılmaz",
      initials: "AY",
      teklif: 28,
      oran: "%25,0",
      kapanan: 7,
      pct: 70,
      tone: "bg-cust-tint text-cust-600",
    },
    {
      ad: "Burak Demir",
      initials: "BD",
      teklif: 24,
      oran: "%20,8",
      kapanan: 5,
      pct: 50,
      tone: "bg-bank-tint text-bank-700",
    },
    {
      ad: "Selin Arslan",
      initials: "SA",
      teklif: 22,
      oran: "%18,2",
      kapanan: 4,
      pct: 40,
      tone: "bg-warn-tint text-warn",
    },
    {
      ad: "Onur Güngör",
      initials: "OG",
      teklif: 20,
      oran: "%15,0",
      kapanan: 3,
      pct: 30,
      tone: "bg-dealer-tint text-dealer-700",
    },
  ],
  vehicles: [
    { rank: 1, ad: "Volkswagen Tiguan", teklif: "45 teklif", oran: "%25,8" },
    { rank: 2, ad: "Toyota Corolla", teklif: "28 teklif", oran: "%16,1" },
    { rank: 3, ad: "Peugeot 3008", teklif: "22 teklif", oran: "%12,6" },
    { rank: 4, ad: "Honda Civic", teklif: "18 teklif", oran: "%10,3" },
    { rank: 5, ad: "Renault Clio", teklif: "15 teklif", oran: "%8,6" },
  ],
  speedStats: [
    {
      label: "Ortalama Yanıt Süresi",
      value: "2,4 saat",
      delta: "%0,4 daha hızlı",
      icon: <Clock size={20} strokeWidth={1.9} />,
      color: "var(--color-dealer)",
      tint: "bg-dealer-tint text-dealer-700",
    },
    {
      label: "Ortalama Kredi Onay Süresi",
      value: "4,2 saat",
      delta: "%1,1 daha hızlı",
      icon: <FileSignature size={20} strokeWidth={1.9} />,
      color: "#7c3aed",
      tint: "bg-[#f1ebfd] text-[#7c3aed]",
    },
  ],
};
