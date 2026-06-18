import { BANK_DASHBOARD, type BankDashboard } from "@/data/bank-dashboard";
import { simulate } from "./client";

/** Bank dashboard overview. Backed by seed data via the fake service layer. */
export function getBankDashboard(): Promise<BankDashboard> {
  return simulate(BANK_DASHBOARD);
}
