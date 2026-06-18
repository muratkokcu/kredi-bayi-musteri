import { DEALER_DETAIL, type DealerDetail } from "@/data/dealer-detail";
import { simulate } from "./client";

/** Bank dealer detail. Backed by seed data via the fake service layer. */
export function getDealerDetail(): Promise<DealerDetail> {
  return simulate(DEALER_DETAIL);
}
