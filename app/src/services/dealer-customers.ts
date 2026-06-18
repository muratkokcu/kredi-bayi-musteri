import { DEALER_CUSTOMERS, type DealerCustomer } from "@/data/dealer-customers";
import { simulate } from "./client";

/** Dealer-side assigned customers list. */
export function listDealerCustomers(): Promise<DealerCustomer[]> {
  return simulate(DEALER_CUSTOMERS);
}
