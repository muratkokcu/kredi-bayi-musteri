import {
  ArrowDown,
  ArrowUp,
  CalendarRange,
  ChevronDown,
  Headphones,
  Info,
  Phone,
  Sparkles,
} from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { getMarka, getModel } from "@/data/arac-taksonomisi";
import type {
  DealerActivity,
  DealerFunnelStage,
  DealerKpi,
  DealerPerformance,
  DealerPopularRaw,
  DealerSegment,
} from "@/data/dealer-home";
import { useDealerHome } from "@/queries/dealer-home";
import { ErrorState, LoadingState } from "@/ui/async-states";
import { MiniBar } from "@/ui/badge";
import { Card, CardHeader } from "@/ui/card";
import { FunnelChart } from "@/ui/funnel-chart";
import { KpiCard } from "@/ui/kpi";
import { VehicleImage } from "@/ui/vehicle-image";
import { DealerShell } from "../dealer-shell";

const DEALER_COLOR = "var(--color-dealer)";

interface PopularVehicle {
  pct: number;
  pctLabel: string;
  sayisi: number;
  title: string;
}

function buildPopularVehicles(
  raw: DealerPopularRaw[],
  pctLabels: Record<string, string>,
): PopularVehicle[] {
  return raw.map((v) => {
    const marka = getMarka(v.marka);
    const model = getModel(v.marka, v.model);
    const markaAd = marka?.marka ?? v.marka;
    const modelAd = model?.model ?? v.model;
    return {
      title: `${markaAd} ${modelAd}`,
      sayisi: v.sayisi,
      pct: v.pct,
      pctLabel: pctLabels[v.model] ?? "",
    };
  });
}

function DateRangePill() {
  return (
    <button
      className="flex items-center gap-2.5 rounded-[10px] border border-line-strong bg-surface px-3.5 py-2 text-left hover:bg-canvas"
      type="button"
    >
      <CalendarRange className="text-ink-muted" size={16} strokeWidth={1.9} />
      <span className="leading-tight">
        <span className="block text-[11px] text-ink-muted">Tarih Aralığı</span>
        <span className="block font-medium text-[12.5px] text-ink tabular-nums">
          15.04.2025 - 22.04.2025
        </span>
      </span>
      <ChevronDown className="text-ink-muted" size={15} strokeWidth={1.9} />
    </button>
  );
}

function KpiRow({ kpis }: { kpis: DealerKpi[] }) {
  return (
    <div className="grid grid-cols-5 gap-4">
      {kpis.map((k) => (
        <KpiCard
          accent="dealer"
          delta={k.delta}
          icon={k.icon}
          key={k.label}
          label={k.label}
          note="önceki 7 güne göre"
          positive={k.positive}
          value={k.value}
        />
      ))}
    </div>
  );
}

function PeriodSelect({ label }: { label: string }) {
  return (
    <button
      className="flex items-center gap-1.5 rounded-[10px] border border-line-strong bg-surface px-3 py-1.5 font-medium text-[12.5px] text-ink-soft hover:bg-canvas"
      type="button"
    >
      {label}
      <ChevronDown size={14} strokeWidth={1.9} />
    </button>
  );
}

function PipelineCard({ funnel }: { funnel: DealerFunnelStage[] }) {
  return (
    <Card className="pb-4">
      <CardHeader
        action={<PeriodSelect label="Bu Hafta" />}
        title={
          <span className="flex items-center gap-1.5">
            Fırsat Pipeline
            <Info className="text-ink-muted" size={14} strokeWidth={1.9} />
          </span>
        }
      />
      <div className="mt-4 px-5">
        <FunnelChart color={DEALER_COLOR} stages={funnel} />
      </div>
      <div className="mt-4 flex items-center justify-between border-line border-t px-5 pt-4">
        <span className="text-[12.5px] text-ink-soft">Kapanış Oranı</span>
        <span className="font-bold text-[15px] text-dealer-700 tabular-nums">
          %25
        </span>
      </div>
    </Card>
  );
}

function SegmentTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name?: string; payload?: DealerSegment }[];
}) {
  if (!(active && payload && payload.length > 0)) {
    return null;
  }
  const seg = payload[0].payload;
  return (
    <div className="rounded-lg border border-line-strong bg-surface px-2.5 py-1.5 shadow-[var(--shadow-pop)]">
      <div className="text-[11px] text-ink-muted">{seg?.label}</div>
      <div className="font-bold text-[13px] text-ink tabular-nums">
        {seg?.value}
      </div>
    </div>
  );
}

function SegmentDonut({ segments }: { segments: DealerSegment[] }) {
  const size = 168;
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <ResponsiveContainer height={size} width={size}>
        <PieChart>
          <Pie
            data={segments}
            dataKey="frac"
            innerRadius={60}
            nameKey="label"
            outerRadius={84}
            paddingAngle={2}
            stroke="none"
          >
            {segments.map((s) => (
              <Cell fill={s.color} key={s.label} />
            ))}
          </Pie>
          <Tooltip content={<SegmentTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <span className="pointer-events-none absolute flex flex-col items-center">
        <span className="text-[11px] text-ink-muted">Toplam</span>
        <span className="font-bold text-[26px] text-ink leading-7 tracking-tight">
          48
        </span>
        <span className="text-[11px] text-ink-muted">Fırsat</span>
      </span>
    </span>
  );
}

