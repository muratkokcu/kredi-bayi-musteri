import { useQuery } from "@tanstack/react-query";
import { listDealerProfitability } from "@/services/dealer-profitability";
import { queryKeys } from "./keys";

/** Bank-side dealer profitability / performance tracking. */
export function useDealerProfitability() {
  return useQuery({
    queryKey: queryKeys.dealerProfitability,
    queryFn: listDealerProfitability,
  });
}
