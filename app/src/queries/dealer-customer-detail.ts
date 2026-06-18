import { useQuery } from "@tanstack/react-query";
import { getDealerCustomerDetail } from "@/services/dealer-customer-detail";
import { queryKeys } from "./keys";

/** Dealer single-customer detail. */
export function useDealerCustomerDetail() {
  return useQuery({
    queryKey: queryKeys.dealerCustomerDetail,
    queryFn: getDealerCustomerDetail,
  });
}
