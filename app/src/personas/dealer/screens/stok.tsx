import { Link } from "@tanstack/react-router";
import type { Table } from "@tanstack/react-table";
import { createColumnHelper, flexRender } from "@tanstack/react-table";
import {
  ArrowRight,
  ArrowUpDown,
  Car,
  ChevronDown,
  ChevronUp,
  Download,
  FileEdit,
  LayoutGrid,
  List,
  MoreVertical,
  PencilLine,
  Plus,
  RotateCcw,
  Search,
  Send,
  SlidersHorizontal,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMarka, kategoriLabel } from "@/data/arac-taksonomisi";
import { Badge } from "@/ui/badge";
import { Card } from "@/ui/card";
import { useDataTable } from "@/ui/use-data-table";
import { DealerShell } from "../dealer-shell";

type StockStatus = "Stokta" | "Rezerve" | "Satıldı";

interface StockVehicle {
  durum: StockStatus;
  fiyat: string;
  id: string;
  km: string;
  marka: string;
  markaSlug: string;
  model: string;
  plaka: string;
  segment: string;
  varyant: string;
  yakit: string;
  yil: number;
}

function segmentLabel(markaSlug: string, model: string, fallback: string) {
  const found = getMarka(markaSlug)?.modeller.find((m) => m.model === model);
  if (found) {
    return kategoriLabel(found.kategori);
  }
  return fallback;
}

const VEHICLES: StockVehicle[] = [
  {
    id: "1",
    markaSlug: "volkswagen",
    marka: "Volkswagen",
    model: "Tiguan",
    varyant: "1.5 TSI e-TSI Life DSG",
    plaka: "34 ABC 123",
    segment: "SUV",
    fiyat: "₺1.250.000",
    yil: 2020,
    km: "45.000 km",
    yakit: "Benzin",
    durum: "Stokta",
  },
  {
    id: "2",
    markaSlug: "toyota",
    marka: "Toyota",
    model: "Corolla",
    varyant: "1.8 Vision",
    plaka: "34 DEF 456",
    segment: "Sedan",
    fiyat: "₺980.000",
    yil: 2020,
    km: "38.000 km",
    yakit: "Hibrit",
    durum: "Stokta",
  },
  {
    id: "3",
    markaSlug: "peugeot",
    marka: "Peugeot",
    model: "3008",
    varyant: "1.5 BlueHDi Active",
    plaka: "34 GHI 789",
    segment: "SUV",
    fiyat: "₺1.180.000",
    yil: 2021,
    km: "52.000 km",
    yakit: "Dizel",
    durum: "Stokta",
  },
  {
    id: "4",
    markaSlug: "renault",
    marka: "Renault",
    model: "Clio",
    varyant: "1.0 TCe Joy",
    plaka: "34 JKL 012",
    segment: "Hatchback",
    fiyat: "₺650.000",
    yil: 2019,
    km: "61.000 km",
    yakit: "Benzin",
    durum: "Rezerve",
  },
  {
    id: "5",
    markaSlug: "honda",
    marka: "Honda",
    model: "Civic",
    varyant: "1.6 i-VTEC Eco",
    plaka: "34 MNO 345",
    segment: "Sedan",
    fiyat: "₺890.000",
    yil: 2018,
    km: "72.000 km",
    yakit: "Benzin",
    durum: "Stokta",
  },
  {
    id: "6",
    markaSlug: "nissan",
    marka: "Nissan",
    model: "Qashqai",
    varyant: "1.3 DIG-T SkyPack",
    plaka: "34 PRS 678",
    segment: "SUV",
    fiyat: "₺750.000",
    yil: 2017,
    km: "85.000 km",
    yakit: "Benzin",
    durum: "Satıldı",
  },
  {
    id: "7",
    markaSlug: "skoda",
    marka: "Skoda",
    model: "Octavia",
    varyant: "1.5 TSI Premium",
    plaka: "34 TUV 901",
    segment: "Sedan",
    fiyat: "₺920.000",
    yil: 2020,
    km: "49.000 km",
    yakit: "Benzin",
    durum: "Stokta",
  },
  {
    id: "8",
    markaSlug: "hyundai",
    marka: "Hyundai",
    model: "i20",
    varyant: "1.4 MPI Jump",
    plaka: "34 XYZ 234",
    segment: "Hatchback",
    fiyat: "₺620.000",
    yil: 2019,
    km: "58.000 km",
    yakit: "Benzin",
    durum: "Stokta",
  },
];

