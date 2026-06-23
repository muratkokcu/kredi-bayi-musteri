import { useQuery } from "@tanstack/react-query";
import { listStockLoans } from "@/services/stock-financing";
import { queryKeys } from "./keys";

/** Stok Finansmanı — stock financing records. */
export function useStockLoans() {
  return useQuery({ queryKey: queryKeys.stockLoans, queryFn: listStockLoans });
}
