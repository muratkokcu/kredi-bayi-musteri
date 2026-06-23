import { MISSING_DOCS, type MissingDoc } from "@/data/missing-docs";
import { simulate } from "./client";

/** Missing document records (Eksik Evrak). */
export function listMissingDocs(): Promise<MissingDoc[]> {
  return simulate(MISSING_DOCS);
}
