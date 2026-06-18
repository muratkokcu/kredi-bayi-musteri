import {
  NOTIFICATION_RULES,
  type NotificationRule,
} from "@/data/notification-rules";
import { simulate } from "./client";

/** Configured notification trigger rules. Backed by seed data via the fake service layer. */
export function listNotificationRules(): Promise<NotificationRule[]> {
  return simulate(NOTIFICATION_RULES);
}
