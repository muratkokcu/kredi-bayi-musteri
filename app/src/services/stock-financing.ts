import { STOCK_LOANS, type StockLoan } from "@/data/stock-financing";
import { simulate } from "./client";

/** Stock financing records (Stok Finansmanı). */
export function listStockLoans(): Promise<StockLoan[]> {
  return simulate(STOCK_LOANS);
}
