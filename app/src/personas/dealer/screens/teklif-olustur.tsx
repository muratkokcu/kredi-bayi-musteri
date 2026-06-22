import {
  ArrowRight,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Info,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  Smartphone,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { OfferVehicle } from "@/data/offer-vehicles";
import { annuity } from "@/lib/finance";
import { formatTRY } from "@/lib/format";
import { useOfferVehicles } from "@/queries/offer-vehicles";
import { EmptyState, ErrorState, LoadingState } from "@/ui/async-states";
import { Badge } from "@/ui/badge";
import { Card, CardHeader } from "@/ui/card";
import { ScoreRing } from "@/ui/score-ring";
import { VehicleImage } from "@/ui/vehicle-image";
import { DealerShell } from "../dealer-shell";

// OfferVehicle type + seed live in src/data/offer-vehicles.ts; the selectable
// list arrives via useOfferVehicles().

const STEPS = [
  { id: 1, label: "Araç Seçimi" },
  { id: 2, label: "Finansman Bilgileri" },
  { id: 3, label: "Teklif Özeti" },
  { id: 4, label: "Onay & Gönder" },
];

const SEND_CHANNELS = [
  { id: "app", label: "Mobil Uygulama" },
  { id: "eposta", label: "E-posta" },
  { id: "sms", label: "SMS" },
  { id: "push", label: "Push Bildirim" },
];

interface FilterDef {
  field: keyof OfferVehicle;
  key: string;
  label: string;
}

const FILTER_DEFS: FilterDef[] = [
  { key: "segment", label: "Segment", field: "segment" },
  { key: "marka", label: "Marka", field: "marka" },
  { key: "model", label: "Model", field: "model" },
  { key: "yakit", label: "Yakıt Tipi", field: "fuel" },
  { key: "vites", label: "Vites", field: "transmission" },
];

// Filter options are derived from the loaded rows so they always match a row.
function buildFilters(vehicles: OfferVehicle[]) {
  return FILTER_DEFS.map((f) => ({
    ...f,
    options: [...new Set(vehicles.map((v) => String(v[f.field])))],
  }));
}

type FilterWithOptions = ReturnType<typeof buildFilters>[number];

const ALL = "tumu";

function matchesVehicle(
  v: OfferVehicle,
  search: string,
  values: Record<string, string>
): boolean {
  const q = search.trim().toLocaleLowerCase("tr");
  if (q) {
    const hay =
      `${v.marka} ${v.model} ${v.variant} ${v.stokKodu}`.toLocaleLowerCase(
        "tr"
      );
    if (!hay.includes(q)) {
      return false;
    }
  }
  return FILTER_DEFS.every((f) => {
    const val = values[f.key];
    return !val || val === ALL || String(v[f.field]) === val;
  });
}

const SOURCE_TABS = [
  { id: "stok", label: "Stoktan Seç" },
  { id: "sahibinden", label: "Sahibinden.com'dan Ara" },
  { id: "manuel", label: "Manuel Araç Girişi" },
];

interface AddOn {
  id: string;
  label: string;
  on: boolean;
  price: string;
}

const ADD_ONS: AddOn[] = [
  { id: "kasko", label: "Kasko", price: "₺12.450 / yıl", on: true },
  { id: "trafik", label: "Trafik Sigortası", price: "₺4.250 / yıl", on: true },
  { id: "gap", label: "GAP Sigortası", price: "₺3.750 / yıl", on: false },
  {
    id: "konut",
    label: "Konut Yardım Paketi",
    price: "₺1.250 / yıl",
    on: false,
  },
];

interface MatchRow {
  label: string;
  value: number;
}

const MATCH_ROWS: MatchRow[] = [
  { label: "SUV Segmenti", value: 95 },
  { label: "Bütçe Aralığı", value: 90 },
  { label: "Hedef Müşteri Yaş Aralığı", value: 85 },
  { label: "Kredi Bitiş Süresi", value: 88 },
];

/** Parses a Turkish-formatted rate label like "%2,29" into a number (2.29). */
function parseRate(label: string): number {
  const normalized = label.replace("%", "").replace(",", ".").trim();
  const value = Number.parseFloat(normalized);
  return Number.isNaN(value) ? 0 : value;
}

/** Parses a term label like "36 Ay" into a month count. */
function parseTerm(label: string): number {
  const value = Number.parseFloat(label);
  return Number.isNaN(value) ? 0 : value;
}

interface ScheduleRow {
  balance: number;
  interest: number;
  month: number;
  payment: number;
  principal: number;
}

/** Month-by-month annuity amortization schedule. */
function buildSchedule(
  loan: number,
  monthlyRate: number,
  months: number
): ScheduleRow[] {
  const payment = annuity(loan, monthlyRate, months);
  const rows: ScheduleRow[] = [];
  let balance = loan;
  for (let m = 1; m <= months; m++) {
    const interest = balance * monthlyRate;
    const principal = payment - interest;
    balance = Math.max(0, balance - principal);
    rows.push({ month: m, payment, principal, interest, balance });
  }
  return rows;
}

function stepCircleClass(isActive: boolean, isDone: boolean): string {
  if (isActive) {
    return "bg-dealer text-white";
  }
  if (isDone) {
    return "bg-dealer/15 text-dealer";
  }
  return "border border-line-strong bg-surface text-ink-muted";
}

function Stepper({
  active,
  onSelect,
}: {
  active: number;
  onSelect: (id: number) => void;
}) {
  return (
    <Card className="px-6 py-4">
      <div className="flex items-center">
        {STEPS.map((step, i) => {
          const isActive = step.id === active;
          const isDone = step.id < active;
          return (
            <div className="flex items-center" key={step.id}>
              <button
                className="flex items-center gap-2.5"
                onClick={() => onSelect(step.id)}
                type="button"
              >
                <span
                  className={`flex size-8 items-center justify-center rounded-full font-semibold text-[13px] ${stepCircleClass(isActive, isDone)}`}
                >
                  {isDone ? <Check size={16} strokeWidth={2.5} /> : step.id}
                </span>
                <span
                  className={`text-[14px] ${isActive ? "font-semibold text-dealer" : "font-medium text-ink-muted"}`}
                >
                  {step.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div className="mx-5 flex w-16 items-center text-line-strong">
                  <span className="h-px flex-1 bg-line-strong" />
                  <ArrowRight size={15} strokeWidth={2} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function FilterBar({
  filters,
  values,
  onChange,
  onClear,
}: {
  filters: FilterWithOptions[];
  values: Record<string, string>;
  onChange: (key: string, v: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="grid grid-cols-[repeat(5,1fr)_auto] gap-3 px-5">
      {filters.map((f) => (
        <div key={f.key}>
          <label
            className="mb-1.5 block font-medium text-[12px] text-ink-muted"
            htmlFor={`filter-${f.key}`}
          >
            {f.label}
          </label>
          <Select
            onValueChange={(v) => onChange(f.key, v)}
            value={values[f.key] ?? ALL}
          >
            <SelectTrigger
              className="h-9 w-full border-line-strong text-[13px]"
              id={`filter-${f.key}`}
            >
              <SelectValue placeholder="Tümü" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Tümü</SelectItem>
              {f.options.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
      <div className="flex items-end">
        <button
          className="flex h-9 items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-3.5 font-medium text-[13px] text-ink-soft hover:bg-canvas"
          onClick={onClear}
          type="button"
        >
          <RotateCcw size={15} strokeWidth={1.9} /> Temizle
        </button>
      </div>
    </div>
  );
}

function VehicleThumb({ v }: { v: OfferVehicle }) {
  return (
    <VehicleImage
      className="size-12 shrink-0 rounded-lg"
      iconSize={22}
      name={`${v.marka} ${v.model}`}
      segment={v.segment}
    />
  );
}

function VehicleRow({
  v,
  selected,
  onSelect,
}: {
  v: OfferVehicle;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      className={`grid w-full grid-cols-[auto_auto_1fr_auto_auto_auto] items-center gap-4 border-line border-b px-5 py-3.5 text-left transition-colors last:border-0 ${
        selected ? "bg-dealer-tint/50" : "hover:bg-canvas"
      }`}
      onClick={onSelect}
      type="button"
    >
      <span
        className={`flex size-[18px] items-center justify-center rounded-full border-2 ${
          selected ? "border-dealer" : "border-line-strong"
        }`}
      >
        {selected && <span className="size-2.5 rounded-full bg-dealer" />}
      </span>
      <VehicleThumb v={v} />
      <span className="min-w-0">
        <span className="block font-semibold text-[14px] text-ink">
          {v.marka} {v.model}
        </span>
        <span className="block text-[12.5px] text-ink-soft">{v.variant}</span>
        <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <Badge tone="neutral">{v.year}</Badge>
          <Badge tone="neutral">{v.segment}</Badge>
          <Badge tone="neutral">{v.transmission}</Badge>
        </span>
      </span>
      <span className="hidden text-right lg:block">
        <span className="block text-[11px] text-ink-muted">Kilometre</span>
        <span className="block text-[12.5px] text-ink-soft tabular-nums">
          {v.km}
        </span>
      </span>
      <span className="hidden text-right md:block">
        <span className="block text-[11px] text-ink-muted">Stok Kodu</span>
        <span className="block text-[12.5px] text-ink-soft tabular-nums">
          {v.stokKodu}
        </span>
      </span>
      <span className="text-right">
        <span className="block font-bold text-[15px] text-ink tabular-nums">
          {v.price}
        </span>
        <span className="font-semibold text-[12px] text-success">Stokta</span>
      </span>
    </button>
  );
}

function VehicleListCard({
  vehicles,
  selectedId,
  onSelect,
  isPending,
  isError,
  refetch,
}: {
  vehicles: OfferVehicle[];
  selectedId: string;
  onSelect: (id: string) => void;
  isPending: boolean;
  isError: boolean;
  refetch: () => void;
}) {
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const filters = buildFilters(vehicles);
  const filtered = vehicles.filter((v) =>
    matchesVehicle(v, search, filterValues)
  );

  function renderList() {
    if (isPending) {
      return <LoadingState label="Araçlar yükleniyor…" />;
    }
    if (isError) {
      return (
        <ErrorState label="Araç listesi yüklenemedi." onRetry={refetch} />
      );
    }
    if (filtered.length === 0) {
      return <EmptyState label="Aramanıza uygun araç bulunamadı." />;
    }
    return filtered.map((v) => (
      <VehicleRow
        key={v.id}
        onSelect={() => onSelect(v.id)}
        selected={v.id === selectedId}
        v={v}
      />
    ));
  }

  return (
    <Card className="pb-4">
      <div className="px-5 pt-5">
        <h3 className="flex items-center gap-2 font-semibold text-[15px] text-ink">
          <span className="flex size-6 items-center justify-center rounded-full bg-dealer-tint font-semibold text-[12px] text-dealer-700">
            1
          </span>
          Araç Seçimi
        </h3>
      </div>

      <div className="mt-4 flex items-center gap-6 border-line border-b px-5">
        {SOURCE_TABS.map((t) => {
          const isActive = t.id === "stok";
          const tabClass = isActive
            ? "border-dealer font-semibold text-dealer"
            : "border-transparent font-medium text-ink-muted hover:text-ink-soft";
          return (
            <button
              className={`-mb-px border-b-2 pb-3 text-[13.5px] ${tabClass}`}
              key={t.id}
              type="button"
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="relative px-5 pt-4">
        <Search
          className="absolute top-[34px] left-8 -translate-y-1/2 text-ink-muted"
          size={16}
          strokeWidth={1.9}
        />
        <input
          className="h-9 w-full rounded-[10px] border border-line-strong bg-surface pl-9 text-[13px] text-ink outline-none placeholder:text-ink-muted focus:border-dealer"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Marka, model veya stok kodu ile ara..."
          type="text"
          value={search}
        />
      </div>

      <div className="mt-4">
        <FilterBar
          filters={filters}
          onChange={(key, v) =>
            setFilterValues((prev) => ({ ...prev, [key]: v }))
          }
          onClear={() => {
            setFilterValues({});
            setSearch("");
          }}
          values={filterValues}
        />
      </div>

      <div className="mt-3">{renderList()}</div>

      <div className="flex items-center justify-between px-5 pt-3">
        <button
          className="flex items-center gap-1.5 font-medium text-[12.5px] text-dealer"
          type="button"
        >
          <RefreshCw size={13} strokeWidth={2} /> Listeyi güncelle
        </button>
        <div className="flex items-center gap-1 text-[12.5px]">
          <button
            className="flex size-7 items-center justify-center rounded-md border border-line-strong text-ink-muted hover:bg-canvas"
            type="button"
          >
            <ChevronLeft size={14} />
          </button>
          {["1", "2", "3"].map((p) => {
            const isActive = p === "1";
            const pageClass = isActive
              ? "bg-dealer font-semibold text-white"
              : "border border-line-strong text-ink-soft hover:bg-canvas";
            return (
              <button
                className={`flex size-7 items-center justify-center rounded-md ${pageClass}`}
                key={p}
                type="button"
              >
                {p}
              </button>
            );
          })}
          <span className="px-1 text-ink-muted">…</span>
          <button
            className="flex size-7 items-center justify-center rounded-md border border-line-strong text-ink-soft hover:bg-canvas"
            type="button"
          >
            25
          </button>
          <button
            className="flex size-7 items-center justify-center rounded-md border border-line-strong text-ink-muted hover:bg-canvas"
            type="button"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </Card>
  );
}

function SelectedVehicleCard({ v }: { v: OfferVehicle }) {
  const specs = [
    { label: "Kilometre", value: v.km },
    { label: "Yakıt Tipi", value: v.fuel },
    { label: "Stok Kodu", value: v.stokKodu },
    { label: "Renk", value: v.renk },
  ];
  return (
    <Card className="pb-5">
      <CardHeader title="Seçili Araç" />
      <div className="mt-3 flex items-start gap-4 px-5">
        <VehicleImage
          className="h-16 w-24 shrink-0 rounded-lg"
          iconSize={30}
          name={`${v.marka} ${v.model}`}
          segment={v.segment}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-semibold text-[15px] text-ink">
                {v.marka} {v.model}
              </div>
              <div className="text-[12.5px] text-ink-soft">{v.variant}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-[16px] text-ink tabular-nums">
                {v.price}
              </div>
              <Badge tone="success">Stokta</Badge>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <Badge tone="neutral">{v.year}</Badge>
            <Badge tone="neutral">{v.segment}</Badge>
            <Badge tone="neutral">{v.transmission}</Badge>
            <Badge tone="neutral">{v.fuel}</Badge>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 border-line border-t px-5 pt-4">
        {specs.map((s) => (
          <div key={s.label}>
            <div className="text-[11.5px] text-ink-muted">{s.label}</div>
            <div className="font-medium text-[13px] text-ink">{s.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

interface FinanceState {
  amount: number;
  down: number;
  rate: string;
  term: string;
}

function FinanceField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 font-medium text-[12px] text-ink-muted">
        {label}
      </div>
      {children}
    </div>
  );
}

function ReadonlyValue({ value, suffix }: { value: string; suffix?: string }) {
  return (
    <div className="flex h-9 items-center justify-between rounded-[10px] border border-line-strong bg-surface px-3 text-[13px] text-ink">
      <span className="font-medium tabular-nums">{value}</span>
      {suffix && (
        <span className="rounded bg-canvas px-1.5 py-0.5 font-semibold text-[11px] text-ink-muted">
          {suffix}
        </span>
      )}
    </div>
  );
}

/** Right-rail estimated finance preview shown under the selected vehicle. */
/**
 * Customer-facing preview of the offer — a mock of what the müşteri sees in
 * their app. Used on the final step so the dealer reviews the real output.
 */
function OfferPreview({ v, fin }: { v: OfferVehicle; fin: FinanceState }) {
  const months = parseTerm(fin.term);
  const monthlyRate = parseRate(fin.rate) / 100;
  const taksit = annuity(fin.amount, monthlyRate, months);
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-2 border-line border-b px-5 py-3">
        <Smartphone className="text-dealer" size={15} strokeWidth={1.9} />
        <span className="font-semibold text-[13px] text-ink">
          Müşteri Önizlemesi
        </span>
        <span className="ml-auto text-[11.5px] text-ink-muted">
          Mobil uygulamada böyle görünür
        </span>
      </div>
      <div className="bg-canvas/60 p-4">
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-success-tint px-2.5 py-1 font-semibold text-[11px] text-success">
              En Uygun Teklif
            </span>
            <Heart className="text-ink-muted" size={16} />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <VehicleImage
              className="h-14 w-20 shrink-0 rounded-xl"
              iconSize={24}
              name={`${v.marka} ${v.model}`}
              segment={v.segment}
            />
            <div className="min-w-0">
              <div className="font-bold text-[15px] text-ink">
                {v.marka} {v.model}
              </div>
              <div className="truncate text-[12px] text-ink-soft">
                {v.variant}
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-xl bg-cust-ink p-3.5 text-white">
            <div className="text-[11px] text-white/70">Aylık Taksit</div>
            <div className="font-bold text-[24px] tabular-nums">
              {formatTRY(taksit)}
            </div>
            <div className="mt-1.5 flex gap-4 text-[11.5px] text-white/80">
              <span>Faiz Oranı {fin.rate}</span>
              <span>Vade {fin.term}</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11.5px] text-ink-soft">Bayi Otomotiv</span>
            <span className="font-semibold text-[12px] text-cust">
              Teklifi İncele →
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function FinancingCard({
  fin,
  setFin,
}: {
  fin: FinanceState;
  setFin: (f: FinanceState) => void;
}) {
  const [showSchedule, setShowSchedule] = useState(false);
  const months = parseTerm(fin.term);
  const monthlyRate = parseRate(fin.rate) / 100;
  const taksit = annuity(fin.amount, monthlyRate, months);
  const toplamGeriOdeme = taksit * months;
  const toplamFaiz = toplamGeriOdeme - fin.amount;
  const maliyetOrani = fin.amount > 0 ? (toplamFaiz / fin.amount) * 100 : 0;
  const schedule = showSchedule
    ? buildSchedule(fin.amount, monthlyRate, months)
    : [];
  const downPercent =
    fin.amount + fin.down > 0
      ? Math.round((fin.down / (fin.amount + fin.down)) * 100)
      : 0;
  const result = [
    { label: "Aylık Taksit", value: formatTRY(taksit), emphasize: true },
    {
      label: "Toplam Geri Ödeme",
      value: formatTRY(toplamGeriOdeme),
      emphasize: false,
    },
    { label: "Toplam Faiz", value: formatTRY(toplamFaiz), emphasize: false },
    {
      label: "Maliyet Oranı",
      value: `%${maliyetOrani.toLocaleString("tr-TR", {
        maximumFractionDigits: 2,
      })}`,
      emphasize: false,
    },
  ];
  return (
    <Card className="pb-5">
      <div className="px-5 pt-5">
        <h3 className="flex items-center gap-2 font-semibold text-[15px] text-ink">
          <span className="flex size-6 items-center justify-center rounded-full bg-dealer font-semibold text-[12px] text-white">
            2
          </span>
          Finansman Bilgileri
        </h3>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-4 px-5">
        <FinanceField label="Kredi Tutarı">
          <ReadonlyValue value={formatTRY(fin.amount)} />
        </FinanceField>
        <FinanceField label="Vade">
          <Select
            onValueChange={(v) => setFin({ ...fin, term: v })}
            value={fin.term}
          >
            <SelectTrigger className="h-9 w-full border-line-strong text-[13px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12 Ay">12 Ay</SelectItem>
              <SelectItem value="24 Ay">24 Ay</SelectItem>
              <SelectItem value="36 Ay">36 Ay</SelectItem>
              <SelectItem value="48 Ay">48 Ay</SelectItem>
            </SelectContent>
          </Select>
        </FinanceField>
        <FinanceField label="Peşinat">
          <ReadonlyValue
            suffix={`%${downPercent}`}
            value={formatTRY(fin.down)}
          />
        </FinanceField>
        <FinanceField label="Faiz Oranı">
          <ReadonlyValue value={fin.rate} />
        </FinanceField>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-4 px-5">
        <div className="col-span-2">
          <Slider
            className="[&_[data-slot=slider-range]]:bg-dealer [&_[data-slot=slider-thumb]]:border-dealer [&_[data-slot=slider-track]]:bg-line"
            max={1_250_000}
            min={100_000}
            onValueChange={(v) => setFin({ ...fin, amount: v[0] })}
            value={[fin.amount]}
          />
          <div className="mt-1 flex justify-between text-[10.5px] text-ink-muted tabular-nums">
            <span>₺100.000</span>
            <span>₺1.250.000</span>
          </div>
        </div>
        <div className="col-span-2">
          <Slider
            className="[&_[data-slot=slider-range]]:bg-dealer [&_[data-slot=slider-thumb]]:border-dealer [&_[data-slot=slider-track]]:bg-line"
            max={60}
            min={0}
            onValueChange={(v) =>
              setFin({ ...fin, down: Math.round((v[0] / 100) * 1_250_000) })
            }
            value={[downPercent]}
          />
          <div className="mt-1 flex items-center justify-between text-[10.5px] text-ink-muted tabular-nums">
            <span>%0</span>
            <span className="font-semibold text-success">Özel Oran</span>
            <span>%60</span>
          </div>
        </div>
      </div>

      <div className="mx-5 mt-4 flex items-start gap-2.5 rounded-[12px] bg-dealer-tint px-4 py-3">
        <Info className="mt-0.5 shrink-0 text-dealer" size={16} />
        <div className="text-[12.5px] leading-5">
          <span className="font-semibold text-dealer-700">
            Bu müşteriye özel oranı uygulanmaktadır.
          </span>
          <p className="text-ink-soft">
            Standart faiz oranına göre müşteriniz aylık %2.120 daha avantajlı.
          </p>
        </div>
      </div>

      <div className="px-5 pt-5">
        <h4 className="font-semibold text-[14px] text-ink">Taksit Hesaplama</h4>
        <div className="mt-3 grid grid-cols-4 overflow-hidden rounded-[12px] border border-line">
          {result.map((r, i) => (
            <div
              className={`px-4 py-3.5 text-center ${
                i > 0 ? "border-line border-l" : ""
              } ${r.emphasize ? "bg-dealer-tint" : "bg-surface"}`}
              key={r.label}
            >
              <div className="text-[11.5px] text-ink-muted">{r.label}</div>
              <div
                className={`mt-1 font-bold text-[18px] tabular-nums ${
                  r.emphasize ? "text-dealer-700" : "text-ink"
                }`}
              >
                {r.value}
              </div>
            </div>
          ))}
        </div>
        <button
          className="mt-3 flex w-full items-center justify-center gap-1.5 font-medium text-[13px] text-dealer"
          onClick={() => setShowSchedule((s) => !s)}
          type="button"
        >
          Detaylı Amortisman Tablosu{" "}
          <ChevronDown
            className={`transition-transform ${showSchedule ? "rotate-180" : ""}`}
            size={15}
          />
        </button>
        {showSchedule && (
          <div className="mt-3 max-h-64 overflow-auto rounded-[12px] border border-line">
            <table className="w-full text-[12px]">
              <thead className="sticky top-0 bg-canvas">
                <tr className="text-ink-muted">
                  {["Ay", "Taksit", "Anapara", "Faiz", "Kalan Anapara"].map(
                    (h) => (
                      <th
                        className="px-3 py-2 text-right font-semibold first:pl-4 first:text-left"
                        key={h}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {schedule.map((r) => (
                  <tr className="border-line border-t" key={r.month}>
                    <td className="px-3 py-1.5 pl-4 text-ink-soft tabular-nums">
                      {r.month}. Ay
                    </td>
                    <td className="px-3 py-1.5 text-right font-medium text-ink tabular-nums">
                      {formatTRY(r.payment)}
                    </td>
                    <td className="px-3 py-1.5 text-right text-ink-soft tabular-nums">
                      {formatTRY(r.principal)}
                    </td>
                    <td className="px-3 py-1.5 text-right text-ink-soft tabular-nums">
                      {formatTRY(r.interest)}
                    </td>
                    <td className="px-3 py-1.5 text-right text-ink-soft tabular-nums">
                      {formatTRY(r.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="border-line border-t px-5 pt-5">
        <h4 className="font-semibold text-[14px] text-ink">
          Ek Ürünler{" "}
          <span className="font-normal text-[12.5px] text-ink-muted">
            (İsteğe Bağlı)
          </span>
        </h4>
        <div className="mt-3 grid grid-cols-4 gap-3">
          {ADD_ONS.map((a) => (
            <label
              className={`flex flex-col gap-2 rounded-[10px] border px-3 py-3 ${
                a.on
                  ? "border-dealer/40 bg-dealer-tint/40"
                  : "border-line bg-surface"
              }`}
              htmlFor={`addon-${a.id}`}
              key={a.id}
            >
              <span className="flex items-center gap-2">
                <Checkbox
                  className="data-[state=checked]:border-dealer data-[state=checked]:bg-dealer"
                  defaultChecked={a.on}
                  id={`addon-${a.id}`}
                />
                <span className="font-semibold text-[12.5px] text-ink">
                  {a.label}
                </span>
              </span>
              <span className="text-[11.5px] text-ink-muted tabular-nums">
                {a.price}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-line border-t px-5 pt-5">
        <h4 className="font-semibold text-[14px] text-ink">Notlar</h4>
        <textarea
          className="mt-3 h-24 w-full resize-none rounded-[10px] border border-line-strong bg-surface p-3 text-[13px] text-ink outline-none placeholder:text-ink-muted focus:border-dealer"
          maxLength={500}
          placeholder="Bu teklif ile ilgili notunuzu buraya yazabilirsiniz..."
        />
        <div className="mt-1 text-right text-[11.5px] text-ink-muted">
          0 / 500
        </div>
      </div>
    </Card>
  );
}

function MusteriFirsatCard() {
  const rows = [
    {
      label: "Kredi Bitiş Tarihi",
      value: "22.05.2025",
      danger: "30 gün kaldı",
    },
    { label: "Kalan Taksit", value: "8 / 36" },
    { label: "Bütçe Aralığı", value: "₺1,2M - ₺1,5M" },
  ];
  return (
    <Card className="pb-5">
      <CardHeader title="Müşteri & Fırsat Bilgisi" />
      <div className="mt-3 flex items-center gap-4 border-line border-b px-5 pb-4">
        <ScoreRing size={56} stroke={6} value={92} />
        <div>
          <div className="font-semibold text-[13px] text-ink">
            Yenileme Skoru
          </div>
          <div className="font-bold text-[14px] text-success">Yüksek</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 px-5 pt-4">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="text-[11.5px] text-ink-muted">{r.label}</div>
            <div className="font-semibold text-[13px] text-ink tabular-nums">
              {r.value}
            </div>
            {r.danger && (
              <div className="font-semibold text-[11.5px] text-danger">
                {r.danger}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

function SegmentMatchCard({ segment }: { segment: string }) {
  const rows = [
    { label: `${segment} Segmenti`, value: MATCH_ROWS[0].value },
    ...MATCH_ROWS.slice(1),
  ];
  return (
    <Card className="pb-5">
      <CardHeader
        action={<Badge tone="success">Yüksek Uyum</Badge>}
        title="Segment Eşleşmesi"
      />
      <div className="mt-4 flex flex-col gap-3.5 px-5">
        {rows.map((m) => (
          <div
            className="grid grid-cols-[1fr_auto] items-center gap-3"
            key={m.label}
          >
            <span className="text-[12.5px] text-ink-soft">{m.label}</span>
            <span className="flex items-center gap-3">
              <span className="h-1.5 w-28 overflow-hidden rounded-full bg-line">
                <span
                  className="block h-full rounded-full bg-success"
                  style={{ width: `${m.value}%` }}
                />
              </span>
              <span className="w-9 text-right font-semibold text-[12.5px] text-ink tabular-nums">
                %{m.value}
              </span>
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ConfirmHint() {
  return (
    <div className="flex items-start gap-2.5 rounded-[12px] border border-success/30 bg-success-tint px-4 py-3.5">
      <CheckCircle2 className="mt-0.5 shrink-0 text-success" size={18} />
      <div className="text-[12.5px] leading-5">
        <div className="font-semibold text-success">
          Bu teklif, müşteri profili ile yüksek uyum göstermektedir.
        </div>
        <p className="text-ink-soft">
          Teklif gönderildiğinde müşteriye mobil uygulama üzerinden
          bildirilecek.
        </p>
      </div>
    </div>
  );
}

function summaryRows(fin: FinanceState) {
  const months = parseTerm(fin.term);
  const monthlyRate = parseRate(fin.rate) / 100;
  const taksit = annuity(fin.amount, monthlyRate, months);
  const total = taksit * months;
  return [
    { label: "Kredi Tutarı", value: formatTRY(fin.amount), strong: false },
    { label: "Peşinat", value: formatTRY(fin.down), strong: false },
    { label: "Vade", value: fin.term, strong: false },
    { label: "Faiz Oranı", value: fin.rate, strong: false },
    { label: "Aylık Taksit", value: formatTRY(taksit), strong: true },
    { label: "Toplam Geri Ödeme", value: formatTRY(total), strong: false },
    {
      label: "Toplam Faiz",
      value: formatTRY(total - fin.amount),
      strong: false,
    },
  ];
}

function SummaryLabel({ children }: { children: string }) {
  return (
    <div className="mb-2 font-semibold text-[11px] text-ink-muted uppercase tracking-wide">
      {children}
    </div>
  );
}

function OfferSummaryCard({ v, fin }: { v: OfferVehicle; fin: FinanceState }) {
  const addons = ADD_ONS.filter((a) => a.on);
  return (
    <Card className="pb-5">
      <CardHeader
        subtitle="Müşteriye gönderilecek teklifin tüm detayları"
        title="Teklif Özeti"
      />
      <div className="mt-4 flex flex-col gap-5 px-5">
        <div>
          <SummaryLabel>Araç</SummaryLabel>
          <div className="flex items-center gap-3 rounded-[12px] border border-line p-3">
            <VehicleImage
              className="h-12 w-16 shrink-0 rounded-lg"
              iconSize={20}
              name={`${v.marka} ${v.model}`}
              segment={v.segment}
            />
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-[14px] text-ink">
                {v.marka} {v.model}
              </div>
              <div className="text-[12px] text-ink-soft">
                {v.variant} · {v.year} · {v.segment}
              </div>
            </div>
            <div className="font-bold text-[15px] text-ink tabular-nums">
              {v.price}
            </div>
          </div>
        </div>
        <div>
          <SummaryLabel>Finansman</SummaryLabel>
          <dl className="divide-y divide-line rounded-[12px] border border-line">
            {summaryRows(fin).map((r) => (
              <div
                className="flex items-center justify-between px-4 py-2.5"
                key={r.label}
              >
                <dt className="text-[12.5px] text-ink-soft">{r.label}</dt>
                <dd
                  className={`text-[13px] tabular-nums ${r.strong ? "font-bold text-dealer-700" : "font-medium text-ink"}`}
                >
                  {r.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <SummaryLabel>Ek Ürünler</SummaryLabel>
          <div className="flex flex-wrap gap-2">
            {addons.map((a) => (
              <Badge key={a.id} tone="dealer">
                {a.label}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function SendCard({
  channels,
  onToggleChannel,
  validity,
  onValidity,
  consent,
  onConsent,
}: {
  channels: string[];
  onToggleChannel: (id: string) => void;
  validity: string;
  onValidity: (v: string) => void;
  consent: boolean;
  onConsent: (v: boolean) => void;
}) {
  return (
    <Card className="pb-5">
      <CardHeader
        subtitle="Teklifin müşteriye nasıl iletileceğini belirleyin"
        title="Onay & Gönder"
      />
      <div className="mt-4 flex flex-col gap-5 px-5">
        <div>
          <SummaryLabel>Gönderim Kanalı</SummaryLabel>
          <div className="grid grid-cols-2 gap-2.5">
            {SEND_CHANNELS.map((c) => (
              <div
                className="flex items-center gap-2.5 rounded-[10px] border border-line px-3 py-2.5"
                key={c.id}
              >
                <Checkbox
                  checked={channels.includes(c.id)}
                  id={`ch-${c.id}`}
                  onCheckedChange={() => onToggleChannel(c.id)}
                />
                <label
                  className="cursor-pointer text-[13px] text-ink"
                  htmlFor={`ch-${c.id}`}
                >
                  {c.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <SummaryLabel>Teklif Geçerlilik Süresi</SummaryLabel>
          <Select onValueChange={onValidity} value={validity}>
            <SelectTrigger className="h-9 w-full border-line-strong text-[13px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["7 gün", "14 gün", "30 gün"].map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-start gap-2.5 rounded-[12px] border border-line bg-canvas px-4 py-3">
          <Checkbox
            checked={consent}
            className="mt-0.5"
            id="consent"
            onCheckedChange={() => onConsent(!consent)}
          />
          <label
            className="cursor-pointer text-[12.5px] text-ink-soft leading-5"
            htmlFor="consent"
          >
            Müşterinin teklif alma onayı (KVKK kapsamında) mevcuttur ve teklif
            gönderimini onaylıyorum.
          </label>
        </div>
        <ConfirmHint />
      </div>
    </Card>
  );
}

function BottomBar({
  step,
  setStep,
  onSend,
  onSaveDraft,
  canSend,
}: {
  step: number;
  setStep: (n: number) => void;
  onSend: () => void;
  onSaveDraft: () => void;
  canSend: boolean;
}) {
  const isLast = step === STEPS.length;
  return (
    <div className="flex items-center justify-between pt-2">
      <button
        className="flex items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-5 py-2.5 font-semibold text-[13.5px] text-ink-soft hover:bg-canvas disabled:opacity-40"
        disabled={step === 1}
        onClick={() => setStep(step - 1)}
        type="button"
      >
        <ChevronLeft size={16} /> Geri
      </button>
      <div className="flex items-center gap-3">
        <button
          className="flex items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-5 py-2.5 font-semibold text-[13.5px] text-ink-soft hover:bg-canvas"
          onClick={onSaveDraft}
          type="button"
        >
          <Bookmark size={16} /> Taslak olarak Kaydet
        </button>
        {isLast ? (
          <button
            className="flex items-center gap-2 rounded-[10px] bg-dealer px-6 py-2.5 font-semibold text-[13.5px] text-white hover:bg-dealer-600 disabled:opacity-40"
            disabled={!canSend}
            onClick={onSend}
            type="button"
          >
            Teklifi Gönder <Send size={16} />
          </button>
        ) : (
          <button
            className="flex items-center gap-2 rounded-[10px] bg-dealer px-6 py-2.5 font-semibold text-[13.5px] text-white hover:bg-dealer-600"
            onClick={() => setStep(step + 1)}
            type="button"
          >
            Devam Et <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export function DealerTeklifOlustur() {
  const { data, isPending, isError, refetch } = useOfferVehicles();
  const vehicles = useMemo(() => data ?? [], [data]);

  const [step, setStep] = useState(1);
  const [selectedId, setSelectedId] = useState("");
  const [fin, setFin] = useState<FinanceState>({
    amount: 1_000_000,
    down: 250_000,
    rate: "%2,29",
    term: "36 Ay",
  });

  const [channels, setChannels] = useState<string[]>(["app", "eposta"]);
  const [validity, setValidity] = useState("14 gün");
  const [consent, setConsent] = useState(false);

  // Selection state stays local; resolve against the loaded list and fall back
  // to the first loaded row until the dealer picks one.
  const selected = useMemo(
    () => vehicles.find((v) => v.id === selectedId) ?? vehicles[0],
    [vehicles, selectedId]
  );

  const toggleChannel = (id: string) =>
    setChannels((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const sendOffer = () => toast.success("Teklif müşteriye gönderildi.");
  const saveDraft = () => toast.success("Teklif taslak olarak kaydedildi.");

  return (
    <DealerShell
      breadcrumb={["Teklifler", "Teklif Oluştur"]}
      subtitle="Müşteriye özel en uygun teklifi oluşturun ve gönderin."
      title="Teklif Oluştur"
    >
      <Stepper active={step} onSelect={setStep} />

      {step === 1 && (
        <div className="mt-5 grid grid-cols-[1.6fr_1fr] gap-5">
          <VehicleListCard
            isError={isError}
            isPending={isPending}
            onSelect={setSelectedId}
            refetch={refetch}
            selectedId={selectedId}
            vehicles={vehicles}
          />
          <div className="flex flex-col gap-5">
            <MusteriFirsatCard />
            {selected && (
              <>
                <SelectedVehicleCard v={selected} />
                <SegmentMatchCard segment={selected.segment} />
              </>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-5 grid grid-cols-[1.6fr_1fr] gap-5">
          <FinancingCard fin={fin} setFin={setFin} />
          <div className="flex flex-col gap-5">
            {selected && <SelectedVehicleCard v={selected} />}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-5 grid grid-cols-[1.6fr_1fr] gap-5">
          {selected && <OfferSummaryCard fin={fin} v={selected} />}
          <div className="flex flex-col gap-5">
            {selected && <SelectedVehicleCard v={selected} />}
            <MusteriFirsatCard />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="mt-5 grid grid-cols-[1.6fr_1fr] gap-5">
          <SendCard
            channels={channels}
            consent={consent}
            onConsent={setConsent}
            onToggleChannel={toggleChannel}
            onValidity={setValidity}
            validity={validity}
          />
          <div className="flex flex-col gap-5">
            {selected && (
              <>
                <SelectedVehicleCard v={selected} />
                <OfferPreview fin={fin} v={selected} />
              </>
            )}
          </div>
        </div>
      )}

      <div className="mt-5">
        <BottomBar
          canSend={consent}
          onSaveDraft={saveDraft}
          onSend={sendOffer}
          setStep={setStep}
          step={step}
        />
      </div>
    </DealerShell>
  );
}
