import type { MissingDoc } from "@/data/missing-docs";
import { fetchPayload } from "./client";

/** Missing document records (Eksik Evrak). */
export function listMissingDocs(): Promise<MissingDoc[]> {
  return fetchPayload<MissingDoc[]>("missing-docs");
}
