import { CUSTOMER_PROFILE, type CustomerProfile } from "@/data/customer-profile";
import { simulate } from "./client";

/** Customer profile record. Backed by seed data via the fake service layer. */
export function getCustomerProfile(): Promise<CustomerProfile> {
  return simulate(CUSTOMER_PROFILE);
}
