/**
 * Dealer-side assigned customers — seed data extracted from the dealer
 * customers screen (rollout). Served via src/services/dealer-customers.
 */
export type DealerCustomerDurum =
  | "Yeni"
  | "Görüşülüyor"
  | "Teklif Gönderildi"
  | "Kazanıldı"
  | "Kayıp";

export interface DealerCustomer {
  avatarTone: string;
  budget: string;
  durum: DealerCustomerDurum;
  id: string;
  initials: string;
  name: string;
  plate: string;
  segment: string;
  skor: number;
  sonEtkilesim: string;
}

export const DEALER_CUSTOMERS: DealerCustomer[] = [
  {
    id: "MST-08412",
    name: "Ahmet Yılmaz",
    initials: "AY",
    avatarTone: "bg-dealer-tint text-dealer-700",
    plate: "34 BKA 412",
    segment: "SUV",
    skor: 92,
    budget: "₺1.8M - ₺2.4M",
    sonEtkilesim: "2025-04-21",
    durum: "Teklif Gönderildi",
  },
  {
    id: "MST-07733",
    name: "Elif Demir",
    initials: "ED",
    avatarTone: "bg-cust-tint text-cust-600",
    plate: "06 TYZ 733",
    segment: "Sedan",
    skor: 88,
    budget: "₺1.5M - ₺2.0M",
    sonEtkilesim: "2025-04-20",
    durum: "Görüşülüyor",
  },
  {
    id: "MST-09187",
    name: "Mehmet Kaya",
    initials: "MK",
    avatarTone: "bg-warn-tint text-warn",
    plate: "35 RNG 187",
    segment: "Hatchback",
    skor: 84,
    budget: "₺1.0M - ₺1.4M",
    sonEtkilesim: "2025-04-19",
    durum: "Kazanıldı",
  },
  {
    id: "MST-06120",
    name: "Zeynep Şahin",
    initials: "ZŞ",
    avatarTone: "bg-bank-tint text-bank-700",
    plate: "16 FCS 120",
    segment: "SUV",
    skor: 79,
    budget: "₺1.2M - ₺1.6M",
    sonEtkilesim: "2025-04-18",
    durum: "Yeni",
  },
  {
    id: "MST-05512",
    name: "Caner Aydın",
    initials: "CA",
    avatarTone: "bg-dealer-tint text-dealer-700",
    plate: "01 CRL 512",
    segment: "Sedan",
    skor: 76,
    budget: "₺1.3M - ₺1.7M",
    sonEtkilesim: "2025-04-16",
    durum: "Görüşülüyor",
  },
  {
    id: "MST-04521",
    name: "Buse Çelik",
    initials: "BÇ",
    avatarTone: "bg-cust-tint text-cust-600",
    plate: "07 İ20 521",
    segment: "Hatchback",
    skor: 71,
    budget: "₺0.9M - ₺1.3M",
    sonEtkilesim: "2025-04-14",
    durum: "Teklif Gönderildi",
  },
  {
    id: "MST-09787",
    name: "Okan Arslan",
    initials: "OA",
    avatarTone: "bg-warn-tint text-warn",
    plate: "34 MBC 787",
    segment: "SUV",
    skor: 64,
    budget: "₺2.4M - ₺3.2M",
    sonEtkilesim: "2025-04-11",
    durum: "Yeni",
  },
  {
    id: "MST-01245",
    name: "Derya Korkmaz",
    initials: "DK",
    avatarTone: "bg-bank-tint text-bank-700",
    plate: "06 AUD 245",
    segment: "Sedan",
    skor: 52,
    budget: "₺2.0M - ₺2.8M",
    sonEtkilesim: "2025-04-07",
    durum: "Kayıp",
  },
];
