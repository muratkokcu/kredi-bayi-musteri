import { DEALER_SALES, type DealerSalesRow } from "@/data/dealer-sales";
import { simulate } from "./client";

/** Monthly dealer sales / penetration rows (Bayi Performans & Penetrasyon). */
export function listDealerSales(): Promise<DealerSalesRow[]> {
  return simulate(DEALER_SALES);
}
