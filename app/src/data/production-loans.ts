/**
 * "Üretim & Karlılık Özeti" ekranı için kredi-bazlı (loan-level) seed.
 * Kurum rapor şablonundaki "Açılan Krediler (Özet)" + karlılık kırılımının
 * uygulama karşılığı. Ekran bu kayıtları client-side filtreleyip toplar
 * (ortak filtre bandı gerçekten çalışsın diye). Deterministik (mulberry32).
 * Servis: src/services/production-loans.
 */
export const URETIM_AYLAR = [
  "Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara",
] as const;

export interface ProductionLoan {
  ay: number; // 1..12
  bayi: string;
  bolge: string;
  distributor: string;
  dosyaMasrafi: number;
  ekspertiz: boolean;
  faiz: number; // aylık %
  hedefTutar: number;
  kasa: string;
  krediTutari: number;
  marka: string;
  modelYil: number;
  musteriTipi: "Bireysel" | "Ticari";
  segment: string;
  sigorta: boolean;
  tesvik: number;
  vade: number; // ay
  yil: number;
}

// bayi -> (distribütör, bölge)
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

const MARKALAR = [
  "Renault","Fiat","Volkswagen","Toyota","Hyundai","Ford","Peugeot",
  "Opel","Dacia","Kia","Honda","Nissan","Mercedes-Benz","BMW","Audi","Skoda",
];
const MARKA_W = [16,14,11,9,8,8,6,5,5,4,3,3,2,2,1.5,1.5];

// kasa -> [segment kategori, ağırlık, ort. kredi ₺]
const KASALAR: [string, string, number, number][] = [
  ["SUV", "Arazi/SUV", 0.3, 1_800_000],
  ["Sedan", "Otomobil", 0.24, 1_200_000],
  ["Hatchback", "Otomobil", 0.18, 900_000],
  ["Station Wagon", "Otomobil", 0.08, 1_400_000],
  ["Pick-up", "Arazi/SUV", 0.1, 1_600_000],
  ["Panelvan", "Ticari", 0.1, 1_150_000],
];

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
    const [bayi, distributor, bolge] = BAYILER[Math.floor(r() * BAYILER.length)];
    const [kasa, segment, , loan] = weighted(
      r,
      KASALAR,
      KASALAR.map((k) => k[2])
    );
    const marka = weighted(r, MARKALAR, MARKA_W);
    const yil = r() < 0.45 ? 2024 : 2025;
    const ay = 1 + Math.floor(r() * 12);
    const ticariEgilim = kasa === "Pick-up" || kasa === "Panelvan" ? 0.78 : 0.2;
    const musteriTipi: "Bireysel" | "Ticari" =
      r() < ticariEgilim ? "Ticari" : "Bireysel";
    const krediTutari = r1000(loan * (0.55 + r() * 0.7));
    const vade = [12, 24, 36, 48][Math.floor(r() * 4)];
    const faiz = Math.round((2.6 + r() * 1.3) * 100) / 100;
    const dosyaMasrafi = r1000(4000 + r() * 24_000);
    const tesvik = r1000(krediTutari * (0.002 + r() * 0.007));
    const modelYil = 2008 + Math.floor(r() * 18); // 2008..2025
    out.push({
      ay,
      bayi,
      bolge,
      distributor,
      dosyaMasrafi,
      ekspertiz: r() < 0.6,
      faiz,
      hedefTutar: r1000(krediTutari * (0.88 + r() * 0.28)),
      kasa,
      krediTutari,
      marka,
      modelYil,
      musteriTipi,
      segment,
      sigorta: r() < 0.72,
      tesvik,
      vade,
      yil,
    });
  }
  return out;
}

export const PRODUCTION_LOANS: ProductionLoan[] = generate();
