import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  Car,
  Flame,
  Fuel,
  Hash,
  Mail,
  MessageSquare,
  Phone,
  Route,
  ShieldCheck,
  Target,
  Wallet,
} from "lucide-react";

/**
 * Dealer single-customer detail — record data extracted from the dealer customer
 * detail screen (roadmap 0.1). Served through the fake service layer
 * (src/services/dealer-customer-detail) so the screen consumes it via a hook
 * rather than importing this file directly. Lucide icon refs are kept as TS
 * values. Pure-derived/presentation values (taxonomy vehicle name and the
 * computeLoan financing scenarios) stay inline in the screen, not here.
 */

export interface FactRow {
  icon: LucideIcon;
  label: string;
  sub?: string;
  subTone?: "muted" | "danger";
  value: string;
}

export interface DetailRow {
  label: string;
  strong?: boolean;
  value: string;
}

export interface ScoreFactor {
  label: string;
  value: number;
}

export interface NeedRow {
  icon: LucideIcon;
  label: string;
  tone: "dealer" | "success" | "cust" | "warn";
  value: string;
}

export interface SegmentRow {
  araclar: string;
  id: string;
  label: string;
  tone: "success" | "dealer" | "warn";
  uygunluk: string;
}

export interface Interaction {
  desc: string;
  icon: LucideIcon;
  id: string;
  title: string;
  tone: string;
}

export interface ExpectationRow {
  label: string;
  value: string;
}

export interface ContactEvent {
  channel: LucideIcon;
  date: string;
  desc: string;
  id: string;
  outcome: string;
  tone: "success" | "dealer" | "warn";
}

export interface QuickContact {
  icon: LucideIcon;
  id: string;
  label: string;
}

export interface DealerCustomerDetail {
  aracKredi: DetailRow[];
  beklentiler: ExpectationRow[];
  etkilesimler: Interaction[];
  hizliIletisim: QuickContact[];
  ihtiyacAnalizi: NeedRow[];
  iletisimGecmisi: ContactEvent[];
  musteriOzet: DetailRow[];
  quickFacts: FactRow[];
  renewalScore: number;
  segmentler: SegmentRow[];
  skorFaktorler: ScoreFactor[];
}

