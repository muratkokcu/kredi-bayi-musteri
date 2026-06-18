import { DEALERS, type Dealer } from "@/data/dealers";
import { simulate } from "./client";

/** Bank-side dealer network list. */
export function listDealers(): Promise<Dealer[]> {
  return simulate(DEALERS);
}
