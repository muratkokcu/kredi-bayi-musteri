import { REPORTS, type Reports } from "@/data/reports";
import { simulate } from "./client";

/** Bank reports analytics (KPIs, trend, segments, funnel, dealers, regions). */
export function getReports(): Promise<Reports> {
  return simulate(REPORTS);
}
