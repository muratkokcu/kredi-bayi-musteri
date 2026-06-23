/**
 * "Limit Takip" ekranı için limit-bazlı seed.
 * Kurum rapor şablonundaki "Limit Takip Raporu" karşılığı.
 * Kırılım: Grup Adı/Firmaları + org (distribütör/bayi/sektör müdürü/bölge
 * yöneticisi) + bölge/il/ilçe + alt sektör. Deterministik (mulberry32).
 * Servis: src/services/limits.
 */
import { BAYILER, BAYI_ORG, orgFields } from "./org";

export const LIMIT_AYLAR = [
  "Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara",
] as const;

export interface LimitRow {
  altSektor: string;
  ay: number;
  bayi: string;
  bolge: string;
  bolgeYoneticisi: string;
  distributor: string;
  garantorluk: "Var" | "Yok";
  garantorlukTutari: number;
  grupAdi: string;
  il: string;
  ilce: string;
  kullanilabilirLimit: number;
  kullanilanLimit: number;
  limitTuru: string;
  revizeTarihi: string; // gg.aa.yyyy
  sektorMuduru: string;
  toplamLimit: number;
  yil: number;
}

const GRUPLAR = [
  "Yıldız Holding", "Demir Grup", "Anadolu Filo A.Ş.", "Ege Lojistik",
  "Başak Otomotiv Grubu", "Marmara Taşımacılık", "Akdeniz Turizm", "Toros İnşaat",
];
const LIMIT_TURU = [
  "Stok Finansmanı Limiti", "Filo Kredi Limiti", "Nakit Kredi Limiti", "Rotatif Limit",
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
const r1000 = (x: number) => Math.round(x / 1000) * 1000;

function generate(): LimitRow[] {
  const r = rng(648648);
  const out: LimitRow[] = [];
  for (let i = 0; i < 150; i++) {
    const bayi = BAYILER[Math.floor(r() * BAYILER.length)];
    const org = BAYI_ORG[bayi];
    const o = orgFields(bayi, r);
    const toplam = r1000(5_000_000 + r() * 75_000_000);
    const kullanilan = r1000(toplam * (0.15 + r() * 0.8));
    const garantorluk: "Var" | "Yok" = r() < 0.55 ? "Var" : "Yok";
    const yil = r() < 0.45 ? 2024 : 2025;
    const ay = 1 + Math.floor(r() * 12);
    const gun = 1 + Math.floor(r() * 28);
    out.push({
      altSektor: o.altSektor,
      ay,
      bayi,
      bolge: org.bolge,
      bolgeYoneticisi: o.bolgeYoneticisi,
      distributor: org.distributor,
      garantorluk,
      garantorlukTutari: garantorluk === "Var" ? r1000(toplam * (0.3 + r() * 0.5)) : 0,
      grupAdi: GRUPLAR[Math.floor(r() * GRUPLAR.length)],
      il: org.il,
      ilce: o.ilce,
      kullanilabilirLimit: toplam - kullanilan,
      kullanilanLimit: kullanilan,
      limitTuru: LIMIT_TURU[Math.floor(r() * LIMIT_TURU.length)],
      revizeTarihi: `${String(gun).padStart(2, "0")}.${String(ay).padStart(2, "0")}.${yil}`,
      sektorMuduru: o.sektorMuduru,
      toplamLimit: toplam,
      yil,
    });
  }
  return out;
}

export const LIMITS: LimitRow[] = generate();
