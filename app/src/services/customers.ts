import { CUSTOMERS, type Customer } from "@/data/customers";
import { simulate } from "./client";

/** Bank customer portfolio. Backed by seed data via the fake service layer. */
export function listCustomers(): Promise<Customer[]> {
  return simulate(CUSTOMERS);
}
