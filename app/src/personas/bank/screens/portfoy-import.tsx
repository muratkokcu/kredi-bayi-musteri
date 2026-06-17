import {
  ArrowRight,
  Check,
  CircleCheck,
  Download,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  TriangleAlert,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/ui/badge";
import { Card, CardHeader } from "@/ui/card";
import { BankShell } from "../bank-shell";

interface Step {
  id: string;
  label: string;
  num: number;
}

const STEPS: Step[] = [
  { id: "upload", num: 1, label: "Dosya Yükle" },
  { id: "map", num: 2, label: "Alan Eşleştirme" },
  { id: "preview", num: 3, label: "Önizleme" },
  { id: "done", num: 4, label: "Tamamla" },
];

const ACTIVE_STEP = 2;

// Target system fields the CSV columns can map onto.
const TARGET_FIELDS: { value: string; label: string }[] = [
  { value: "musteri_adi", label: "Müşteri Adı" },
  { value: "tc_kimlik", label: "TC Kimlik No" },
  { value: "telefon", label: "Telefon" },
  { value: "email", label: "E-posta" },
  { value: "kredi_no", label: "Kredi No" },
  { value: "kredi_tutari", label: "Kredi Tutarı" },
  { value: "kalan_borc", label: "Kalan Borç" },
  { value: "aylik_taksit", label: "Aylık Taksit" },
  { value: "kalan_taksit", label: "Kalan Taksit" },
  { value: "kredi_bitis", label: "Kredi Bitiş Tarihi" },
  { value: "arac_marka", label: "Araç Markası" },
  { value: "arac_model", label: "Araç Modeli" },
  { value: "model_yili", label: "Model Yılı" },
  { value: "plaka", label: "Plaka" },
  { value: "bolge", label: "Bölge" },
  { value: "ignore", label: "İçe aktarma (yok say)" },
];

type MapStatus = "matched" | "manual" | "error";

interface MapRow {
  csvColumn: string;
  sample: string;
  status: MapStatus;
  target: string;
}

const MAP_ROWS: MapRow[] = [
  {
    csvColumn: "musteri_adi",
    sample: "Mehmet Yılmaz",
    target: "musteri_adi",
    status: "matched",
  },
  {
    csvColumn: "tc_no",
    sample: "123******78",
    target: "tc_kimlik",
    status: "matched",
  },
  {
    csvColumn: "gsm",
    sample: "0532 *** ** 45",
    target: "telefon",
    status: "matched",
  },
  {
    csvColumn: "eposta_adresi",
    sample: "mehmet@ornek.com",
    target: "email",
    status: "matched",
  },
  {
    csvColumn: "kredi_referans",
    sample: "KRD-2021-001245",
    target: "kredi_no",
    status: "matched",
  },
  {
    csvColumn: "kredi_tutar",
    sample: "1.450.000",
    target: "kredi_tutari",
    status: "matched",
  },
  {
    csvColumn: "bakiye",
    sample: "685.000",
    target: "kalan_borc",
    status: "manual",
  },
  {
    csvColumn: "taksit_tutari",
    sample: "28.750",
    target: "aylik_taksit",
    status: "matched",
  },
  {
    csvColumn: "kalan_ay",
    sample: "22 / 48",
    target: "kalan_taksit",
    status: "matched",
  },
  {
    csvColumn: "vade_bitis",
    sample: "03.09.2025",
    target: "kredi_bitis",
    status: "matched",
  },
  {
    csvColumn: "marka",
    sample: "Volkswagen",
    target: "arac_marka",
    status: "matched",
  },
  {
    csvColumn: "model",
    sample: "Tiguan",
    target: "arac_model",
    status: "matched",
  },
  {
    csvColumn: "yil",
    sample: "2021",
    target: "model_yili",
    status: "matched",
  },
  {
    csvColumn: "plaka_no",
    sample: "34 ABC 123",
    target: "plaka",
    status: "matched",
  },
  {
    csvColumn: "sehir_kodu",
    sample: "34 / İstanbul",
    target: "ignore",
    status: "error",
  },
];

interface HistoryRow {
  date: string;
  file: string;
  id: string;
  rows: string;
  status: "success" | "warn" | "danger";
  statusLabel: string;
}

const HISTORY: HistoryRow[] = [
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

const STATUS_BADGE: Record<
  MapStatus,
  { label: string; tone: "success" | "warn" | "danger" }
> = {
  matched: { label: "Otomatik", tone: "success" },
  manual: { label: "Manuel", tone: "warn" },
  error: { label: "Hatalı", tone: "danger" },
};

function StepDot({ step }: { step: Step }) {
  const isDone = step.num < ACTIVE_STEP;
  const isActive = step.num === ACTIVE_STEP;

  function dotClass(): string {
    if (isDone) {
      return "bg-bank text-white";
    }
    if (isActive) {
      return "bg-bank text-white ring-4 ring-bank-tint";
    }
    return "border border-line-strong bg-surface text-ink-muted";
  }

  function labelClass(): string {
    if (isActive) {
      return "font-semibold text-ink";
    }
    if (isDone) {
      return "font-medium text-ink-soft";
    }
    return "text-ink-muted";
  }

  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-full font-semibold text-[13px] ${dotClass()}`}
      >
        {isDone ? <Check size={17} strokeWidth={2.4} /> : step.num}
      </span>
      <span className="leading-tight">
        <span className="block text-[11px] text-ink-muted uppercase tracking-wide">
          Adım {step.num}
        </span>
        <span className={`block text-[13.5px] ${labelClass()}`}>
          {step.label}
        </span>
      </span>
    </div>
  );
}

function Stepper() {
  return (
    <Card className="px-6 py-5">
      <div className="flex items-center justify-between">
        {STEPS.map((step, i) => (
          <div
            className="flex flex-1 items-center last:flex-none"
            key={step.id}
          >
            <StepDot step={step} />
            {i < STEPS.length - 1 && (
              <span
                className={`mx-4 h-0.5 flex-1 rounded-full ${
                  step.num < ACTIVE_STEP ? "bg-bank" : "bg-line"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

function FileBanner() {
  return (
    <div className="flex items-center gap-4 border-line border-b px-5 py-4">
      <span className="flex size-11 items-center justify-center rounded-xl bg-bank-tint text-bank-700">
        <FileSpreadsheet size={22} strokeWidth={1.8} />
      </span>
      <div className="leading-tight">
        <div className="font-semibold text-[14px] text-ink">
          portfoy_2025_06_aktarim.csv
        </div>
        <div className="mt-0.5 text-[12px] text-ink-muted tabular-nums">
          1,8 MB · 12.480 satır · 15 sütun
        </div>
      </div>
      <Badge className="ml-2" tone="success">
        <CircleCheck size={13} /> Yüklendi
      </Badge>
      <button
        className="ml-auto flex items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-3.5 py-2 font-medium text-[13px] text-ink-soft hover:bg-canvas"
        type="button"
      >
        <RefreshCw size={15} /> Yeniden Yükle
      </button>
    </div>
  );
}

function MappingRow({ row }: { row: MapRow }) {
  const badge = STATUS_BADGE[row.status];
  return (
    <div className="grid grid-cols-[1.1fr_auto_1.2fr_auto] items-center gap-4 border-line border-b px-5 py-3 last:border-0 hover:bg-canvas/50">
      {/* CSV column */}
      <div className="leading-tight">
        <div className="flex items-center gap-1.5 font-medium font-mono text-[12.5px] text-ink">
          <FileText className="text-ink-muted" size={13} />
          {row.csvColumn}
        </div>
        <div className="mt-0.5 truncate text-[11.5px] text-ink-muted">
          Örnek: {row.sample}
        </div>
      </div>

      {/* arrow */}
      <ArrowRight className="text-ink-muted" size={16} />

      {/* target field select */}
      <Select defaultValue={row.target}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Alan seçin" />
        </SelectTrigger>
        <SelectContent>
          {TARGET_FIELDS.map((f) => (
            <SelectItem key={f.value} value={f.value}>
              {f.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* status */}
      <Badge tone={badge.tone}>{badge.label}</Badge>
    </div>
  );
}

function MappingCard() {
  return (
    <Card className="overflow-hidden">
      <CardHeader
        action={
          <button
            className="font-semibold text-[12.5px] text-bank-700"
            type="button"
          >
            Otomatik Eşleştir
          </button>
        }
        subtitle="CSV sütunlarını sistem alanları ile eşleştirin. Eşleşmeyen alanları manuel seçebilirsiniz."
        title="Alan Eşleştirme"
      />

      <div className="mt-4">
        <FileBanner />

        <div className="flex items-center gap-3 bg-success-tint/50 px-5 py-3 text-[12.5px] text-success">
          <CircleCheck size={16} />
          <span className="font-medium">
            15 sütundan 14'ü otomatik eşleştirildi. 1 sütun içe aktarılmayacak.
          </span>
        </div>

        {/* column headers */}
        <div className="grid grid-cols-[1.1fr_auto_1.2fr_auto] items-center gap-4 border-line border-y bg-canvas/60 px-5 py-2.5 font-semibold text-[11px] text-ink-muted uppercase tracking-wide">
          <span>CSV Sütunu</span>
          <span className="w-4" />
          <span>Sistem Alanı</span>
          <span>Durum</span>
        </div>

        {MAP_ROWS.map((row) => (
          <MappingRow key={row.csvColumn} row={row} />
        ))}
      </div>
    </Card>
  );
}

function SummaryRow({
  label,
  value,
  tone,
}: {
  label: string;
  tone?: "success" | "danger";
  value: string;
}) {
  function valueClass(): string {
    if (tone === "success") {
      return "text-success";
    }
    if (tone === "danger") {
      return "text-danger";
    }
    return "text-ink";
  }
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-[12.5px] text-ink-soft">{label}</span>
      <span className={`font-bold text-[14px] tabular-nums ${valueClass()}`}>
        {value}
      </span>
    </div>
  );
}

function SummaryCard() {
  return (
    <Card className="px-5 pt-5 pb-4">
      <h3 className="font-semibold text-[15px] text-ink leading-5">
        Import Özeti
      </h3>
      <div className="mt-3 divide-y divide-line">
        <SummaryRow label="Toplam Satır" value="12.480" />
        <SummaryRow label="Eşleşen Alan" tone="success" value="14 / 15" />
        <SummaryRow label="Hatalı Satır" tone="danger" value="36" />
        <SummaryRow label="Yinelenen Kayıt" value="124" />
      </div>

      <div className="mt-3 rounded-[12px] bg-warn-tint/60 px-3.5 py-3">
        <div className="flex items-start gap-2">
          <TriangleAlert className="mt-0.5 shrink-0 text-warn" size={15} />
          <p className="text-[12px] text-ink-soft leading-4">
            36 satırda zorunlu alan eksik. Bu satırlar önizleme adımında
            incelenebilir.
          </p>
        </div>
      </div>

      <div className="mt-4 border-line border-t pt-3">
        <div className="mb-1 flex justify-between text-[12px]">
          <span className="text-ink-soft">İçe aktarılacak</span>
          <span className="font-semibold text-ink tabular-nums">12.444</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-bank"
            style={{ width: "99.7%" }}
          />
        </div>
      </div>
    </Card>
  );
}

function HistoryCard() {
  return (
    <Card className="pb-2">
      <CardHeader
        action={
          <button
            className="font-semibold text-[12.5px] text-bank-700"
            type="button"
          >
            Tümünü Gör
          </button>
        }
        title="Import Geçmişi"
      />
      <div className="mt-3 px-5">
        {HISTORY.map((h) => (
          <div
            className="flex items-center gap-3 border-line border-b py-3 last:border-0"
            key={h.id}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-canvas text-ink-muted">
              <FileSpreadsheet size={16} strokeWidth={1.8} />
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="truncate font-medium text-[13px] text-ink">
                {h.file}
              </div>
              <div className="mt-0.5 flex gap-2 text-[11px] text-ink-muted tabular-nums">
                <span>{h.rows}</span>
                <span>·</span>
                <span>{h.date}</span>
              </div>
            </div>
            <Badge tone={h.status}>{h.statusLabel}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}

function BottomBar() {
  return (
    <div className="mt-5 flex items-center justify-between rounded-[var(--radius-card)] border border-line bg-surface px-6 py-4 shadow-[var(--shadow-card)]">
      <button
        className="flex items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-4 py-2.5 font-medium text-[13px] text-ink-soft hover:bg-canvas"
        type="button"
      >
        Geri
      </button>
      <span className="text-[12.5px] text-ink-muted">
        Adım {ACTIVE_STEP} / {STEPS.length} · Alan Eşleştirme
      </span>
      <button
        className="flex items-center gap-2 rounded-[10px] bg-bank px-5 py-2.5 font-semibold text-[13px] text-white hover:bg-bank-600"
        type="button"
      >
        Devam Et <ArrowRight size={16} />
      </button>
    </div>
  );
}

export function BankPortfoyImport() {
  return (
    <BankShell
      actions={
        <button
          className="flex items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-3.5 py-2 font-medium text-[13px] text-ink-soft hover:bg-canvas"
          type="button"
        >
          <Download size={16} /> Şablon İndir
        </button>
      }
      breadcrumb={["Portföy Import", "Yeni Import"]}
      info
      subtitle="CSV dosyası yükleyerek müşteri portföyünüzü toplu olarak içe aktarın."
      title="Portföy Import"
    >
      <Stepper />

      <div className="mt-5 grid grid-cols-3 gap-5">
        <div className="col-span-2">
          <MappingCard />
        </div>
        <div className="flex flex-col gap-5">
          <SummaryCard />
          <HistoryCard />
        </div>
      </div>

      <BottomBar />
    </BankShell>
  );
}
