/**
 * KVKK consent registry — seed data for the bank-side consent management
 * screen. Each record is a timestamped, auditable customer consent.
 * Served via src/services/consents.
 */
export type ConsentAmac =
  | "Kredi Değerlendirmesi"
  | "KKB/Findeks Sorgu"
  | "Pazarlama İletişimi"
  | "Grup Şirketleriyle Paylaşım";

export type ConsentKanal = "Mobil" | "Web";

export type ConsentDurum = "Aktif" | "Geri Çekildi" | "Süresi Doldu";

export interface ConsentRecord {
  amaclar: ConsentAmac[];
  durum: ConsentDurum;
  id: string;
  kanal: ConsentKanal;
  metinVersiyonu: string;
  musteri: string;
  musteriKodu: string;
  tarih: string;
}

export const CONSENTS: ConsentRecord[] = [
  {
    id: "RZA-000124",
    musteri: "Ahmet Yılmaz",
    musteriKodu: "MUS-000124",
    tarih: "2026-05-12",
    amaclar: ["Kredi Değerlendirmesi", "KKB/Findeks Sorgu"],
    metinVersiyonu: "v1.2",
    kanal: "Mobil",
    durum: "Aktif",
  },
  {
    id: "RZA-000131",
    musteri: "Elif Demir",
    musteriKodu: "MUS-000131",
    tarih: "2026-05-09",
    amaclar: [
      "Kredi Değerlendirmesi",
      "KKB/Findeks Sorgu",
      "Pazarlama İletişimi",
    ],
    metinVersiyonu: "v1.2",
    kanal: "Web",
    durum: "Aktif",
  },
  {
    id: "RZA-000098",
    musteri: "Mehmet Kaya",
    musteriKodu: "MUS-000098",
    tarih: "2026-04-28",
    amaclar: ["Kredi Değerlendirmesi", "Pazarlama İletişimi"],
    metinVersiyonu: "v1.1",
    kanal: "Mobil",
    durum: "Geri Çekildi",
  },
  {
    id: "RZA-000142",
    musteri: "Zeynep Şahin",
    musteriKodu: "MUS-000142",
    tarih: "2026-06-03",
    amaclar: [
      "Kredi Değerlendirmesi",
      "KKB/Findeks Sorgu",
      "Grup Şirketleriyle Paylaşım",
    ],
    metinVersiyonu: "v1.2",
    kanal: "Web",
    durum: "Aktif",
  },
  {
    id: "RZA-000077",
    musteri: "Caner Aydın",
    musteriKodu: "MUS-000077",
    tarih: "2025-06-15",
    amaclar: ["Kredi Değerlendirmesi", "KKB/Findeks Sorgu"],
    metinVersiyonu: "v1.0",
    kanal: "Web",
    durum: "Süresi Doldu",
  },
  {
    id: "RZA-000156",
    musteri: "Buse Çelik",
    musteriKodu: "MUS-000156",
    tarih: "2026-06-10",
    amaclar: ["Kredi Değerlendirmesi"],
    metinVersiyonu: "v1.2",
    kanal: "Mobil",
    durum: "Aktif",
  },
  {
    id: "RZA-000089",
    musteri: "Okan Arslan",
    musteriKodu: "MUS-000089",
    tarih: "2026-03-22",
    amaclar: [
      "Kredi Değerlendirmesi",
      "Pazarlama İletişimi",
      "Grup Şirketleriyle Paylaşım",
    ],
    metinVersiyonu: "v1.1",
    kanal: "Mobil",
    durum: "Geri Çekildi",
  },
  {
    id: "RZA-000045",
    musteri: "Derya Korkmaz",
    musteriKodu: "MUS-000045",
    tarih: "2025-05-30",
    amaclar: ["Kredi Değerlendirmesi", "KKB/Findeks Sorgu"],
    metinVersiyonu: "v1.0",
    kanal: "Web",
    durum: "Süresi Doldu",
  },
  {
    id: "RZA-000163",
    musteri: "Selin Doğan",
    musteriKodu: "MUS-000163",
    tarih: "2026-06-14",
    amaclar: [
      "Kredi Değerlendirmesi",
      "KKB/Findeks Sorgu",
      "Pazarlama İletişimi",
      "Grup Şirketleriyle Paylaşım",
    ],
    metinVersiyonu: "v1.2",
    kanal: "Web",
    durum: "Aktif",
  },
  {
    id: "RZA-000118",
    musteri: "Burak Yıldız",
    musteriKodu: "MUS-000118",
    tarih: "2026-05-01",
    amaclar: ["Kredi Değerlendirmesi", "Pazarlama İletişimi"],
    metinVersiyonu: "v1.1",
    kanal: "Mobil",
    durum: "Aktif",
  },
  {
    id: "RZA-000102",
    musteri: "Gamze Aksoy",
    musteriKodu: "MUS-000102",
    tarih: "2026-02-18",
    amaclar: ["Kredi Değerlendirmesi", "KKB/Findeks Sorgu"],
    metinVersiyonu: "v1.1",
    kanal: "Web",
    durum: "Geri Çekildi",
  },
];
