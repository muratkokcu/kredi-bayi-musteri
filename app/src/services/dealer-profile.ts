import { DEALER_PROFILE, type ProfileRow } from "@/data/dealer-profile";
import { simulate } from "./client";

/** Dealer store profile (contact and account fields). */
export function getDealerProfile(): Promise<ProfileRow[]> {
  return simulate(DEALER_PROFILE);
}
