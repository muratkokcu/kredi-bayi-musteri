/**
 * Customer vehicle preferences (araç tercihlerim) — server data extracted from
 * the customer arac-tercihlerim screen (data rollout). Served through the fake
 * service layer (src/services/vehicle-preferences) so the screen consumes it via
 * a hook rather than importing this file directly.
 *
 * The saved searches and the personalized recommended-vehicle records are data.
 * Interactive criteria-selection config (interest types, fuel/transmission/
 * model-year/km/down-payment option lists) and the taxonomy-derived recommended
 * vehicle name + variant stay inline in the screen.
 */

export interface KayitliArama {
  ad: string;
  adet: string;
  detay: string;
  fiyat: string;
  name: string;
  segment: string;
}

export interface OnerilenArac {
  etiketler: string[];
  pesinat: string;
  segment: string;
  taksit: string;
}

export interface VehiclePreferences {
  kayitliAramalar: KayitliArama[];
  onerilenAraclar: OnerilenArac[];
  toplamArac: string;
}

export const VEHICLE_PREFERENCES: VehiclePreferences = {
  kayitliAramalar: [
    {
      ad: "Aile için SUV",
      detay: "SUV · Otomatik",
      fiyat: "₺10.000 - ₺25.000",
      adet: "12 yeni araç",
      segment: "SUV",
      name: "Volkswagen Tiguan",
    },
    {
      ad: "Ekonomik Sedan",
      detay: "Sedan · Otomatik",
      fiyat: "₺8.000 - ₺18.000",
      adet: "8 yeni araç",
      segment: "Sedan",
      name: "Skoda Octavia",
    },
    {
      ad: "Elektrikli Tercihim",
      detay: "Elektrikli · Otomatik",
      fiyat: "₺15.000 - ₺30.000",
      adet: "5 yeni araç",
      segment: "Elektrikli",
      name: "BYD Seal",
    },
    {
      ad: "İş için Ticari",
      detay: "Ticari · Dizel",
      fiyat: "₺12.000 - ₺28.000",
      adet: "3 yeni araç",
      segment: "Ticari",
      name: "Ford Transit",
    },
  ],
  toplamArac: "56 araç bulundu",
  onerilenAraclar: [
    {
      etiketler: ["SUV", "Otomatik", "Benzin", "2023"],
      taksit: "₺18.750",
      pesinat: "₺250.000 peşinat",
      segment: "SUV",
    },
    {
      etiketler: ["Sedan", "Otomatik", "Benzin", "2023"],
      taksit: "₺17.250",
      pesinat: "₺220.000 peşinat",
      segment: "Sedan",
    },
    {
      etiketler: ["Elektrikli", "Otomatik", "2024"],
      taksit: "₺22.950",
      pesinat: "₺320.000 peşinat",
      segment: "Elektrikli",
    },
  ],
};