const STATUS_TONE: Record<StockStatus, "success" | "warn" | "neutral"> = {
  Stokta: "success",
  Rezerve: "warn",
  Satıldı: "neutral",
};

// Distinct values present in the data — guarantees column filters match.
const SEGMENTS = [...new Set(VEHICLES.map((v) => v.segment))];
const DURUMLAR = [...new Set(VEHICLES.map((v) => v.durum))];
const YAKITLAR = [...new Set(VEHICLES.map((v) => v.yakit))];

interface FilterDef {
  /** table column id this filter drives; omitted = visual only */
  column?: string;
  label: string;
  options: string[];
}

const FILTERS: FilterDef[] = [
  { label: "Segment", options: SEGMENTS, column: "segment" },
  { label: "Araç Tipi", options: ["Otomobil", "Arazi/SUV", "Minivan"] },
  // "Yakıt Tipi" drives the price column via a custom filterFn that reads
  // row.original.yakit — no extra column needed, layout unchanged.
  { label: "Yakıt Tipi", options: YAKITLAR, column: "fiyat" },
  { label: "Vites", options: ["Otomatik", "Manuel", "Yarı Otomatik"] },
  { label: "Durum", options: DURUMLAR, column: "durum" },
  { label: "Konum", options: ["İstanbul", "Ankara", "İzmir"] },
];

const ALL = "__all__";

function SortIcon({ state }: { state: false | "asc" | "desc" }) {
  if (state === "asc") {
    return <ChevronUp size={12} />;
  }
  if (state === "desc") {
    return <ChevronDown size={12} />;
  }
  return <ArrowUpDown className="opacity-40" size={12} />;
}

const SPEC_CHIPS = ["2020", "SUV", "Otomatik", "Benzin", "Beyaz"];

const INFO_GRID: { label: string; value: string }[] = [
  { label: "Stok Kodu", value: "KA-2020-1256" },
  { label: "İlk Tescil Tarihi", value: "15.06.2020" },
  { label: "Plaka", value: "34 ABC 123" },
  { label: "Renk", value: "Beyaz" },
  { label: "Şasi No", value: "WVGZZZ5NZLW123456" },
  { label: "Araç Durumu", value: "Sorunsuz" },
  { label: "Motor No", value: "DADA123456" },
];

const SPEC_ROWS: { label: string; value: string }[] = [
  { label: "Yakıt", value: "Benzin" },
  { label: "Kasa Tipi", value: "SUV" },
  { label: "Vites", value: "Otomatik" },
  { label: "Kapı Sayısı", value: "5" },
  { label: "Çekiş", value: "Önden Çekiş" },
  { label: "Koltuk Sayısı", value: "5" },
  { label: "Motor Hacmi", value: "1.498 cc" },
  { label: "Renk (Dış)", value: "Beyaz" },
  { label: "Motor Gücü", value: "150 PS" },
  { label: "Renk (İç)", value: "Siyah" },
  { label: "Tork", value: "250 Nm" },
  { label: "Garanti Durumu", value: "Garanti Devam Ediyor" },
  { label: "", value: "" },
  { label: "Garanti Bitiş", value: "15.06.2025" },
  { label: "", value: "" },
  { label: "Muayene Bitiş", value: "10.06.2026" },
];

const DETAIL_TABS = [
  "Genel Bilgi",
  "Özellikler",
  "Görseller",
  "Belgeler",
  "Fiyat Geçmişi",
  "İşlemler",
];

const ACTIONS = [
  { icon: PencilLine, label: "Düzenle", danger: false },
  { icon: Tag, label: "Fiyat Geçmişi", danger: false },
  { icon: Send, label: "Sahibinden'e Gönder", danger: false },
  { icon: Download, label: "Rapor İndir", danger: false },
  { icon: Trash2, label: "Stoktan Çıkar", danger: true },
];

const ch = createColumnHelper<StockVehicle>();

