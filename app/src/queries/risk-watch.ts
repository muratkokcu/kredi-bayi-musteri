import { useQuery } from "@tanstack/react-query";
import { listRiskContracts } from "@/services/risk-watch";
import { queryKeys } from "./keys";

/** Risk & İzleme — watch-list contracts. */
export function useRiskContracts() {
  return useQuery({ queryKey: queryKeys.riskContracts, queryFn: listRiskContracts });
}
