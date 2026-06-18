import { useQuery } from "@tanstack/react-query";
import { listStock } from "@/services/stock";
import { queryKeys } from "./keys";

/** Dealer-side vehicle inventory list. */
export function useStock() {
  return useQuery({
    queryKey: queryKeys.stock,
    queryFn: listStock,
  });
}
