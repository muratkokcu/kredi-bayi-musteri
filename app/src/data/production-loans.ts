/**
 * "Üretim & Karlılık Özeti" ekranı için kredi-bazlı (loan-level) seed.
 * Kurum rapor şablonundaki "Açılan Krediler (Özet)" + karlılık kırılımının
 * uygulama karşılığı. Ekran bu kayıtları client-side filtreleyip toplar
 * (ortak filtre bandı gerçekten çalışsın diye). Deterministik (mulberry32).
 * Servis: src/services/production-loans.
 */
import { orgFields } from "./org";

export const URETIM_AYLAR = [
  "Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara",
] as const;

export interface ProductionLoan {
  altSektor: string;
  aracYas: number;
  ay: number; // 1..12
  bayi: string;
  bolgeYoneticisi: string;
  danisman: string;
  ilce: string;
  sektorMuduru: string;
  bolge: string;
  distributor: string;
  dosyaMasrafi: number;
  ekspertiz: boolean;
  ekspertizFirma: string;
  faiz: number; // aylık %
  hedefTutar: number;
  il: string;
  kasa: string;
  kaskoDegeri: number;
  krediTutari: number;
  marka: string;
  model: string;
  modelYil: number;
  musteriTipi: "Bireysel" | "Ticari";
  plaka: string;
  satisBedeli: number;
  segment: string;
  sigorta: boolean;
  tesvik: number;
  vade: number; // ay
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

// marka -> ağırlık + [model, kasa] (kasa modelle tutarlı; gerçek modeller)
const MARKALAR: [string, number, [string, string][]][] = [
  ["Renault", 16, [["Clio", "Hatchback"], ["Megane", "Sedan"], ["Taliant", "Sedan"], ["Kangoo", "Panelvan"]]],
  ["Fiat", 14, [["Egea", "Sedan"], ["Egea Cross", "SUV"], ["Fiorino", "Panelvan"], ["Fullback", "Pick-up"]]],
  ["Volkswagen", 11, [["Golf", "Hatchback"], ["Passat", "Sedan"], ["Polo", "Hatchback"], ["Transporter", "Panelvan"]]],
  ["Toyota", 9, [["Corolla", "Sedan"], ["C-HR", "SUV"], ["Hilux", "Pick-up"]]],
  ["Hyundai", 8, [["i20", "Hatchback"], ["Bayon", "SUV"]]],
  ["Ford", 8, [["Focus", "Hatchback"], ["Puma", "SUV"], ["Transit", "Panelvan"]]],
  ["Peugeot", 6, [["2008", "SUV"], ["301", "Sedan"], ["Partner", "Panelvan"]]],
  ["Opel", 5, [["Corsa", "Hatchback"], ["Astra", "Station Wagon"]]],
  ["Dacia", 5, [["Duster", "SUV"], ["Sandero", "Hatchback"]]],
  ["Kia", 4, [["Ceed", "Hatchback"], ["Sportage", "SUV"]]],
  ["Honda", 3, [["Civic", "Sedan"], ["HR-V", "SUV"]]],
  ["Nissan", 3, [["Qashqai", "SUV"], ["Juke", "SUV"]]],
  ["Mercedes-Benz", 2, [["A-Serisi", "Hatchback"], ["C-Serisi", "Sedan"]]],
  ["BMW", 2, [["3 Serisi", "Sedan"], ["X1", "SUV"]]],
  ["Audi", 1.5, [["A3", "Hatchback"], ["Q3", "SUV"]]],
  ["Skoda", 1.5, [["Octavia", "Sedan"], ["Superb", "Sedan"]]],
];
const MARKA_W = MARKALAR.map((m) => m[1]);
const IL_PLAKA: Record<string, string> = {
  İstanbul: "34", Ankara: "06", İzmir: "35", Bursa: "16", Antalya: "07",
};
const EKSPERTIZ_FIRMA = ["TÜV", "Dekra", "Otoekspertiz"];

// kasa -> segment kategori + ort. kredi ₺
const KASA_INFO: Record<string, { segment: string; loan: number }> = {
  SUV: { segment: "Arazi/SUV", loan: 1_800_000 },
  Sedan: { segment: "Otomobil", loan: 1_200_000 },
  Hatchback: { segment: "Otomobil", loan: 900_000 },
  "Station Wagon": { segment: "Otomobil", loan: 1_400_000 },
  "Pick-up": { segment: "Arazi/SUV", loan: 1_600_000 },
  Panelvan: { segment: "Ticari", loan: 1_150_000 },
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

function weighted<T>(r: () => number, opts: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let x = r() * total;
  for (let i = 0; i < opts.length; i++) {
    x -= weights[i];
    if (x <= 0) {
      return opts[i];
    }
  }
  return opts[opts.length - 1];
}

const r1000 = (x: number) => Math.round(x / 1000) * 1000;

function generate(): ProductionLoan[] {
  const r = rng(20250101);
  const out: ProductionLoan[] = [];
  const COUNT = 640;
  for (let i = 0; i < COUNT; i++) {
    const [bayi, distributor, bolge, il] = BAYILER[Math.floor(r() * BAYILER.length)];
    const markaRow = weighted(r, MARKALAR, MARKA_W);
    const marka = markaRow[0];
    const [model, kasa] = markaRow[2][Math.floor(r() * markaRow[2].length)];
    const { segment, loan } = KASA_INFO[kasa];
    const yil = r() < 0.45 ? 2024 : 2025;
    const ay = 1 + Math.floor(r() * 12);
    const ticariEgilim = kasa === "Pick-up" || kasa === "Panelvan" ? 0.78 : 0.2;
    const musteriTipi: "Bireysel" | "Ticari" =
      r() < ticariEgilim ? "Ticari" : "Bireysel";
    const krediTutari = r1000(loan * (0.55 + r() * 0.7));
    const satisBedeli = r1000(krediTutari / (0.6 + r() * 0.3));
    const vade = [12, 24, 36, 48][Math.floor(r() * 4)];
    const faiz = Math.round((2.6 + r() * 1.3) * 100) / 100;
    const dosyaMasrafi = r1000(4000 + r() * 24_000);
    const tesvik = r1000(krediTutari * (0.002 + r() * 0.007));
    const modelYil = 2008 + Math.floor(r() * 18); // 2008..2025
    const ekspertiz = r() < 0.6;
    const o = orgFields(bayi, r);
    out.push({
      altSektor: o.altSektor,
      aracYas: 2025 - modelYil,
      ay,
      bayi,
      bolge,
      bolgeYoneticisi: o.bolgeYoneticisi,
      danisman: o.danisman,
      distributor,
      dosyaMasrafi,
      ekspertiz,
      ekspertizFirma: ekspertiz ? EKSPERTIZ_FIRMA[Math.floor(r() * EKSPERTIZ_FIRMA.length)] : "—",
      faiz,
      hedefTutar: r1000(krediTutari * (0.88 + r() * 0.28)),
      il,
      ilce: o.ilce,
      kasa,
      kaskoDegeri: r1000(satisBedeli * (0.85 + r() * 0.2)),
      krediTutari,
      marka,
      model,
      modelYil,
      musteriTipi,
      plaka: `${IL_PLAKA[il] ?? "34"} *** ${10 + Math.floor(r() * 89)}`,
      satisBedeli,
      segment,
      sektorMuduru: o.sektorMuduru,
      sigorta: r() < 0.72,
      tesvik,
      vade,
      yil,
    });
  }
  return out;
}

export const PRODUCTION_LOANS: ProductionLoan[] = /*#__PURE__*/ generate();
