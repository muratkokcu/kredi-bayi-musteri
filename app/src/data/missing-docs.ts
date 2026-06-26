/**
 * "Eksik Evrak" ekranı için kayıt-bazlı seed.
 * Kurum rapor şablonundaki "Eksik Evrak Takip" — dört ayrı evrak alanını kapsar:
 * Tüketici · Bayi · Spot · Filo (bunlar ayrı kategorilerdir, birleşik değil).
 * Deterministik (mulberry32). Servis: src/services/missing-docs.
 */
import { orgFields } from "./org";

export type EvrakTur = "Tüketici" | "Bayi" | "Spot" | "Filo";

export interface MissingDoc {
  altSektor: string;
  bayi: string;
  bolge: string;
  bolgeYoneticisi: string;
  danisman: string;
  distributor: string;
  evrakTarihi: string; // gg.aa.yyyy
  evrakTuru: string;
  hataTuru: string;
  il: string;
  ilce: string;
  musteriTedarikci: string;
  sektorMuduru: string;
  sozlesmeNo: string;
  sozlesmeTuru: string; // türe göre dolu (asla boş): ör. Spot → "Spot Kredi"
  tur: EvrakTur;
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

// Her tür kendi evrak + sözleşme türü kümesine sahiptir (kurum şablonu kırılımı).
const TUR_CONFIG: Record<
  EvrakTur,
  { evrak: string[]; sozlesme: string[] }
> = {
  Tüketici: {
    evrak: ["Kredi Sözleşmesi", "Ödeme Planı", "KVKK Aydınlatma Metni", "Kefalet Sözleşmesi"],
    sozlesme: ["Bireysel Taşıt Kredisi", "İhtiyaç Kredisi"],
  },
  Bayi: {
    evrak: ["Satıcı Genel Sözleşmesi", "KVKK Ek Protokolü", "Portal Kullanım Taahhütnamesi"],
    sozlesme: ["Bayi Çerçeve Sözleşmesi", "Satıcı Sözleşmesi"],
  },
  Spot: {
    evrak: ["Spot Kredi Sözleşmesi", "Şahsi Kefalet Evrakı", "Rehin Sözleşmesi"],
    sozlesme: ["Spot Kredi"],
  },
  Filo: {
    evrak: ["Filo Çerçeve Sözleşmesi", "Kiralama Sözleşmesi", "Kredi Sözleşmesi"],
    sozlesme: ["Filo Kiralama", "Filo Kredisi"],
  },
};
const TUR_AGIRLIK: [EvrakTur, number][] = [
  ["Tüketici", 8],
  ["Bayi", 5],
  ["Spot", 5],
  ["Filo", 3],
];
const TEDARIKCILER = ["Doğuş Oto A.Ş.", "Borusan Lojistik", "Otokoç Tic.", "Anadolu Stok", "Ege Oto Dağıtım"];
const FILO_MUSTERILERI = ["Anadolu Filo A.Ş.", "Ege Kurumsal Kiralama", "Marmara Lojistik", "Pegasus Filo", "Setur Filo Yönetimi"];
const HATA = ["Sözleşme yok", "İmza eksik", "Sistemle uyumsuz", "Tarih hatalı", "Kaşe eksik"];
const HATA_W = [5, 6, 4, 2, 3];
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
function weighted<T>(r: () => number, opts: T[], weights: number[]): T {
  let x = r() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < opts.length; i++) {
    x -= weights[i];
    if (x <= 0) {
      return opts[i];
    }
  }
  return opts[opts.length - 1];
}
const pick = <T,>(r: () => number, xs: T[]): T => xs[Math.floor(r() * xs.length)];

/** Türe göre taraf (Müşteri / Tedarikçi / Bayi). */
function partyFor(tur: EvrakTur, r: () => number, bayi: string): string {
  if (tur === "Tüketici") {
    return `${pick(r, [...HARF])}*** ${pick(r, [...HARF])}***`;
  }
  if (tur === "Bayi") {
    return bayi;
  }
  if (tur === "Spot") {
    return pick(r, TEDARIKCILER);
  }
  return pick(r, FILO_MUSTERILERI);
}

function generate(): MissingDoc[] {
  const r = rng(131313);
  const out: MissingDoc[] = [];
  for (let i = 0; i < 130; i++) {
    const [bayi, distributor, bolge, il] = BAYILER[Math.floor(r() * BAYILER.length)];
    const tur = weighted(
      r,
      TUR_AGIRLIK.map((t) => t[0]),
      TUR_AGIRLIK.map((t) => t[1])
    );
    const cfg = TUR_CONFIG[tur];
    const yil = r() < 0.45 ? 2024 : 2025;
    const ay = 1 + Math.floor(r() * 12);
    const gun = 1 + Math.floor(r() * 28);
    const o = orgFields(bayi, r);
    out.push({
      altSektor: o.altSektor,
      bayi,
      bolge,
      bolgeYoneticisi: o.bolgeYoneticisi,
      danisman: o.danisman,
      distributor,
      evrakTarihi: `${String(gun).padStart(2, "0")}.${String(ay).padStart(2, "0")}.${yil}`,
      evrakTuru: pick(r, cfg.evrak),
      hataTuru: weighted(r, HATA, HATA_W),
      il,
      ilce: o.ilce,
      musteriTedarikci: partyFor(tur, r, bayi),
      sektorMuduru: o.sektorMuduru,
      sozlesmeNo: `SZ-${300000 + i}`,
      sozlesmeTuru: pick(r, cfg.sozlesme),
      tur,
      yil,
    });
  }
  return out;
}

export const MISSING_DOCS: MissingDoc[] = /*#__PURE__*/ generate();
