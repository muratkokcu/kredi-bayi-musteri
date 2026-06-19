import { useQuery } from "@tanstack/react-query";
import { listConsents } from "@/services/consents";

/** KVKK consent registry list. */
export function useConsents() {
  return useQuery({
    queryKey: ["consents"],
    queryFn: listConsents,
  });
}
