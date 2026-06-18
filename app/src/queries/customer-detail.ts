import { useQuery } from "@tanstack/react-query";
import { getCustomerDetail } from "@/services/customer-detail";
import { queryKeys } from "./keys";

/** Bank single-customer detail. */
export function useCustomerDetail() {
  return useQuery({
    queryKey: queryKeys.customerDetail,
    queryFn: getCustomerDetail,
  });
}
