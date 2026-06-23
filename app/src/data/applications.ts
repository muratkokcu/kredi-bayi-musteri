/**
 * "Başvuru Hunisi & Dönüşüm" ekranı için başvuru-bazlı seed.
 * Kurum rapor şablonundaki "Başvuru Raporları"nın uygulama karşılığı.
 * Ekran client-side filtreleyip toplar. Deterministik (mulberry32).
 * Servis: src/services/applications.
 */
import { orgFields } from "./org";

export const BASVURU_AYLAR = [
  "Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara",
] as const;

export type BasvuruDurum = "Kullandırım" | "Onay" | "Ret" | "İade" | "İptal";

export interface Application {
  altSektor: string;
  ay: number; // 1..12
  bayi: string;
  bolge: string;
  bolgeYoneticisi: string;
  danisman: string;
  distributor: string;
  durum: BasvuruDurum;
  il: string;
  ilce: string;
  musteriTipi: "Bireysel" | "Ticari";
  retNedeni: string;
  sektorMuduru: string;
  tutar: number;
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
    const [bayi, distributor, bolge, il] = BAYILER[Math.floor(r() * BAYILER.length)];
    const durum = weighted(r, DURUMLAR, DURUM_W);
    const o = orgFields(bayi, r);
    out.push({
      altSektor: o.altSektor,
      ay: 1 + Math.floor(r() * 12),
      bayi,
      bolge,
      bolgeYoneticisi: o.bolgeYoneticisi,
      danisman: o.danisman,
      distributor,
      durum,
      il,
      ilce: o.ilce,
      musteriTipi: r() < 0.7 ? "Bireysel" : "Ticari",
      retNedeni: durum === "Ret" ? weighted(r, RET_NEDEN, [4, 3, 2, 2, 1]) : "—",
      sektorMuduru: o.sektorMuduru,
      tutar: r1000(400_000 + r() * 2_800_000),
      yil: r() < 0.45 ? 2024 : 2025,
    });
  }
  return out;
}

export const APPLICATIONS: Application[] = generate();
