import { Link } from "@tanstack/react-router";
import type { Table } from "@tanstack/react-table";
import { createColumnHelper, flexRender } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Car,
  ChevronDown,
  ChevronUp,
  Download,
  MoreVertical,
  Search,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users2,
  Wallet,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/ui/badge";
import { Card } from "@/ui/card";
import { ScoreRing } from "@/ui/score-ring";
import { StatCard } from "@/ui/stat-card";
import { useDataTable } from "@/ui/use-data-table";
import { DealerShell } from "../dealer-shell";

interface Opportunity {
  avatarTone: string;
  bitis: string;
  butce: string;
  id: string;
  initials: string;
  kalanGun: number;
  paid: number;
  segment: string;
  skor: number;
  total: number;
  vehicle: string;
  vehicleSub: string;
}

const OPPORTUNITIES: Opportunity[] = [
  {
    id: "MST-08412",
    initials: "08",
    avatarTone: "bg-dealer-tint text-dealer-700",
    vehicle: "BMW 3 Serisi",
    vehicleSub: "2021 · 320i",
    bitis: "15.08.2025",
    kalanGun: 28,
    paid: 8,
    total: 36,
    skor: 92,
    butce: "₺1.8M - ₺2.4M",
    segment: "SUV",
  },
  {
    id: "MST-07733",
    initials: "07",
    avatarTone: "bg-cust-tint text-cust-600",
    vehicle: "Volkswagen Passat",
    vehicleSub: "2020 · 1.5 TSI",
    bitis: "03.09.2025",
    kalanGun: 47,
    paid: 14,
    total: 48,
    skor: 88,
    butce: "₺1.5M - ₺2.0M",
    segment: "Sedan",
  },
  {
    id: "MST-09187",
    initials: "09",
    avatarTone: "bg-warn-tint text-warn",
    vehicle: "Renault Megane",
    vehicleSub: "2019 · 1.5 dCi",
    bitis: "28.07.2025",
    kalanGun: 19,
    paid: 30,
    total: 36,
    skor: 84,
    butce: "₺1.0M - ₺1.4M",
    segment: "Hatchback",
  },
  {
    id: "MST-06120",
    initials: "06",
    avatarTone: "bg-bank-tint text-bank-700",
    vehicle: "Ford Focus",
    vehicleSub: "2021 · 1.5 EcoBoost",
    bitis: "11.10.2025",
    kalanGun: 84,
    paid: 22,
    total: 48,
    skor: 79,
    butce: "₺1.2M - ₺1.6M",
    segment: "SUV",
  },
  {
    id: "MST-05512",
    initials: "05",
    avatarTone: "bg-dealer-tint text-dealer-700",
    vehicle: "Toyota Corolla",
    vehicleSub: "2021 · 1.8 Hybrid",
    bitis: "05.08.2025",
    kalanGun: 35,
    paid: 26,
    total: 36,
    skor: 76,
    butce: "₺1.3M - ₺1.7M",
    segment: "Sedan",
  },
  {
    id: "MST-04521",
    initials: "04",
    avatarTone: "bg-cust-tint text-cust-600",
    vehicle: "Hyundai i20",
    vehicleSub: "2020 · 1.0 T-GDI",
    bitis: "19.07.2025",
    kalanGun: 12,
    paid: 31,
    total: 36,
    skor: 71,
    butce: "₺0.9M - ₺1.3M",
    segment: "Hatchback",
  },
  {
    id: "MST-09787",
    initials: "09",
    avatarTone: "bg-warn-tint text-warn",
    vehicle: "Mercedes-Benz C Serisi",
    vehicleSub: "2022 · C 200",
    bitis: "27.08.2025",
    kalanGun: 41,
    paid: 18,
    total: 48,
    skor: 67,
    butce: "₺2.4M - ₺3.2M",
    segment: "SUV",
  },
  {
    id: "MST-01245",
    initials: "01",
    avatarTone: "bg-bank-tint text-bank-700",
    vehicle: "Audi A4",
    vehicleSub: "2022 · 40 TDI",
    bitis: "12.12.2025",
    kalanGun: 132,
    paid: 12,
    total: 60,
    skor: 63,
    butce: "₺2.0M - ₺2.8M",
    segment: "Sedan",
  },
  {
    id: "MST-02984",
    initials: "02",
    avatarTone: "bg-dealer-tint text-dealer-700",
    vehicle: "Peugeot 308",
    vehicleSub: "2020 · 1.5 BlueHDi",
    bitis: "02.09.2025",
    kalanGun: 46,
    paid: 24,
    total: 48,
    skor: 58,
    butce: "₺1.1M - ₺1.5M",
    segment: "Hatchback",
  },
  {
    id: "MST-01190",
    initials: "01",
    avatarTone: "bg-cust-tint text-cust-600",
    vehicle: "Fiat Egea",
    vehicleSub: "2019 · 1.6 D Multijet",
    bitis: "21.07.2025",
    kalanGun: 14,
    paid: 33,
    total: 36,
    skor: 54,
    butce: "₺0.7M - ₺1.0M",
    segment: "Sedan",
  },
];

