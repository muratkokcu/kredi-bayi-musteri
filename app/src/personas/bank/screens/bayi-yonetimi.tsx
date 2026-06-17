import type { Table } from "@tanstack/react-table";
import { createColumnHelper, flexRender } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Building2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Download,
  Filter,
  Plus,
  Search,
  Store,
  Target,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge, MiniBar } from "@/ui/badge";
import { Card } from "@/ui/card";
import { StatCard } from "@/ui/stat-card";
import { useDataTable } from "@/ui/use-data-table";
import { BankShell } from "../bank-shell";

interface Dealer {
  bolge: string;
  donusum: number;
  durum: "Aktif" | "Pasif" | "Beklemede";
  id: string;
  initials: string;
  kod: string;
  logoTone: string;
  name: string;
  sehir: string;
  teklif: number;
  yanit: string;
}

const DEALERS: Dealer[] = [
  {
    id: "1",
    name: "Doğuş Otomotiv",
    sehir: "İstanbul / Maslak",
    initials: "DO",
    logoTone: "bg-bank-tint text-bank-700",
    kod: "BYİ-1024",
    bolge: "Marmara",
    durum: "Aktif",
    teklif: 1248,
    donusum: 38,
    yanit: "1,8 saat",
  },
  {
    id: "2",
    name: "Borusan Otomotiv",
    sehir: "İstanbul / Şişli",
    initials: "BO",
    logoTone: "bg-dealer-tint text-dealer-700",
    kod: "BYİ-1077",
    bolge: "Marmara",
    durum: "Aktif",
    teklif: 1086,
    donusum: 41,
    yanit: "2,1 saat",
  },
  {
    id: "3",
    name: "Otokoç Otomotiv",
    sehir: "Ankara / Çankaya",
    initials: "OO",
    logoTone: "bg-cust-tint text-cust-600",
    kod: "BYİ-0931",
    bolge: "İç Anadolu",
    durum: "Aktif",
    teklif: 974,
    donusum: 35,
    yanit: "2,6 saat",
  },
  {
    id: "4",
    name: "Groupe PSA Bayi",
    sehir: "İzmir / Bornova",
    initials: "GP",
    logoTone: "bg-warn-tint text-warn",
    kod: "BYİ-1153",
    bolge: "Ege",
    durum: "Beklemede",
    teklif: 612,
    donusum: 29,
    yanit: "4,2 saat",
  },
  {
    id: "5",
    name: "Çetaş Otomotiv",
    sehir: "Bursa / Nilüfer",
    initials: "ÇO",
    logoTone: "bg-bank-tint text-bank-700",
    kod: "BYİ-1208",
    bolge: "Marmara",
    durum: "Aktif",
    teklif: 845,
    donusum: 33,
    yanit: "2,3 saat",
  },
  {
    id: "6",
    name: "Aydın Otomotiv",
    sehir: "Antalya / Muratpaşa",
    initials: "AO",
    logoTone: "bg-dealer-tint text-dealer-700",
    kod: "BYİ-0884",
    bolge: "Akdeniz",
    durum: "Aktif",
    teklif: 738,
    donusum: 31,
    yanit: "3,0 saat",
  },
  {
    id: "7",
    name: "Maslak Motors",
    sehir: "İstanbul / Sarıyer",
    initials: "MM",
    logoTone: "bg-cust-tint text-cust-600",
    kod: "BYİ-1291",
    bolge: "Marmara",
    durum: "Pasif",
    teklif: 421,
    donusum: 22,
    yanit: "5,4 saat",
  },
  {
    id: "8",
    name: "Ege Oto Plaza",
    sehir: "İzmir / Karşıyaka",
    initials: "EO",
    logoTone: "bg-warn-tint text-warn",
    kod: "BYİ-1042",
    bolge: "Ege",
    durum: "Aktif",
    teklif: 690,
    donusum: 36,
    yanit: "2,5 saat",
  },
];

// Distinct values present in the data — guarantees the filters match.
const BOLGELER = [...new Set(DEALERS.map((d) => d.bolge))];
const DURUMLAR = [...new Set(DEALERS.map((d) => d.durum))];

interface FilterDef {
  /** table column id this filter drives; omitted = visual only */
  column?: string;
  label: string;
  options: string[];
  placeholder: string;
}

