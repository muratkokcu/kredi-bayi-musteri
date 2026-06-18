import {
  VEHICLE_PREFERENCES,
  type VehiclePreferences,
} from "@/data/vehicle-preferences";
import { simulate } from "./client";

/** Customer vehicle preferences. Backed by seed data via the fake service layer. */
export function getVehiclePreferences(): Promise<VehiclePreferences> {
  return simulate(VEHICLE_PREFERENCES);
}
