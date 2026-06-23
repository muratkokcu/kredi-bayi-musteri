/**
 * "Stok Finansmanı" ekranı için kayıt-bazlı seed.
 * Kurum rapor şablonundaki "Stok Finansmanı Raporu (Özet + Detay)" karşılığı.
 * Deterministik (mulberry32). Servis: src/services/stock-financing.
 */
export const STOK_AYLAR = [
  "Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara",
] as const;

export interface StockLoan {
  ay: number;
  bayi: string;
  bolge: string;
  distributor: string;
  durum: "Açık" | "Kapalı";
  dosyaMasrafi: number;
  faiz: number;
  kapamaGun: number; // 0 = açık
  krediTutari: number;
  marka: string;
  modelYil: number;
  tahsilat: number; // 0 = açık
  tedarikci: string;
  vadeGun: number;
  yil: number;
}

const BAYILER: [string, string, string][] = [
  ["Doğuş Otomotiv", "Doğuş Oto Dağıtım", "Marmara"],
  ["Borusan Otomotiv", "Borusan Otomotiv Dağıtım", "Marmara"],
  ["Otokoç Otomotiv", "Otokoç Dağıtım", "İç Anadolu"],
  ["Groupe PSA Bayi", "Bağımsız Kanal", "Ege"],
  ["Çetaş Otomotiv", "Bağımsız Kanal", "Marmara"],
  ["Aydın Otomotiv", "Bağımsız Kanal", "Akdeniz"],
  ["Maslak Motors", "Bağımsız Kanal", "Marmara"],
  ["Ege Oto Plaza", "Otokoç Dağıtım", "Ege"],
];
const TEDARIKCI = ["Doğuş Oto A.Ş.", "Borusan Lojistik", "Otokoç Tic.", "Ege Filo", "Anadolu Stok"];
const MARKALAR = ["Renault", "Fiat", "Volkswagen", "Toyota", "Hyundai", "Ford", "Peugeot", "Kia"];

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
    const [bayi, distributor, bolge] = BAYILER[Math.floor(r() * BAYILER.length)];
    const kredi = r1000(800_000 + r() * 3_200_000);
    const vadeGun = [60, 90, 120, 180][Math.floor(r() * 4)];
    const durum: "Açık" | "Kapalı" = r() < 0.62 ? "Kapalı" : "Açık";
    const kapamaGun = durum === "Kapalı" ? Math.round(20 + r() * (vadeGun + 25)) : 0;
    const tahsilat = durum === "Kapalı" ? r1000(kredi * (1.0 + r() * 0.06)) : 0;
    out.push({
      ay: 1 + Math.floor(r() * 12),
      bayi,
      bolge,
      distributor,
      durum,
      dosyaMasrafi: r1000(5000 + r() * 25_000),
      faiz: Math.round((2.4 + r() * 1.0) * 100) / 100,
      kapamaGun,
      krediTutari: kredi,
      marka: MARKALAR[Math.floor(r() * MARKALAR.length)],
      modelYil: 2018 + Math.floor(r() * 8),
      tahsilat,
      tedarikci: TEDARIKCI[Math.floor(r() * TEDARIKCI.length)],
      vadeGun,
      yil: r() < 0.45 ? 2024 : 2025,
    });
  }
  return out;
}

export const STOCK_LOANS: StockLoan[] = generate();
