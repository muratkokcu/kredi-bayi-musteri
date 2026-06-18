/**
 * Customer-side received offers — seed data extracted from the customer
 * "Tekliflerim" screen (rollout). Served via src/services/my-offers.
 */
export interface OfferSpecs {
  km: string;
  vites: string;
  yakit: string;
  yil: string;
}

export interface Offer {
  aylik: string;
  bayi: string;
  bayiKisa: string;
  durum?: "yeni" | "goruntulenen";
  enUygun?: boolean;
  faiz: string;
  geriOdeme: string;
  id: string;
  markaSlug: string;
  modelSlug: string;
  specs: OfferSpecs;
  toplam: string;
  varyantIndex: number;
  vurgu?: boolean;
}

export const OFFERS: Offer[] = [
  {
    id: "tiguan-kaya",
    markaSlug: "volkswagen",
    modelSlug: "tiguan",
    varyantIndex: 0,
    bayi: "Kaya Otomotiv",
    bayiKisa: "KAYA",
    specs: { yil: "2023", km: "18.500 km", yakit: "Benzin", vites: "Otomatik" },
    faiz: "%1,89",
    aylik: "₺16.250",
    toplam: "₺1.165.000",
    geriOdeme: "₺975.000",
    durum: "yeni",
    enUygun: true,
  },
  {
    id: "corolla-zirve",
    markaSlug: "toyota",
    modelSlug: "corolla",
    varyantIndex: 1,
    bayi: "Zirve Motors",
    bayiKisa: "ZIRVE",
    specs: { yil: "2022", km: "32.000 km", yakit: "Hibrit", vites: "Otomatik" },
    faiz: "%2,09",
    aylik: "₺16.750",
    toplam: "₺1.005.000",
    geriOdeme: "₺1.005.000",
    durum: "yeni",
  },
  {
    id: "3008-yildiz",
    markaSlug: "peugeot",
    modelSlug: "3008",
    varyantIndex: 1,
    bayi: "Yıldız Oto",
    bayiKisa: "YILDIZ",
    specs: { yil: "2023", km: "21.300 km", yakit: "Hibrit", vites: "Otomatik" },
    faiz: "%2,19",
    aylik: "₺17.100",
    toplam: "₺1.195.000",
    geriOdeme: "₺1.026.000",
    durum: "goruntulenen",
  },
  {
    id: "clio-max",
    markaSlug: "renault",
    modelSlug: "clio",
    varyantIndex: 0,
    bayi: "Max Otomotiv",
    bayiKisa: "MAX",
    specs: { yil: "2022", km: "27.800 km", yakit: "Benzin", vites: "Manuel" },
    faiz: "%2,29",
    aylik: "₺15.450",
    toplam: "₺1.075.000",
    geriOdeme: "₺927.000",
    durum: "goruntulenen",
    vurgu: true,
  },
];
