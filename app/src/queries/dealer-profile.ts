import { useQuery } from "@tanstack/react-query";
import { getDealerProfile } from "@/services/dealer-profile";
import { queryKeys } from "./keys";

/** Dealer store profile record for the settings screen. */
export function useDealerProfile() {
  return useQuery({
    queryKey: queryKeys.dealerProfile,
    queryFn: getDealerProfile,
  });
}
