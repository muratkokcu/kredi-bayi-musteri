import { OFFER_DETAIL, type OfferDetail } from "@/data/offer-detail";
import { simulate } from "./client";

/** Customer single-offer detail. Backed by seed data via the fake service layer. */
export function getOfferDetail(): Promise<OfferDetail> {
  return simulate(OFFER_DETAIL);
}
