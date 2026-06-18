import {
  APPLICATION_STATUS,
  type ApplicationStatus,
} from "@/data/application-status";
import { simulate } from "./client";

/** Customer loan-application status. Backed by seed data via the fake service layer. */
export function getApplicationStatus(): Promise<ApplicationStatus> {
  return simulate(APPLICATION_STATUS);
}
