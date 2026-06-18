import { useQuery } from "@tanstack/react-query";
import { getImportHistory } from "@/services/import-history";
import { queryKeys } from "./keys";

/** Portfolio import history list. */
export function useImportHistory() {
  return useQuery({
    queryKey: queryKeys.importHistory,
    queryFn: getImportHistory,
  });
}
