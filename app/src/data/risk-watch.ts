/**
 * "Risk & İzleme" ekranı için sözleşme-bazlı seed.
 * Kurum rapor şablonundaki "İzleme Listesi" + "Kanuni Takip" karşılığı.
 * Deterministik (mulberry32). Servis: src/services/risk-watch.
 */
export type RiskDurum = "Güncel" | "İzleme" | "NPL" | "Kanuni Takip";

export interface RiskContract {
  bayi: string;
  bolge: string;
  distributor: string;
  durum: RiskDurum;
  fpd: boolean; // first payment default
  gecikmeGun: number;
  il: string;
  kalanBakiye: number;
  krediTutari: number;
  musteri: string;
  musteriTipi: "Bireysel" | "Ticari";
  sozlesmeNo: string;
  taksitGecikme: number;
  tahsilatOrani: number; // 0..1
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
const HARF = "ABCDEFGHKMNSTYZ";

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

function durumOf(gun: number): RiskDurum {
  if (gun >= 120) {
    return "Kanuni Takip";
  }
  if (gun >= 90) {
    return "NPL";
  }
  if (gun >= 30) {
    return "İzleme";
  }
  return "Güncel";
}

function generate(): RiskContract[] {
  const r = rng(424242);
  const out: RiskContract[] = [];
  const buckets = [10, 20, 45, 75, 100, 160];
  const weights = [34, 24, 18, 12, 7, 5];
  for (let i = 0; i < 190; i++) {
    const [bayi, distributor, bolge, il] = BAYILER[Math.floor(r() * BAYILER.length)];
    // ağırlıklı gecikme kovası seç
    let x = r() * weights.reduce((a, b) => a + b, 0);
    let bi = 0;
    for (let j = 0; j < buckets.length; j++) {
      x -= weights[j];
      if (x <= 0) {
        bi = j;
        break;
      }
    }
    const gecikme = Math.round(buckets[bi] * (0.7 + r() * 0.6));
    const kredi = r1000(500_000 + r() * 2_500_000);
    out.push({
      bayi,
      bolge,
      distributor,
      durum: durumOf(gecikme),
      fpd: r() < 0.12,
      gecikmeGun: gecikme,
      il,
      kalanBakiye: r1000(kredi * (0.2 + r() * 0.7)),
      krediTutari: kredi,
      musteri: `${HARF[Math.floor(r() * HARF.length)]}*** ${HARF[Math.floor(r() * HARF.length)]}***`,
      musteriTipi: r() < 0.7 ? "Bireysel" : "Ticari",
      sozlesmeNo: `SZ-${200000 + i}`,
      taksitGecikme: Math.max(1, Math.floor(gecikme / 30) + (r() < 0.5 ? 1 : 0)),
      tahsilatOrani: Math.round((0.55 + r() * 0.43) * 1000) / 1000,
    });
  }
  return out;
}

export const RISK_CONTRACTS: RiskContract[] = generate();
