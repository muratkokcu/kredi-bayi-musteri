import { useQuery } from "@tanstack/react-query";
import { listDealers } from "@/services/dealers";
import { queryKeys } from "./keys";

/** Bank-side dealer network list. */
export function useDealers() {
  return useQuery({
    queryKey: queryKeys.dealers,
    queryFn: listDealers,
  });
}
