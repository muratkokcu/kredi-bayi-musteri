import type { StockLoan } from "@/data/stock-financing";
import { fetchPayload } from "./client";

/** Stock financing records (Stok Finansmanı). */
export function listStockLoans(): Promise<StockLoan[]> {
  return fetchPayload<StockLoan[]>("stock-financing");
}
