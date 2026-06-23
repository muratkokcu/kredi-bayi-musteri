/**
 * "Başvuru Hunisi & Dönüşüm" ekranı için başvuru-bazlı seed.
 * Kurum rapor şablonundaki "Başvuru Raporları"nın uygulama karşılığı.
 * Ekran client-side filtreleyip toplar. Deterministik (mulberry32).
 * Servis: src/services/applications.
 */
export const BASVURU_AYLAR = [
  "Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara",
] as const;

export type BasvuruDurum = "Kullandırım" | "Onay" | "Ret" | "İade" | "İptal";

export interface Application {
  ay: number; // 1..12
  bayi: string;
  bolge: string;
  durum: BasvuruDurum;
  musteriTipi: "Bireysel" | "Ticari";
  retNedeni: string;
  tutar: number;
  yil: number;
}

const BAYILER: [string, string][] = [
  ["Doğuş Otomotiv", "Marmara"],
  ["Borusan Otomotiv", "Marmara"],
  ["Otokoç Otomotiv", "İç Anadolu"],
  ["Groupe PSA Bayi", "Ege"],
  ["Çetaş Otomotiv", "Marmara"],
  ["Aydın Otomotiv", "Akdeniz"],
  ["Maslak Motors", "Marmara"],
  ["Ege Oto Plaza", "Ege"],
];
const RET_NEDEN = [
  "Skor düşük",
  "Belge eksik",
  "Gelir yetersiz",
  "Negatif kayıt",
  "Teminat yetersiz",
];
const DURUMLAR: BasvuruDurum[] = ["Kullandırım", "Ret", "Onay", "İade", "İptal"];
const DURUM_W = [0.62, 0.18, 0.07, 0.05, 0.08];

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

function generate(): Application[] {
  const r = rng(73312);
  const out: Application[] = [];
  for (let i = 0; i < 900; i++) {
    const [bayi, bolge] = BAYILER[Math.floor(r() * BAYILER.length)];
    const durum = weighted(r, DURUMLAR, DURUM_W);
    out.push({
      ay: 1 + Math.floor(r() * 12),
      bayi,
      bolge,
      durum,
      musteriTipi: r() < 0.7 ? "Bireysel" : "Ticari",
      retNedeni: durum === "Ret" ? weighted(r, RET_NEDEN, [4, 3, 2, 2, 1]) : "—",
      tutar: r1000(400_000 + r() * 2_800_000),
      yil: r() < 0.45 ? 2024 : 2025,
    });
  }
  return out;
}

export const APPLICATIONS: Application[] = generate();
