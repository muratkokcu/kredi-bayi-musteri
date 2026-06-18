import { useQuery } from "@tanstack/react-query";
import { getCommissions } from "@/services/commissions";
import { queryKeys } from "./keys";

/** Dealer commissions overview. */
export function useCommissions() {
  return useQuery({
    queryKey: queryKeys.commissions,
    queryFn: getCommissions,
  });
}
