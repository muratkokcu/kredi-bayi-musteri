import type { ProductionLoan } from "@/data/production-loans";
import { fetchPayload } from "./client";

/** Loan-level production/profitability records (Üretim & Karlılık). */
export function listProductionLoans(): Promise<ProductionLoan[]> {
  return fetchPayload<ProductionLoan[]>("production-loans");
}
