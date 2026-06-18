import { useQuery } from "@tanstack/react-query";
import { listNotificationRules } from "@/services/notification-rules";
import { queryKeys } from "./keys";

/** Configured notification trigger rules list. */
export function useNotificationRules() {
  return useQuery({
    queryKey: queryKeys.notificationRules,
    queryFn: listNotificationRules,
  });
}
