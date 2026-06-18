import { useQuery } from "@tanstack/react-query";
import { getDealerHome } from "@/services/dealer-home";
import { queryKeys } from "./keys";

/** Dealer home (dashboard) overview. */
export function useDealerHome() {
  return useQuery({
    queryKey: queryKeys.dealerHome,
    queryFn: getDealerHome,
  });
}
