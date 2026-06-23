/**
 * "Bayi Performans & Penetrasyon" ekranı için aylık bayi satış seed'i.
 * Kurum rapor şablonundaki "Bayi Satış Performansı"nın uygulama karşılığı.
 * Penetrasyon = kredili satış / toplam satış. Deterministik (mulberry32).
 * Servis: src/services/dealer-sales.
 */
export const SATIS_AYLAR = [
  "Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara",
] as const;

export interface DealerSalesRow {
  ay: number; // 1..12
  bayi: string;
  bolge: string;
  krediliSatis: number;
  sigortali: number;
  toplamSatis: number;
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
        const [bayi, bolge] = BAYILER[bi];
        const toplam = Math.round((40 + r() * 180) * yMul * season * (1 - bi * 0.03));
        const qfPen = 0.18 + r() * 0.28;
        const kredili = Math.round(toplam * qfPen);
        const sigPen = 0.45 + r() * 0.4;
        const sigortali = Math.round(kredili * sigPen);
        out.push({ ay, bayi, bolge, krediliSatis: kredili, sigortali, toplamSatis: toplam, yil });
      }
    }
  }
  return out;
}

export const DEALER_SALES: DealerSalesRow[] = generate();