function SegmentCard({ segments }: { segments: DealerSegment[] }) {
  return (
    <Card className="pb-1">
      <CardHeader title="Segment Dağılımı" />
      <div className="mt-3 flex items-center gap-5 px-5">
        <SegmentDonut segments={segments} />
        <div className="flex-1">
          {segments.map((s) => (
            <div
              className="flex items-center justify-between border-line border-b py-2.5 last:border-0"
              key={s.label}
            >
              <span className="flex items-center gap-2.5">
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: s.color }}
                />
                <span className="text-[13px] text-ink-soft">{s.label}</span>
              </span>
              <span className="font-semibold text-[13px] text-ink tabular-nums">
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>
      <button
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-[10px] border border-line-strong px-3 py-2.5 font-medium text-[13px] text-dealer-700 hover:bg-dealer-tint"
        type="button"
      >
        Segmentleri Görüntüle
        <ArrowUp className="rotate-45" size={14} strokeWidth={2.2} />
      </button>
    </Card>
  );
}

function ActivitiesCard({ activities }: { activities: DealerActivity[] }) {
  return (
    <Card className="pb-2">
      <CardHeader
        action={
          <button
            className="font-medium text-[12.5px] text-dealer-700 hover:underline"
            type="button"
          >
            Tümünü Görüntüle
          </button>
        }
        title="Son Aktiviteler"
      />
      <div className="mt-3 px-5">
        {activities.map(({ icon: Icon, ...a }) => (
          <div
            className="flex items-start gap-3 border-line border-b py-3 last:border-0"
            key={a.id}
          >
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-full ${a.tone}`}
            >
              <Icon size={17} strokeWidth={1.9} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] text-ink leading-4">
                <span className="font-semibold">{a.name}</span> {a.text}
              </p>
              <p className="mt-0.5 truncate text-[11.5px] text-ink-muted">
                {a.sub}
              </p>
            </div>
            <span className="shrink-0 text-[11.5px] text-ink-muted tabular-nums">
              {a.time}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function PopularVehiclesCard({ vehicles }: { vehicles: PopularVehicle[] }) {
  return (
    <Card className="pb-4">
      <CardHeader title="En Çok İlgi Gören Araçlar" />
      <div className="mt-3 px-5">
        {vehicles.map((v, i) => (
          <div
            className="flex items-center gap-3 border-line border-b py-3 last:border-0"
            key={v.title}
          >
            <span className="w-4 shrink-0 text-center font-bold text-[13px] text-ink-muted tabular-nums">
              {i + 1}
            </span>
            <VehicleImage
              className="h-8 w-11 shrink-0 rounded-md"
              iconSize={16}
              name={v.title}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-medium text-[13px] text-ink">
                  {v.title}
                </span>
                <span className="shrink-0 text-[11.5px] text-ink-muted tabular-nums">
                  {v.sayisi} fırsat
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-2.5">
                <MiniBar color={DEALER_COLOR} value={v.pct} />
                <span className="shrink-0 font-semibold text-[12px] text-ink tabular-nums">
                  {v.pctLabel}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function deltaTone(positive: boolean): string {
  return positive ? "text-success" : "text-danger";
}

function PerformanceCard({
  performance,
}: {
  performance: DealerPerformance[];
}) {
  return (
    <Card className="pb-2">
      <CardHeader
        action={<PeriodSelect label="Bu Ay" />}
        title="Performans Özeti"
      />
      <div className="mt-3 px-5">
        {performance.map(({ icon: Icon, ...p }) => (
          <div
            className="flex items-center gap-3 border-line border-b py-3 last:border-0"
            key={p.label}
          >
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-full ${p.tone}`}
            >
              <Icon size={17} strokeWidth={1.9} />
            </span>
            <span className="flex-1 text-[13px] text-ink-soft">{p.label}</span>
            <span className="font-bold text-[15px] text-ink tabular-nums">
              {p.value}
            </span>
            <span
              className={`flex w-12 items-center justify-end gap-0.5 font-semibold text-[12px] tabular-nums ${deltaTone(p.positive)}`}
            >
              {p.positive ? (
                <ArrowUp size={12} strokeWidth={2.6} />
              ) : (
                <ArrowDown size={12} strokeWidth={2.6} />
              )}
              {p.delta}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function AnnouncementsCard() {
  return (
    <Card className="pb-5">
      <CardHeader title="Duyurular" />
      <div className="mt-3 space-y-3 px-5">
        <div className="rounded-[12px] border border-line bg-canvas p-4">
          <div className="flex items-center gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-dealer-tint text-dealer-700">
              <Sparkles size={16} strokeWidth={1.9} />
            </span>
            <span className="font-semibold text-[13.5px] text-ink">
              Nisan kampanyası yayında!
            </span>
          </div>
          <p className="mt-2 text-[12.5px] text-ink-soft leading-5">
            SUV segmentinde %0,99 faiz fırsatını kaçırmayın.
          </p>
          <button
            className="mt-2.5 flex items-center gap-1 font-medium text-[12.5px] text-dealer-700 hover:underline"
            type="button"
          >
            Detayları Gör
            <ArrowUp className="rotate-45" size={13} strokeWidth={2.2} />
          </button>
        </div>

        <div className="flex items-start gap-3 rounded-[12px] border border-line p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-dealer-tint text-dealer-700">
            <Headphones size={19} strokeWidth={1.9} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-[13.5px] text-ink">
              Bayi Destek Hattı
            </div>
            <p className="mt-1 text-[12.5px] text-ink-soft leading-5">
              Her türlü soru ve destek için bize ulaşabilirsiniz.
            </p>
            <button
              className="mt-2.5 flex items-center gap-2 rounded-[10px] bg-dealer px-3.5 py-2 font-semibold text-[13px] text-white hover:bg-dealer-600"
              type="button"
            >
              <Phone size={15} strokeWidth={2} /> Bize Ulaşın
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

const SHELL_PROPS = {
  actions: <DateRangePill />,
  highlight: "Mehmet 👋",
  subtitle: "Bugün 22 Nisan 2025 Salı",
  title: "Günaydın,",
} as const;

export function DealerDashboard() {
  const { data, isPending, isError, refetch } = useDealerHome();

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

  const popularVehicles = buildPopularVehicles(data.popularRaw, data.popularPct);

  return (
    <DealerShell {...SHELL_PROPS}>
      <KpiRow kpis={data.kpis} />

      <div className="mt-5 grid grid-cols-3 gap-5">
        <PipelineCard funnel={data.funnel} />
        <SegmentCard segments={data.segments} />
        <ActivitiesCard activities={data.activities} />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-5">
        <PopularVehiclesCard vehicles={popularVehicles} />
        <PerformanceCard performance={data.performance} />
        <AnnouncementsCard />
      </div>
    </DealerShell>
  );
}
