import { useQuery } from "@tanstack/react-query";
import { getApplicationStatus } from "@/services/application-status";
import { queryKeys } from "./keys";

/** Customer loan-application status. */
export function useApplicationStatus() {
  return useQuery({
    queryKey: queryKeys.applicationStatus,
    queryFn: getApplicationStatus,
  });
}
