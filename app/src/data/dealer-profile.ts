/**
 * Dealer profile — the store's contact and account record shown on the dealer
 * settings screen (data rollout). Served through the fake service layer
 * (src/services/dealer-profile) so the screen consumes it via a hook rather
 * than importing this file directly. Notification/security/preference toggles
 * on the same screen stay as local form state and are not part of this record.
 */
import { KeyRound, Mail, MapPin, Phone, Store } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ProfileRow {
  icon: LucideIcon;
  label: string;
  value: string;
}

export const DEALER_PROFILE: ProfileRow[] = [
  { icon: Store, label: "Bayi Adı", value: "Bayi Otomotiv" },
  { icon: Store, label: "Yetkili", value: "Mehmet Kaya" },
  { icon: Phone, label: "Telefon", value: "+90 532 *** ** **" },
  { icon: Mail, label: "E-posta", value: "mehmet.kaya@bayi.com" },
  { icon: MapPin, label: "Adres", value: "Ataşehir, İstanbul Anadolu" },
  { icon: KeyRound, label: "Vergi No", value: "1234567890" },
];
