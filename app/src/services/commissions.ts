import { COMMISSIONS, type Commissions } from "@/data/commissions";
import { simulate } from "./client";

/** Dealer commissions overview. Backed by seed data via the fake service layer. */
export function getCommissions(): Promise<Commissions> {
  return simulate(COMMISSIONS);
}
