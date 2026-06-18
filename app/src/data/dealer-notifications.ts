/**
 * Dealer notification feed — the grouped notification items on the dealer
 * notifications screen (roadmap 0.1). Served through the fake service layer
 * (src/services/dealer-notifications) so the screen consumes it via a hook
 * rather than importing this file directly. The filter chips stay local state.
 */
import {
  CheckCircle2,
  Coins,
  FileText,
  Handshake,
  type LucideIcon,
  Sparkles,
  TriangleAlert,
  Users2,
} from "lucide-react";

export type Tone = "dealer" | "success" | "warn";
export type Group = "Bugün" | "Bu Hafta" | "Daha Önce";

export interface NotificationDef {
  description: string;
  group: Group;
  icon: LucideIcon;
  id: string;
  time: string;
  title: string;
  tone: Tone;
  unread: boolean;
}

export const NOTIFICATIONS: NotificationDef[] = [
  {
    id: "lead-suv",
    group: "Bugün",
    icon: Sparkles,
    tone: "dealer",
    title: "Fırsat havuzuna 5 yeni müşteri eklendi",
    description: "SUV segmenti · Yenileme skoru 80+ olan müşteriler.",
    time: "3 dk önce",
    unread: true,
  },
  {
    id: "offer-accepted",
    group: "Bugün",
    icon: CheckCircle2,
    tone: "success",
    title: "Teklifiniz kabul edildi: Yıldız Holding",
    description: "Volkswagen Tiguan · ₺1.450.000 · Sözleşme aşamasına geçti.",
    time: "42 dk önce",
    unread: true,
  },
  {
    id: "offer-expiring",
    group: "Bugün",
    icon: TriangleAlert,
    tone: "warn",
    title: "3 teklifin geçerlilik süresi yarın doluyor",
    description: "Ahmet Yılmaz, Mehmet Demir ve Selin Kaya için süre uzatın.",
    time: "Bugün 09:10",
    unread: true,
  },
  {
    id: "commission-ready",
    group: "Bugün",
    icon: Coins,
    tone: "success",
    title: "Mayıs komisyon ödemeniz hazır",
    description: "₺128.500 tutarındaki ödeme hesabınıza aktarıldı.",
    time: "Bugün 08:30",
    unread: true,
  },
  {
    id: "offer-viewed",
    group: "Bu Hafta",
    icon: FileText,
    tone: "dealer",
    title: "Mehmet Demir teklifinizi görüntüledi",
    description: "Toyota Corolla · ₺980.000 · 2. kez incelendi.",
    time: "Dün 16:24",
    unread: false,
  },
  {
    id: "deal-closed",
    group: "Bu Hafta",
    icon: Handshake,
    tone: "success",
    title: "Görüşme tamamlandı: Ayşe Kara",
    description: "İlk görüşme olumlu sonuçlandı, teklif gönderildi.",
    time: "Dün 11:40",
    unread: false,
  },
  {
    id: "lead-sedan",
    group: "Bu Hafta",
    icon: Users2,
    tone: "dealer",
    title: "Fırsat havuzuna 8 yeni müşteri eklendi",
    description: "Sedan segmenti · Mevcut kredisi biten müşteriler.",
    time: "16 Haziran",
    unread: false,
  },
  {
    id: "offer-rejected",
    group: "Daha Önce",
    icon: TriangleAlert,
    tone: "warn",
    title: "Hakan Şahin teklifinizi reddetti",
    description: "Peugeot 3008 · ₺1.150.000 · Faiz oranı yüksek bulundu.",
    time: "12 Haziran",
    unread: false,
  },
  {
    id: "commission-april",
    group: "Daha Önce",
    icon: Coins,
    tone: "success",
    title: "Nisan komisyon ödemeniz tamamlandı",
    description: "₺96.200 tutarındaki ödeme hesabınıza aktarıldı.",
    time: "5 Haziran",
    unread: false,
  },
  {
    id: "campaign",
    group: "Daha Önce",
    icon: Sparkles,
    tone: "dealer",
    title: "Haziran yenileme kampanyası yayında",
    description: "SUV segmentinde %0,99 faiz fırsatı portföyünüze tanımlandı.",
    time: "1 Haziran",
    unread: false,
  },
];
