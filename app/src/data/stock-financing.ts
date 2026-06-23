/**
 * "Stok Finansmanı" ekranı için kayıt-bazlı seed.
 * Kurum rapor şablonundaki "Stok Finansmanı Raporu (Özet + Detay)" karşılığı.
 * Deterministik (mulberry32). Servis: src/services/stock-financing.
 */
import { orgFields } from "./org";

export const STOK_AYLAR = [
  "Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara",
] as const;

export interface StockLoan {
  altSektor: string;
  aracYas: number;
  ay: number;
  bayi: string;
  bolge: string;
  bolgeYoneticisi: string;
  ilce: string;
  sektorMuduru: string;
  distributor: string;
  durum: "Açık" | "Kapalı";
  dosyaMasrafi: number;
  faiz: number;
  il: string;
  kapamaGun: number; // 0 = açık
  kaskoDegeri: number;
  krediTutari: number;
  marka: string;
  model: string;
  modelYil: number;
  plaka: string;
  satisBedeli: number;
  tahsilat: number; // 0 = açık
  tedarikci: string;
  vadeGun: number;
  yil: number;
}

// bayi -> (distribütör, bölge, il)
const BAYILER: [string, string, string, string][] = [
  ["Doğuş Otomotiv", "Doğuş Oto Dağıtım", "Marmara", "İstanbul"],
  ["Borusan Otomotiv", "Borusan Otomotiv Dağıtım", "Marmara", "İstanbul"],
  ["Otokoç Otomotiv", "Otokoç Dağıtım", "İç Anadolu", "Ankara"],
  ["Groupe PSA Bayi", "Bağımsız Kanal", "Ege", "İzmir"],
  ["Çetaş Otomotiv", "Bağımsız Kanal", "Marmara", "Bursa"],
  ["Aydın Otomotiv", "Bağımsız Kanal", "Akdeniz", "Antalya"],
  ["Maslak Motors", "Bağımsız Kanal", "Marmara", "İstanbul"],
  ["Ege Oto Plaza", "Otokoç Dağıtım", "Ege", "İzmir"],
];
const TEDARIKCI = ["Doğuş Oto A.Ş.", "Borusan Lojistik", "Otokoç Tic.", "Ege Filo", "Anadolu Stok"];
// marka -> gerçek modeller (taksonomiyle uyumlu)
const MARKA_MODEL: [string, string[]][] = [
  ["Renault", ["Clio", "Megane", "Taliant"]],
  ["Fiat", ["Egea", "Egea Cross"]],
  ["Volkswagen", ["Golf", "Passat", "Polo"]],
  ["Toyota", ["Corolla", "C-HR"]],
  ["Hyundai", ["i20", "Bayon"]],
  ["Ford", ["Focus", "Puma"]],
  ["Peugeot", ["2008", "301"]],
  ["Kia", ["Ceed", "Sportage"]],
];
const IL_PLAKA: Record<string, string> = {
  İstanbul: "34", Ankara: "06", İzmir: "35", Bursa: "16", Antalya: "07",
};

function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const r1000 = (x: number) => Math.round(x / 1000) * 1000;

function generate(): StockLoan[] {
  const r = rng(556677);
  const out: StockLoan[] = [];
  for (let i = 0; i < 320; i++) {
    const [bayi, distributor, bolge, il] = BAYILER[Math.floor(r() * BAYILER.length)];
    const [marka, models] = MARKA_MODEL[Math.floor(r() * MARKA_MODEL.length)];
    const satisBedeli = r1000(900_000 + r() * 3_500_000);
    const kredi = r1000(satisBedeli * (0.7 + r() * 0.25));
    const vadeGun = [60, 90, 120, 180][Math.floor(r() * 4)];
    const durum: "Açık" | "Kapalı" = r() < 0.62 ? "Kapalı" : "Açık";
    const kapamaGun = durum === "Kapalı" ? Math.round(20 + r() * (vadeGun + 25)) : 0;
    const tahsilat = durum === "Kapalı" ? r1000(kredi * (1.0 + r() * 0.06)) : 0;
    const modelYil = 2018 + Math.floor(r() * 8);
    const o = orgFields(bayi, r);
    out.push({
      altSektor: o.altSektor,
      bolgeYoneticisi: o.bolgeYoneticisi,
      ilce: o.ilce,
      sektorMuduru: o.sektorMuduru,
      aracYas: 2025 - modelYil,
      ay: 1 + Math.floor(r() * 12),
      bayi,
      bolge,
      distributor,
      durum,
      dosyaMasrafi: r1000(5000 + r() * 25_000),
      faiz: Math.round((2.4 + r() * 1.0) * 100) / 100,
      il,
      kapamaGun,
      kaskoDegeri: r1000(satisBedeli * (0.85 + r() * 0.2)),
      krediTutari: kredi,
      marka,
      model: models[Math.floor(r() * models.length)],
      modelYil,
      plaka: `${IL_PLAKA[il] ?? "34"} *** ${10 + Math.floor(r() * 89)}`,
      satisBedeli,
      tahsilat,
      tedarikci: TEDARIKCI[Math.floor(r() * TEDARIKCI.length)],
      vadeGun,
      yil: r() < 0.45 ? 2024 : 2025,
    });
  }
  return out;
}

export const STOCK_LOANS: StockLoan[] = generate();
