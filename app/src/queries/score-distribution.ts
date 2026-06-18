import { useQuery } from "@tanstack/react-query";
import { getScoreDistribution } from "@/services/score-distribution";
import { queryKeys } from "./keys";

/** Renewal-score distribution preview. */
export function useScoreDistribution() {
  return useQuery({
    queryKey: queryKeys.scoreDistribution,
    queryFn: getScoreDistribution,
  });
}
