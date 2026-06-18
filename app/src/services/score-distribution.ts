import {
  SCORE_DISTRIBUTION,
  type ScoreDistribution,
} from "@/data/score-distribution";
import { simulate } from "./client";

/** Renewal-score distribution across the customer base. */
export function getScoreDistribution(): Promise<ScoreDistribution> {
  return simulate(SCORE_DISTRIBUTION);
}