function uygunlukLabel(skor: number): string {
  if (skor >= 85) {
    return "Çok Uygun";
  }
  if (skor >= 70) {
    return "Uygun";
  }
  return "Orta";
}

function uygunlukToneClass(skor: number): string {
  if (skor >= 85) {
    return "text-success";
  }
  if (skor >= 70) {
    return "text-dealer-700";
  }
  return "text-warn";
}

// Distinct segment values present in the data — guarantees the filter matches.
const SEGMENTS = [...new Set(OPPORTUNITIES.map((o) => o.segment))];

interface FilterDef {
  /** table column id this filter drives; omitted = visual only */
  column?: string;
  label: string;
  options: string[];
  placeholder: string;
}

const FILTERS: FilterDef[] = [
  {
    label: "Segment",
    placeholder: "Tüm Segmentler",
    options: SEGMENTS,
    column: "segment",
  },
  {
    label: "Skor Aralığı",
    placeholder: "Tümü",
    options: ["Yüksek (80+)", "Orta (60-79)", "Düşük (<60)"],
    column: "skor",
  },
  {
    label: "Bütçe",
    placeholder: "Tümü",
    options: ["₺0 - ₺1M", "₺1M - ₺2M", "₺2M - ₺3M", "₺3M+"],
    column: "butce",
  },
  {
    label: "Bölge",
    placeholder: "Tüm Bölgeler",
    options: ["Marmara", "Ege", "İç Anadolu", "Akdeniz", "Karadeniz"],
  },
];

function skorFilter(value: number, bucket: string): boolean {
  if (bucket === "Yüksek (80+)") {
    return value >= 80;
  }
  if (bucket === "Orta (60-79)") {
    return value >= 60 && value < 80;
  }
  if (bucket === "Düşük (<60)") {
    return value < 60;
  }
  return true;
}

const BUDGET_RE = /([\d.]+)M/;

/** Lower bound (in millions ₺) parsed from a range label like "₺1.8M - ₺2.4M". */
function budgetLower(butce: string): number {
  const match = butce.match(BUDGET_RE);
  return match ? Number.parseFloat(match[1]) : 0;
}

function budgetFilter(butce: string, bucket: string): boolean {
  const low = budgetLower(butce);
  if (bucket === "₺0 - ₺1M") {
    return low < 1;
  }
  if (bucket === "₺1M - ₺2M") {
    return low >= 1 && low < 2;
  }
  if (bucket === "₺2M - ₺3M") {
    return low >= 2 && low < 3;
  }
  if (bucket === "₺3M+") {
    return low >= 3;
  }
  return true;
}

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

function deadlineTone(days: number): "danger" | "warn" | "neutral" {
  if (days <= 30) {
    return "danger";
  }
  if (days <= 60) {
    return "warn";
  }
  return "neutral";
}

const ch = createColumnHelper<Opportunity>();

