import { useQuery } from "@tanstack/react-query";
import { listDealerOffers } from "@/services/dealer-offers";
import { queryKeys } from "./keys";

/** Dealer-side offers pipeline list. */
export function useDealerOffers() {
  return useQuery({
    queryKey: queryKeys.dealerOffers,
    queryFn: listDealerOffers,
  });
}
