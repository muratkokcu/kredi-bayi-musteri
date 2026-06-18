import {
  ArrowRight,
  ArrowUp,
  CalendarRange,
  ChevronDown,
  Download,
} from "lucide-react";
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type {
  DealerPerformance,
  PerformanceAdvisorRow,
  PerformanceFunnelStage,
  PerformanceKpi,
  PerformanceSegmentRow,
  PerformanceSpeedStat,
  PerformanceStatusRow,
  PerformanceVehicleRow,
} from "@/data/dealer-performance";
import { useDealerPerformance } from "@/queries/dealer-performance";
import { AreaChart } from "@/ui/area-chart";
import { ErrorState, LoadingState } from "@/ui/async-states";
import { MiniBar } from "@/ui/badge";
import { Card, CardHeader } from "@/ui/card";
import { FunnelChart } from "@/ui/funnel-chart";
import { StatCard } from "@/ui/stat-card";
import { DealerShell } from "../dealer-shell";

const SHELL_PROPS = {
  actions: (
    <>
      <button
        className="flex items-center gap-2.5 rounded-[10px] border border-line-strong bg-surface px-3.5 py-2 text-left hover:bg-canvas"
        type="button"
      >
        <CalendarRange className="text-ink-muted" size={16} />
        <span className="leading-tight">
          <span className="block text-[11px] text-ink-muted">
            Tarih Aralığı
          </span>
          <span className="block font-medium text-[12.5px] text-ink tabular-nums">
            01 Mayıs - 31 Mayıs 2025
          </span>
        </span>
        <ChevronDown className="text-ink-muted" size={15} />
      </button>
      <button
        className="flex items-center gap-2 rounded-[10px] bg-dealer px-3.5 py-2 font-semibold text-[13px] text-white hover:bg-dealer-600"
        type="button"
      >
        <Download size={16} /> Dışa Aktar
      </button>
    </>
  ),
  breadcrumb: ["Performans", "Analitik"],
  subtitle:
    "Satış performansınızı analiz edin, hedeflerinizi takip edin ve işinizi büyütün.",
  title: "Performans & Analitik",
} as const;

function KpiRow({ kpis }: { kpis: PerformanceKpi[] }) {
  return (
    <div className="grid grid-cols-6 gap-4">
      {kpis.map((k) => (
        <StatCard
          icon={k.icon}
          key={k.label}
          label={k.label}
          sub={
            <span className="inline-flex items-center gap-1">
              <span className="inline-flex items-center gap-0.5 font-semibold text-success">
                <ArrowUp size={12} strokeWidth={2.6} />
                {k.delta}
              </span>
              <span className="text-ink-muted">geçen aya göre</span>
            </span>
          }
          tone={k.tone}
          value={k.value}
        />
      ))}
    </div>
  );
}

function FunnelCard({ stages }: { stages: PerformanceFunnelStage[] }) {
  return (
    <Card className="flex flex-col pb-0">
      <CardHeader title="Tekliften Satışa Dönüşüm Hunisi" />
      <div className="mt-5 px-5">
        <FunnelChart color="var(--color-dealer)" stages={stages} />
      </div>
      <div className="mt-4 flex items-center justify-between border-line border-t px-5 py-3.5">
        <span className="text-[13px] text-ink-soft">
          Dönüşüm Oranı (Teklif → Satış)
        </span>
        <span className="flex items-center gap-2">
          <span className="font-bold text-[15px] text-ink tabular-nums">
            %14,1
          </span>
          <span className="inline-flex items-center gap-0.5 font-semibold text-[12.5px] text-success">
            <ArrowUp size={12} strokeWidth={2.6} />
            %2,8
          </span>
        </span>
      </div>
    </Card>
  );
}

function TrendCard({
  offerTrend,
  salesTrend,
  trendLabels,
  offerLabels,
  offerTicks,
}: {
  offerLabels: string[];
  offerTicks: string[];
  offerTrend: number[];
  salesTrend: number[];
  trendLabels: string[];
}) {
  return (
    <Card className="pb-3">
      <CardHeader
        action={
          <button
            className="flex items-center gap-1.5 rounded-[10px] border border-line-strong bg-surface px-3 py-1.5 font-medium text-[12.5px] text-ink-soft"
            type="button"
          >
            Günlük <ChevronDown size={14} />
          </button>
        }
        title="Teklif & Satış Trendi"
      />
      <div className="mt-3 flex items-center gap-4 px-5 text-[12px]">
        <span className="flex items-center gap-1.5 text-ink-soft">
          <span className="size-2.5 rounded-full bg-dealer" /> Teklif Sayısı
        </span>
        <span className="flex items-center gap-1.5 text-ink-soft">
          <span className="size-2.5 rounded-full bg-[#16a34a]" /> Kapanan Satış
        </span>
      </div>
      <div className="relative px-2 pt-2">
        {/* secondary series drawn first, behind the primary */}
        <div className="pointer-events-none absolute inset-0 px-2 pt-2">
          <AreaChart
            color="#16a34a"
            data={salesTrend}
            height={236}
            labels={offerLabels}
            yTicks={offerTicks}
          />
        </div>
        <AreaChart
          color="var(--color-dealer)"
          data={offerTrend}
          height={236}
          labels={trendLabels}
          yTicks={offerTicks}
        />
      </div>
    </Card>
  );
}

