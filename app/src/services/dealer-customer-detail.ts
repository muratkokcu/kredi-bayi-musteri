import {
  DEALER_CUSTOMER_DETAIL,
  type DealerCustomerDetail,
} from "@/data/dealer-customer-detail";
import { simulate } from "./client";

/** Dealer single-customer detail. Backed by seed data via the fake service layer. */
export function getDealerCustomerDetail(): Promise<DealerCustomerDetail> {
  return simulate(DEALER_CUSTOMER_DETAIL);
}
