import { useQuery } from "@tanstack/react-query";
import { listOpportunities } from "@/services/opportunities";
import { queryKeys } from "./keys";

/** Dealer-side opportunity pool list. */
export function useOpportunities() {
  return useQuery({
    queryKey: queryKeys.opportunities,
    queryFn: listOpportunities,
  });
}
