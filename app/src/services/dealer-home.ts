import { DEALER_HOME, type DealerHome } from "@/data/dealer-home";
import { simulate } from "./client";

/** Dealer home (dashboard) overview. Backed by seed data via the fake service layer. */
export function getDealerHome(): Promise<DealerHome> {
  return simulate(DEALER_HOME);
}
