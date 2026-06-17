import raw from "./arac-taksonomisi.json";

/**
 * Vehicle taxonomy — sourced from arabam.com/tum-markalar (see `kaynak`/`tarih`
 * in the JSON). This is the single source of truth for brand / model / variant
 * and the body-type → category segment standard. Screens MUST derive vehicle
 * options and segment labels from here rather than inventing values.
 */

export interface KasaKategori {
  kasaTipleri: string[];
  label: string;
  slug: string;
}

export interface AracModel {
  kategori: string;
  model: string;
  slug: string;
  varyantlar: string[];
}

export interface AracMarka {
  kategoriler: string[];
  marka: string;
  modeller: AracModel[];
  slug: string;
}

// --- raw shapes (the JSON has one model keyed `veriantlar` by typo) ----------
interface RawKategori {
  kasa_tipleri: string[];
  label: string;
  slug: string;
}
interface RawModel {
  kategori: string;
  model: string;
  slug: string;
  varyantlar?: string[];
  veriantlar?: string[];
}
interface RawMarka {
  kategoriler: string[];
  marka: string;
  modeller: RawModel[];
  slug: string;
}
interface RawMeta {
  not: string;
  segment_map: Record<string, string[]>;
  toplam_marka: number;
  vites_tipleri: string[];
  yakit_tipleri: string[];
}
interface RawTaxonomy {
  kategoriler: RawKategori[];
  kaynak: string;
  markalar: RawMarka[];
  meta: RawMeta;
  tarih: string;
}

const data = raw as RawTaxonomy;

export const kaynak = data.kaynak;
export const tarih = data.tarih;

export const kategoriler: KasaKategori[] = data.kategoriler.map((k) => ({
  slug: k.slug,
  label: k.label,
  kasaTipleri: k.kasa_tipleri,
}));

export const markalar: AracMarka[] = data.markalar.map((m) => ({
  marka: m.marka,
  slug: m.slug,
  kategoriler: m.kategoriler,
  modeller: m.modeller.map((md) => ({
    model: md.model,
    slug: md.slug,
    kategori: md.kategori,
    // tolerate the `veriantlar` typo present in the source data
    varyantlar: md.varyantlar ?? md.veriantlar ?? [],
  })),
}));

/** Segment standard: body type (kasa tipi) → category slug. */
export const kasaTipiKategori: Record<string, string> = {};
for (const k of kategoriler) {
  for (const tip of k.kasaTipleri) {
    kasaTipiKategori[tip] = k.slug;
  }
}

/** Flat list of every body type across categories (segment options). */
export const kasaTipleri: string[] = kategoriler.flatMap((k) => k.kasaTipleri);

const markaBySlug = new Map(markalar.map((m) => [m.slug, m]));

export function getMarka(slug: string): AracMarka | undefined {
  return markaBySlug.get(slug);
}

export function getModel(
  markaSlug: string,
  modelSlug: string
): AracModel | undefined {
  return getMarka(markaSlug)?.modeller.find((m) => m.slug === modelSlug);
}

export function markalarByKategori(kategoriSlug: string): AracMarka[] {
  return markalar.filter((m) => m.kategoriler.includes(kategoriSlug));
}

export function kategoriLabel(slug: string): string {
  return kategoriler.find((k) => k.slug === slug)?.label ?? slug;
}

// --- meta: fuel/transmission vocab + EU segment map (A/B/C/D/E + SUV/EV) -----
export const yakitTipleri: string[] = data.meta.yakit_tipleri;
export const vitesTipleri: string[] = data.meta.vites_tipleri;
export const toplamMarka: number = data.meta.toplam_marka;

/** EU segment standard → representative model examples (from source data). */
export const segmentMap: Record<string, string[]> = data.meta.segment_map;
export const segmentKodlari: string[] = Object.keys(segmentMap);
