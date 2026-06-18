import { OFFER_VEHICLES, type OfferVehicle } from "@/data/offer-vehicles";
import { simulate } from "./client";

/** Selectable vehicles for the dealer offer-creation wizard (step 1). */
export function listOfferVehicles(): Promise<OfferVehicle[]> {
  return simulate(OFFER_VEHICLES);
}
