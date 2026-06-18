import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  MessageSquare,
  Search,
  TrendingUp,
  UserPlus,
  Users2,
} from "lucide-react";
import type { DealerCustomer, DealerCustomerDurum } from "@/data/dealer-customers";
import { useDealerCustomers } from "@/queries/dealer-customers";
import { formatDate } from "@/lib/format";
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
import { DealerShell } from "../dealer-shell";

// DealerCustomer type + seed live in src/data/dealer-customers.ts;
// rows arrive via useDealerCustomers().

type DurumTone = "dealer" | "warn" | "success" | "danger";

const DURUM_TONE: Record<DealerCustomerDurum, DurumTone> = {
  Yeni: "dealer",
  Görüşülüyor: "warn",
  "Teklif Gönderildi": "dealer",
  Kazanıldı: "success",
  Kayıp: "danger",
};

interface FilterDef {
  label: string;
  options: string[];
  placeholder: string;
}

const FILTERS: FilterDef[] = [
  {
    label: "Durum",
    placeholder: "Tüm Durumlar",
    options: [
      "Yeni",
      "Görüşülüyor",
      "Teklif Gönderildi",
      "Kazanıldı",
      "Kayıp",
    ],
  },
  {
    label: "Araç Segmenti",
    placeholder: "Tüm Segmentler",
    options: ["SUV", "Sedan", "Hatchback"],
  },
];

function FilterSelect({ filter }: { filter: FilterDef }) {
  return (
    <div className="w-[170px]">
      <div className="mb-1.5 font-medium text-[12px] text-ink-soft">
        {filter.label}
      </div>
      <button
        className="flex w-full items-center justify-between gap-2 rounded-[10px] border border-line-strong px-3 py-2 text-left hover:bg-canvas"
        type="button"
      >
        <span className="text-[13px] text-ink-muted">{filter.placeholder}</span>
        <ChevronDown
          className="shrink-0 text-ink-muted"
          size={15}
          strokeWidth={1.9}
        />
      </button>
    </div>
  );
}

function Toolbar() {
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
              placeholder="Müşteri adı, ID, plaka, segment..."
            />
          </div>
        </div>
        {FILTERS.map((f) => (
          <FilterSelect filter={f} key={f.label} />
        ))}
      </div>
    </Card>
  );
}

const COLUMNS = [
  "Müşteri",
  "Segment",
  "Yenileme Skoru",
  "Bütçe Aralığı",
  "Son Etkileşim",
  "Durum",
  "",
];

function CustomerRow({ row }: { row: DealerCustomer }) {
  return (
    <tr className="border-line border-t hover:bg-canvas/50">
      <td className="px-4 py-3 first:pl-5">
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
            <span className="block text-[11.5px] text-ink-muted tabular-nums">
              {row.plate}
            </span>
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge tone="dealer">{row.segment}</Badge>
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-center">
          <ScoreRing size={38} value={row.skor} />
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="font-medium text-[12.5px] text-ink-soft tabular-nums">
          {row.budget}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-[12.5px] text-ink-soft tabular-nums">
          {formatDate(row.sonEtkilesim)}
        </span>
      </td>
      <td className="px-4 py-3">
        <Badge tone={DURUM_TONE[row.durum]}>{row.durum}</Badge>
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end">
          <Link
            className="flex size-8 items-center justify-center rounded-lg text-ink-muted hover:bg-canvas hover:text-ink"
            to="/bayi/musteri-detay"
          >
            <ChevronRight size={18} />
          </Link>
        </div>
      </td>
    </tr>
  );
}

export function DealerMusteriler() {
  const { data, isPending, isError, refetch } = useDealerCustomers();
  const customers = data ?? [];

  function renderBody() {
    if (isPending) {
      return <TableSkeleton cols={COLUMNS.length} rows={8} />;
    }
    if (isError) {
      return (
        <TableStateRow colSpan={COLUMNS.length}>
          <ErrorState
            label="Müşteri listesi yüklenemedi."
            onRetry={() => refetch()}
          />
        </TableStateRow>
      );
    }
    if (customers.length === 0) {
      return (
        <TableStateRow colSpan={COLUMNS.length}>
          <EmptyState label="Müşteri bulunamadı." />
        </TableStateRow>
      );
    }
    return customers.map((row) => <CustomerRow key={row.id} row={row} />);
  }

  return (
    <DealerShell
      breadcrumb={["Müşterilerim", "Atanan Müşteriler"]}
      info
      subtitle="Atanan müşterilerinizi takip edin, teklif sürecini yönetin."
      title="Müşterilerim"
    >
      {/* stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          icon={<Users2 size={20} strokeWidth={1.9} />}
          label="Toplam Müşteri"
          sub="Size atanmış aktif portföy"
          tone="dealer"
          value="124"
        />
        <StatCard
          icon={<MessageSquare size={20} strokeWidth={1.9} />}
          label="Aktif Görüşme"
          sub="Görüşülüyor & teklif aşamasında"
          tone="warn"
          value="38"
        />
        <StatCard
          icon={<CheckCircle2 size={20} strokeWidth={1.9} />}
          label="Bu Ay Kazanılan"
          sub="Tamamlanan yenilemeler"
          tone="teal"
          value="17"
        />
        <StatCard
          icon={<TrendingUp size={20} strokeWidth={1.9} />}
          label="Dönüşüm Oranı"
          sub="Son 30 güne göre %4 artış"
          tone="dealer"
          value="%32,6"
        />
      </div>

      <Toolbar />

      {/* table */}
      <Card className="mt-5 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <h3 className="font-semibold text-[15px] text-ink">
            Müşterilerim{" "}
            <span className="font-normal text-ink-muted">
              ({isPending ? "…" : customers.length})
            </span>
          </h3>
          <div className="flex items-center gap-2.5">
            <Link
              className="flex items-center gap-2 rounded-[10px] border border-line-strong px-3 py-1.5 font-semibold text-[12.5px] text-ink-soft hover:bg-canvas"
              to="/bayi/firsat-havuzu"
            >
              <UserPlus size={15} /> Fırsat Havuzu
            </Link>
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
            <tr className="bg-canvas/60">
              {COLUMNS.map((col, i) => (
                <th
                  className="px-4 py-2.5 text-left font-semibold text-[11px] text-ink-muted uppercase tracking-wide first:pl-5"
                  // biome-ignore lint/suspicious/noArrayIndexKey: static header labels
                  key={col || `col-${i}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{renderBody()}</tbody>
        </table>

        <div className="flex items-center justify-between border-line border-t px-5 py-3.5 text-[12.5px] text-ink-muted">
          <span>
            {isPending && "Yükleniyor…"}
            {!isPending && customers.length === 0 && "Sonuç bulunamadı"}
            {!isPending &&
              customers.length > 0 &&
              `1-${customers.length} / ${customers.length} müşteri`}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              className="flex size-8 items-center justify-center rounded-lg border border-line-strong text-ink-muted disabled:opacity-40"
              disabled
              type="button"
            >
              ‹
            </button>
            <button
              className="flex size-8 items-center justify-center rounded-lg bg-dealer font-medium text-white"
              type="button"
            >
              1
            </button>
            <button
              className="flex size-8 items-center justify-center rounded-lg border border-line-strong text-ink-soft disabled:opacity-40"
              disabled
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
