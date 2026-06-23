import { useQuery } from "@tanstack/react-query";
import { listApplications } from "@/services/applications";
import { queryKeys } from "./keys";

/** Başvuru Hunisi & Dönüşüm — application records. */
export function useApplications() {
  return useQuery({
    queryKey: queryKeys.applications,
    queryFn: listApplications,
  });
}
