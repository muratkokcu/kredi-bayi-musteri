/**
 * Dealer-side vehicle inventory — seed data extracted from the stock screen
 * (rollout). Served via src/services/stock.
 */
export type StockStatus = "Stokta" | "Rezerve" | "Satıldı";

export interface StockVehicle {
  durum: StockStatus;
  fiyat: string;
  id: string;
  km: string;
  marka: string;
  markaSlug: string;
  model: string;
  plaka: string;
  segment: string;
  varyant: string;
  yakit: string;
  yil: number;
}

export const STOCK: StockVehicle[] = [
  {
    id: "1",
    markaSlug: "volkswagen",
    marka: "Volkswagen",
    model: "Tiguan",
    varyant: "1.5 TSI e-TSI Life DSG",
    plaka: "34 ABC 123",
    segment: "SUV",
    fiyat: "₺1.250.000",
    yil: 2020,
    km: "45.000 km",
    yakit: "Benzin",
    durum: "Stokta",
  },
  {
    id: "2",
    markaSlug: "toyota",
    marka: "Toyota",
    model: "Corolla",
    varyant: "1.8 Vision",
    plaka: "34 DEF 456",
    segment: "Sedan",
    fiyat: "₺980.000",
    yil: 2020,
    km: "38.000 km",
    yakit: "Hibrit",
    durum: "Stokta",
  },
  {
    id: "3",
    markaSlug: "peugeot",
    marka: "Peugeot",
    model: "3008",
    varyant: "1.5 BlueHDi Active",
    plaka: "34 GHI 789",
    segment: "SUV",
    fiyat: "₺1.180.000",
    yil: 2021,
    km: "52.000 km",
    yakit: "Dizel",
    durum: "Stokta",
  },
  {
    id: "4",
    markaSlug: "renault",
    marka: "Renault",
    model: "Clio",
    varyant: "1.0 TCe Joy",
    plaka: "34 JKL 012",
    segment: "Hatchback",
    fiyat: "₺650.000",
    yil: 2019,
    km: "61.000 km",
    yakit: "Benzin",
    durum: "Rezerve",
  },
  {
    id: "5",
    markaSlug: "honda",
    marka: "Honda",
    model: "Civic",
    varyant: "1.6 i-VTEC Eco",
    plaka: "34 MNO 345",
    segment: "Sedan",
    fiyat: "₺890.000",
    yil: 2018,
    km: "72.000 km",
    yakit: "Benzin",
    durum: "Stokta",
  },
  {
    id: "6",
    markaSlug: "nissan",
    marka: "Nissan",
    model: "Qashqai",
    varyant: "1.3 DIG-T SkyPack",
    plaka: "34 PRS 678",
    segment: "SUV",
    fiyat: "₺750.000",
    yil: 2017,
    km: "85.000 km",
    yakit: "Benzin",
    durum: "Satıldı",
  },
  {
    id: "7",
    markaSlug: "skoda",
    marka: "Skoda",
    model: "Octavia",
    varyant: "1.5 TSI Premium",
    plaka: "34 TUV 901",
    segment: "Sedan",
    fiyat: "₺920.000",
    yil: 2020,
    km: "49.000 km",
    yakit: "Benzin",
    durum: "Stokta",
  },
  {
    id: "8",
    markaSlug: "hyundai",
    marka: "Hyundai",
    model: "i20",
    varyant: "1.4 MPI Jump",
    plaka: "34 XYZ 234",
    segment: "Hatchback",
    fiyat: "₺620.000",
    yil: 2019,
    km: "58.000 km",
    yakit: "Benzin",
    durum: "Stokta",
  },
];
