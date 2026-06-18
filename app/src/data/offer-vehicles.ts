/**
 * Selectable vehicles for the dealer offer-creation wizard (step 1) — seed data
 * extracted from the teklif-olustur screen (rollout). Served via
 * src/services/offer-vehicles. Built from the real taxonomy: marka + model + a
 * real variant code.
 */
export interface OfferVehicle {
  fuel: string;
  id: string;
  km: string;
  marka: string;
  model: string;
  price: string;
  priceNum: number;
  renk: string;
  segment: string;
  stokKodu: string;
  transmission: string;
  variant: string;
  year: string;
}

export const OFFER_VEHICLES: OfferVehicle[] = [
  {
    id: "ka-2020-1256",
    marka: "Volkswagen",
    model: "Tiguan",
    variant: "1.5 TSI e-TSI Life",
    year: "2020",
    km: "45.000 km",
    fuel: "Benzin",
    transmission: "Otomatik",
    stokKodu: "KA-2020-1256",
    renk: "Beyaz",
    segment: "SUV",
    price: "₺1.250.000",
    priceNum: 1_250_000,
  },
  {
    id: "ka-2020-0897",
    marka: "Toyota",
    model: "Corolla",
    variant: "1.2 Turbo Vision",
    year: "2020",
    km: "38.000 km",
    fuel: "Benzin",
    transmission: "Otomatik",
    stokKodu: "KA-2020-0897",
    renk: "Gri",
    segment: "Sedan",
    price: "₺980.000",
    priceNum: 980_000,
  },
  {
    id: "ka-2021-0432",
    marka: "Peugeot",
    model: "3008",
    variant: "1.2 PureTech Active",
    year: "2021",
    km: "52.000 km",
    fuel: "Benzin",
    transmission: "Otomatik",
    stokKodu: "KA-2021-0432",
    renk: "Siyah",
    segment: "SUV",
    price: "₺1.180.000",
    priceNum: 1_180_000,
  },
  {
    id: "ka-2019-0781",
    marka: "Renault",
    model: "Clio",
    variant: "1.0 TCe Joy",
    year: "2019",
    km: "60.000 km",
    fuel: "Benzin",
    transmission: "Manuel",
    stokKodu: "KA-2019-0781",
    renk: "Mavi",
    segment: "Hatchback",
    price: "₺650.000",
    priceNum: 650_000,
  },
];
