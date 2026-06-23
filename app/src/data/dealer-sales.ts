/**
 * "Bayi Performans & Penetrasyon" ekranı için aylık bayi satış seed'i.
 * Kurum rapor şablonundaki "Bayi Satış Performansı"nın uygulama karşılığı.
 * Penetrasyon = kredili satış / toplam satış. Deterministik (mulberry32).
 * Servis: src/services/dealer-sales.
 */
import {
  ALT_SEKTOR_W,
  ALT_SEKTORLER,
  BAYI_ORG,
  sektorMuduruFor,
} from "./org";

export const SATIS_AYLAR = [
  "Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara",
] as const;

export interface DealerSalesRow {
  altSektor: string;
  ay: number; // 1..12
  bayi: string;
  bolge: string;
  bolgeYoneticisi: string;
  danisman: string;
  distributor: string;
  il: string;
  ilce: string;
  krediliSatis: number;
  sektorMuduru: string;
  sigortali: number;
  toplamSatis: number;
  yil: number;
}

// bayi -> (bölge, distribütör, il)
const BAYILER: [string, string, string, string][] = [
  ["Doğuş Otomotiv", "Marmara", "Doğuş Oto Dağıtım", "İstanbul"],
  ["Borusan Otomotiv", "Marmara", "Borusan Otomotiv Dağıtım", "İstanbul"],
  ["Otokoç Otomotiv", "İç Anadolu", "Otokoç Dağıtım", "Ankara"],
  ["Groupe PSA Bayi", "Ege", "Bağımsız Kanal", "İzmir"],
  ["Çetaş Otomotiv", "Marmara", "Bağımsız Kanal", "Bursa"],
  ["Aydın Otomotiv", "Akdeniz", "Bağımsız Kanal", "Antalya"],
  ["Maslak Motors", "Marmara", "Bağımsız Kanal", "İstanbul"],
  ["Ege Oto Plaza", "Ege", "Otokoç Dağıtım", "İzmir"],
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

function generate(): DealerSalesRow[] {
  const r = rng(909090);
  const out: DealerSalesRow[] = [];
  for (const [yi, yil] of [2024, 2025].entries()) {
    const yMul = yi === 0 ? 0.9 : 1;
    for (let ay = 1; ay <= 12; ay++) {
      const season = 1 + 0.12 * Math.sin(((ay - 1) / 12) * Math.PI * 2);
      for (let bi = 0; bi < BAYILER.length; bi++) {
        const [bayi, bolge, distributor, il] = BAYILER[bi];
        const org = BAYI_ORG[bayi];
        const aylikToplam = (40 + r() * 180) * yMul * season * (1 - bi * 0.03);
        const altW = ALT_SEKTOR_W.reduce((a, b) => a + b, 0);
        // aylık satışı alt sektörlere böl (grain: bayi × ay × alt sektör)
        ALT_SEKTORLER.forEach((altSektor, ai) => {
          const toplam = Math.max(1, Math.round((aylikToplam * ALT_SEKTOR_W[ai]) / altW));
          const qfPen = 0.18 + r() * 0.28;
          const kredili = Math.round(toplam * qfPen);
          const sigPen = 0.45 + r() * 0.4;
          out.push({
            altSektor,
            ay,
            bayi,
            bolge,
            bolgeYoneticisi: org.bolgeYoneticisi,
            danisman: org.danismanlar[ai % org.danismanlar.length],
            distributor,
            il,
            ilce: org.ilce,
            krediliSatis: kredili,
            sektorMuduru: sektorMuduruFor(altSektor),
            sigortali: Math.round(kredili * sigPen),
            toplamSatis: toplam,
            yil,
          });
        });
      }
    }
  }
  return out;
}

export const DEALER_SALES: DealerSalesRow[] = generate();