const columns = [
  ch.accessor("id", {
    header: "Müşteri",
    cell: (info) => {
      const row = info.row.original;
      return (
        <Link
          className="group flex items-center gap-3"
          to="/bayi/musteri-detay"
        >
          <span
            className={`flex size-9 items-center justify-center rounded-full font-bold text-[12px] ${row.avatarTone}`}
          >
            {row.initials}
          </span>
          <span className="leading-tight">
            <span className="block font-semibold text-[13.5px] text-ink group-hover:text-dealer">
              {row.id}
            </span>
            <span className="block text-[11.5px] text-ink-muted">
              Anonim Müşteri
            </span>
          </span>
        </Link>
      );
    },
  }),
  ch.accessor("vehicle", {
    header: "Araç Bilgisi",
    cell: (info) => {
      const row = info.row.original;
      return (
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-11 items-center justify-center rounded-md bg-canvas text-ink-muted">
            <Car size={16} strokeWidth={1.8} />
          </span>
          <span className="leading-tight">
            <span className="block font-medium text-[13px] text-ink">
              {row.vehicle}
            </span>
            <span className="block text-[11.5px] text-ink-muted">
              {row.vehicleSub}
            </span>
          </span>
        </div>
      );
    },
  }),
  ch.accessor("skor", {
    header: "Yenileme Skoru",
    filterFn: (row, id, value) => skorFilter(row.getValue<number>(id), value),
    cell: (info) => (
      <div className="flex justify-center">
        <ScoreRing size={42} value={info.getValue()} />
      </div>
    ),
  }),
  ch.accessor("bitis", {
    header: "Kredi Bitiş Tarihi",
    cell: (info) => {
      const { bitis, kalanGun } = info.row.original;
      const tone = deadlineTone(kalanGun);
      return (
        <div className="leading-tight">
          <span className="block text-[12.5px] text-ink tabular-nums">
            {bitis}
          </span>
          <Badge className="mt-1" tone={tone}>
            {kalanGun} gün kaldı
          </Badge>
        </div>
      );
    },
  }),
  ch.accessor((row) => row.total - row.paid, {
    id: "kalanTaksit",
    header: "Kalan Taksit",
    cell: (info) => {
      const { paid, total } = info.row.original;
      return (
        <div className="w-24">
          <div className="mb-1 flex justify-between text-[11.5px] text-ink-soft tabular-nums">
            <span>{paid}</span>
            <span className="text-ink-muted">/ {total}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-dealer"
              style={{ width: `${(paid / total) * 100}%` }}
            />
          </div>
        </div>
      );
    },
  }),
  ch.accessor("butce", {
    header: "Bütçe Aralığı",
    filterFn: (row, id, value) => budgetFilter(row.getValue<string>(id), value),
    cell: (info) => (
      <span className="font-medium text-[12.5px] text-ink-soft tabular-nums">
        {info.getValue()}
      </span>
    ),
  }),
  ch.accessor("segment", {
    header: "Segment",
    filterFn: "equalsString",
    cell: (info) => <Badge tone="cust">{info.getValue()}</Badge>,
  }),
  ch.accessor((row) => row.skor, {
    id: "uygunluk",
    header: "Uygunluk",
    cell: (info) => {
      const { skor } = info.row.original;
      const filled = Math.round(skor / 20);
      return (
        <div className="leading-tight">
          <span
            className={`block font-semibold text-[12.5px] ${uygunlukToneClass(skor)}`}
          >
            {uygunlukLabel(skor)}
          </span>
          <span className="mt-0.5 flex items-center gap-1">
            <span className="flex text-warn">
              {["1", "2", "3", "4", "5"].map((s, i) => (
                <Star
                  className={i < filled ? "" : "text-line-strong"}
                  fill={i < filled ? "currentColor" : "none"}
                  key={s}
                  size={11}
                />
              ))}
            </span>
            <span className="text-[11px] text-ink-muted tabular-nums">
              %{skor}
            </span>
          </span>
        </div>
      );
    },
  }),
  ch.display({
    id: "actions",
    header: "",
    cell: () => (
      <div className="flex items-center justify-end gap-2">
        <Link
          className="rounded-[10px] border border-line-strong px-3 py-1.5 font-semibold text-[12.5px] text-ink-soft hover:bg-canvas"
          to="/bayi/musteri-detay"
        >
          Detay
        </Link>
        <Link
          className="rounded-[10px] bg-dealer px-3.5 py-1.5 font-semibold text-[12.5px] text-white hover:bg-dealer-600"
          to="/bayi/teklif-olustur"
        >
          Teklif Ver
        </Link>
        <button
          className="flex size-8 items-center justify-center rounded-lg text-ink-muted hover:bg-canvas hover:text-ink"
          type="button"
        >
          <MoreVertical size={16} />
        </button>
      </div>
    ),
  }),
];

