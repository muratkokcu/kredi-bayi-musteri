import { CUSTOMER_HOME, type CustomerHome } from "@/data/customer-home";
import { simulate } from "./client";

/** Customer home overview. Backed by seed data via the fake service layer. */
export function getCustomerHome(): Promise<CustomerHome> {
  return simulate(CUSTOMER_HOME);
}
