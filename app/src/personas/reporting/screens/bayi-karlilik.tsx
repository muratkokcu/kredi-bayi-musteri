import {
  Building2,
  Download,
  Layers,
  Minus,
  TrendingDown,
  TrendingUp,
  User,
  Users2,
} from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  type DealerProfit,
  METRICS,
  type MetricKey,
  PROFIT_MONTHS,
} from "@/data/dealer-profitability";
import { formatNumber, formatPercent, formatTRY, formatTRYCompact } from "@/lib/format";
import { useDealerProfitability } from "@/queries/dealer-profitability";
import { ErrorState, LoadingState } from "@/ui/async-states";
import { Card } from "@/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReportingShell } from "../reporting-shell";

const SHELL_PROPS = {
  breadcrumb: ["Raporlar", "Bayi Karlılık"],
  subtitle: "Bayilerin dönemsel performansını ve trendini tek bakışta izleyin.",
  title: "Bayi Karlılık Takibi",
} as const;

type Trend = "up" | "down" | "flat";
type FilterKey =
  | "all"
  | "up"
  | "down"
  | "flat"
  | "volLo"
  | "volMid"
  | "volHi"
  | "Bireysel"
  | "Ticari";

const VOL_LO = 50_000_000;
const VOL_HI = 150_000_000;

function mean(xs: number[]): number {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

function trendOf(series: number[]): Trend {
  const prev = mean(series.slice(6, 9));
  const last = mean(series.slice(9, 12));
  if (prev === 0) {
    return "flat";
  }
  const change = last / prev - 1;
  if (change > 0.05) {
    return "up";
  }
  if (change < -0.05) {
    return "down";
  }
  return "flat";
}

function fmt(value: number, kind: "money" | "percent" | "count"): string {
  if (kind === "money") {
    return formatTRYCompact(value);
  }
  if (kind === "percent") {
    return formatPercent(value, 0);
  }
  return formatNumber(value);
}

/** Tiny inline trend sparkline (SVG polyline). */
function Sparkline({ data, tone }: { data: number[]; tone: string }) {
  const w = 72;
  const h = 22;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * (w - 2) + 1;
      const y = h - 2 - ((v - min) / span) * (h - 4);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg aria-hidden="true" height={h} viewBox={`0 0 ${w} ${h}`} width={w}>
      <polyline
        fill="none"
        points={pts}
        stroke={tone}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
      />
    </svg>
  );
}

function DirectionBadge({ trend }: { trend: Trend }) {
  if (trend === "up") {
    return <TrendingUp className="text-success" size={17} strokeWidth={2.2} />;
  }
  if (trend === "down") {
    return <TrendingDown className="text-danger" size={17} strokeWidth={2.2} />;
  }
  return <Minus className="text-ink-muted" size={17} strokeWidth={2.2} />;
}