/** Tooltip for the status donut: white card matching the design tokens. */
function DonutTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { label: string; pct: string; count: number } }[];
}) {
  if (!(active && payload && payload.length > 0)) {
    return null;
  }
  const row = payload[0].payload;
  return (
    <div className="rounded-lg border border-line-strong bg-surface px-2.5 py-1.5 shadow-[var(--shadow-pop)]">
      <div className="text-[11px] text-ink-muted">{row.label}</div>
      <div className="font-bold text-[13px] text-ink tabular-nums">
        {row.count} ({row.pct})
      </div>
    </div>
  );
}

/** Donut for Tekliflerin Durum Dağılımı with centered total. */
function StatusDonut({ status }: { status: PerformanceStatusRow[] }) {
  const size = 150;
  const fracs = [0.172, 0.375, 0.203, 0.125, 0.078, 0.047];
  const data = status.map((s, i) => ({
    color: s.color,
    count: s.count,
    label: s.label,
    pct: s.pct,
    value: fracs[i],
  }));
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <ResponsiveContainer height={size} width={size}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={55}
            nameKey="label"
            outerRadius={75}
            paddingAngle={2}
            stroke="none"
          >
            {data.map((d) => (
              <Cell fill={d.color} key={d.label} />
            ))}
          </Pie>
          <Tooltip content={<DonutTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <span className="pointer-events-none absolute flex flex-col items-center">
        <span className="text-[11px] text-ink-muted">Toplam</span>
        <span className="font-bold text-[24px] text-ink leading-7 tracking-tight">
          128
        </span>
      </span>
    </span>
  );
}

