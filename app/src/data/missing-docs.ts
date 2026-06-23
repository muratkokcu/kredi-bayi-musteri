/**
 * "Eksik Evrak" ekranı için kayıt-bazlı seed.
 * Kurum rapor şablonundaki "Eksik Evrak Takip (Tüketici/Bayi + Stok/Filo)".
 * Deterministik (mulberry32). Servis: src/services/missing-docs.
 */
export type EvrakTur = "Tüketici/Bayi" | "Stok/Filo";

export interface MissingDoc {
  bayi: string;
  bolge: string;
  evrakTuru: string;
  hataTuru: string;
  musteriTedarikci: string;
  sozlesmeNo: string;
  tur: EvrakTur;
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
const TEDARIKCI = ["Doğuş Oto A.Ş.", "Borusan Lojistik", "Otokoç Tic.", "Ege Filo", "Anadolu Stok"];
const EVRAK_TUK = ["Satıcı Genel Sözleşmesi", "KVKK Ek Protokolü", "Portal Kullanım Taahhütnamesi", "Kredi Sözleşmesi"];
const EVRAK_STOK = ["Stok Finansmanı Sözleşmesi", "Garantörlük Evrakı", "Kredi Sözleşmesi"];
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

function generate(): MissingDoc[] {
  const r = rng(131313);
  const out: MissingDoc[] = [];
  for (let i = 0; i < 130; i++) {
    const [bayi, bolge] = BAYILER[Math.floor(r() * BAYILER.length)];
    const tur: EvrakTur = r() < 0.65 ? "Tüketici/Bayi" : "Stok/Filo";
    out.push({
      bayi,
      bolge,
      evrakTuru: tur === "Tüketici/Bayi" ? EVRAK_TUK[Math.floor(r() * EVRAK_TUK.length)] : EVRAK_STOK[Math.floor(r() * EVRAK_STOK.length)],
      hataTuru: weighted(r, HATA, HATA_W),
      musteriTedarikci:
        tur === "Tüketici/Bayi"
          ? `${HARF[Math.floor(r() * HARF.length)]}*** ${HARF[Math.floor(r() * HARF.length)]}***`
          : TEDARIKCI[Math.floor(r() * TEDARIKCI.length)],
      sozlesmeNo: `SZ-${300000 + i}`,
      tur,
      yil: r() < 0.45 ? 2024 : 2025,
    });
  }
  return out;
}

export const MISSING_DOCS: MissingDoc[] = generate();
