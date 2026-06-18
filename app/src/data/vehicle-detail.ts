import {
  BarChart3,
  Copy,
  Download,
  ExternalLink,
  Eye,
  Heart,
  MessageSquareText,
  PackageMinus,
  Share2,
  Tag,
  Trash2,
} from "lucide-react";

/**
 * Dealer single-vehicle detail — record data extracted from the vehicle detail
 * screen (roadmap 0.1). Served through the fake service layer
 * (src/services/vehicle-detail) so the screen consumes it via a hook rather
 * than importing this file directly. Lucide icon refs are kept as TS values;
 * taxonomy getModel-derived presentation stays inline in the screen.
 */

export interface SpecRow {
  label: string;
  value: string;
}

export interface IdentRow {
  label: string;
  value: string;
}

export interface PriceRow {
  label: string;
  tone?: "success";
  value: string;
}

export interface StockRow {
  label: string;
  value: string;
}

export interface SegRow {
  label: string;
  value: string;
}

export interface QuickStat {
  icon: typeof Eye;
  label: string;
  sub: string;
  value: string;
  valueTone?: "warn";
}

export interface ActionItem {
  danger?: boolean;
  icon: typeof Tag;
  label: string;
}

export interface VehicleDetail {
  actions: ActionItem[];
  chips: string[];
  identLeft: IdentRow[];
  identRight: IdentRow[];
  priceRows: PriceRow[];
  quickStats: QuickStat[];
  segRows: SegRow[];
  specLeft: SpecRow[];
  specRight: SpecRow[];
  stockRows: StockRow[];
  tabs: string[];
}

export const VEHICLE_DETAIL: VehicleDetail = {
  chips: ["2020", "SUV", "Otomatik", "Benzin", "Beyaz"],
  specLeft: [
    { label: "Marka / Model", value: "Volkswagen Tiguan" },
    { label: "Versiyon", value: "1.5 TSI e-TSI Life DSG" },
    { label: "Model Yılı", value: "2020" },
    { label: "Yakıt Tipi", value: "Benzin" },
    { label: "Vites", value: "Otomatik" },
    { label: "Çekiş", value: "Önden Çekiş" },
    { label: "Motor Hacmi", value: "1.498 cc" },
    { label: "Motor Gücü", value: "150 PS" },
    { label: "Tork", value: "250 Nm" },
  ],
  specRight: [
    { label: "Kasa Tipi", value: "SUV" },
    { label: "Kapı Sayısı", value: "5" },
    { label: "Koltuk Sayısı", value: "5" },
    { label: "Renk (Dış)", value: "Beyaz" },
    { label: "Renk (İç)", value: "Siyah" },
    { label: "Kilometre", value: "45.000 km" },
    { label: "Garanti Durumu", value: "Garantisi Devam Ediyor" },
    { label: "Garanti Bitiş", value: "15.06.2025" },
    { label: "Muayene Bitiş", value: "10.06.2026" },
  ],
  identLeft: [
    { label: "Stok Kodu", value: "KA-2020-1256" },
    { label: "Plaka", value: "34 ABC 123" },
    { label: "Şasi No", value: "WVGZZZ5NZLW123456" },
    { label: "Motor No", value: "DADA123456" },
  ],
  identRight: [
    { label: "Kilometre", value: "45.000 km" },
    { label: "İlk Tescil Tarihi", value: "10.03.2020" },
    { label: "Renk", value: "Beyaz" },
    { label: "Araç Durumu", value: "Hasarsız" },
  ],
  tabs: [
    "Genel Bilgiler",
    "Donanım & Özellikler",
    "Hasar & Ekspertiz",
    "Belgeler",
    "Fiyat Geçmişi",
    "Segment Eşleşmesi",
  ],
  priceRows: [
    { label: "Maliyet", value: "₺1.050.000" },
    { label: "Kär", value: "₺200.000", tone: "success" },
    { label: "Kär Marjı", value: "%16,0" },
  ],
  stockRows: [
    { label: "Stokta Kalma Süresi", value: "12 gün" },
    { label: "Stok Giriş Tarihi", value: "10.05.2025" },
  ],
  segRows: [
    { label: "SUV Segmenti", value: "₺1,0M - ₺1,5M" },
    { label: "Bütçe Aralığı", value: "30 - 55" },
    { label: "Hedef Müşteri Yaş Aralığı", value: "55" },
    { label: "Kredi Bitiş Süresi", value: "0 - 90 gün" },
  ],
  quickStats: [
    { icon: Eye, label: "Görüntülenme", value: "24", sub: "Son 7 gün" },
    {
      icon: MessageSquareText,
      label: "Teklif Sayısı",
      value: "3",
      sub: "Toplam",
    },
    { icon: Heart, label: "Favoriye Ekleme", value: "7", sub: "Toplam" },
    {
      icon: BarChart3,
      label: "Rekabet Durumu",
      value: "Orta",
      sub: "Piyasada 12 adet benzer araç",
      valueTone: "warn",
    },
    {
      icon: Tag,
      label: "Ortalama Piyasa Fiyatı",
      value: "₺1.210.000",
      sub: "Son 30 gün",
    },
  ],
  actions: [
    { icon: Tag, label: "Fiyatı Düzenle" },
    { icon: PackageMinus, label: "Stoktan Çıkar" },
    { icon: Copy, label: "Kopyala" },
    { icon: ExternalLink, label: "Sahibinden" },
    { icon: Share2, label: "Paylaş" },
    { icon: Download, label: "Rapor İndir" },
    { icon: Trash2, label: "Aracı Sil", danger: true },
  ],
};
