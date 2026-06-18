import { useQuery } from "@tanstack/react-query";
import { getVehicleDetail } from "@/services/vehicle-detail";
import { queryKeys } from "./keys";

/** Dealer single-vehicle detail. */
export function useVehicleDetail() {
  return useQuery({
    queryKey: queryKeys.vehicleDetail,
    queryFn: getVehicleDetail,
  });
}
