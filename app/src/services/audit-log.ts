import { AUDIT_EVENTS, type AuditEvent } from "@/data/audit-log";
import { simulate } from "./client";

/** Immutable audit trail (append-only). */
export function listAuditEvents(): Promise<AuditEvent[]> {
  return simulate(AUDIT_EVENTS);
}
