/**
 * Renewal-score distribution preview — the server-derived metric on the score
 * settings screen (how the customer base spreads across score buckets). The
 * scoring parameters/weights themselves stay as interactive local form state.
 */
export interface ScoreBucket {
  color: string;
  count: string;
  frac: number;
  label: string;
  pct: string;
}

export interface ScoreDistribution {
  buckets: ScoreBucket[];
  highRatePct: string;
  total: string;
}

export const SCORE_DISTRIBUTION: ScoreDistribution = {
  total: "245.830",
  highRatePct: "%33",
  buckets: [
    {
      label: "Düşük (0-49)",
      count: "76.245",
      pct: "%31",
      frac: 31,
      color: "var(--color-danger)",
    },
    {
      label: "Orta (50-74)",
      count: "89.312",
      pct: "%36",
      frac: 36,
      color: "var(--color-warn)",
    },
    {
      label: "Yüksek (75-100)",
      count: "80.273",
      pct: "%33",
      frac: 33,
      color: "var(--color-success)",
    },
  ],
};
