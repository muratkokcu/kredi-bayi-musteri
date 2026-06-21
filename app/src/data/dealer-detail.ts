/**
 * Bank dealer detail — composite record extracted from the dealer detail screen
 * (data rollout). Served through the fake service layer (src/services/dealer-detail)
 * so the screen consumes it via a hook rather than importing this file directly.
 */
import {
  Activity,
  Banknote,
  Heart,
  Repeat,
  type Store,
  Zap,
} from "lucide-react";

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
  icon: typeof Store;
  label: string;
  max: number;
  score: number;
}

export interface SonTeklif {
  arac: string;
  durum: string;
  id: string;
  musteri: string;
  tarih: string;
  tone: "success" | "warn" | "danger";
  tutar: number;
}

export interface DealerDetail {
  bayiAdi: string;
  bayiSkor: number;
  ozetAlanlar: OzetAlan[];
  iletisimSol: KeyVal[];
  iletisimSag: KeyVal[];
  skorFaktorler: SkorFaktor[];
  sonTeklifler: SonTeklif[];
}

export const DEALER_DETAIL: DealerDetail = {
  bayiAdi: "Bayi Otomotiv",
  bayiSkor: 88,
  ozetAlanlar: [
    { label: "Bayi Kodu", value: "BYİ-000341" },
    { label: "Bölge", value: "İstanbul Anadolu" },
    { label: "Yetkili", value: "Mehmet Kaya" },
    { label: "Katılım", value: "12.03.2021" },
  ],
  iletisimSol: [
    { label: "Yetkili", value: "Mehmet Kaya" },
    { label: "Telefon", value: "+90 216 442 18 90" },
    { label: "E-posta", value: "info@bayi.com.tr" },
    {
      label: "Adres",
      value: "Ataşehir, İstanbul",
      sub: "Barbaros Mah. Halk Cd. No:14",
    },
  ],
  iletisimSag: [
    { label: "Vergi No", value: "4820157963" },
    { label: "Aktif Müşteri", value: "1.842" },
    { label: "Stok Aracı", value: "126 adet" },
    {
      label: "Sözleşme Bitiş",
      value: "31.12.2026",
      sub: "196 gün kaldı",
    },
  ],
  skorFaktorler: [
    { icon: Repeat, label: "Teklif Dönüşümü", score: 23, max: 25 },
    { icon: Zap, label: "Yanıt Hızı", score: 21, max: 25 },
    { icon: Heart, label: "Müşteri Memnuniyeti", score: 18, max: 20 },
    { icon: Banknote, label: "İşlem Hacmi", score: 16, max: 20 },
    { icon: Activity, label: "Aktiflik", score: 10, max: 10 },
  ],
  sonTeklifler: [
    {
      id: "1",
      musteri: "Ayşe Demir",
      arac: "Volkswagen Tiguan 1.5 TSI",
      tutar: 1_285_000,
      tarih: "16.06.2025",
      durum: "Kabul Edildi",
      tone: "success",
    },
    {
      id: "2",
      musteri: "Burak Yılmaz",
      arac: "Toyota Corolla 1.8 Hybrid",
      tutar: 1_040_000,
      tarih: "15.06.2025",
      durum: "Bekliyor",
      tone: "warn",
    },
    {
      id: "3",
      musteri: "Elif Kaya",
      arac: "Renault Megane E-Tech",
      tutar: 1_460_000,
      tarih: "13.06.2025",
      durum: "Kabul Edildi",
      tone: "success",
    },
    {
      id: "4",
      musteri: "Mert Aydın",
      arac: "Ford Focus 1.5 EcoBlue",
      tutar: 925_000,
      tarih: "11.06.2025",
      durum: "Reddedildi",
      tone: "danger",
    },
    {
      id: "5",
      musteri: "Zeynep Şahin",
      arac: "Hyundai Tucson 1.6 T-GDI",
      tutar: 1_390_000,
      tarih: "09.06.2025",
      durum: "Bekliyor",
      tone: "warn",
    },
  ],
};
