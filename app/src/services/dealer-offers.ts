import { COLUMNS, type Column } from "@/data/dealer-offers";
import { simulate } from "./client";

/** Dealer-side offers pipeline, grouped by stage column. */
export function listDealerOffers(): Promise<Column[]> {
  return simulate(COLUMNS);
}
