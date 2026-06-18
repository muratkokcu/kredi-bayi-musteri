import { useQuery } from "@tanstack/react-query";
import { listMyOffers } from "@/services/my-offers";
import { queryKeys } from "./keys";

/** Customer-side received offers list. */
export function useMyOffers() {
  return useQuery({
    queryKey: queryKeys.myOffers,
    queryFn: listMyOffers,
  });
}
