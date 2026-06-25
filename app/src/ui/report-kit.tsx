import { ArrowDown, ArrowUp, ChevronsUpDown, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Cell, Label, Pie, PieChart, ResponsiveContainer } from "recharts";
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
 * Kompakt filtre toolbar'ı: ilk `primary` filtre inline; gerisi "Filtreler (N)"
 * popover panelinde. Aktif (Tümü olmayan) gizli filtreler çip olarak görünür,
 * çipten × ile kaldırılır. Alanı ~3 kat küçültür.
 */
export function FilterBar({
  filters,
  primary = 3,
  onReset,
  right,
}: {
  filters: FilterDef[];
  primary?: number;
  onReset: () => void;
  right?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const primaryFilters = filters.slice(0, primary);
  const moreFilters = filters.slice(primary);
  const activeMore = moreFilters.filter((f) => f.value !== ALL);

  return (
    <Card className="p-3">
      <div className="flex flex-wrap items-end gap-2.5">
        {primaryFilters.map((f) => (
          <FilterSelect
            key={f.key}
            label={f.label}
            onChange={f.onChange}
            options={f.options}
            value={f.value}
            width={f.width}
          />
        ))}

        {moreFilters.length > 0 && (
          <div className="relative" ref={ref}>
            <button
              className={`flex h-9 items-center gap-1.5 rounded-[10px] border px-3 font-medium text-[13px] transition-colors ${
                activeMore.length
                  ? "border-bank bg-bank-tint text-bank-700"
                  : "border-line-strong bg-surface text-ink-soft hover:bg-canvas"
              }`}
              onClick={() => setOpen((o) => !o)}
              type="button"
            >
              <SlidersHorizontal size={15} /> Filtreler
              {activeMore.length > 0 && (
                <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-bank px-1 font-bold text-[10px] text-white">
                  {activeMore.length}
                </span>
              )}
            </button>
            {open && (
              <div className="absolute top-full left-0 z-40 mt-1.5 w-[min(680px,92vw)] rounded-xl border border-line-strong bg-surface p-4 shadow-[var(--shadow-pop)]">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-semibold text-[13px] text-ink">
                    Tüm Filtreler
                  </span>
                  <button
                    className="font-medium text-[12px] text-bank-700 hover:underline"
                    onClick={() => {
                      for (const f of moreFilters) {
                        f.onChange(ALL);
                      }
                    }}
                    type="button"
                  >
                    Bu grubu temizle
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {moreFilters.map((f) => (
                    <FilterSelect
                      key={f.key}
                      label={f.label}
                      onChange={f.onChange}
                      options={f.options}
                      value={f.value}
                      width={f.width}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="ml-auto flex items-end gap-2.5">
          <button
            className="flex h-9 items-center gap-1.5 rounded-[10px] border border-line-strong bg-surface px-3 font-medium text-[13px] text-ink-soft hover:bg-canvas"
            onClick={onReset}
            type="button"
          >
            <RotateCcw size={15} /> Temizle
          </button>
          {right}
        </div>
      </div>

      {activeMore.length > 0 && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {activeMore.map((f) => (
            <button
              className="flex items-center gap-1 rounded-full bg-bank-tint py-1 pr-1.5 pl-2.5 font-medium text-[11.5px] text-bank-700 hover:bg-bank-tint/70"
              key={f.key}
              onClick={() => f.onChange(ALL)}
              type="button"
            >
              <span className="text-ink-muted">{f.label}:</span> {f.value}
              <X size={12} strokeWidth={2.4} />
            </button>
          ))}
        </div>
      )}
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

  const renderCenter = (props: unknown) => {
    const vb = (props as { viewBox?: { cx?: number; cy?: number } }).viewBox;
    const cx = vb?.cx ?? 0;
    const cy = vb?.cy ?? 0;
    return (
      <g>
        <text
          dy={-3}
          fill="var(--color-ink)"
          fontSize={20}
          fontWeight={700}
          textAnchor="middle"
          x={cx}
          y={cy}
        >
          {formatValue(shown ? shown.value : total)}
        </text>
        <text
          dy={15}
          fill="var(--color-ink-muted)"
          fontSize={11}
          textAnchor="middle"
          x={cx}
          y={cy}
        >
          {shown ? shown.name : centerLabel}
        </text>
      </g>
    );
  };

  return (
    <ResponsiveContainer height="100%" width="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          innerRadius={58}
          nameKey="name"
          onMouseEnter={(_, i) => setActive(i)}
          onMouseLeave={() => setActive(null)}
          outerRadius={92}
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
          <Label content={renderCenter} position="center" />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
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
