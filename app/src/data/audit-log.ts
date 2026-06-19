/**
 * Immutable audit trail — seed data for the bank-side Denetim Kaydı
 * (compliance centerpiece: BDDK audit + SIEM). Served via
 * src/services/audit-log. Rows are append-only and never mutated.
 */
export type AuditCategory =
  | "Kimlik & Erişim"
  | "Veri Erişimi"
  | "İşlem"
  | "Yönetim"
  | "Uyum";

export type AuditResult = "Başarılı" | "Reddedildi" | "Uyarı";

export interface AuditEvent {
  action: string;
  actor: string;
  category: AuditCategory;
  id: string;
  ip: string;
  resource: string;
  result: AuditResult;
  role: string;
  timestamp: string;
}

export const AUDIT_EVENTS: AuditEvent[] = [
  {
    id: "EVT-2026-0001",
    timestamp: "19.06.2026 14:32",
    actor: "Ahmet Kaya",
    role: "Banka Yöneticisi",
    action: "Giriş yapıldı",
    resource: "Yönetim Paneli",
    ip: "10.12.40.5",
    category: "Kimlik & Erişim",
    result: "Başarılı",
  },
  {
    id: "EVT-2026-0002",
    timestamp: "19.06.2026 14:30",
    actor: "Elif Demir",
    role: "Banka Analisti",
    action: "Müşteri kaydı görüntülendi",
    resource: "Müşteri MUS-000124",
    ip: "10.12.40.18",
    category: "Veri Erişimi",
    result: "Başarılı",
  },
  {
    id: "EVT-2026-0003",
    timestamp: "19.06.2026 14:21",
    actor: "Bilinmeyen",
    role: "Sistem",
    action: "Başarısız giriş denemesi",
    resource: "Yönetim Paneli",
    ip: "88.247.13.92",
    category: "Kimlik & Erişim",
    result: "Reddedildi",
  },
  {
    id: "EVT-2026-0004",
    timestamp: "19.06.2026 13:58",
    actor: "Mehmet Yıldız",
    role: "Bayi",
    action: "Teklif gönderildi",
    resource: "Teklif KRD-2021-001245",
    ip: "88.231.4.17",
    category: "İşlem",
    result: "Başarılı",
  },
  {
    id: "EVT-2026-0005",
    timestamp: "19.06.2026 13:44",
    actor: "Zeynep Şahin",
    role: "Banka Yöneticisi",
    action: "Başvuru durumu güncellendi",
    resource: "Başvuru KRD-2021-001188",
    ip: "10.12.40.7",
    category: "İşlem",
    result: "Başarılı",
  },
  {
    id: "EVT-2026-0006",
    timestamp: "19.06.2026 12:19",
    actor: "Ahmet Kaya",
    role: "Banka Yöneticisi",
    action: "Rapor dışa aktarıldı",
    resource: "Portföy Raporu RPR-2026-0042",
    ip: "10.12.40.5",
    category: "Veri Erişimi",
    result: "Başarılı",
  },
  {
    id: "EVT-2026-0007",
    timestamp: "19.06.2026 11:52",
    actor: "Caner Aydın",
    role: "Bayi",
    action: "Müşteri kaydı görüntülendi",
    resource: "Müşteri MUS-000451",
    ip: "78.180.22.140",
    category: "Veri Erişimi",
    result: "Uyarı",
  },
  {
    id: "EVT-2026-0008",
    timestamp: "19.06.2026 11:30",
    actor: "Ahmet Kaya",
    role: "Banka Yöneticisi",
    action: "Kullanıcı rolü değiştirildi",
    resource: "Kullanıcı KUL-0087",
    ip: "10.12.40.5",
    category: "Yönetim",
    result: "Başarılı",
  },
  {
    id: "EVT-2026-0009",
    timestamp: "19.06.2026 10:47",
    actor: "Sistem",
    role: "Sistem",
    action: "Skor parametresi güncellendi",
    resource: "Skor Modeli SCM-2026-03",
    ip: "10.12.40.2",
    category: "Yönetim",
    result: "Başarılı",
  },
  {
    id: "EVT-2026-0010",
    timestamp: "19.06.2026 10:12",
    actor: "Buse Çelik",
    role: "Uyum Uzmanı",
    action: "KVKK açık rıza alındı",
    resource: "Müşteri MUS-000478",
    ip: "10.12.40.31",
    category: "Uyum",
    result: "Başarılı",
  },
  {
    id: "EVT-2026-0011",
    timestamp: "19.06.2026 09:38",
    actor: "Buse Çelik",
    role: "Uyum Uzmanı",
    action: "Veri silme talebi işlendi",
    resource: "Müşteri MUS-000312",
    ip: "10.12.40.31",
    category: "Uyum",
    result: "Başarılı",
  },
  {
    id: "EVT-2026-0012",
    timestamp: "19.06.2026 09:05",
    actor: "Okan Arslan",
    role: "Bayi",
    action: "Başarısız giriş denemesi",
    resource: "Bayi Portalı",
    ip: "88.243.91.7",
    category: "Kimlik & Erişim",
    result: "Reddedildi",
  },
  {
    id: "EVT-2026-0013",
    timestamp: "19.06.2026 08:41",
    actor: "Derya Korkmaz",
    role: "Banka Analisti",
    action: "Rapor dışa aktarıldı",
    resource: "Bayi BYİ-1024",
    ip: "10.12.40.22",
    category: "Veri Erişimi",
    result: "Uyarı",
  },
  {
    id: "EVT-2026-0014",
    timestamp: "18.06.2026 18:57",
    actor: "Elif Demir",
    role: "Banka Analisti",
    action: "Oturum sonlandırıldı",
    resource: "Yönetim Paneli",
    ip: "10.12.40.18",
    category: "Kimlik & Erişim",
    result: "Başarılı",
  },
];
