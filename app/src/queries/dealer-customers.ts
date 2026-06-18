import { useQuery } from "@tanstack/react-query";
import { listDealerCustomers } from "@/services/dealer-customers";
import { queryKeys } from "./keys";

/** Dealer-side assigned customers list. */
export function useDealerCustomers() {
  return useQuery({
    queryKey: queryKeys.dealerCustomers,
    queryFn: listDealerCustomers,
  });
}
