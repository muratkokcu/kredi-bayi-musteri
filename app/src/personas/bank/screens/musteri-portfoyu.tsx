import { Link } from "@tanstack/react-router";
import type { Table } from "@tanstack/react-table";
import { createColumnHelper, flexRender } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Calendar,
  CalendarRange,
  Car,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Download,
  Search,
  SlidersHorizontal,
  TrendingUp,
  Users2,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useMemo } from "react";
import type { Customer } from "@/data/customers";
import { useCustomers } from "@/queries/customers";
import {
  EmptyState,
  ErrorState,
  TableSkeleton,
  TableStateRow,
} from "@/ui/async-states";
import { useDataTable } from "@/ui/use-data-table";
import { VehicleImage } from "@/ui/vehicle-image";
import { BankShell } from "../bank-shell";

// Customer type + seed live in src/data/customers.ts; rows arrive via useCustomers().

interface FilterDef {
  /** table column id this filter drives; omitted = visual only */
  column?: string;
  label: string;
  options: string[];
  placeholder: string;
}

// Segment options come from the loaded rows; the rest are fixed buckets.
function buildFilters(segments: string[]): FilterDef[] {
  return [
    {
      label: "Kalan Taksit",
      placeholder: "Tümü",
      options: ["0-12 ay", "13-24 ay", "25-36 ay", "37+ ay"],
      column: "kalanTaksit",
    },
    {
      label: "Araç Segmenti",
      placeholder: "Tümü",
      options: segments,
      column: "segment",
    },
    {
      label: "Bütçe Aralığı",
      placeholder: "Tümü",
      options: ["₺0 - ₺1M", "₺1M - ₺2M", "₺2M - ₺3M", "₺3M+"],
      column: "bolge",
    },
    {
      label: "Yenileme Skoru",
      placeholder: "Tümü",
      options: ["Yüksek (80+)", "Orta (60-79)", "Düşük (<60)"],
      column: "skor",
    },
  ];
}

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

function kalanTaksitFilter(remaining: number, bucket: string): boolean {
  if (bucket === "0-12 ay") {
    return remaining <= 12;
  }
  if (bucket === "13-24 ay") {
    return remaining >= 13 && remaining <= 24;
  }
  if (bucket === "25-36 ay") {
    return remaining >= 25 && remaining <= 36;
  }
  if (bucket === "37+ ay") {
    return remaining >= 37;
  }
  return true;
}

const BUDGET_RE = /([\d.]+)M/;

/** Lower bound (in millions ₺) parsed from a range label like "₺1.5M - ₺2.0M". */
function budgetLower(bolge: string): number {
  const match = bolge.match(BUDGET_RE);
  return match ? Number.parseFloat(match[1]) : 0;
}

