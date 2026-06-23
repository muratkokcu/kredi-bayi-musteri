import { APPLICATIONS, type Application } from "@/data/applications";
import { simulate } from "./client";

/** Application-level records (Başvuru Hunisi & Dönüşüm). */
export function listApplications(): Promise<Application[]> {
  return simulate(APPLICATIONS);
}
