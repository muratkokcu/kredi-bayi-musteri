import { useQuery } from "@tanstack/react-query";
import { listMissingDocs } from "@/services/missing-docs";
import { queryKeys } from "./keys";

/** Eksik Evrak — missing document records. */
export function useMissingDocs() {
  return useQuery({ queryKey: queryKeys.missingDocs, queryFn: listMissingDocs });
}
