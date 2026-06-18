/**
 * Dealer home (dashboard) — server data extracted from the dealer ana-sayfa
 * screen (data rollout). Served through the fake service layer
 * (src/services/dealer-home) so the screen consumes it via a hook rather than
 * importing this file directly.
 *
 * KPI values, chart input arrays and lists are data; pure UI config (button
 * labels, class names, the period/date selectors) stays inline in the screen.
 * Taxonomy-derived popular-vehicle titles are computed inline in the screen
 * from the raw `popularRaw` / `popularPct` seed kept here.
 */
import {
  CheckCircle2,
  Clock,
  Coins,
  Eye,
  FileText,
  Gauge,
  MessageSquare,
  Phone,
  Sparkles,
  Star,
  UserPlus,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface DealerKpi {
  delta: string;
  icon: LucideIcon;
  label: string;
  positive: boolean;
  value: string;
}

export interface DealerFunnelStage {
  label: string;
  sub: string;
  value: string;
  pct: string;
  frac: number;
}

export interface DealerSegment {
  color: string;
  frac: number;
  label: string;
  value: string;
}

export interface DealerActivity {
  icon: LucideIcon;
  id: string;
  name: string;
  sub: string;
  text: string;
  time: string;
  tone: string;
}

export interface DealerPopularRaw {
  marka: string;
  model: string;
  pct: number;
  sayisi: number;
}

export interface DealerPerformance {
  delta: string;
  icon: LucideIcon;
  label: string;
  positive: boolean;
  tone: string;
  value: string;
}

export interface DealerHome {
  kpis: DealerKpi[];
  funnel: DealerFunnelStage[];
  segments: DealerSegment[];
  activities: DealerActivity[];
  popularRaw: DealerPopularRaw[];
  popularPct: Record<string, string>;
  performance: DealerPerformance[];
}

export const DEALER_HOME: DealerHome = {
  kpis: [
    {
      icon: Sparkles,
      label: "Yeni Fırsatlar",
      value: "48",
      delta: "%20",
      positive: true,
    },
    {
      icon: FileText,
      label: "Bekleyen Teklifler",
      value: "23",
      delta: "%15",
      positive: true,
    },
    {
      icon: CheckCircle2,
      label: "Kabul Edilen Teklifler",
      value: "12",
      delta: "%33",
      positive: true,
    },
    {
      icon: XCircle,
      label: "Reddedilen Teklifler",
      value: "6",
      delta: "%14",
      positive: false,
    },
    {
      icon: Coins,
      label: "Tahmini Kazanç",
      value: "₺1.285.000",
      delta: "%18",
      positive: true,
    },
  ],
  funnel: [
    {
      label: "Fırsat Havuzu",
      sub: "Uygun müşteriler",
      value: "48",
      pct: "%100",
      frac: 1,
    },
    {
      label: "Teklif Oluşturulan",
      sub: "Teklif gönderilen fırsatlar",
      value: "24",
      pct: "%50",
      frac: 0.78,
    },
    {
      label: "İnceleme Aşamasında",
      sub: "Müşterinin incelediği teklifler",
      value: "14",
      pct: "%29",
      frac: 0.58,
    },
    {
      label: "Görüşme Yapılan",
      sub: "Müşteri ile görüşülen fırsatlar",
      value: "12",
      pct: "%25",
      frac: 0.42,
    },
    {
      label: "Kazanılan",
      sub: "Kapanan satışlar",
      value: "9",
      pct: "%19",
      frac: 0.3,
    },
  ],
  segments: [
    { label: "SUV", value: "%38", frac: 0.38, color: "var(--color-dealer)" },
    { label: "Sedan", value: "%28", frac: 0.28, color: "var(--color-bank)" },
    { label: "Hatchback", value: "%17", frac: 0.17, color: "#f59e0b" },
    { label: "MPV", value: "%9", frac: 0.09, color: "var(--color-cust)" },
    { label: "Diğer", value: "%8", frac: 0.08, color: "#94a3b8" },
  ],
  activities: [
    {
      id: "ahmet",
      icon: CheckCircle2,
      tone: "bg-success-tint text-success",
      name: "Ahmet Yılmaz",
      text: "teklifinizi kabul etti",
      sub: "Volkswagen Tiguan",
      time: "10:24",
    },
    {
      id: "mehmet",
      icon: Eye,
      tone: "bg-dealer-tint text-dealer-700",
      name: "Mehmet Demir",
      text: "teklifinizi görüntüledi",
      sub: "Toyota Corolla · ₺980.000 TL",
      time: "09:48",
    },
    {
      id: "havuz",
      icon: UserPlus,
      tone: "bg-cust-tint text-cust-600",
      name: "Yeni fırsat",
      text: "havuzuna 6 müşteri eklendi",
      sub: "SUV segmenti",
      time: "09:15",
    },
    {
      id: "ayse",
      icon: Phone,
      tone: "bg-warn-tint text-warn",
      name: "Ayşe Kara",
      text: "görüşme kaydı eklendi",
      sub: "İlk görüşme tamamlandı",
      time: "Dün 16:30",
    },
    {
      id: "hakan",
      icon: XCircle,
      tone: "bg-danger-tint text-danger",
      name: "Hakan Şahin",
      text: "teklifinizi reddetti",
      sub: "Peugeot 3008 · ₺1.150.000 TL",
      time: "Dün 14:22",
    },
  ],
  popularRaw: [
    { marka: "volkswagen", model: "tiguan", sayisi: 8, pct: 100 },
    { marka: "toyota", model: "corolla", sayisi: 7, pct: 88 },
    { marka: "peugeot", model: "3008", sayisi: 6, pct: 75 },
    { marka: "renault", model: "clio", sayisi: 5, pct: 63 },
    { marka: "hyundai", model: "i20", sayisi: 4, pct: 50 },
  ],
  popularPct: {
    tiguan: "%22",
    corolla: "%19",
    "3008": "%17",
    clio: "%14",
    i20: "%11",
  },
  performance: [
    {
      icon: MessageSquare,
      tone: "bg-dealer-tint text-dealer-700",
      label: "Teklif Gönderim Oranı",
      value: "%50",
      delta: "%8",
      positive: true,
    },
    {
      icon: Phone,
      tone: "bg-success-tint text-success",
      label: "Görüşme Oranı",
      value: "%37",
      delta: "%5",
      positive: true,
    },
    {
      icon: Clock,
      tone: "bg-warn-tint text-warn",
      label: "Kapanış Oranı",
      value: "%25",
      delta: "%6",
      positive: true,
    },
    {
      icon: Gauge,
      tone: "bg-danger-tint text-danger",
      label: "Ortalama Kapanış Süresi",
      value: "18 gün",
      delta: "%2",
      positive: false,
    },
    {
      icon: Star,
      tone: "bg-dealer-tint text-dealer-700",
      label: "Müşteri Memnuniyeti",
      value: "4.6 / 5",
      delta: "%0,3",
      positive: true,
    },
  ],
};
