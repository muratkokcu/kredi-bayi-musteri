import { CUSTOMER_DETAIL, type CustomerDetail } from "@/data/customer-detail";
import { simulate } from "./client";

/** Bank single-customer detail. Backed by seed data via the fake service layer. */
export function getCustomerDetail(): Promise<CustomerDetail> {
  return simulate(CUSTOMER_DETAIL);
}
