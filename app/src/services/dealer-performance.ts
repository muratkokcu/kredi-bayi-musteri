import type { DealerPerformance } from "@/data/dealer-performance";
import { fetchPayload } from "./client";

/** Dealer performance & analytics overview. Üretim ortamı gibi JSON payload'tan çekilir. */
export function getDealerPerformance(): Promise<DealerPerformance> {
  return fetchPayload<DealerPerformance>("dealer-performance");
}
