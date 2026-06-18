import { useQuery } from "@tanstack/react-query";
import { getCustomerProfile } from "@/services/customer-profile";
import { queryKeys } from "./keys";

/** Customer profile record. */
export function useCustomerProfile() {
  return useQuery({
    queryKey: queryKeys.customerProfile,
    queryFn: getCustomerProfile,
  });
}