const FILTERS: FilterDef[] = [
  {
    label: "Bölge",
    placeholder: "Tümü",
    options: BOLGELER,
    column: "bolge",
  },
  {
    label: "Durum",
    placeholder: "Tümü",
    options: DURUMLAR,
    column: "durum",
  },
  {
    label: "Dönüşüm Oranı",
    placeholder: "Tümü",
    options: ["Yüksek (%35+)", "Orta (%25-35)", "Düşük (<%25)"],
  },
  {
    label: "Sıralama",
    placeholder: "Teklif Başarısı",
    options: ["Teklif Başarısı", "Dönüşüm Oranı", "Yanıt Süresi"],
  },
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

function durumTone(durum: Dealer["durum"]): "success" | "neutral" | "warn" {
  if (durum === "Aktif") {
    return "success";
  }
  if (durum === "Beklemede") {
    return "warn";
  }
  return "neutral";
}

function donusumColor(value: number): string {
  if (value >= 35) {
    return "var(--color-success)";
  }
  if (value >= 25) {
    return "var(--color-bank)";
  }
  return "var(--color-warn)";
}

const ch = createColumnHelper<Dealer>();

const columns = [
  ch.accessor("name", {
    header: "Bayi",
    cell: (info) => {
      const row = info.row.original;
      return (
        <div className="flex items-center gap-3">
          <span
            className={`flex size-9 items-center justify-center rounded-[10px] font-bold text-[12px] ${row.logoTone}`}
          >
            {row.initials}
          </span>
          <span className="leading-tight">
            <span className="block font-semibold text-[13.5px] text-ink">
              {row.name}
            </span>
            <span className="block text-[11.5px] text-ink-muted">
              {row.sehir}
            </span>
          </span>
        </div>
      );
    },
  }),
  ch.accessor("kod", {
    header: "Bayi Kodu",
    cell: (info) => (
      <span className="text-[12.5px] text-ink-soft tabular-nums">
        {info.getValue()}
      </span>
    ),
  }),
  ch.accessor("bolge", {
    header: "Bölge",
    filterFn: "equalsString",
    cell: (info) => (
      <span className="font-medium text-[12.5px] text-ink-soft">
        {info.getValue()}
      </span>
    ),
  }),
  ch.accessor("durum", {
    header: "Durum",
    filterFn: "equalsString",
    cell: (info) => {
      const durum = info.getValue();
      return <Badge tone={durumTone(durum)}>{durum}</Badge>;
    },
  }),
  ch.accessor("teklif", {
    header: "Teklif Başarısı",
    cell: (info) => (
      <span className="font-semibold text-[13px] text-ink tabular-nums">
        {info.getValue().toLocaleString("tr-TR")}
      </span>
    ),
  }),
  ch.accessor("donusum", {
    header: "Dönüşüm Oranı",
    cell: (info) => {
      const value = info.getValue();
      return (
        <div className="w-32">
          <div className="mb-1 flex justify-between text-[11.5px] text-ink-soft tabular-nums">
            <span className="font-semibold text-ink">%{value}</span>
          </div>
          <MiniBar color={donusumColor(value)} value={value} />
        </div>
      );
    },
  }),
  ch.accessor("yanit", {
    header: "Ort. Yanıt Süresi",
    cell: (info) => (
      <span className="flex items-center gap-1.5 text-[12.5px] text-ink-soft tabular-nums">
        <Clock className="text-ink-muted" size={14} />
        {info.getValue()}
      </span>
    ),
  }),
  ch.display({
    id: "actions",
    header: "",
    cell: () => (
      <button
        className="flex size-8 items-center justify-center rounded-lg text-ink-muted hover:bg-canvas hover:text-ink"
        onClick={() => toast.info("Bayi detayı yakında")}
        type="button"
      >
        <ChevronRight size={18} />
      </button>
    ),
  }),
];

function Toolbar({ table }: { table: Table<Dealer> }) {
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
              placeholder="Bayi adı, bayi kodu, bölge..."
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

export function BankBayiYonetimi() {
  const table = useDataTable({ data: DEALERS, columns, pageSize: 6 });

  return (
    <BankShell
      actions={
        <>
          <button
            className="flex items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-3.5 py-2 font-medium text-[13px] text-ink-soft hover:bg-canvas"
            type="button"
          >
            <Download size={16} /> Rapor Al
          </button>
          <button
            className="flex items-center gap-2 rounded-[10px] bg-bank px-3.5 py-2 font-semibold text-[13px] text-white hover:bg-bank-600"
            onClick={() => toast.success("Yeni bayi ekleme akışı açılıyor…")}
            type="button"
          >
            <Plus size={16} /> Yeni Bayi
          </button>
        </>
      }
      breadcrumb={["Bayi Yönetimi", "Bayi Listesi"]}
      info
      subtitle="Platforma bağlı bayileri görüntüleyin ve performanslarını takip edin."
      title="Bayi Yönetimi"
    >
      {/* stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          icon={<Store size={20} strokeWidth={1.9} />}
          label="Toplam Bayi"
          sub={
            <span>
              Aktif <span className="font-semibold text-bank-600">241</span> ·
              Pasif <span className="font-semibold text-ink-soft">13</span>
            </span>
          }
          tone="bank"
          value="254"
        />
        <StatCard
          icon={<Target size={20} strokeWidth={1.9} />}
          label="Toplam Teklif Başarısı"
          sub="Son 30 günde"
          tone="dealer"
          value="18.492"
        />
        <StatCard
          icon={<TrendingUp size={20} strokeWidth={1.9} />}
          label="Ortalama Dönüşüm Oranı"
          sub="Bu ayki dönüşüm"
          tone="teal"
          value="%32,6"
        />
        <StatCard
          icon={<Clock size={20} strokeWidth={1.9} />}
          label="Ortalama Yanıt Süresi"
          sub="Teklif yanıt süresi"
          tone="warn"
          value="2,4 saat"
        />
      </div>

      <Toolbar table={table} />

      {/* table */}
      <Card className="mt-5 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <h3 className="flex items-center gap-2 font-semibold text-[15px] text-ink">
            <Building2 className="text-ink-muted" size={17} strokeWidth={1.9} />
            Bayiler{" "}
            <span className="font-normal text-ink-muted">
              ({table.getFilteredRowModel().rows.length})
            </span>
          </h3>
          <div className="flex items-center gap-2.5">
            <button
              className="flex items-center gap-2 rounded-[10px] border border-line-strong px-3 py-1.5 font-medium text-[12.5px] text-ink-soft"
              type="button"
            >
              <Filter size={15} /> Görünüm
            </button>
            <button
              className="flex items-center gap-2 rounded-[10px] bg-bank px-3 py-1.5 font-semibold text-[12.5px] text-white hover:bg-bank-600"
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
                } / ${table.getFilteredRowModel().rows.length} bayi`}
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
