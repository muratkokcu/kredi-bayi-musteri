import { useQuery } from "@tanstack/react-query";
import { getBankDashboard } from "@/services/bank-dashboard";
import { queryKeys } from "./keys";

/** Bank dashboard overview. */
export function useBankDashboard() {
  return useQuery({
    queryKey: queryKeys.bankDashboard,
    queryFn: getBankDashboard,
  });
}
