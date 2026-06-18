/**
 * Dealer commissions — server data extracted from the commissions screen
 * (roadmap 0.1). Served through the fake service layer (src/services/commissions)
 * so the screen consumes it via a hook rather than importing this file directly.
 *
 * KPI values, the monthly chart series and the transactions rows are data; pure
 * UI config (the period pill, headers, class names) stays inline in the screen.
 * Lives in a .tsx file because the KPI icons are authored as JSX, kept verbatim
 * from the original screen.
 */
import { Clock, Coins, Percent, Wallet } from "lucide-react";
import type { ReactNode } from "react";
import { formatPercent, formatTRY } from "@/lib/format";

export interface CommissionKpi {
  delta: string;
  icon: ReactNode;
  label: string;
  positive: boolean;
  tone: "dealer" | "cust" | "warn" | "teal";
  value: string;
}

export interface CommissionMonthBar {
  amount: number;
  label: string;
}

export type CommissionIslemDurum = "Ödendi" | "Bekliyor" | "İşlemde";

export interface CommissionHareket {
  arac: string;
  durum: CommissionIslemDurum;
  id: string;
  komisyon: number;
  musteri: string;
  oran: number;
  tarih: string;
  teklif: number;
}

export interface Commissions {
  kpis: CommissionKpi[];
  monthly: CommissionMonthBar[];
  hareketler: CommissionHareket[];
}

export const COMMISSIONS: Commissions = {
  kpis: [
    {
      icon: <Coins size={20} strokeWidth={1.9} />,
      label: "Bu Ay Kazanılan",
      value: formatTRY(214_500),
      delta: "%18,4",
      positive: true,
      tone: "dealer",
    },
    {
      icon: <Clock size={20} strokeWidth={1.9} />,
      label: "Bekleyen Ödeme",
      value: formatTRY(86_200),
      delta: "%6,2",
      positive: false,
      tone: "warn",
    },
    {
      icon: <Wallet size={20} strokeWidth={1.9} />,
      label: "Bu Yıl Toplam",
      value: formatTRY(1_342_750),
      delta: "%23,1",
      positive: true,
      tone: "teal",
    },
    {
      icon: <Percent size={20} strokeWidth={1.9} />,
      label: "Ortalama Komisyon Oranı",
      value: formatPercent(1.62, 2),
      delta: "%0,12",
      positive: true,
      tone: "cust",
    },
  ],
  // Aylık kazanç (₺) — son 8 ay.
  monthly: [
    { label: "Oca", amount: 132_400 },
    { label: "Şub", amount: 118_900 },
    { label: "Mar", amount: 156_300 },
    { label: "Nis", amount: 171_800 },
    { label: "May", amount: 149_600 },
    { label: "Haz", amount: 188_500 },
    { label: "Tem", amount: 203_700 },
    { label: "Ağu", amount: 214_500 },
  ],
  hareketler: [
    {
      id: "h1",
      tarih: "12.08.2025",
      musteri: "Ahmet Yılmaz",
      arac: "Volkswagen Tiguan",
      teklif: 1_450_000,
      oran: 1.5,
      komisyon: 21_750,
      durum: "Ödendi",
    },
    {
      id: "h2",
      tarih: "09.08.2025",
      musteri: "Selin Arslan",
      arac: "Toyota Corolla",
      teklif: 980_000,
      oran: 1.75,
      komisyon: 17_150,
      durum: "Ödendi",
    },
    {
      id: "h3",
      tarih: "05.08.2025",
      musteri: "Burak Demir",
      arac: "Peugeot 3008",
      teklif: 1_280_000,
      oran: 1.6,
      komisyon: 20_480,
      durum: "İşlemde",
    },
    {
      id: "h4",
      tarih: "01.08.2025",
      musteri: "Ayşe Kara",
      arac: "Renault Clio",
      teklif: 760_000,
      oran: 1.4,
      komisyon: 10_640,
      durum: "Ödendi",
    },
    {
      id: "h5",
      tarih: "28.07.2025",
      musteri: "Hakan Şahin",
      arac: "Honda Civic",
      teklif: 1_150_000,
      oran: 1.65,
      komisyon: 18_975,
      durum: "Bekliyor",
    },
    {
      id: "h6",
      tarih: "24.07.2025",
      musteri: "Yıldız Holding",
      arac: "Hyundai Tucson",
      teklif: 1_620_000,
      oran: 1.5,
      komisyon: 24_300,
      durum: "İşlemde",
    },
    {
      id: "h7",
      tarih: "19.07.2025",
      musteri: "Merve Çelik",
      arac: "Ford Focus",
      teklif: 890_000,
      oran: 1.55,
      komisyon: 13_795,
      durum: "Bekliyor",
    },
    {
      id: "h8",
      tarih: "15.07.2025",
      musteri: "Onur Güngör",
      arac: "Volkswagen Passat",
      teklif: 1_390_000,
      oran: 1.7,
      komisyon: 23_630,
      durum: "Ödendi",
    },
  ],
};
