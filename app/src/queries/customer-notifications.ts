import { useQuery } from "@tanstack/react-query";
import { listCustomerNotifications } from "@/services/customer-notifications";
import { queryKeys } from "./keys";

/** Customer notification feed list. */
export function useCustomerNotifications() {
  return useQuery({
    queryKey: queryKeys.customerNotifications,
    queryFn: listCustomerNotifications,
  });
}
