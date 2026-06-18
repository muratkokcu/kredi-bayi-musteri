import {
  NOTIFICATIONS,
  type NotificationDef,
} from "@/data/dealer-notifications";
import { simulate } from "./client";

/** Dealer notification feed items. Backed by seed data via the fake service layer. */
export function listDealerNotifications(): Promise<NotificationDef[]> {
  return simulate(NOTIFICATIONS);
}
