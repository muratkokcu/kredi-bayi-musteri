/**
 * Rapor kırılımları için ortak org/boyut sözlüğü (kurum şablonundaki kırılım
 * eksenleri). Tüm rapor veri setleri bunu kullanır ki bayi → distribütör/bölge/
 * il/ilçe/bölge yöneticisi ve alt sektör/sektör müdürü/danışman tutarlı olsun.
 * (Yetkilendirme DEĞİL — sadece raporlama kırılımı.)
 */
export const DIKEY = "Otomotiv";

export const ALT_SEKTORLER = ["Binek", "Hafif Ticari", "Ağır Ticari", "İkinci El"];
const ALT_W = [55, 22, 8, 15];

const SEKTOR_MUDURU_BY_ALT: Record<string, string> = {
  Binek: "B. Şahin",
  "Hafif Ticari": "E. Koç",
  "Ağır Ticari": "E. Koç",
  "İkinci El": "N. Arı",
};
export const SEKTOR_MUDURLERI = [...new Set(Object.values(SEKTOR_MUDURU_BY_ALT))];
export const ALT_SEKTOR_W = ALT_W;

export function sektorMuduruFor(altSektor: string): string {
  return SEKTOR_MUDURU_BY_ALT[altSektor] ?? SEKTOR_MUDURLERI[0];
}

export interface BayiOrg {
  distributor: string;
  bolge: string;
  il: string;
  ilce: string;
  bolgeYoneticisi: string;
  danismanlar: string[];
}

export const BAYI_ORG: Record<string, BayiOrg> = {
  "Doğuş Otomotiv": { distributor: "Doğuş Oto Dağıtım", bolge: "Marmara", il: "İstanbul", ilce: "Maslak", bolgeYoneticisi: "M. Yıldız", danismanlar: ["Ahmet Y.", "Elif K."] },
  "Borusan Otomotiv": { distributor: "Borusan Otomotiv Dağıtım", bolge: "Marmara", il: "İstanbul", ilce: "Şişli", bolgeYoneticisi: "M. Yıldız", danismanlar: ["Mert D.", "Zeynep A."] },
  "Otokoç Otomotiv": { distributor: "Otokoç Dağıtım", bolge: "İç Anadolu", il: "Ankara", ilce: "Çankaya", bolgeYoneticisi: "A. Demir", danismanlar: ["Can T.", "Derya S."] },
  "Groupe PSA Bayi": { distributor: "Bağımsız Kanal", bolge: "Ege", il: "İzmir", ilce: "Bornova", bolgeYoneticisi: "S. Aksoy", danismanlar: ["Burak Ö.", "Selin G."] },
  "Çetaş Otomotiv": { distributor: "Bağımsız Kanal", bolge: "Marmara", il: "Bursa", ilce: "Nilüfer", bolgeYoneticisi: "M. Yıldız", danismanlar: ["Onur B.", "Ayşe M."] },
  "Aydın Otomotiv": { distributor: "Bağımsız Kanal", bolge: "Akdeniz", il: "Antalya", ilce: "Muratpaşa", bolgeYoneticisi: "K. Çelik", danismanlar: ["Ahmet Y.", "Derya S."] },
  "Maslak Motors": { distributor: "Bağımsız Kanal", bolge: "Marmara", il: "İstanbul", ilce: "Sarıyer", bolgeYoneticisi: "M. Yıldız", danismanlar: ["Mert D.", "Selin G."] },
  "Ege Oto Plaza": { distributor: "Otokoç Dağıtım", bolge: "Ege", il: "İzmir", ilce: "Karşıyaka", bolgeYoneticisi: "S. Aksoy", danismanlar: ["Can T.", "Ayşe M."] },
};

export const BAYILER = Object.keys(BAYI_ORG);

function pick<T>(r: () => number, opts: T[], weights?: number[]): T {
  if (!weights) {
    return opts[Math.floor(r() * opts.length)];
  }
  let x = r() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < opts.length; i++) {
    x -= weights[i];
    if (x <= 0) {
      return opts[i];
    }
  }
  return opts[opts.length - 1];
}

export interface OrgFields {
  altSektor: string;
  bolgeYoneticisi: string;
  danisman: string;
  ilce: string;
  sektorMuduru: string;
}

/** Bir kayıt için kırılım alanlarını üretir (rng paylaşımlı). */
export function orgFields(bayi: string, r: () => number): OrgFields {
  const e = BAYI_ORG[bayi];
  const altSektor = pick(r, ALT_SEKTORLER, ALT_W);
  return {
    altSektor,
    bolgeYoneticisi: e.bolgeYoneticisi,
    danisman: e.danismanlar[Math.floor(r() * e.danismanlar.length)],
    ilce: e.ilce,
    sektorMuduru: SEKTOR_MUDURU_BY_ALT[altSektor],
  };
}