function Toolbar({ table }: { table: Table<Opportunity> }) {
  return (
    <Card className="mt-5 px-5 py-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-[240px] flex-1">
          <div className="mb-1.5 font-medium text-[12px] text-ink-soft">
            Arama
          </div>
          <div className="flex items-center gap-2 rounded-[10px] border border-line-strong px-3 py-2">
            <Search className="text-ink-muted" size={16} />
            <input
              className="w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-muted"
              onChange={(e) => table.setGlobalFilter(e.target.value)}
              placeholder="Müşteri ID, araç modeli, segment..."
              value={(table.getState().globalFilter as string) ?? ""}
            />
          </div>
        </div>
        {FILTERS.map((f) => (
          <div className="w-[160px]" key={f.label}>
            <div className="mb-1.5 font-medium text-[12px] text-ink-soft">
              {f.label}
            </div>
            <Select
              onValueChange={(v) =>
                f.column &&
                table
                  .getColumn(f.column)
                  ?.setFilterValue(v === ALL ? undefined : v)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={f.placeholder} />
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
      </div>
    </Card>
  );
}

export function DealerFirsatHavuzu() {
  const table = useDataTable({ data: OPPORTUNITIES, columns, pageSize: 6 });

  return (
    <DealerShell
      breadcrumb={["Fırsat Havuzu", "Uygun Müşteriler"]}
      info
      subtitle="Yenileme zamanı yaklaşan, size atanmış uygun müşterileri keşfedin ve teklif oluşturun."
      title="Fırsat Havuzu"
    >
      {/* stat cards */}
      <div className="grid grid-cols-5 gap-4">
        <StatCard
          icon={<Users2 size={20} strokeWidth={1.9} />}
          label="Toplam Fırsat"
          sub="Bölgenizdeki tüm uygun müşteriler"
          tone="dealer"
          value="1.248"
        />
        <StatCard
          icon={<Sparkles size={20} strokeWidth={1.9} />}
          label="Yeni Eklenen"
          sub="Son 7 gün içinde"
          tone="cust"
          value="418"
        />
        <StatCard
          icon={<TrendingUp size={20} strokeWidth={1.9} />}
          label="Yüksek Skor (80+)"
          sub="%23 fırsat havuzundan"
          tone="teal"
          value="287"
        />
        <StatCard
          icon={<Target size={20} strokeWidth={1.9} />}
          label="Bütçe Uygun"
          sub="Stoğunuzla eşleşen"
          tone="warn"
          value="156"
        />
        <StatCard
          icon={<Wallet size={20} strokeWidth={1.9} />}
          label="Toplam Bütçe Hacmi"
          sub="Tahmini yenileme değeri"
          tone="bank"
          value="₺618,6M"
        />
      </div>

      <Toolbar table={table} />

      {/* table */}
      <Card className="mt-5 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <h3 className="font-semibold text-[15px] text-ink">
            Uygun Müşteriler{" "}
            <span className="font-normal text-ink-muted">
              ({table.getFilteredRowModel().rows.length})
            </span>
          </h3>
          <div className="flex items-center gap-2.5">
            <button
              className="flex items-center gap-2 rounded-[10px] bg-dealer px-3 py-1.5 font-semibold text-[12.5px] text-white hover:bg-dealer-600"
              type="button"
            >
              <Download size={15} /> CSV İndir
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
            {table.getRowModel().rows.map((row) => (
              <tr
                className="border-line border-t hover:bg-canvas/50"
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <td className="px-4 py-3 first:pl-5" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* pagination */}
        <div className="flex items-center justify-between border-line border-t px-5 py-3.5 text-[12.5px] text-ink-muted">
          <span>
            {table.getFilteredRowModel().rows.length === 0
              ? "Sonuç bulunamadı"
              : `${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-${
                  table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                  table.getRowModel().rows.length
                } / ${table.getFilteredRowModel().rows.length} fırsat`}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              className="flex size-8 items-center justify-center rounded-lg border border-line-strong text-ink-muted disabled:opacity-40"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              type="button"
            >
              ‹
            </button>
            {Array.from({ length: table.getPageCount() }, (_, i) => i).map(
              (pageIndex) => (
                <button
                  className={`flex size-8 items-center justify-center rounded-lg font-medium ${
                    pageIndex === table.getState().pagination.pageIndex
                      ? "bg-dealer text-white"
                      : "border border-line-strong text-ink-soft"
                  }`}
                  key={pageIndex}
                  onClick={() => table.setPageIndex(pageIndex)}
                  type="button"
                >
                  {pageIndex + 1}
                </button>
              )
            )}
            <button
              className="flex size-8 items-center justify-center rounded-lg border border-line-strong text-ink-soft disabled:opacity-40"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
              type="button"
            >
              ›
            </button>
          </div>
        </div>
      </Card>
    </DealerShell>
  );
}
