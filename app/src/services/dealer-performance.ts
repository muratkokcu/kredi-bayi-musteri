import {
  DEALER_PERFORMANCE,
  type DealerPerformance,
} from "@/data/dealer-performance";
import { simulate } from "./client";

/**
 * Dealer performance & analytics overview. JSON payload'a alınmadı: veri JSX
 * ikon (ReactNode) içerdiğinden serialize edilemez; bu yüzden fake servis
 * katmanından (simulate) servis edilir. JSON'a taşımak için önce ikonların
 * veriden ayrıştırılması (string anahtar → bileşen) gerekir.
 */
export function getDealerPerformance(): Promise<DealerPerformance> {
  return simulate(DEALER_PERFORMANCE);
}