const columns = [
  ch.accessor(
    (row) => `${row.marka} ${row.model} ${row.varyant} ${row.plaka}`,
    {
      id: "arac",
      header: "Araç",
      cell: (info) => {
        const row = info.row.original;
        return (
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-16 shrink-0 items-center justify-center rounded-lg bg-canvas text-ink-muted">
              <Car size={20} strokeWidth={1.7} />
            </span>
            <span className="leading-tight">
              <span className="block font-semibold text-[13.5px] text-ink">
                {row.marka} {row.model}
              </span>
              <span className="block text-[12px] text-ink-soft">
                {row.varyant}
              </span>
              <span className="mt-0.5 block text-[11px] text-ink-muted tabular-nums">
                {row.plaka}
              </span>
            </span>
          </div>
        );
      },
    }
  ),
  ch.accessor("segment", {
    header: "Segment",
    filterFn: "equalsString",
    cell: (info) => <Badge tone="dealer">{info.getValue()}</Badge>,
  }),
  ch.accessor("fiyat", {
    header: "Fiyat",
    // Hosts the "Yakıt Tipi" filter without its own column: matches on yakit.
    filterFn: (row, _id, value) => row.original.yakit === value,
    cell: (info) => (
      <span className="font-bold text-[13.5px] text-ink tabular-nums">
        {info.getValue()}
      </span>
    ),
  }),
  ch.accessor("yil", {
    header: "Yıl",
    cell: (info) => (
      <span className="text-[12.5px] text-ink-soft tabular-nums">
        {info.getValue()}
      </span>
    ),
  }),
  ch.accessor("km", {
    header: "KM",
    cell: (info) => (
      <span className="text-[12.5px] text-ink-soft tabular-nums">
        {info.getValue()}
      </span>
    ),
  }),
  ch.accessor("durum", {
    header: "Durum",
    filterFn: "equalsString",
    cell: (info) => {
      const v = info.getValue();
      return <Badge tone={STATUS_TONE[v]}>{v}</Badge>;
    },
  }),
  ch.display({
    id: "actions",
    header: "",
    cell: () => (
      <button
        className="flex size-8 items-center justify-center rounded-lg text-ink-muted hover:bg-canvas hover:text-ink"
        type="button"
      >
        <MoreVertical size={16} />
      </button>
    ),
  }),
];

