import { useQuery } from "@tanstack/react-query";
import { listDealerSales } from "@/services/dealer-sales";
import { queryKeys } from "./keys";

/** Bayi Performans & Penetrasyon — monthly sales rows. */
export function useDealerSales() {
  return useQuery({
    queryKey: queryKeys.dealerSales,
    queryFn: listDealerSales,
  });
}
