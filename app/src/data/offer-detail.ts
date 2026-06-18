import {
  BadgeCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

/**
 * Customer single-offer detail — record data extracted from the offer detail
 * screen (roadmap 0.1). Served through the fake service layer
 * (src/services/offer-detail) so the screen consumes it via a hook rather than
 * importing this file directly. Taxonomy-derived vehicle name/variant and
 * computeLoan-derived figures stay inline on the screen. Lucide icon refs are
 * kept as TS values.
 */

export interface KeyStat {
  accent?: boolean;
  label: string;
  value: string;
}

export interface OzetSatir {
  label: string;
  value: string;
}

export interface OdemeSatir {
  ay: string;
  id: string;
  tarih: string;
  tutar: string;
}

export interface OfferDetail {
  aracSpec: string;
  badgeIcon: typeof BadgeCheck;
  badgeLabel: string;
  bayiAdi: string;
  bayiPuan: string;
  countdownCardDesc: string;
  countdownCardIcon: typeof CheckCircle2;
  countdownCardTitle: string;
  countdownClockIcon: typeof Clock;
  countdownLabel: string;
  countdownValue: string;
  infoCardButton: string;
  infoCardIcon: typeof Sparkles;
  infoCardText: string;
  keyStats: KeyStat[];
  odemePlani: OdemeSatir[];
  odemePlaniHint: string;
  teklifOzeti: OzetSatir[];
}

export const OFFER_DETAIL: OfferDetail = {
  aracSpec: "2022 · SUV · Otomatik · Benzin",
  badgeIcon: BadgeCheck,
  badgeLabel: "En Uygun Teklif",
  bayiAdi: "Kaya Otomotiv",
  bayiPuan: "4.8",
  keyStats: [
    { label: "Faiz Oranı", value: "%1,89" },
    { label: "Aylık Taksit", value: "₺16.250" },
    { label: "Toplam Teklif Tutarı", value: "₺975.000" },
    { label: "Onay Şansı", value: "Yüksek", accent: true },
  ],
  infoCardIcon: Sparkles,
  infoCardText:
    "Bu teklif, kredi profiline göre en uygun olarak işaretlendi.",
  infoCardButton: "Neden En Uygun?",
  teklifOzeti: [
    { label: "Kredi Tutarı", value: "₺800.000" },
    { label: "Finansman", value: "Taşıt Kredisi" },
    { label: "Vade", value: "48 Ay" },
    { label: "Faiz Oranı", value: "%1,89" },
    { label: "Aylık Taksit", value: "₺16.250" },
    { label: "Toplam Geri Ödeme", value: "₺975.000" },
    { label: "Tahsis Ücreti", value: "₺9.500" },
    { label: "İlk Taksit Tarihi", value: "16 Haziran 2026" },
  ],
  odemePlaniHint: "İlk 6 Ay",
  odemePlani: [
    { id: "ay1", ay: "1. Ay", tarih: "16 Tem 2026", tutar: "₺16.250" },
    { id: "ay2", ay: "2. Ay", tarih: "16 Ağu 2026", tutar: "₺16.250" },
    { id: "ay3", ay: "3. Ay", tarih: "16 Eyl 2026", tutar: "₺16.250" },
    { id: "ay4", ay: "4. Ay", tarih: "16 Eki 2026", tutar: "₺16.250" },
    { id: "ay5", ay: "5. Ay", tarih: "16 Kas 2026", tutar: "₺16.250" },
    { id: "ay6", ay: "6. Ay", tarih: "16 Ara 2026", tutar: "₺16.250" },
  ],
  countdownCardIcon: CheckCircle2,
  countdownCardTitle: "Erken başvuru avantajı",
  countdownCardDesc:
    "Kredinin yenileme döneminde başvur, ek faiz indirimi kazan.",
  countdownClockIcon: Clock,
  countdownValue: "03:18:42",
  countdownLabel: "Süre kaldı",
};
