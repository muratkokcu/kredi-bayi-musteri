import { useQuery } from "@tanstack/react-query";
import { listCustomers } from "@/services/customers";
import { queryKeys } from "./keys";

/** Bank customer portfolio list. */
export function useCustomers() {
  return useQuery({
    queryKey: queryKeys.customers,
    queryFn: listCustomers,
  });
}
