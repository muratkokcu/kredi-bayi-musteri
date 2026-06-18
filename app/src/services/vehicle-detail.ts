import { VEHICLE_DETAIL, type VehicleDetail } from "@/data/vehicle-detail";
import { simulate } from "./client";

/** Dealer single-vehicle detail. Backed by seed data via the fake service layer. */
export function getVehicleDetail(): Promise<VehicleDetail> {
  return simulate(VEHICLE_DETAIL);
}
