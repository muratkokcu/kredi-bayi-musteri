import { useQuery } from "@tanstack/react-query";
import { listProductionLoans } from "@/services/production-loans";
import { queryKeys } from "./keys";

/** Üretim & Karlılık — loan-level records. */
export function useProductionLoans() {
  return useQuery({
    queryKey: queryKeys.productionLoans,
    queryFn: listProductionLoans,
  });
}
