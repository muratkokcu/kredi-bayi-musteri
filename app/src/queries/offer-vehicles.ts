import { useQuery } from "@tanstack/react-query";
import { listOfferVehicles } from "@/services/offer-vehicles";
import { queryKeys } from "./keys";

/** Selectable vehicles for the dealer offer-creation wizard (step 1). */
export function useOfferVehicles() {
  return useQuery({
    queryKey: queryKeys.offerVehicles,
    queryFn: listOfferVehicles,
  });
}
