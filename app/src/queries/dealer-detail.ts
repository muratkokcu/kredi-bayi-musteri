import { useQuery } from "@tanstack/react-query";
import { getDealerDetail } from "@/services/dealer-detail";
import { queryKeys } from "./keys";

/** Bank dealer detail record. */
export function useDealerDetail() {
  return useQuery({
    queryKey: queryKeys.dealerDetail,
    queryFn: getDealerDetail,
  });
}
