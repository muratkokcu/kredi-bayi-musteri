import type { LimitRow } from "@/data/limits";
import { fetchPayload } from "./client";

/** Limit tracking rows (Limit Takip). */
export function listLimits(): Promise<LimitRow[]> {
  return fetchPayload<LimitRow[]>("limits");
}
