import { useQuery } from "@tanstack/react-query";
import { getVehiclePreferences } from "@/services/vehicle-preferences";
import { queryKeys } from "./keys";

/** Customer vehicle preferences (saved searches + recommended vehicles). */
export function useVehiclePreferences() {
  return useQuery({
    queryKey: queryKeys.vehiclePreferences,
    queryFn: getVehiclePreferences,
  });
}
