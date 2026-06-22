import {
  DEALER_PROFITABILITY,
  type DealerProfit,
} from "@/data/dealer-profitability";
import { simulate } from "./client";

/** Bank-side dealer profitability / performance tracking rows. */
export function listDealerProfitability(): Promise<DealerProfit[]> {
  return simulate(DEALER_PROFITABILITY);
}
