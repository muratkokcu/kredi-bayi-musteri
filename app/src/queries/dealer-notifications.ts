import { useQuery } from "@tanstack/react-query";
import { listDealerNotifications } from "@/services/dealer-notifications";
import { queryKeys } from "./keys";

/** Dealer notification feed list. */
export function useDealerNotifications() {
  return useQuery({
    queryKey: queryKeys.dealerNotifications,
    queryFn: listDealerNotifications,
  });
}