function StatusCard({ status }: { status: PerformanceStatusRow[] }) {
  return (
    <Card className="pb-5">
      <CardHeader title="Tekliflerin Durum Dağılımı" />
      <div className="mt-3 flex items-center gap-5 px-5">
        <StatusDonut status={status} />
        <div className="flex-1">
          {status.map((s) => (
            <div
              className="flex items-center justify-between py-2"
              key={s.label}
            >
              <span className="flex items-center gap-2.5">
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: s.color }}
                />
                <span className="text-[13px] text-ink-soft">{s.label}</span>
              </span>
              <span className="text-[12.5px] text-ink-muted tabular-nums">
                <span className="font-semibold text-ink">{s.count}</span> (
                {s.pct})
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function FilterPill({ label }: { label: string }) {
  return (
    <button
      className="flex items-center gap-1.5 rounded-[10px] border border-line-strong bg-surface px-3 py-1.5 font-medium text-[12.5px] text-ink-soft"
      type="button"
    >
      {label} <ChevronDown size={14} />
    </button>
  );
}

function ReportLink({ label }: { label: string }) {
  return (
    <div className="border-line border-t px-5 py-3">
      <button
        className="flex w-full items-center justify-center gap-1.5 font-semibold text-[13px] text-dealer"
        type="button"
      >
        {label} <ArrowRight size={15} strokeWidth={2.1} />
      </button>
    </div>
  );
}

function SegmentCard({ segments }: { segments: PerformanceSegmentRow[] }) {
  return (
    <Card className="flex flex-col pb-0">
      <CardHeader
        action={<FilterPill label="Tüm Segmentler" />}
        title="Segment Performansı"
      />
      <div className="mt-3 flex-1 px-5">
        <div className="grid grid-cols-[1fr_0.7fr_0.8fr_0.9fr_1fr] gap-2 border-line border-b pb-2 font-semibold text-[11px] text-ink-muted uppercase tracking-wide">
          <span>Segment</span>
          <span className="text-right">Teklif Sayısı</span>
          <span className="text-right">Kazanma Oranı</span>
          <span className="text-right">Ort. Yanıt Süresi</span>
          <span className="text-right">Kapanan Satış</span>
        </div>
        {segments.map((s) => (
          <div
            className="grid grid-cols-[1fr_0.7fr_0.8fr_0.9fr_1fr] items-center gap-2 border-line border-b py-2.5 last:border-0"
            key={s.segment}
          >
            <span className="font-semibold text-[13px] text-ink">
              {s.segment}
            </span>
            <span className="text-right text-[12.5px] text-ink-soft tabular-nums">
              {s.teklif}
            </span>
            <span className="text-right font-medium text-[12.5px] text-ink tabular-nums">
              {s.oran}
            </span>
            <span className="text-right text-[12.5px] text-ink-soft tabular-nums">
              {s.yanit}
            </span>
            <span className="flex items-center justify-end gap-2">
              <span className="w-16">
                <MiniBar color="var(--color-dealer)" value={s.pct} />
              </span>
              <span className="w-5 text-right font-semibold text-[12.5px] text-ink tabular-nums">
                {s.kapanan}
              </span>
            </span>
          </div>
        ))}
      </div>
      <ReportLink label="Tüm Segment Raporu" />
    </Card>
  );
}

function AdvisorCard({ advisors }: { advisors: PerformanceAdvisorRow[] }) {
  return (
    <Card className="flex flex-col pb-0">
      <CardHeader
        action={<FilterPill label="Tüm Danışmanlar" />}
        title="Satış Danışmanı Performansı"
      />
      <div className="mt-3 flex-1 px-5">
        <div className="grid grid-cols-[1.4fr_0.6fr_0.8fr_1fr] gap-2 border-line border-b pb-2 font-semibold text-[11px] text-ink-muted uppercase tracking-wide">
          <span>Danışman</span>
          <span className="text-right">Teklif</span>
          <span className="text-right">Kazanma Oranı</span>
          <span className="text-right">Kapanan</span>
        </div>
        {advisors.map((a) => (
          <div
            className="grid grid-cols-[1.4fr_0.6fr_0.8fr_1fr] items-center gap-2 border-line border-b py-2.5 last:border-0"
            key={a.ad}
          >
            <span className="flex items-center gap-2.5">
              <span
                className={`flex size-8 items-center justify-center rounded-full font-bold text-[11px] ${a.tone}`}
              >
                {a.initials}
              </span>
              <span className="font-semibold text-[13px] text-ink">{a.ad}</span>
            </span>
            <span className="text-right text-[12.5px] text-ink-soft tabular-nums">
              {a.teklif}
            </span>
            <span className="text-right font-medium text-[12.5px] text-ink tabular-nums">
              {a.oran}
            </span>
            <span className="flex items-center justify-end gap-2">
              <span className="w-16">
                <MiniBar color="var(--color-dealer)" value={a.pct} />
              </span>
              <span className="w-5 text-right font-semibold text-[12.5px] text-ink tabular-nums">
                {a.kapanan}
              </span>
            </span>
          </div>
        ))}
      </div>
      <ReportLink label="Tüm Danışman Raporu" />
    </Card>
  );
}

/** Tiny inline sparkline matching the small trend chips on the right column. */
function Sparkline({ color }: { color: string }) {
  const points = [10, 8, 12, 9, 14, 11, 16, 13, 18, 15, 20];
  const data = points.map((v) => ({ v }));
  return (
    <div className="shrink-0" style={{ height: 36, width: 120 }}>
      <ResponsiveContainer height={36} width={120}>
        <LineChart data={data} margin={{ bottom: 4, left: 0, right: 0, top: 4 }}>
          <Line
            dataKey="v"
            dot={false}
            stroke={color}
            strokeWidth={2}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function SpeedCard({ stat }: { stat: PerformanceSpeedStat }) {
  return (
    <Card className="px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[13px] text-ink-soft">{stat.label}</div>
          <div className="mt-1 font-bold text-[22px] text-ink leading-7 tracking-tight">
            {stat.value}
          </div>
          <div className="mt-1 inline-flex items-center gap-0.5 font-semibold text-[12px] text-success">
            <ArrowUp size={12} strokeWidth={2.6} />
            {stat.delta}
          </div>
        </div>
        <Sparkline color={stat.color} />
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-full ${stat.tint}`}
        >
          {stat.icon}
        </div>
      </div>
    </Card>
  );
}

/** Inline blue progress ring for Hedefe Ulaşma Oranı. */
function TargetRing() {
  const size = 78;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const value = 64.8;
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        aria-hidden="true"
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        width={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={r}
          stroke="var(--color-line)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={r}
          stroke="var(--color-dealer)"
          strokeDasharray={`${(value / 100) * c} ${c}`}
          strokeLinecap="round"
          strokeWidth={stroke}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="absolute font-bold text-[14px] text-ink tabular-nums">
        %64,8
      </span>
    </span>
  );
}

function TargetCard() {
  return (
    <Card className="px-5 py-4">
      <h3 className="font-semibold text-[15px] text-ink">
        Hedefe Ulaşma Oranı
      </h3>
      <div className="mt-4 flex items-center justify-between">
        <div className="leading-tight">
          <div className="text-[12px] text-ink-muted">Aylık Hedef</div>
          <div className="mt-1 font-bold text-[18px] text-ink tabular-nums">
            ₺5.000.000
          </div>
        </div>
        <TargetRing />
        <div className="text-right leading-tight">
          <div className="text-[12px] text-ink-muted">Gerçekleşen</div>
          <div className="mt-1 font-bold text-[18px] text-dealer tabular-nums">
            ₺3.240.000
          </div>
        </div>
      </div>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-dealer"
          style={{ width: "64.8%" }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-[12px] text-ink-muted tabular-nums">
        <span>₺0</span>
        <span>Kalan: ₺1.760.000</span>
      </div>
    </Card>
  );
}

function VehicleCard({ vehicles }: { vehicles: PerformanceVehicleRow[] }) {
  return (
    <Card className="px-5 py-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[15px] text-ink">
          En Çok Tercih Edilen Araçlar
        </h3>
        <button
          className="flex items-center gap-1.5 font-semibold text-[13px] text-dealer"
          type="button"
        >
          Tümünü Gör <ArrowRight size={15} strokeWidth={2.1} />
        </button>
      </div>
      <div className="mt-4 grid grid-cols-5 gap-4">
        {vehicles.map((v) => (
          <div className="flex items-center gap-3" key={v.ad}>
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-dealer-tint font-bold text-[11px] text-dealer-700">
              {v.rank}
            </span>
            <span className="flex h-11 w-14 shrink-0 items-center justify-center rounded-lg bg-canvas">
              <svg
                aria-hidden="true"
                fill="none"
                height="22"
                viewBox="0 0 48 24"
                width="40"
              >
                <path
                  d="M4 17h40M7 17l3-7c0.6-1.4 1.9-2 3.4-2h17.2c1.5 0 2.8 0.6 3.4 2l3 7M9 17v2M39 17v2"
                  stroke="var(--color-ink-muted)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.6"
                />
                <circle cx="14" cy="17" fill="var(--color-ink-muted)" r="2.4" />
                <circle cx="34" cy="17" fill="var(--color-ink-muted)" r="2.4" />
              </svg>
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-semibold text-[13px] text-ink">
                {v.ad}
              </span>
              <span className="block text-[12px] text-ink-soft">
                {v.teklif}
              </span>
              <span className="block font-medium text-[12px] text-dealer tabular-nums">
                {v.oran}
              </span>
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function PerformansContent({ data }: { data: DealerPerformance }) {
  return (
    <>
      <KpiRow kpis={data.kpis} />

      <div className="mt-5 grid grid-cols-3 gap-5">
        <FunnelCard stages={data.funnelStages} />
        <TrendCard
          offerLabels={data.offerLabels}
          offerTicks={data.offerTicks}
          offerTrend={data.offerTrend}
          salesTrend={data.salesTrend}
          trendLabels={data.trendLabels}
        />
        <StatusCard status={data.status} />
      </div>

      <div className="mt-5 grid grid-cols-[1fr_1fr_0.92fr] gap-5">
        <SegmentCard segments={data.segments} />
        <AdvisorCard advisors={data.advisors} />
        <div className="flex flex-col gap-5">
          {data.speedStats.map((s) => (
            <SpeedCard key={s.label} stat={s} />
          ))}
          <TargetCard />
        </div>
      </div>

      <div className="mt-5">
        <VehicleCard vehicles={data.vehicles} />
      </div>
    </>
  );
}

export function DealerPerformans() {
  const { data, isPending, isError, refetch } = useDealerPerformance();

  if (isPending) {
    return (
      <DealerShell {...SHELL_PROPS}>
        <LoadingState />
      </DealerShell>
    );
  }

  if (isError || !data) {
    return (
      <DealerShell {...SHELL_PROPS}>
        <ErrorState onRetry={() => refetch()} />
      </DealerShell>
    );
  }

  return (
    <DealerShell {...SHELL_PROPS}>
      <PerformansContent data={data} />
    </DealerShell>
  );
}
