import { STOCK, type StockVehicle } from "@/data/stock";
import { simulate } from "./client";

/** Dealer-side vehicle inventory list. */
export function listStock(): Promise<StockVehicle[]> {
  return simulate(STOCK);
}
