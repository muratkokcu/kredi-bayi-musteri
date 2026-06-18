import {
  NOTIFICATIONS,
  type Notification,
} from "@/data/customer-notifications";
import { simulate } from "./client";

/** Customer notification feed items. Backed by seed data via the fake service layer. */
export function listCustomerNotifications(): Promise<Notification[]> {
  return simulate(NOTIFICATIONS);
}
