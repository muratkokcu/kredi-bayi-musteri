import { LIMITS, type LimitRow } from "@/data/limits";
import { simulate } from "./client";

/** Limit tracking rows (Limit Takip). */
export function listLimits(): Promise<LimitRow[]> {
  return simulate(LIMITS);
}
