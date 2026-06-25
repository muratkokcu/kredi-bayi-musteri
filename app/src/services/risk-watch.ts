import type { RiskContract } from "@/data/risk-watch";
import { fetchPayload } from "./client";

/** Risk / watch-list contracts (Risk & İzleme). */
export function listRiskContracts(): Promise<RiskContract[]> {
  return fetchPayload<RiskContract[]>("risk-watch");
}
