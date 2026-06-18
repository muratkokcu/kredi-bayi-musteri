import {
  IMPORT_HISTORY,
  type ImportHistoryRow,
} from "@/data/import-history";
import { simulate } from "./client";

/** Past portfolio CSV imports for the import wizard's history panel. */
export function getImportHistory(): Promise<ImportHistoryRow[]> {
  return simulate(IMPORT_HISTORY);
}
