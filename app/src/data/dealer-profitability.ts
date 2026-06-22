/**
 * Bank-side dealer profitability / performance tracking — seed for the
 * "Bayi Karlılık Takibi" decision-grade screen (ERKPORT-style heatmap +
 * YoY combo). Derived deterministically from the dealer network seed
 * (src/data/dealers) so numbers stay stable across reloads. Served via
 * src/services/dealer-profitability.
 */
import { DEALERS, type Dealer } from "./dealers";

/** Trailing 12 months ending the current period. */
export const PROFIT_MONTHS = [
  "Tem",
  "Ağu",
  "Eyl",
  "Eki",
  "Kas",
  "Ara",
  "Oca",
  "Şub",
  "Mar",
  "Nis",
  "May",
  "Haz",
] as const;

export type MetricKey =
  | "kabulHacmi"
  | "komisyon"
  | "yenilemeOrani"
  | "teklifSayisi";

export interface MetricMeta {
  key: MetricKey;
  label: string;
  kind: "money" | "percent" | "count";
  /** how the Total column aggregates the 12 months */
  agg: "sum" | "avg";
}

export const METRICS: MetricMeta[] = [
  { key: "kabulHacmi", label: "Kabul Hacmi", kind: "money", agg: "sum" },
  { key: "komisyon", label: "Komisyon", kind: "money", agg: "sum" },
  { key: "yenilemeOrani", label: "Yenileme Oranı", kind: "percent", agg: "avg" },
  { key: "teklifSayisi", label: "Teklif Sayısı", kind: "count", agg: "sum" },
];

export interface MetricSeries {
  current: number[];
  previous: number[];
}

export interface DealerProfit {
  id: string;
  name: string;
  initials: string;
  logoTone: string;
  bolge: string;
  tip: "Bireysel" | "Ticari";
  series: Record<MetricKey, MetricSeries>;
}

const AVG_LOAN = 1_350_000; // ortalama yenileme kredisi tutarı (₺)
const COMMISSION_RATE = 0.016; // ~%1,6

/** Small deterministic PRNG (mulberry32) so seed data is stable. */
function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function emptySeries(): MetricSeries {
  return { current: [], previous: [] };
}

function buildDealer(d: Dealer, i: number): DealerProfit {
  const r = rng(1000 + i * 97 + d.teklif);
  const monthlyOffers = d.teklif / 12;
  const baseAccept = monthlyOffers * (d.donusum / 100);
  // kararlı yön eğimi: bazı bayiler yükselişte, bazıları düşüşte
  const drift = (r() - 0.5) * 0.07;
  const yoy = 0.92 + r() * 0.22; // geçen yıla göre büyüme çarpanı

  const kabulHacmi = emptySeries();
  const komisyon = emptySeries();
  const yenilemeOrani = emptySeries();
  const teklifSayisi = emptySeries();

  for (let m = 0; m < 12; m++) {
    const season = 1 + 0.12 * Math.sin((m / 12) * Math.PI * 2 + i);
    const trendMul = 1 + drift * m;
    const noise = 0.82 + r() * 0.36;

    const accept = Math.max(2, baseAccept * season * trendMul * noise);
    const hac = Math.round(accept * AVG_LOAN);
    kabulHacmi.current.push(hac);
    komisyon.current.push(Math.round(hac * COMMISSION_RATE * (0.9 + r() * 0.2)));
    teklifSayisi.current.push(Math.round(monthlyOffers * season * noise));
    yenilemeOrani.current.push(
      Math.round(d.donusum * (0.85 + r() * 0.3) * 10) / 10
    );

    // geçen yıl: trend olmadan, kendi gürültüsüyle, yoy ile ölçekli
    const pNoise = 0.82 + r() * 0.36;
    const pHac = Math.round((accept / trendMul / yoy) * pNoise * AVG_LOAN);
    kabulHacmi.previous.push(pHac);
    komisyon.previous.push(Math.round(pHac * COMMISSION_RATE * (0.9 + r() * 0.2)));
    teklifSayisi.previous.push(
      Math.round((monthlyOffers / yoy) * season * pNoise)
    );
    yenilemeOrani.previous.push(
      Math.round(d.donusum * (0.8 + r() * 0.3) * 10) / 10
    );
  }

  return {
    id: d.id,
    name: d.name,
    initials: d.initials,
    logoTone: d.logoTone,
    bolge: d.bolge,
    tip: i % 3 === 0 ? "Ticari" : "Bireysel",
    series: { kabulHacmi, komisyon, yenilemeOrani, teklifSayisi },
  };
}

export const DEALER_PROFITABILITY: DealerProfit[] = DEALERS.map(buildDealer);
