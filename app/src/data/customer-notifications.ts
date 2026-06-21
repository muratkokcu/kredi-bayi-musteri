/**
 * Customer notification feed — the grouped notification items on the customer
 * (müşteri) notifications screen. Served through the fake service layer
 * (src/services/customer-notifications) so the screen consumes it via a hook
 * rather than importing this file directly.
 */
import {
  BadgePercent,
  CalendarClock,
  CheckCircle2,
  Gift,
  type LucideIcon,
  TrendingUp,
} from "lucide-react";

export type NotifTone = "cust" | "success" | "warn";
export type NotifGroup = "Bugün" | "Bu Hafta" | "Daha Önce";

export interface Notification {
  id: string;
  icon: LucideIcon;
  tone: NotifTone;
  title: string;
  body: string;
  time: string;
  group: NotifGroup;
  unread: boolean;
}

export const NOTIFICATIONS: Notification[] = [
  {
    id: "teklif-kaya",
    icon: BadgePercent,
    tone: "cust",
    title: "Yeni teklif aldın",
    body: "Bayi Otomotiv %1,89 faiz oranıyla yeni bir yenileme teklifi gönderdi.",
    time: "10 dk önce",
    group: "Bugün",
    unread: true,
  },
  {
    id: "basvuru-onay",
    icon: CheckCircle2,
    tone: "success",
    title: "Başvurun güncellendi",
    body: "Kredi yenileme başvurun ön onaydan geçti. Belgelerini yükleyebilirsin.",
    time: "1 sa önce",
    group: "Bugün",
    unread: true,
  },
  {
    id: "odeme-hatirlatma",
    icon: CalendarClock,
    tone: "warn",
    title: "Ödeme hatırlatma",
    body: "Bu ayki ₺18.750 taksitinin son ödeme tarihi 25 Haziran. Otomatik ödeme açık.",
    time: "4 sa önce",
    group: "Bugün",
    unread: false,
  },
  {
    id: "teklif-zirve",
    icon: BadgePercent,
    tone: "cust",
    title: "Yeni teklif aldın",
    body: "Zirve Motors Toyota Corolla için %2,09 faizli bir teklif oluşturdu.",
    time: "2 gün önce",
    group: "Bu Hafta",
    unread: true,
  },
  {
    id: "arac-deger",
    icon: TrendingUp,
    tone: "success",
    title: "Araç değerin güncellendi",
    body: "Volkswagen Tiguan aracının piyasa değeri %3,2 artarak ₺1.125.000 oldu.",
    time: "3 gün önce",
    group: "Bu Hafta",
    unread: false,
  },
  {
    id: "kampanya-yaz",
    icon: Gift,
    tone: "cust",
    title: "Kampanya",
    body: "Yaza özel: 36 aya varan vadelerde %1,79'dan başlayan faiz fırsatları seni bekliyor.",
    time: "5 gün önce",
    group: "Bu Hafta",
    unread: false,
  },
  {
    id: "odeme-onceki",
    icon: CalendarClock,
    tone: "warn",
    title: "Ödeme hatırlatma",
    body: "Mayıs ayı taksitin başarıyla tahsil edildi. Bir sonraki taksite 30 gün var.",
    time: "12 gün önce",
    group: "Daha Önce",
    unread: false,
  },
  {
    id: "kampanya-ilk",
    icon: Gift,
    tone: "cust",
    title: "Kampanya",
    body: "Hoş geldin! İlk yenileme teklifini görüntülediğinde ekstra puan kazanırsın.",
    time: "3 hafta önce",
    group: "Daha Önce",
    unread: false,
  },
];
