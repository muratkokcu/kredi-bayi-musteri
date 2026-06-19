import { useQuery } from "@tanstack/react-query";
import { listAuditEvents } from "@/services/audit-log";

/** Immutable audit trail (append-only). */
export function useAuditLog() {
  return useQuery({
    queryKey: ["audit-log"],
    queryFn: listAuditEvents,
  });
}
