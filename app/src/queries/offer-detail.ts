import { useQuery } from "@tanstack/react-query";
import { getOfferDetail } from "@/services/offer-detail";
import { queryKeys } from "./keys";

/** Customer single-offer detail. */
export function useOfferDetail() {
  return useQuery({
    queryKey: queryKeys.offerDetail,
    queryFn: getOfferDetail,
  });
}
