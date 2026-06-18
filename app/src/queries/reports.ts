import { useQuery } from "@tanstack/react-query";
import { getReports } from "@/services/reports";
import { queryKeys } from "./keys";

/** Bank reports analytics for the Raporlar screen. */
export function useReports() {
  return useQuery({ queryKey: queryKeys.reports, queryFn: getReports });
}
