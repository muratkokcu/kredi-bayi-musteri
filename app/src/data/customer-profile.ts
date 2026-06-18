import {
  Bell,
  FileText,
  HelpCircle,
  type LucideIcon,
  ShieldCheck,
  User,
} from "lucide-react";
import { formatTRY } from "@/lib/format";

/**
 * Customer profile — the account holder's header, contact, credit summary and
 * menu record shown on the customer profile screen (data rollout). Served
 * through the fake service layer (src/services/customer-profile) so the screen
 * consumes it via a hook rather than importing this file directly. The
 * taxonomy-derived vehicle card and the payment-plan Link stay inline on the
 * screen. Lucide icon refs are kept as TS values.
 */

export interface IletisimSatiri {
  deger: string;
  etiket: string;
}

export interface KrediStat {
  deger: string;
  etiket: string;
}

export interface MenuSatiri {
  icon: LucideIcon;
  label: string;
}

export interface CustomerProfile {
  initials: string;
  isim: string;
  krediOzetim: KrediStat[];
  menuSatirlari: MenuSatiri[];
  rozet: string;
  iletisimBilgileri: IletisimSatiri[];
  uyelik: string;
}

export const CUSTOMER_PROFILE: CustomerProfile = {
  isim: "Elif Yıldız",
  initials: "EY",
  uyelik: "Üye: 2021'den beri",
  rozet: "Yüksek Skor",
  iletisimBilgileri: [
    { etiket: "Telefon", deger: "+90 532 *** ** 24" },
    { etiket: "E-posta", deger: "e***@gmail.com" },
    { etiket: "TC Kimlik", deger: "••• •• ••34" },
  ],
  krediOzetim: [
    { etiket: "Kalan Borç", deger: formatTRY(612_750) },
    { etiket: "Aylık Taksit", deger: formatTRY(18_450) },
    { etiket: "Kredi Bitiş", deger: "15.08.2025" },
  ],
  menuSatirlari: [
    { icon: User, label: "Kişisel Bilgiler" },
    { icon: FileText, label: "Belgelerim" },
    { icon: Bell, label: "Bildirim Ayarları" },
    { icon: ShieldCheck, label: "Güvenlik" },
    { icon: HelpCircle, label: "Yardım & Destek" },
  ],
};
