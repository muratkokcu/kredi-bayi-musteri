/**
 * Bank customer portfolio — seed data extracted from the portfolio screen
 * (roadmap 0.1). Served through the fake service layer (src/services/customers)
 * so screens consume it via hooks rather than importing this file directly.
 */
export interface Customer {
  avatarTone: string;
  bitis: string;
  bolge: string;
  id: string;
  initials: string;
  kalanGun: number;
  krediNo: string;
  name: string;
  paid: number;
  plate: string;
  segment: string;
  skor: number;
  sonAktivite: string;
  total: number;
  vehicle: string;
  vehicleSub: string;
}

export const CUSTOMERS: Customer[] = [
  {
    id: "1",
    name: "Mehmet Yılmaz",
    plate: "34 ABC 123",
    initials: "MY",
    avatarTone: "bg-bank-tint text-bank-700",
    krediNo: "KRD-2021-001245",
    vehicle: "BMW 3 Serisi",
    vehicleSub: "2021 · 320i",
    paid: 28,
    total: 36,
    bitis: "15.08.2025",
    kalanGun: 62,
    skor: 84,
    bolge: "₺1.5M - ₺2.0M",
    segment: "Sedan",
    sonAktivite: "22.04.2025",
  },
  {
    id: "2",
    name: "Ahmet Şahin",
    plate: "06 DEF 456",
    initials: "AŞ",
    avatarTone: "bg-dealer-tint text-dealer-700",
    krediNo: "KRD-2022-009787",
    vehicle: "Volkswagen Tiguan",
    vehicleSub: "2020 · SUV",
    paid: 22,
    total: 48,
    bitis: "03.09.2025",
    kalanGun: 81,
    skor: 92,
    bolge: "₺1.8M - ₺2.4M",
    segment: "SUV",
    sonAktivite: "21.04.2025",
  },
  {
    id: "3",
    name: "Ayşe Demir",
    plate: "35 GHI 789",
    initials: "AD",
    avatarTone: "bg-cust-tint text-cust-600",
    krediNo: "KRD-2021-004521",
    vehicle: "Renault Clio",
    vehicleSub: "2019 · Hatchback",
    paid: 31,
    total: 36,
    bitis: "28.07.2025",
    kalanGun: 43,
    skor: 67,
    bolge: "₺0.8M - ₺1.2M",
    segment: "Hatchback",
    sonAktivite: "19.04.2025",
  },
  {
    id: "4",
    name: "Can Yılmaz",
    plate: "34 JKL 012",
    initials: "CY",
    avatarTone: "bg-warn-tint text-warn",
    krediNo: "KRD-2023-001190",
    vehicle: "Audi A4",
    vehicleSub: "2022 · Sedan",
    paid: 12,
    total: 60,
    bitis: "11.12.2025",
    kalanGun: 180,
    skor: 58,
    bolge: "₺2.0M - ₺2.8M",
    segment: "Sedan",
    sonAktivite: "18.04.2025",
  },
  {
    id: "5",
    name: "Sıla Öztürk",
    plate: "16 MNO 345",
    initials: "SÖ",
    avatarTone: "bg-bank-tint text-bank-700",
    krediNo: "KRD-2022-007733",
    vehicle: "Toyota Corolla",
    vehicleSub: "2021 · Sedan",
    paid: 26,
    total: 36,
    bitis: "05.08.2025",
    kalanGun: 52,
    skor: 88,
    bolge: "₺1.2M - ₺1.6M",
    segment: "Sedan",
    sonAktivite: "17.04.2025",
  },
  {
    id: "6",
    name: "Okan Korkmaz",
    plate: "07 PRS 678",
    initials: "OK",
    avatarTone: "bg-dealer-tint text-dealer-700",
    krediNo: "KRD-2021-002984",
    vehicle: "Hyundai i20",
    vehicleSub: "2020 · Hatchback",
    paid: 30,
    total: 36,
    bitis: "19.07.2025",
    kalanGun: 34,
    skor: 73,
    bolge: "₺0.9M - ₺1.3M",
    segment: "Hatchback",
    sonAktivite: "16.04.2025",
  },
  {
    id: "7",
    name: "Yasemin Aksoy",
    plate: "34 TUV 901",
    initials: "YA",
    avatarTone: "bg-cust-tint text-cust-600",
    krediNo: "KRD-2023-005512",
    vehicle: "Mercedes C200",
    vehicleSub: "2022 · Sedan",
    paid: 9,
    total: 48,
    bitis: "02.02.2026",
    kalanGun: 232,
    skor: 49,
    bolge: "₺2.4M - ₺3.2M",
    segment: "Sedan",
    sonAktivite: "15.04.2025",
  },
  {
    id: "8",
    name: "Burak Çelik",
    plate: "01 XYZ 234",
    initials: "BÇ",
    avatarTone: "bg-warn-tint text-warn",
    krediNo: "KRD-2022-006120",
    vehicle: "Ford Kuga",
    vehicleSub: "2021 · SUV",
    paid: 24,
    total: 48,
    bitis: "27.08.2025",
    kalanGun: 73,
    skor: 81,
    bolge: "₺1.6M - ₺2.2M",
    segment: "SUV",
    sonAktivite: "14.04.2025",
  },
];
