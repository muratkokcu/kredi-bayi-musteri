/**
 * Import history — the server-provided log of past portfolio CSV imports shown
 * on the import wizard. The wizard itself (upload, field mapping, preview) is
 * interactive local state; only this completed-imports list comes from the
 * server.
 */
export interface ImportHistoryRow {
  date: string;
  file: string;
  id: string;
  rows: string;
  status: "success" | "warn" | "danger";
  statusLabel: string;
}

export const IMPORT_HISTORY: ImportHistoryRow[] = [
  {
    id: "1",
    file: "portfoy_2025_06.csv",
    rows: "12.480 satır",
    date: "14.06.2025 · 09:42",
    status: "success",
    statusLabel: "Başarılı",
  },
  {
    id: "2",
    file: "portfoy_2025_05.csv",
    rows: "11.920 satır",
    date: "13.05.2025 · 11:08",
    status: "success",
    statusLabel: "Başarılı",
  },
  {
    id: "3",
    file: "yeni_bayiler_q2.csv",
    rows: "842 satır",
    date: "28.04.2025 · 16:25",
    status: "warn",
    statusLabel: "Kısmi",
  },
  {
    id: "4",
    file: "portfoy_2025_04.csv",
    rows: "11.604 satır",
    date: "12.04.2025 · 08:55",
    status: "success",
    statusLabel: "Başarılı",
  },
  {
    id: "5",
    file: "test_import.csv",
    rows: "0 satır",
    date: "02.04.2025 · 14:11",
    status: "danger",
    statusLabel: "Başarısız",
  },
];