function budgetFilter(bolge: string, bucket: string): boolean {
  const low = budgetLower(bolge);
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

function bitisFilter(days: number, bucket: string): boolean {
  if (bucket === "30 gün içinde") {
    return days <= 30;
  }
  if (bucket === "60 gün içinde") {
    return days <= 60;
  }
  if (bucket === "90 gün içinde") {
    return days <= 90;
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
  if (days <= 60) {
    return "danger";
  }
  if (days <= 90) {
    return "warn";
  }
  return "neutral";
}

const ch = createColumnHelper<Customer>();

const columns = [
  ch.display({
    id: "select",
    header: () => <Checkbox aria-label="Tümünü seç" />,
    cell: () => <Checkbox aria-label="Satır seç" />,
  }),
  ch.accessor("name", {
    header: "Müşteri",
    cell: (info) => {
      const row = info.row.original;
      return (
        <div className="flex items-center gap-3">
          <span
            className={`flex size-9 items-center justify-center rounded-full font-bold text-[12px] ${row.avatarTone}`}
          >
            {row.initials}
          </span>
          <span className="leading-tight">
            <span className="block font-semibold text-[13.5px] text-ink">
              {row.name}
            </span>
            <span className="block text-[11.5px] text-ink-muted">
              {row.plate}
            </span>
          </span>
        </div>
      );
    },
  }),
  ch.accessor("krediNo", {
    header: "Kredi No",
    cell: (info) => (
      <span className="text-[12.5px] text-ink-soft tabular-nums">
        {info.getValue()}
      </span>
    ),
  }),
  ch.accessor("vehicle", {
    header: "Araç Bilgisi",
    cell: (info) => {
      const row = info.row.original;
      return (
        <div className="flex items-center gap-2.5">
          <VehicleImage
            className="h-8 w-11 rounded-md"
            iconSize={16}
            name={row.vehicle}
            segment={row.segment}
          />
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
  ch.accessor((row) => row.total - row.paid, {
    id: "kalanTaksit",
    header: "Kalan Taksit",
    filterFn: (row, id, value) =>
      kalanTaksitFilter(row.getValue<number>(id), value),
    cell: (info) => {
      const { paid, total } = info.row.original;
      return (
        <div className="w-28">
          <div className="mb-1 flex justify-between text-[11.5px] text-ink-soft tabular-nums">
            <span>{paid}</span>
            <span className="text-ink-muted">/ {total}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-bank"
              style={{ width: `${(paid / total) * 100}%` }}
            />
          </div>
        </div>
      );
    },
  }),
  ch.accessor("bitis", {
    header: "Kredi Bitiş",
    filterFn: (row, _id, value) => bitisFilter(row.original.kalanGun, value),
    cell: (info) => {
      const { bitis, kalanGun } = info.row.original;
      const tone = deadlineTone(kalanGun);
      return (
        <div className="leading-tight">
          <span className="block text-[12.5px] text-ink tabular-nums">
            {bitis}
          </span>
          <Badge className="mt-1" tone={tone}>
            {kalanGun} gün
          </Badge>
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
  ch.accessor("bolge", {
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
    cell: (info) => <Badge tone="dealer">{info.getValue()}</Badge>,
  }),
  ch.accessor("sonAktivite", {
    header: "Son Aktivite",
    cell: (info) => (
      <span className="text-[12.5px] text-ink-muted tabular-nums">
        {info.getValue()}
      </span>
    ),
  }),
  ch.display({
    id: "actions",
    header: "",
    cell: () => (
      <Link
        className="flex size-8 items-center justify-center rounded-lg text-ink-muted hover:bg-canvas hover:text-ink"
        to="/banka/musteri-detay"
      >
        <ChevronRight size={18} />
      </Link>
    ),
  }),
];

function Toolbar({
  table,
  filters,
}: {
  table: Table<Customer>;
  filters: FilterDef[];
}) {
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
              placeholder="Müşteri adı, kredi no, araç..."
              value={(table.getState().globalFilter as string) ?? ""}
            />
          </div>
        </div>
        {filters.map((f) => (
          <div className="w-[150px]" key={f.label}>
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
        <div className="w-[180px]">
          <div className="mb-1.5 font-medium text-[12px] text-ink-soft">
            Kredi Bitiş Tarihi
          </div>
          <Select
            onValueChange={(v) =>
              table
                .getColumn("bitis")
                ?.setFilterValue(v === ALL ? undefined : v)
            }
          >
            <SelectTrigger className="w-full">
              <span className="flex items-center gap-2">
                <CalendarRange className="text-ink-muted" size={16} />
                <SelectValue placeholder="Tüm Zamanlar" />
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Tüm Zamanlar</SelectItem>
              <SelectItem value="30 gün içinde">30 gün içinde</SelectItem>
              <SelectItem value="60 gün içinde">60 gün içinde</SelectItem>
              <SelectItem value="90 gün içinde">90 gün içinde</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <button
          className="flex items-center gap-2 rounded-[10px] px-3 py-2 font-medium text-[13px] text-bank-700"
          type="button"
        >
          <SlidersHorizontal size={16} /> Daha fazla filtre
        </button>
      </div>
    </Card>
  );
}

export function BankMusteriPortfoyu() {
  const { data, isPending, isError, refetch } = useCustomers();
  const customers = useMemo(() => data ?? [], [data]);
  const table = useDataTable({ data: customers, columns, pageSize: 6 });

  const segments = useMemo(
    () => [...new Set(customers.map((c) => c.segment))],
    [customers]
  );
  const filters = useMemo(() => buildFilters(segments), [segments]);

  const rows = table.getRowModel().rows;
  const filteredCount = table.getFilteredRowModel().rows.length;

  function renderBody() {
    if (isPending) {
      return <TableSkeleton cols={columns.length} rows={6} />;
    }
    if (isError) {
      return (
        <TableStateRow colSpan={columns.length}>
          <ErrorState
            label="Müşteri portföyü yüklenemedi."
            onRetry={() => refetch()}
          />
        </TableStateRow>
      );
    }
    if (rows.length === 0) {
      return (
        <TableStateRow colSpan={columns.length}>
          <EmptyState label="Eşleşen müşteri bulunamadı." />
        </TableStateRow>
      );
    }
    return rows.map((row) => (
      <tr className="border-line border-t hover:bg-canvas/50" key={row.id}>
        {row.getVisibleCells().map((cell) => (
          <td className="px-4 py-3 first:pl-5" key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
    ));
  }

  return (
    <BankShell
      breadcrumb={["Müşteri Portföyü", "Tüm Müşteriler"]}
      info
      subtitle="Tüm kredi müşterilerinizi görüntüleyin, filtreleyin ve portföyünüzü yönetin."
      title="Müşteri Portföyü"
    >
      {/* stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          icon={<Users2 size={20} strokeWidth={1.9} />}
          label="Toplam Müşteri"
          sub={
            <span>
              Aktif <span className="font-semibold text-bank-600">238.612</span>{" "}
              · Pasif <span className="font-semibold text-ink-soft">7.218</span>
            </span>
          }
          tone="bank"
          value="245.830"
        />
        <StatCard
          icon={<TrendingUp size={20} strokeWidth={1.9} />}
          label="Yüksek Skor (70+)"
          sub="%7,5 portföyünüzden"
          tone="dealer"
          value="18.492"
        />
        <StatCard
          icon={<Calendar size={20} strokeWidth={1.9} />}
          label="Bu Ay Biten Krediler"
          sub="Önümüzdeki 30 gün"
          tone="cust"
          value="4.231"
        />
        <StatCard
          icon={<Car size={20} strokeWidth={1.9} />}
          label="Ortalama Kalan Taksit"
          sub="Ay"
          tone="warn"
          value="21,4"
        />
        <StatCard
          icon={<ScoreRing showValue={false} size={26} stroke={4} value={33} />}
          label="Yenileme Oranı"
          sub="Bu ayki dönüşüm"
          tone="teal"
          value="%32,6"
        />
      </div>

      <Toolbar filters={filters} table={table} />

      {/* table */}
      <Card className="mt-5 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <h3 className="font-semibold text-[15px] text-ink">
            Müşteriler{" "}
            <span className="font-normal text-ink-muted">
              ({isPending ? "…" : filteredCount})
            </span>
          </h3>
          <div className="flex items-center gap-2.5">
            <button
              className="flex items-center gap-2 rounded-[10px] bg-bank px-3 py-1.5 font-semibold text-[12.5px] text-white hover:bg-bank-600"
              type="button"
            >
              <Download size={15} /> CSV İndir
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-line border-t">
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
          <tbody>{renderBody()}</tbody>
          </table>
        </div>

        {/* pagination */}
        <div className="flex items-center justify-between border-line border-t px-5 py-3.5 text-[12.5px] text-ink-muted">
          <span>
            {isPending && "Yükleniyor…"}
            {!isPending && filteredCount === 0 && "Sonuç bulunamadı"}
            {!isPending &&
              filteredCount > 0 &&
              `${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-${
                table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                rows.length
              } / ${filteredCount} müşteri`}
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
                      ? "bg-bank text-white"
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
    </BankShell>
  );
}
