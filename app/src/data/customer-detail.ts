import {
  CalendarClock,
  Car,
  CreditCard,
  History,
  Target,
} from "lucide-react";

/**
 * Bank single-customer detail — record data extracted from the customer detail
 * screen (roadmap 0.1). Served through the fake service layer
 * (src/services/customer-detail) so the screen consumes it via a hook rather
 * than importing this file directly. Lucide icon refs are kept as TS values.
 */

export interface OzetAlan {
  label: string;
  value: string;
}

export interface KeyVal {
  label: string;
  strong?: boolean;
  sub?: string;
  value: string;
}

export interface SkorFaktor {
  icon: typeof Car;
  label: string;
  max: number;
  score: number;
}

export interface Interaction {
  bayi: string;
  durum: string;
  id: string;
  islem: string;
  tarih: string;
  tone: "success" | "warn" | "danger" | "dealer";
}

export interface TimelineEvent {
  date: string;
  desc: string;
  id: string;
  title: string;
}

export interface CustomerDetail {
  aracBilgi: KeyVal[];
  etkilesimler: Interaction[];
  initials: string;
  krediBilgi: KeyVal[];
  musteriKodu: string;
  notMeta: string;
  notText: string;
  ozetAlanlar: OzetAlan[];
  score: number;
  scoreLabel: string;
  skorFaktorler: SkorFaktor[];
  timeline: TimelineEvent[];
}

export const CUSTOMER_DETAIL: CustomerDetail = {
  score: 85,
  musteriKodu: "Müşteri-000124",
  initials: "ME",
  scoreLabel: "Yüksek Skor",
  notText:
    "Müşteri SUV segmentinde araç tercih ediyor. Bütçe aralığı 1 - 1.5 M TL. Önce 2 teklif almış, şu an değerlendirme aşamasında.",
  notMeta: "Son güncelleme: 22.04.2025 10:22 - Ahmet Kaya",
  ozetAlanlar: [
    { label: "Kredi No", value: "KRD-2021-001245" },
    { label: "Müşteri Kodu", value: "MUS-000124" },
    { label: "Bölge", value: "İstanbul Anadolu" },
    { label: "Kredi Başlangıç", value: "15.08.2021" },
  ],
  aracBilgi: [
    { label: "Araç Segmenti", value: "SUV" },
    { label: "Model Yılı", value: "2021" },
    { label: "Yakıt Tipi", value: "Benzin" },
    { label: "Vites", value: "Otomatik" },
    { label: "Araç Yaşı", value: "3 yıl 8 ay" },
  ],
  krediBilgi: [
    { label: "Kalan Borç", value: "₺612.750", strong: true },
    { label: "Aylık Taksit", value: "₺18.450" },
    { label: "Kalan Taksit", value: "12 / 36" },
    { label: "Kredi Bitiş Tarihi", value: "15.08.2025", sub: "92 gün kaldı" },
    { label: "Bütçe Aralığı (₺)", value: "1.000.000 - 1.500.000" },
  ],
  skorFaktorler: [
    {
      icon: CalendarClock,
      label: "Kredi Bitişine Kalan Süre",
      score: 25,
      max: 25,
    },
    { icon: CreditCard, label: "Ödeme Performansı", score: 20, max: 25 },
    { icon: Car, label: "Araç Yaşı", score: 15, max: 20 },
    { icon: Target, label: "Segment Talebi", score: 15, max: 15 },
    { icon: History, label: "Teklif Geçmişi", score: 10, max: 15 },
  ],
  etkilesimler: [
    {
      id: "1",
      bayi: "Doğuş Oto",
      tarih: "20.04.2025 14:30",
      islem: "Teklif Gönderildi",
      durum: "Bekliyor",
      tone: "warn",
    },
    {
      id: "2",
      bayi: "Borusan Otomotiv",
      tarih: "18.04.2025 11:15",
      islem: "Araç İncelendi",
      durum: "Görüldü",
      tone: "dealer",
    },
    {
      id: "3",
      bayi: "Otokoç",
      tarih: "15.04.2025 16:45",
      islem: "Teklif Gönderildi",
      durum: "Reddedildi",
      tone: "danger",
    },
    {
      id: "4",
      bayi: "Groupe PSA",
      tarih: "01.04.2025 09:20",
      islem: "Profil Görüntülendi",
      durum: "Tamamlandı",
      tone: "success",
    },
  ],
  timeline: [
    {
      id: "1",
      date: "15.08.2021",
      title: "Kredi Başlangıcı",
      desc: "₺720.000 - 36 Ay",
    },
    {
      id: "2",
      date: "10.03.2023",
      title: "Araç Değerleme",
      desc: "Güncel piyasa değeri ₺1.150.000",
    },
    {
      id: "3",
      date: "20.04.2025",
      title: "Yeni Teklif Alındı",
      desc: "Doğuş Oto tarafından teklif gönderildi",
    },
  ],
};
