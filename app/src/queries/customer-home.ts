import { useQuery } from "@tanstack/react-query";
import { getCustomerHome } from "@/services/customer-home";
import { queryKeys } from "./keys";

/** Customer home overview. */
export function useCustomerHome() {
  return useQuery({
    queryKey: queryKeys.customerHome,
    queryFn: getCustomerHome,
  });
}
