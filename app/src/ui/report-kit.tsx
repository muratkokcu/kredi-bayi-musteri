import { ArrowDown, ArrowUp, ChevronsUpDown, RotateCcw } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Card, CardHeader } from "./card";

/** Ortak rapor ekranı parçaları (filtre bandı select'i + grafik kartı). */
export const ALL = "Tümü";

export function uniq(xs: string[]): string[] {
  return [...new Set(xs)].sort((a, b) => a.localeCompare(b, "tr"));
}

export function FilterSelect({
  label,
  value,
  options,
  onChange,
  width = 150,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  width?: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-medium text-[11px] text-ink-muted">{label}</span>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger
          className="h-9 border-line-strong text-[13px]"
          style={{ width }}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{ALL}</SelectItem>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function ChartCard({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader title={title} />
      <div className="mt-3 h-[240px] px-5 pb-5">{children}</div>
    </Card>
  );
}

// ------------------------------------------------------------------ FilterBar
export interface FilterDef {
  key: string;
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  width?: number;
}

/**
 * Filtre toolbar'ı: tüm filtreler doğrudan (inline, satıra sığmazsa alt satıra
 * sarar) gösterilir. Popover yok — radix Select açılır menüsü portal'da render
 * olduğu için popover'la birlikte "dışarı tıklama" çakışması/kapanması yaşanmaz.
 */
export function FilterBar({
  filters,
  onReset,
  right,
}: {
  filters: FilterDef[];
  onReset: () => void;
  right?: ReactNode;
}) {
  const activeCount = filters.filter((f) => f.value !== ALL).length;
  return (
    <Card className="p-3">
      <div className="flex flex-wrap items-end gap-2.5">
        {filters.map((f) => (
          <FilterSelect
            key={f.key}
            label={f.label}
            onChange={f.onChange}
            options={f.options}
            value={f.value}
            width={f.width}
          />
        ))}

        <div className="ml-auto flex items-end gap-2.5">
          <button
            className="flex h-9 items-center gap-1.5 rounded-[10px] border border-line-strong bg-surface px-3 font-medium text-[13px] text-ink-soft hover:bg-canvas disabled:opacity-40"
            disabled={activeCount === 0}
            onClick={onReset}
            type="button"
          >
            <RotateCcw size={15} /> Temizle{activeCount > 0 ? ` (${activeCount})` : ""}
          </button>
          {right}
        </div>
      </div>
    </Card>
  );
}

// ------------------------------------------------------------------ KpiStrip
export interface KpiItem {
  label: string;
  value: string;
  sub?: ReactNode;
}

/** İnce, tek satır kompakt KPI şeridi (büyük ikon-diskli kartların yerine). */
export function KpiStrip({ items }: { items: KpiItem[] }) {
  return (
    <Card className="mt-4 flex flex-wrap divide-x divide-line">
      {items.map((it) => (
        <div
          className="flex min-w-[140px] flex-1 flex-col gap-0.5 px-4 py-2.5"
          key={it.label}
        >
          <span className="truncate text-[11.5px] text-ink-muted">
            {it.label}
          </span>
          <span className="font-bold text-[18px] text-ink leading-6 tabular-nums">
            {it.value}
          </span>
          {it.sub && (
            <span className="truncate text-[11px] text-ink-muted">{it.sub}</span>
          )}
        </div>
      ))}
    </Card>
  );
}

// ------------------------------------------------------------------ Sıralama
export type SortDir = "asc" | "desc";
export interface SortState {
  key: string;
  dir: SortDir;
  toggle: (k: string) => void;
}

/** Tablo satırlarını tıklanabilir başlıklarla sıralar (TR locale, sayı-duyarlı). */
export function useSort<T>(
  rows: T[],
  initialKey: string,
  initialDir: SortDir = "desc"
): { sorted: T[]; key: string; dir: SortDir; toggle: (k: string) => void } {
  const [key, setKey] = useState(initialKey);
  const [dir, setDir] = useState<SortDir>(initialDir);

  const sorted = useMemo(() => {
    const arr = [...rows];
    arr.sort((a, b) => {
      const av = (a as Record<string, unknown>)[key];
      const bv = (b as Record<string, unknown>)[key];
      let c: number;
      if (typeof av === "number" && typeof bv === "number") {
        c = av - bv;
      } else {
        c = String(av ?? "").localeCompare(String(bv ?? ""), "tr", {
          numeric: true,
        });
      }
      return dir === "asc" ? c : -c;
    });
    return arr;
  }, [rows, key, dir]);

  const toggle = (k: string) => {
    if (k === key) {
      setDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setKey(k);
      setDir("desc");
    }
  };

  return { sorted, key, dir, toggle };
}

// ------------------------------------------------------------------ DonutChart
export interface DonutDatum {
  name: string;
  value: number;
}

/**
 * Donut grafik: dış etiket yok; dilime gelince (hover) ortadaki boşlukta o
 * dilimin değeri + adı belirir, boşta toplamı gösterir. Diğer dilimler soluklaşır.
 */
export function DonutChart({
  data,
  colors,
  formatValue,
  centerLabel = "Toplam",
}: {
  data: DonutDatum[];
  colors: string[];
  formatValue: (v: number) => string;
  centerLabel?: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const total = data.reduce((a, d) => a + d.value, 0);
  const shown = active !== null ? data[active] : null;

  return (
    <div className="relative h-full w-full">
      <ResponsiveContainer height="100%" width="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius="60%"
            nameKey="name"
            onMouseEnter={(_, i) => setActive(i)}
            onMouseLeave={() => setActive(null)}
            outerRadius="92%"
            paddingAngle={2}
            stroke="none"
          >
            {data.map((d, i) => (
              <Cell
                fill={colors[i % colors.length]}
                key={d.name}
                opacity={active === null || active === i ? 1 : 0.4}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold text-[20px] text-ink leading-6 tabular-nums">
          {formatValue(shown ? shown.value : total)}
        </span>
        <span className="max-w-[120px] truncate text-[11px] text-ink-muted">
          {shown ? shown.name : centerLabel}
        </span>
      </div>
    </div>
  );
}

/** Sıralanabilir tablo başlığı (tıklayınca yön değişir, ok gösterir). */
export function SortTh({
  sort,
  k,
  label,
  align = "left",
  className,
}: {
  sort: SortState;
  k: string;
  label: string;
  align?: "left" | "right" | "center";
  className?: string;
}) {
  const active = sort.key === k;
  const Icon = active ? (sort.dir === "asc" ? ArrowUp : ArrowDown) : ChevronsUpDown;
  return (
    <th
      className={cn(
        "py-2 font-medium",
        align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      <button
        className={cn(
          "inline-flex items-center gap-1 hover:text-ink-soft",
          active && "text-bank-700"
        )}
        onClick={() => sort.toggle(k)}
        type="button"
      >
        {label}
        <Icon className={active ? "" : "opacity-40"} size={12} strokeWidth={2.2} />
      </button>
    </th>
  );
}