export const DEALER_CUSTOMER_DETAIL: DealerCustomerDetail = {
  renewalScore: 92,
  quickFacts: [
    {
      icon: Calendar,
      label: "Kredi Bitiş Tarihi",
      value: "22.05.2025",
      sub: "30 gün kaldı",
      subTone: "danger",
    },
    { icon: Hash, label: "Kalan Borç", value: "8 / 36" },
    { icon: Wallet, label: "Kalan Taksit", value: "36" },
    { icon: Target, label: "Bütçe Aralığı", value: "₺1,2M - ₺1,5M" },
    { icon: Car, label: "Segment", value: "SUV" },
  ],
  musteriOzet: [
    { label: "Ad Soyad", value: "A*** Y******" },
    { label: "Plaka", value: "34 *** 123" },
    { label: "Yaş", value: "34" },
    { label: "İl / İlçe", value: "İstanbul / Kadıköy" },
    { label: "Meslek", value: "Özel Sektör" },
    { label: "Medeni Durum", value: "Evli" },
    { label: "Çocuk", value: "1" },
    { label: "Müşteri Tipi", value: "Bireysel" },
  ],
  aracKredi: [
    { label: "Yıl", value: "2020" },
    { label: "Yakıt Tipi", value: "Dizel" },
    { label: "Vites", value: "Otomatik" },
    { label: "Kredi Tutarı", value: "₺980.000" },
    { label: "Kalan Borç", value: "₺245.000", strong: true },
    { label: "Faiz Oranı", value: "%2,15" },
    { label: "Kredi Bitiş Tarihi", value: "22.05.2025" },
    { label: "Kalan Taksit", value: "8 / 36" },
    { label: "Aylık Taksit", value: "₺28.750" },
  ],
  skorFaktorler: [
    { label: "Kredi Bitiş Yakınlığı", value: 25 },
    { label: "Ödeme Performansı", value: 25 },
    { label: "Araç Segment Uygunluğu", value: 22 },
    { label: "Bütçe Uygunluğu", value: 12 },
    { label: "Müşteri Sadakati", value: 8 },
  ],
  ihtiyacAnalizi: [
    { icon: Car, label: "Araç Tipi Tercihi", value: "SUV", tone: "success" },
    {
      icon: Route,
      label: "Kullanım Amacı",
      value: "Aile & Günlük Kullanım",
      tone: "dealer",
    },
    {
      icon: ShieldCheck,
      label: "Öncelikli Özellikler",
      value: "Güvenlik, Konfor, Bagaj Hacmi",
      tone: "cust",
    },
    {
      icon: Fuel,
      label: "Yakıt Tercihi",
      value: "Dizel / Hibrit",
      tone: "dealer",
    },
    {
      icon: Wallet,
      label: "Tahmini Bütçe",
      value: "₺1,2M - ₺1,5M",
      tone: "success",
    },
    { icon: Flame, label: "Takip Seviyesi", value: "Sıcak", tone: "warn" },
  ],
  segmentler: [
    {
      id: "suv",
      label: "SUV",
      araclar: "Volkswagen Tiguan, Nissan Qashqai, Hyundai Tucson",
      uygunluk: "Çok Uygun",
      tone: "success",
    },
    {
      id: "c-suv",
      label: "C-SUV",
      araclar: "Peugeot 3008, Kia Sportage, Toyota RAV4",
      uygunluk: "Uygun",
      tone: "dealer",
    },
    {
      id: "d-sedan",
      label: "D-Sedan",
      araclar: "Skoda Superb, Toyota Camry",
      uygunluk: "Orta",
      tone: "warn",
    },
  ],
  etkilesimler: [
    {
      id: "telefon",
      icon: Phone,
      title: "Telefon",
      desc: "Arama yapıldı",
      tone: "bg-success-tint text-success",
    },
    {
      id: "eposta",
      icon: Mail,
      title: "E-posta",
      desc: "Kampanya e-postası gönderildi",
      tone: "bg-dealer-tint text-dealer-700",
    },
    {
      id: "sms",
      icon: MessageSquare,
      title: "SMS",
      desc: "Kampanya SMS'i gönderildi",
      tone: "bg-cust-tint text-cust-600",
    },
  ],
  beklentiler: [
    { label: "Aylık Ödeme Hedefi", value: "₺25.000 - ₺30.000" },
    { label: "Peşinat Kapasitesi", value: "₺300.000" },
    { label: "Tercih Edilen Vade", value: "48 Ay" },
    { label: "Karar Süresi", value: "2-3 hafta içinde" },
    { label: "Takas Aracı", value: "Var (2020 Tiguan)" },
  ],
  iletisimGecmisi: [
    {
      id: "1",
      channel: Phone,
      date: "12.05.2025 14:30",
      desc: "Yenileme fırsatı hakkında bilgilendirme yapıldı, ilgili.",
      outcome: "Olumlu",
      tone: "success",
    },
    {
      id: "2",
      channel: Mail,
      date: "08.05.2025 09:10",
      desc: "SUV segment kampanya e-postası gönderildi.",
      outcome: "Açıldı",
      tone: "dealer",
    },
    {
      id: "3",
      channel: MessageSquare,
      date: "02.05.2025 17:45",
      desc: "Taksit hatırlatma ve kampanya SMS'i iletildi.",
      outcome: "İletildi",
      tone: "dealer",
    },
    {
      id: "4",
      channel: Phone,
      date: "24.04.2025 11:20",
      desc: "Aranamadı, sesli mesaj bırakıldı.",
      outcome: "Ulaşılamadı",
      tone: "warn",
    },
  ],
  hizliIletisim: [
    { id: "ara", icon: Phone, label: "Ara" },
    { id: "eposta", icon: Mail, label: "E-posta" },
    { id: "sms", icon: MessageSquare, label: "SMS" },
  ],
};
