import { CONSENTS, type ConsentRecord } from "@/data/consents";
import { simulate } from "./client";

/** KVKK consent registry — timestamped, auditable customer consents. */
export function listConsents(): Promise<ConsentRecord[]> {
  return simulate(CONSENTS);
}