function Toolbar({ table }: { table: Table<StockVehicle> }) {
  // Selects are controlled by local state so "Filtreleri Temizle" can reset
  // their displayed value too (not just the underlying table filter).
  const [selected, setSelected] = useState<Record<string, string>>({});

  const clearAll = () => {
    table.resetColumnFilters();
    table.setGlobalFilter("");
    setSelected({});
  };

  return (
    <Card className="mt-5 px-5 py-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[200px] flex-1">
          <div className="mb-1.5 font-medium text-[12px] text-ink-soft">
            Araç Ara
          </div>
          <div className="flex items-center gap-2 rounded-[10px] border border-line-strong px-3 py-2">
            <Search className="text-ink-muted" size={16} />
            <input
              className="w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-muted"
              onChange={(e) => table.setGlobalFilter(e.target.value)}
              placeholder="Marka, model, plaka..."
              value={(table.getState().globalFilter as string) ?? ""}
            />
          </div>
        </div>
        {FILTERS.map((f) => (
          <div className="w-[118px]" key={f.label}>
            <div className="mb-1.5 font-medium text-[12px] text-ink-soft">
              {f.label}
            </div>
            <Select
              onValueChange={(v) => {
                setSelected((prev) => ({ ...prev, [f.label]: v }));
                if (f.column) {
                  table
                    .getColumn(f.column)
                    ?.setFilterValue(v === ALL ? undefined : v);
                }
              }}
              value={selected[f.label] ?? ALL}
            >
              <SelectTrigger className="w-full">
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
        <button
          className="flex items-center gap-2 rounded-[10px] px-3 py-2 font-medium text-[12.5px] text-ink-soft hover:bg-canvas"
          onClick={clearAll}
          type="button"
        >
          <RotateCcw size={15} /> Filtreleri Temizle
        </button>
        <button
          className="flex items-center gap-2 rounded-[10px] border border-line-strong px-3 py-2 font-medium text-[12.5px] text-dealer-700"
          type="button"
        >
          <SlidersHorizontal size={15} /> Daha Fazla Filtre
        </button>
      </div>
    </Card>
  );
}

function StockTable({
  table,
  selectedId,
  onSelect,
}: {
  table: Table<StockVehicle>;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <Card className="mt-5 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4">
        <h3 className="font-semibold text-[14px] text-ink">
          {table.getFilteredRowModel().rows.length} araç bulundu
        </h3>
        <div className="flex items-center gap-2">
          <span className="mr-1 text-[12px] text-ink-muted">Görünüm</span>
          <button
            className="flex size-8 items-center justify-center rounded-lg bg-dealer text-white"
            type="button"
          >
            <List size={16} />
          </button>
          <button
            className="flex size-8 items-center justify-center rounded-lg border border-line-strong text-ink-muted hover:bg-canvas"
            type="button"
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      <table className="w-full border-line border-t">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr className="bg-canvas/60" key={hg.id}>
              {hg.headers.map((header) => {
                const content = flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                );
                return (
                  <th
                    className="px-4 py-2.5 text-left font-semibold text-[11px] text-ink-muted uppercase tracking-wide first:pl-5"
                    key={header.id}
                  >
                    {header.column.getCanSort() ? (
                      <button
                        className="flex items-center gap-1 uppercase hover:text-ink-soft"
                        onClick={header.column.getToggleSortingHandler()}
                        type="button"
                      >
                        {content}
                        <SortIcon state={header.column.getIsSorted()} />
                      </button>
                    ) : (
                      content
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const isActive = row.original.id === selectedId;
            return (
              <tr
                className={`cursor-pointer border-line border-t ${
                  isActive
                    ? "bg-dealer-tint/60 ring-1 ring-dealer ring-inset"
                    : "hover:bg-canvas/50"
                }`}
                key={row.id}
                onClick={() => onSelect(row.original.id)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td className="px-4 py-3 first:pl-5" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex items-center justify-between border-line border-t px-5 py-3.5 text-[12.5px] text-ink-muted">
        <div className="flex items-center gap-2">
          <span>Sayfa başına</span>
          <span className="rounded-md border border-line-strong px-2 py-1 font-medium text-ink-soft">
            10
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            className="flex size-8 items-center justify-center rounded-lg border border-line-strong text-ink-muted"
            type="button"
          >
            ‹
          </button>
          {["1", "2", "3", "...", "13"].map((p) => {
            const isCurrent = p === "1";
            return (
              <button
                className={`flex size-8 items-center justify-center rounded-lg font-medium ${
                  isCurrent
                    ? "bg-dealer text-white"
                    : "border border-line-strong text-ink-soft"
                }`}
                key={p}
                type="button"
              >
                {p}
              </button>
            );
          })}
          <button
            className="flex size-8 items-center justify-center rounded-lg border border-line-strong text-ink-soft"
            type="button"
          >
            ›
          </button>
        </div>
      </div>
    </Card>
  );
}

function DetailPanel({ vehicle }: { vehicle: StockVehicle }) {
  const segment = segmentLabel(
    vehicle.markaSlug,
    vehicle.model,
    vehicle.segment
  );
  return (
    <Card className="sticky top-6 overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5">
        <Badge tone="success">{vehicle.durum}</Badge>
        <button
          className="flex size-8 items-center justify-center rounded-lg text-ink-muted hover:bg-canvas hover:text-ink"
          type="button"
        >
          <X size={17} />
        </button>
      </div>

      <div className="flex gap-4 px-5 pt-3">
        <div className="flex flex-col gap-2">
          <div className="flex h-[120px] w-[150px] items-center justify-center rounded-xl bg-canvas text-ink-muted">
            <Car size={44} strokeWidth={1.4} />
          </div>
          <div className="flex items-center gap-1.5">
            {["a", "b", "c"].map((k) => (
              <span
                className="flex size-9 items-center justify-center rounded-md bg-canvas text-ink-muted"
                key={k}
              >
                <Car size={15} strokeWidth={1.6} />
              </span>
            ))}
            <span className="flex size-9 items-center justify-center rounded-md bg-dealer-tint font-semibold text-[11px] text-dealer-700">
              +8
            </span>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-bold text-[18px] text-ink leading-6 tracking-tight">
            {vehicle.marka} {vehicle.model}
          </h2>
          <p className="mt-0.5 text-[12.5px] text-ink-soft">
            {vehicle.varyant}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {SPEC_CHIPS.map((chip) => (
              <span
                className="rounded-full bg-canvas px-2.5 py-1 font-medium text-[11.5px] text-ink-soft"
                key={chip}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3 px-5">
        <div>
          <div className="text-[12px] text-ink-muted">Fiyat</div>
          <div className="font-bold text-[22px] text-ink tabular-nums leading-7 tracking-tight">
            {vehicle.fiyat}
          </div>
        </div>
        <button
          className="flex items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-3.5 py-2 font-semibold text-[12.5px] text-dealer-700 hover:bg-canvas"
          type="button"
        >
          <FileEdit size={15} /> Fiyat Düzelt
        </button>
      </div>

      <Link
        className="mx-5 mt-4 flex items-center justify-center gap-2 rounded-[10px] bg-dealer py-2.5 font-semibold text-[13px] text-white hover:bg-dealer-600"
        to="/bayi/arac-detay"
      >
        Tüm Detayları Gör <ArrowRight size={15} />
      </Link>

      {/* info grid */}
      <div className="mx-5 mt-4 grid grid-cols-2 gap-x-6 gap-y-3 rounded-xl bg-canvas/60 px-4 py-4">
        <div className="space-y-3">
          {INFO_GRID.filter((_, i) => i % 2 === 0).map((row) => (
            <div className="font-semibold text-[13px] text-ink" key={row.label}>
              {row.value}
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {INFO_GRID.filter((_, i) => i % 2 === 1).map((row) => (
            <div className="flex items-center justify-between" key={row.label}>
              <span className="text-[12.5px] text-ink-soft">{row.label}</span>
              {row.value === "Sorunsuz" ? (
                <Badge tone="success">{row.value}</Badge>
              ) : (
                <span className="font-semibold text-[12.5px] text-ink">
                  {row.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* tabs */}
      <div className="mt-4 flex items-center gap-5 overflow-x-auto border-line border-b px-5">
        {DETAIL_TABS.map((tab, i) => {
          const active = i === 0;
          return (
            <button
              className={`whitespace-nowrap border-b-2 pb-2.5 font-medium text-[13px] ${
                active
                  ? "border-dealer text-dealer-700"
                  : "border-transparent text-ink-muted hover:text-ink-soft"
              }`}
              key={tab}
              type="button"
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* lower split: spec grid + actions */}
      <div className="grid grid-cols-[1fr_180px] gap-4 px-5 py-5">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
          {SPEC_ROWS.map((row, i) => {
            if (!row.label) {
              const filler = `filler-${i}`;
              return <div className="hidden md:block" key={filler} />;
            }
            return (
              <div
                className="flex items-center justify-between gap-2"
                key={row.label}
              >
                <span className="text-[12px] text-ink-soft">{row.label}</span>
                <span className="text-right font-semibold text-[12px] text-ink">
                  {row.value}
                </span>
              </div>
            );
          })}
          <div className="hidden text-[12px] text-ink-soft md:block">
            Segment
          </div>
          <div className="hidden text-right font-semibold text-[12px] text-ink md:block">
            {segment}
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="font-semibold text-[13px] text-ink">İşlemler</div>
          {ACTIONS.map(({ icon: Icon, label, danger }) => (
            <button
              className={`flex w-full items-center gap-2.5 rounded-[10px] border border-line px-3 py-2 font-medium text-[12.5px] hover:bg-canvas ${
                danger ? "text-danger" : "text-ink-soft"
              }`}
              key={label}
              type="button"
            >
              <Icon size={15} /> {label}
            </button>
          ))}
          <div className="pt-2">
            <div className="font-semibold text-[13px] text-ink">Notlar</div>
            <button
              className="mt-2 flex w-full items-center justify-between gap-2 rounded-[10px] border border-line px-3 py-2.5 text-[12px] text-ink-muted hover:bg-canvas"
              type="button"
            >
              Not eklemek için tıklayın...
              <PencilLine size={14} />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function DealerStok() {
  const [selectedId, setSelectedId] = useState("1");
  const selected = VEHICLES.find((v) => v.id === selectedId) ?? VEHICLES[0];
  const table = useDataTable({ data: VEHICLES, columns, pageSize: 6 });

  return (
    <DealerShell
      actions={
        <button
          className="flex items-center gap-2 rounded-[10px] bg-dealer px-3.5 py-2 font-semibold text-[13px] text-white hover:bg-dealer-600"
          onClick={() => toast.success("Araç ekleme formu açılıyor…")}
          type="button"
        >
          <Plus size={16} /> Araç Ekle
        </button>
      }
      breadcrumb={["Stok Yönetimi", "Araç Listesi"]}
      subtitle="Stoktaki araçlarınızı yönetin, fiyat ve durum bilgilerini güncelleyin."
      title="Stok Yönetimi"
    >
      <Toolbar table={table} />
      <div className="mt-1 grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
        <StockTable
          onSelect={setSelectedId}
          selectedId={selectedId}
          table={table}
        />
        <div className="lg:mt-5">
          <DetailPanel vehicle={selected} />
        </div>
      </div>
    </DealerShell>
  );
}
