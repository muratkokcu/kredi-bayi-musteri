import { Clock, Percent, Wallet } from "lucide-react";
import type { ComponentType } from "react";

/**
 * Customer loan-application status — record data extracted from the application
 * status screen (roadmap 0.x). Served through the fake service layer
 * (src/services/application-status) so the screen consumes it via a hook rather
 * than importing this file directly. Lucide icon refs are kept as TS values.
 */

export type StepState = "done" | "active" | "pending";

export interface StepItem {
  date: string;
  desc: string;
  id: string;
  state: StepState;
  title: string;
}

export interface LoanDetail {
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
  value: string;
}

export interface ApplicationStatus {
  basvuruNo: string;
  basvuruTarihi: string;
  loanDetails: LoanDetail[];
  steps: StepItem[];
}

export const APPLICATION_STATUS: ApplicationStatus = {
  basvuruTarihi: "10 Mayıs 2025",
  basvuruNo: "BAS-2025-00124",
  steps: [
    {
      id: "alindi",
      title: "Başvuru Alındı",
      desc: "Başvurunuz başarıyla alındı.",
      date: "10 Mayıs 2025",
      state: "done",
    },
    {
      id: "on-onay",
      title: "Ön Onay",
      desc: "Kredi ön onay süreci sonuçlandı.",
      date: "11 Mayıs 2025",
      state: "done",
    },
    {
      id: "kredi-kontrol",
      title: "Kredi Kontrolü",
      desc: "Belgeleriniz kontrol ediliyor.",
      date: "12 Mayıs 2025",
      state: "done",
    },
    {
      id: "evrak-kontrol",
      title: "Evrak Kontrolü",
      desc: "Yüklediğiniz evraklar inceleniyor.",
      date: "13 Mayıs 2025",
      state: "active",
    },
    {
      id: "banka-onay",
      title: "Banka Onayı",
      desc: "Banka onayı bekleniyor.",
      date: "Beklemede",
      state: "pending",
    },
    {
      id: "arac-teslim",
      title: "Araç Teslimi",
      desc: "Onay sonrası teslimat planlanacaktır.",
      date: "Beklemede",
      state: "pending",
    },
  ],
  loanDetails: [
    { icon: Wallet, label: "Kredi Tutarı", value: "₺1.000.000" },
    { icon: Clock, label: "Vade", value: "48 Ay" },
    { icon: Percent, label: "Faiz Oranı", value: "%1,89" },
  ],
};
