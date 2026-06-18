import { OPPORTUNITIES, type Opportunity } from "@/data/opportunities";
import { simulate } from "./client";

/** Dealer-side opportunity pool list. */
export function listOpportunities(): Promise<Opportunity[]> {
  return simulate(OPPORTUNITIES);
}
