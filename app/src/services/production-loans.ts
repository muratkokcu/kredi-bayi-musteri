import { PRODUCTION_LOANS, type ProductionLoan } from "@/data/production-loans";
import { simulate } from "./client";

/** Loan-level production/profitability records (Üretim & Karlılık). */
export function listProductionLoans(): Promise<ProductionLoan[]> {
  return simulate(PRODUCTION_LOANS);
}
