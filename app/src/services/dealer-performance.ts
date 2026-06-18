import {
  DEALER_PERFORMANCE,
  type DealerPerformance,
} from "@/data/dealer-performance";
import { simulate } from "./client";

/** Dealer performance & analytics overview. Backed by seed data via the fake service layer. */
export function getDealerPerformance(): Promise<DealerPerformance> {
  return simulate(DEALER_PERFORMANCE);
}
