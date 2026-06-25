import type { Application } from "@/data/applications";
import { fetchPayload } from "./client";

/** Application-level records (Başvuru Hunisi & Dönüşüm). */
export function listApplications(): Promise<Application[]> {
  return fetchPayload<Application[]>("applications");
}
