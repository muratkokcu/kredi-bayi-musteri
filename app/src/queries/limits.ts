import { useQuery } from "@tanstack/react-query";
import { listLimits } from "@/services/limits";
import { queryKeys } from "./keys";

/** Limit Takip — limit rows. */
export function useLimits() {
  return useQuery({ queryKey: queryKeys.limits, queryFn: listLimits });
}
