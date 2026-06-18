import { OFFERS, type Offer } from "@/data/my-offers";
import { simulate } from "./client";

/** Customer-side received offers list. */
export function listMyOffers(): Promise<Offer[]> {
  return simulate(OFFERS);
}