interface KpiPillProps {
  active: boolean;
  count: number;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

function KpiPill({ active, count, icon, label, onClick }: KpiPillProps) {
  return (
    <button
      className={`flex min-w-[116px] shrink-0 items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left transition-colors ${
        active
          ? "border-bank bg-bank-tint"
          : "border-line bg-surface hover:bg-canvas"
      }`}
      onClick={onClick}
      type="button"
    >
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
          active ? "bg-bank text-white" : "bg-canvas text-ink-soft"
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-bold text-[17px] text-ink leading-none tabular-nums">
          {count}
        </span>
        <span className="mt-0.5 block truncate text-[11px] text-ink-muted">
          {label}
        </span>
      </span>
    </button>
  );
}

function ProfitBody({ rows }: { rows: DealerProfit[] }) {
  const [metric, setMetric] = useState<MetricKey>("kabulHacmi");
  const [normalize, setNormalize] = useState<"row" | "table">("table");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const meta = METRICS.find((m) => m.key === metric) ?? METRICS[0];

  // bayi başına trend + yıllık hacim (KPI + filtre için, tüm bayilerden)
  const derived = useMemo(() => {
    const map = new Map<string, { trend: Trend; yearVol: number }>();
    for (const d of rows) {
      map.set(d.id, {
        trend: trendOf(d.series.kabulHacmi.current),
        yearVol: d.series.kabulHacmi.current.reduce((a, b) => a + b, 0),
      });
    }
    return map;
  }, [rows]);

  const matches = (d: DealerProfit): boolean => {
    const info = derived.get(d.id);
    if (!info) {
      return true;
    }
    switch (filter) {
      case "all":
        return true;
      case "up":
      case "down":
      case "flat":
        return info.trend === filter;
      case "volLo":
        return info.yearVol < VOL_LO;
      case "volMid":
        return info.yearVol >= VOL_LO && info.yearVol < VOL_HI;
      case "volHi":
        return info.yearVol >= VOL_HI;
      default:
        return d.tip === filter;
    }
  };

  const shown = rows.filter(matches);

  const counts = useMemo(() => {
    let up = 0;
    let down = 0;
    let flat = 0;
    let lo = 0;
    let mid = 0;
    let hi = 0;
    let bir = 0;
    let kur = 0;
    for (const d of rows) {
      const info = derived.get(d.id);
      if (info?.trend === "up") up += 1;
      else if (info?.trend === "down") down += 1;
      else flat += 1;
      const v = info?.yearVol ?? 0;
      if (v < VOL_LO) lo += 1;
      else if (v < VOL_HI) mid += 1;
      else hi += 1;
      if (d.tip === "Ticari") kur += 1;
      else bir += 1;
    }
    return { up, down, flat, lo, mid, hi, bir, kur };
  }, [rows, derived]);

  const toggle = (key: FilterKey) =>
    setFilter((prev) => (prev === key ? "all" : key));

  // heatmap renk normalizasyonu
  const tableMin = Math.min(
    ...shown.flatMap((d) => d.series[metric].current)
  );
  const tableMax = Math.max(
    ...shown.flatMap((d) => d.series[metric].current)
  );

  const cellBg = (value: number, row: number[]): string => {
    const lo = normalize === "row" ? Math.min(...row) : tableMin;
    const hi = normalize === "row" ? Math.max(...row) : tableMax;
    const norm = hi === lo ? 0.5 : (value - lo) / (hi - lo);
    const pct = 8 + norm * 74;
    return `color-mix(in oklab, var(--color-bank) ${pct.toFixed(0)}%, var(--color-surface))`;
  };
  const cellText = (value: number, row: number[]): string => {
    const lo = normalize === "row" ? Math.min(...row) : tableMin;
    const hi = normalize === "row" ? Math.max(...row) : tableMax;
    const norm = hi === lo ? 0.5 : (value - lo) / (hi - lo);
    return norm > 0.55 ? "text-white" : "text-ink";
  };

  const total = (d: DealerProfit): number => {
    const arr = d.series[metric].current;
    const sum = arr.reduce((a, b) => a + b, 0);
    return meta.agg === "avg" ? sum / arr.length : sum;
  };

  // combo grafik verisi: seçili bayi ya da gösterilenlerin toplamı
  const comboData = useMemo(() => {
    const pool = selectedId
      ? shown.filter((d) => d.id === selectedId)
      : shown;
    return PROFIT_MONTHS.map((ay, i) => {
      let hac = 0;
      let kom = 0;
      let pHac = 0;
      let pKom = 0;
      for (const d of pool) {
        hac += d.series.kabulHacmi.current[i];
        kom += d.series.komisyon.current[i];
        pHac += d.series.kabulHacmi.previous[i];
        pKom += d.series.komisyon.previous[i];
      }
      return { ay, hac, kom, pHac, pKom };
    });
  }, [shown, selectedId]);

  const selected = rows.find((d) => d.id === selectedId);

  const exportCsv = () => {
    const header = ["Bayi", ...PROFIT_MONTHS, "Toplam"].join(";");
    const lines = shown.map((d) =>
      [
        d.name,
        ...d.series[metric].current.map((v) => Math.round(v)),
        Math.round(total(d)),
      ].join(";")
    );
    const blob = new Blob([`${header}\n${lines.join("\n")}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bayi-karlilik-${metric}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* KPI ŞERİDİ */}
      <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1">
        <KpiPill
          active={filter === "all"}
          count={rows.length}
          icon={<Users2 size={17} strokeWidth={1.9} />}
          label="Toplam Bayi"
          onClick={() => setFilter("all")}
        />
        <KpiPill
          active={filter === "up"}
          count={counts.up}
          icon={<TrendingUp size={17} strokeWidth={1.9} />}
          label="Yükselen"
          onClick={() => toggle("up")}
        />
        <KpiPill
          active={filter === "down"}
          count={counts.down}
          icon={<TrendingDown size={17} strokeWidth={1.9} />}
          label="Düşüşte"
          onClick={() => toggle("down")}
        />
        <KpiPill
          active={filter === "flat"}
          count={counts.flat}
          icon={<Minus size={17} strokeWidth={1.9} />}
          label="Sabit"
          onClick={() => toggle("flat")}
        />
        <KpiPill
          active={filter === "volLo"}
          count={counts.lo}
          icon={<Layers size={17} strokeWidth={1.9} />}
          label="< ₺50M"
          onClick={() => toggle("volLo")}
        />
        <KpiPill
          active={filter === "volMid"}
          count={counts.mid}
          icon={<Layers size={17} strokeWidth={1.9} />}
          label="₺50M – 150M"
          onClick={() => toggle("volMid")}
        />
        <KpiPill
          active={filter === "volHi"}
          count={counts.hi}
          icon={<Layers size={17} strokeWidth={1.9} />}
          label="> ₺150M"
          onClick={() => toggle("volHi")}
        />
        <KpiPill
          active={filter === "Bireysel"}
          count={counts.bir}
          icon={<User size={17} strokeWidth={1.9} />}
          label="Bireysel"
          onClick={() => toggle("Bireysel")}
        />
        <KpiPill
          active={filter === "Ticari"}
          count={counts.kur}
          icon={<Building2 size={17} strokeWidth={1.9} />}
          label="Ticari"
          onClick={() => toggle("Ticari")}
        />
      </div>

      {/* YoY COMBO */}
      <Card className="mt-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold text-[15px] text-ink">
            {selected ? selected.name : "Tüm Bayiler"} — Bu Yıl / Geçen Yıl
          </h3>
          {selected && (
            <button
              className="font-semibold text-[12.5px] text-bank-700"
              onClick={() => setSelectedId(null)}
              type="button"
            >
              Tümünü göster
            </button>
          )}
        </div>
        <div className="mt-4 h-[260px]">
          <ResponsiveContainer height="100%" width="100%">
            <ComposedChart
              data={comboData}
              margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
            >
              <CartesianGrid stroke="var(--color-line)" vertical={false} />
              <XAxis
                axisLine={false}
                dataKey="ay"
                tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }}
                tickFormatter={formatTRYCompact}
                tickLine={false}
                width={64}
              />
              <Tooltip
                formatter={(value) => formatTRY(Number(value) || 0)}
                labelStyle={{ color: "var(--color-ink)" }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                dataKey="hac"
                fill="var(--color-bank)"
                name="Kabul Hacmi"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="kom"
                fill="var(--color-bank-700)"
                name="Komisyon"
                radius={[4, 4, 0, 0]}
              />
              <Line
                dataKey="pHac"
                dot={false}
                name="Geçen Yıl Hacim"
                stroke="var(--color-warn)"
                strokeWidth={2}
              />
              <Line
                dataKey="pKom"
                dot={false}
                name="Geçen Yıl Komisyon"
                stroke="var(--color-ink-muted)"
                strokeDasharray="4 3"
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* KONTROLLER + HEATMAP TABLO */}
      <Card className="mt-5 pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
          <h3 className="font-semibold text-[15px] text-ink leading-5">
            {`Bayi × Dönem — ${meta.label}`}
          </h3>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center overflow-hidden rounded-[10px] border border-line-strong text-[12.5px]">
              <button
                className={`px-3 py-1.5 font-medium ${
                  normalize === "table"
                    ? "bg-bank text-white"
                    : "bg-surface text-ink-soft"
                }`}
                onClick={() => setNormalize("table")}
                type="button"
              >
                Tablo bazı
              </button>
              <button
                className={`px-3 py-1.5 font-medium ${
                  normalize === "row"
                    ? "bg-bank text-white"
                    : "bg-surface text-ink-soft"
                }`}
                onClick={() => setNormalize("row")}
                type="button"
              >
                Satır bazı
              </button>
            </div>
            <Select
              onValueChange={(v) => setMetric(v as MetricKey)}
              value={metric}
            >
              <SelectTrigger className="h-9 w-[168px] border-line-strong text-[13px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {METRICS.map((m) => (
                  <SelectItem key={m.key} value={m.key}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              className="flex items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-3.5 py-2 font-medium text-[13px] text-ink-soft hover:bg-canvas"
              onClick={exportCsv}
              type="button"
            >
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        <div className="mt-3 overflow-x-auto px-5">
          <table className="w-full min-w-[1000px] border-collapse">
            <thead>
              <tr className="text-[11.5px] text-ink-muted">
                <th className="sticky left-0 z-10 bg-surface px-2 py-2 text-left font-medium">
                  Bayi
                </th>
                {PROFIT_MONTHS.map((ay) => (
                  <th className="px-1 py-2 text-center font-medium" key={ay}>
                    {ay}
                  </th>
                ))}
                <th className="px-2 py-2 text-right font-medium">Toplam</th>
                <th className="px-2 py-2 text-center font-medium">Son 12 Ay</th>
                <th className="px-2 py-2 text-center font-medium">Yön</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((d) => {
                const row = d.series[metric].current;
                const info = derived.get(d.id);
                const isSel = d.id === selectedId;
                return (
                  <tr
                    className={`cursor-pointer border-line border-t transition-colors hover:bg-canvas/60 ${
                      isSel ? "bg-bank-tint/40" : ""
                    }`}
                    key={d.id}
                    onClick={() =>
                      setSelectedId((p) => (p === d.id ? null : d.id))
                    }
                  >
                    <td className="sticky left-0 z-10 bg-surface px-2 py-1.5">
                      <span className="flex items-center gap-2">
                        <span
                          className={`flex size-7 shrink-0 items-center justify-center rounded-lg font-bold text-[10.5px] ${d.logoTone}`}
                        >
                          {d.initials}
                        </span>
                        <span className="truncate font-medium text-[13px] text-ink">
                          {d.name}
                        </span>
                      </span>
                    </td>
                    {row.map((v, i) => (
                      <td className="px-0.5 py-1" key={PROFIT_MONTHS[i]}>
                        <div
                          className={`rounded-md py-1.5 text-center font-medium text-[11px] tabular-nums ${cellText(v, row)}`}
                          style={{ background: cellBg(v, row) }}
                        >
                          {fmt(v, meta.kind)}
                        </div>
                      </td>
                    ))}
                    <td className="px-2 py-1.5 text-right font-bold text-[12.5px] text-ink tabular-nums">
                      {fmt(total(d), meta.kind)}
                    </td>
                    <td className="px-2 py-1.5">
                      <div className="flex justify-center">
                        <Sparkline
                          data={row}
                          tone={
                            info?.trend === "down"
                              ? "var(--color-danger)"
                              : info?.trend === "up"
                                ? "var(--color-success)"
                                : "var(--color-ink-muted)"
                          }
                        />
                      </div>
                    </td>
                    <td className="px-2 py-1.5">
                      <div className="flex justify-center">
                        <DirectionBadge trend={info?.trend ?? "flat"} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

export function BankBayiKarlilik() {
  const { data, isPending, isError, refetch } = useDealerProfitability();

  if (isPending) {
    return (
      <ReportingShell {...SHELL_PROPS}>
        <LoadingState />
      </ReportingShell>
    );
  }

  if (isError || !data) {
    return (
      <ReportingShell {...SHELL_PROPS}>
        <ErrorState onRetry={() => refetch()} />
      </ReportingShell>
    );
  }

  return (
    <ReportingShell {...SHELL_PROPS}>
      <ProfitBody rows={data} />
    </ReportingShell>
  );
}
