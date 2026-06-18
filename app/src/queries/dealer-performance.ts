import { useQuery } from "@tanstack/react-query";
import { getDealerPerformance } from "@/services/dealer-performance";
import { queryKeys } from "./keys";

/** Dealer performance & analytics overview. */
export function useDealerPerformance() {
  return useQuery({
    queryKey: queryKeys.dealerPerformance,
    queryFn: getDealerPerformance,
  });
}
