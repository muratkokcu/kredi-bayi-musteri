/**
 * Notification trigger rules — the configured-rule rows on the bank notification
 * settings screen (roadmap 0.1). Served through the fake service layer
 * (src/services/notification-rules) so the screen consumes it via a hook rather
 * than importing this file directly. The toggle/filter UI stays local state.
 */
import {
  CalendarClock,
  Car,
  CircleCheck,
  CircleX,
  Eye,
  type LucideIcon,
  Sparkles,
  TrendingUp,
  Users2,
} from "lucide-react";

export type Channel = "sms" | "eposta" | "push";
export type Hedef = "Müşteri" | "Bayi";

export interface NotificationRule {
  aciklama: string;
  active: boolean;
  ad: string;
  hedef: Hedef;
  icon: LucideIcon;
  id: string;
  kanallar: Channel[];
  kosul: string;
  son: string;
  tone: string;
}

export const NOTIFICATION_RULES: NotificationRule[] = [
  {
    id: "kredi-bitis",
    ad: "Kredi Bitişine X Gün Kala",
    aciklama:
      "Kredinin bitiş tarihine X gün kaldığında müşteriye bildirim gönderir.",
    icon: CalendarClock,
    tone: "bg-bank-tint text-bank-600",
    hedef: "Müşteri",
    kanallar: ["sms", "eposta", "push"],
    kosul: "Bitişe 90, 60, 30 gün kala",
    active: true,
    son: "22.04.2025 14:30",
  },
  {
    id: "arac-yas",
    ad: "Araç X Yaşına Gelince",
    aciklama:
      "Araç yaşı belirlenen eşiğe ulaştığında müşteriye bildirim gönderir.",
    icon: Car,
    tone: "bg-cust-tint text-cust-600",
    hedef: "Müşteri",
    kanallar: ["sms", "eposta", "push"],
    kosul: "Araç yaşı ≥ 3, 5, 7 yıl",
    active: true,
    son: "21.04.2025 11:15",
  },
  {
    id: "bayi-teklif",
    ad: "Bayi Teklif Gönderince",
    aciklama:
      "Bayi tarafından yeni teklif gönderildiğinde müşteriye bildirim gönderir.",
    icon: Users2,
    tone: "bg-dealer-tint text-dealer-700",
    hedef: "Müşteri",
    kanallar: ["sms", "eposta"],
    kosul: "Teklif oluşturulduğunda",
    active: true,
    son: "20.04.2025 16:45",
  },
  {
    id: "teklif-goruntu",
    ad: "Teklif Görüntülendiğinde",
    aciklama: "Müşteri teklif görüntülediğinde bayiye bildirim gönderir.",
    icon: Eye,
    tone: "bg-warn-tint text-warn",
    hedef: "Bayi",
    kanallar: ["push"],
    kosul: "Müşteri teklif görüntülediğinde",
    active: true,
    son: "19.04.2025 09:20",
  },
  {
    id: "teklif-kabul",
    ad: "Teklif Kabul Edildiğinde",
    aciklama: "Müşteri teklifi kabul ettiğinde bayiye bildirim gönderir.",
    icon: CircleCheck,
    tone: "bg-success-tint text-success",
    hedef: "Bayi",
    kanallar: ["push"],
    kosul: "Teklif kabul edildiğinde",
    active: true,
    son: "18.04.2025 10:10",
  },
  {
    id: "teklif-red",
    ad: "Teklif Reddedildiğinde",
    aciklama: "Müşteri teklifi reddettiğinde bayiye bildirim gönderir.",
    icon: CircleX,
    tone: "bg-danger-tint text-danger",
    hedef: "Bayi",
    kanallar: ["push"],
    kosul: "Teklif reddedildiğinde",
    active: false,
    son: "15.04.2025 13:30",
  },
  {
    id: "tercih-arac",
    ad: "Tercihlere Uygun Araç Eklendiğinde",
    aciklama:
      "Müşterinin tercihlerine uygun yeni araç sisteme eklendiğinde bildirim gönderir.",
    icon: Sparkles,
    tone: "bg-[#e0f5f3] text-[#0e9488]",
    hedef: "Müşteri",
    kanallar: ["sms", "eposta"],
    kosul: "Yeni araç sisteme eklendiğinde",
    active: true,
    son: "12.04.2025 08:45",
  },
  {
    id: "yuksek-skor",
    ad: "Yüksek Skor Değişiminde",
    aciklama:
      "Yenileme skoru belirli eşiğin üzerine çıktığında bayiye bildirim gönderir.",
    icon: TrendingUp,
    tone: "bg-bank-tint text-bank-600",
    hedef: "Bayi",
    kanallar: ["eposta"],
    kosul: "Skor ≥ 70",
    active: false,
    son: "10.04.2025 17:25",
  },
];
