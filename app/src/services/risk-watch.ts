import { RISK_CONTRACTS, type RiskContract } from "@/data/risk-watch";
import { simulate } from "./client";

/** Risk / watch-list contracts (Risk & İzleme). */
export function listRiskContracts(): Promise<RiskContract[]> {
  return simulate(RISK_CONTRACTS);
}
