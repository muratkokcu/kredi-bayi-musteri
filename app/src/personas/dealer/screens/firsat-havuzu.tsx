import { Link } from "@tanstack/react-router";
import type { Table } from "@tanstack/react-table";
import { createColumnHelper, flexRender } from "@tanstack/react-table";
import {
  ArrowUpDown,
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
import { useMemo } from "react";
import type { Opportunity } from "@/data/opportunities";
import { useOpportunities } from "@/queries/opportunities";
import {
  EmptyState,
  ErrorState,
  TableSkeleton,
  TableStateRow,
} from "@/ui/async-states";
import { Badge } from "@/ui/badge";
import { Card } from "@/ui/card";
import { ScoreRing } from "@/ui/score-ring";
import { StatCard } from "@/ui/stat-card";
import { useDataTable } from "@/ui/use-data-table";
import { VehicleImage } from "@/ui/vehicle-image";
import { DealerShell } from "../dealer-shell";

// Opportunity type + seed live in src/data/opportunities.ts; rows arrive via useOpportunities().

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

interface FilterDef {
  /** table column id this filter drives; omitted = visual only */
  column?: string;
  label: string;
  options: string[];
  placeholder: string;
}

// Segment options come from the loaded rows; the rest are fixed buckets.
function buildFilters(segmentler: string[]): FilterDef[] {
  return [
    {
      label: "Segment",
      placeholder: "Tüm Segmentler",
      options: segmentler,
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

function Toolbar({
  table,
  filters,
}: {
  table: Table<Opportunity>;
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
              placeholder="Müşteri ID, araç modeli, segment..."
              value={(table.getState().globalFilter as string) ?? ""}
            />
          </div>
        </div>
        {filters.map((f) => (
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
  const { data, isPending, isError, refetch } = useOpportunities();
  const opportunities = useMemo(() => data ?? [], [data]);
  const table = useDataTable({ data: opportunities, columns, pageSize: 6 });

  const segmentler = useMemo(
    () => [...new Set(opportunities.map((o) => o.segment))],
    [opportunities]
  );
  const filters = useMemo(() => buildFilters(segmentler), [segmentler]);

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
            label="Fırsat havuzu yüklenemedi."
            onRetry={() => refetch()}
          />
        </TableStateRow>
      );
    }
    if (rows.length === 0) {
      return (
        <TableStateRow colSpan={columns.length}>
          <EmptyState label="Eşleşen fırsat bulunamadı." />
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

      <Toolbar filters={filters} table={table} />

      {/* table */}
      <Card className="mt-5 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <h3 className="font-semibold text-[15px] text-ink">
            Uygun Müşteriler{" "}
            <span className="font-normal text-ink-muted">
              ({isPending ? "…" : filteredCount})
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
          <tbody>{renderBody()}</tbody>
        </table>

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
              } / ${filteredCount} fırsat`}
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
