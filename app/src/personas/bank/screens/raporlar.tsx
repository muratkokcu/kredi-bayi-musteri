import {
  ArrowUp,
  CalendarRange,
  Car,
  ChevronDown,
  CircleCheck,
  CreditCard,
  FileText,
} from "lucide-react";
import { lazy, type ReactNode, Suspense } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Reports, ReportSegment } from "@/data/reports";
import type { Bolge } from "@/data/turkiye-bolge";
import { useReports } from "@/queries/reports";
import { AreaChart } from "@/ui/area-chart";
import { ErrorState, LoadingState } from "@/ui/async-states";
import { Card, CardHeader } from "@/ui/card";
import { FunnelChart } from "@/ui/funnel-chart";
import { ScoreRing } from "@/ui/score-ring";
import { StatCard } from "@/ui/stat-card";
import { BankShell } from "../bank-shell";

// Lazy-loaded so the Türkiye GeoJSON + d3-geo land in a separate chunk,
// fetched only when Raporlar is opened (keeps them out of the main bundle).
const TurkeyChoropleth = lazy(() =>
  import("@/ui/turkey-choropleth").then((m) => ({
    default: m.TurkeyChoropleth,
  }))
);

// Report figures (KPIs, trend, segments, funnel, dealers, regions, period) are
// server data fetched via useReports(); see src/data/reports.ts. Presentation
// below (KPI icons/tones, segment chart colors, tab labels) stays inline.

/** KPI icon + tone, keyed by label and merged onto the fetched KPI rows. */
const KPI_PRESENTATION: Record<
  string,
  { icon: ReactNode; tone: "bank" | "dealer" | "cust" | "warn" | "teal" }
> = {
  "Yenileme Oranı": {
    icon: (
      <ScoreRing
        color="currentColor"
        showValue={false}
        size={26}
        stroke={4}
        trackColor="color-mix(in oklab, currentColor 22%, transparent)"
        value={33}
      />
    ),
    tone: "teal",
  },
  "Toplam Uygun Müşteri": {
    icon: <Car size={20} strokeWidth={1.9} />,
    tone: "bank",
  },
  "Teklif Gönderilen": {
    icon: <FileText size={20} strokeWidth={1.9} />,
    tone: "warn",
  },
  "Kabul Edilen": {
    icon: <CircleCheck size={20} strokeWidth={1.9} />,
    tone: "cust",
  },
  "Toplam Hacim": {
    icon: <CreditCard size={20} strokeWidth={1.9} />,
    tone: "dealer",
  },
};

/** Segment chart color, keyed by segment label (presentation only). */
const SEGMENT_COLORS: Record<string, string> = {
  SUV: "var(--color-bank)",
  Sedan: "var(--color-dealer)",
  Hatchback: "#f59e0b",
  MPV: "#f59e0b",
  Diğer: "var(--color-cust)",
};

const TABS = [
  { id: "genel", label: "Genel Bakış" },
  { id: "yenileme", label: "Yenileme Performansı" },
  { id: "segment", label: "Segment Analizi" },
  { id: "bayi", label: "Bayi Performansı" },
  { id: "musteri", label: "Müşteri Analizi" },
];

function regionTone(oran: number): string {
  if (oran >= 40) {
    return "bg-bank";
  }
  if (oran >= 30) {
    return "bg-bank-600/70";
  }
  if (oran >= 20) {
    return "bg-bank/45";
  }
  return "bg-bank/20";
}

function KpiRow({ kpis }: { kpis: Reports["kpis"] }) {
  return (
    <div className="grid grid-cols-5 gap-4">
      {kpis.map((k) => (
        <StatCard
          icon={KPI_PRESENTATION[k.label].icon}
          key={k.label}
          label={k.label}
          sub={
            <span className="flex items-center gap-1">
              <span className="text-ink-muted">Önceki döneme göre</span>
              <span className="inline-flex items-center gap-0.5 font-semibold text-success">
                <ArrowUp size={12} strokeWidth={2.6} />
                {k.delta}
              </span>
            </span>
          }
          tone={KPI_PRESENTATION[k.label].tone}
          value={k.value}
        />
      ))}
    </div>
  );
}

/** Tooltip for the segment donut: segment name + its yenileme oranı value. */
function DonutTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name?: string; payload?: { display?: string } }[];
}) {
  if (!(active && payload && payload.length > 0)) {
    return null;
  }
  const slice = payload[0];
  return (
    <div className="rounded-lg border border-line-strong bg-surface px-2.5 py-1.5 shadow-[var(--shadow-pop)]">
      <div className="text-[11px] text-ink-muted">{slice.name}</div>
      <div className="font-bold text-[13px] text-ink tabular-nums">
        {slice.payload?.display}
      </div>
    </div>
  );
}

/** Recharts donut for segment dağılımı, centered overall figure. */
function SegmentDonut({ segments }: { segments: ReportSegment[] }) {
  // Same proportions as the previous hand-drawn donut.
  const fracs = [0.27, 0.23, 0.18, 0.17, 0.15];
  const chartData = segments.map((s, i) => ({
    name: s.label,
    value: fracs[i],
    display: s.value,
  }));

  return (
    <div className="relative shrink-0" style={{ width: 168, height: 168 }}>
      <ResponsiveContainer height={168} width={168}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            innerRadius={56}
            outerRadius={80}
            paddingAngle={2}
            stroke="none"
          >
            {segments.map((s) => (
              <Cell fill={SEGMENT_COLORS[s.label]} key={s.label} />
            ))}
          </Pie>
          <Tooltip content={<DonutTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold text-[24px] text-ink leading-6 tracking-tight">
          %32,6
        </span>
        <span className="mt-0.5 text-[11px] text-ink-muted">
          Genel Ortalama
        </span>
      </span>
    </div>
  );
}

function SegmentCard({ segments }: { segments: ReportSegment[] }) {
  return (
    <Card className="pb-5">
      <CardHeader title="Segment Bazlı Yenileme Oranı" />
      <div className="mt-3 flex items-center gap-6 px-5">
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
                  style={{ background: SEGMENT_COLORS[s.label] }}
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
    </Card>
  );
}

function TrendCard({
  trend,
  twoSeries = false,
}: {
  trend: Reports["trend"];
  twoSeries?: boolean;
}) {
  return (
    <Card className="pb-3">
      <CardHeader
        action={
          <button
            className="flex items-center gap-1.5 rounded-[10px] border border-line-strong bg-surface px-3 py-1.5 font-medium text-[12.5px] text-ink-soft"
            type="button"
          >
            Son 12 Ay <ChevronDown size={14} />
          </button>
        }
        title={
          twoSeries ? "Yenileme Oranı Trendi" : "Aylık Yenileme Oranı Trendi"
        }
      />
      {twoSeries && (
        <div className="mt-3 flex items-center gap-4 px-5 text-[12px]">
          <span className="flex items-center gap-1.5 text-ink-soft">
            <span className="size-2.5 rounded-full bg-bank" /> Yenileme Oranı
          </span>
          <span className="flex items-center gap-1.5 text-ink-muted">
            <span className="size-2.5 rounded-full bg-cust" /> Önceki Dönem
          </span>
        </div>
      )}
      <div className="px-2 pt-2">
        <AreaChart
          color="var(--color-bank)"
          data={trend.data}
          height={236}
          highlight={11}
          highlightLabel="Nis 2025"
          highlightValue="%32,6"
          labels={trend.labels}
          yTicks={trend.ticks}
        />
      </div>
    </Card>
  );
}

function FunnelCard({ funnel }: { funnel: Reports["funnel"] }) {
  return (
    <Card className="pb-5">
      <CardHeader title="Yenileme Hunisi" />
      <div className="mt-4 px-5">
        <FunnelChart stages={funnel} />
      </div>
    </Card>
  );
}

function BayiTableCard({ bayiler }: { bayiler: Reports["bayiler"] }) {
  return (
    <Card className="pb-5">
      <CardHeader
        title={
          <span>
            Bayi Performansı{" "}
            <span className="font-normal text-ink-muted">(Top 5)</span>
          </span>
        }
      />
      <div className="mt-3 px-5">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-3 border-line border-b pb-2 font-semibold text-[11px] text-ink-muted uppercase tracking-wide">
          <span>Bayi Adı</span>
          <span className="text-right">Teklif Gönderilen</span>
          <span className="text-right">Kabul Oranı</span>
          <span className="text-right">Yenileme Hacmi</span>
        </div>
        {bayiler.map((b) => (
          <div
            className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-3 border-line border-b py-3 last:border-0"
            key={b.ad}
          >
            <span className="font-semibold text-[13px] text-ink">{b.ad}</span>
            <span className="text-right text-[12.5px] text-ink-soft tabular-nums">
              {b.teklif}
            </span>
            <span className="text-right text-[12.5px] text-ink-soft tabular-nums">
              {b.oran}
            </span>
            <span className="text-right font-medium text-[12.5px] text-ink tabular-nums">
              {b.hacim}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/** Styled Türkiye region heatmap placeholder — region list with colored dots. */
function RegionCard({ regions }: { regions: Reports["regions"] }) {
  const ratesByRegion = Object.fromEntries(
    regions.map((r) => [r.bolge, r.oran])
  ) as Record<Bolge, number>;
  return (
    <Card className="pb-5">
      <CardHeader
        subtitle="81 il, bağlı olduğu coğrafi bölgenin yenileme oranıyla renklenir."
        title="Bölge Bazlı Yenileme Oranı"
      />
      <div className="mt-4 flex gap-5 px-5">
        <div className="flex-1">
          <Suspense
            fallback={
              <div className="flex h-44 items-center justify-center rounded-xl bg-canvas text-[12px] text-ink-muted">
                Harita yükleniyor…
              </div>
            }
          >
            <TurkeyChoropleth ratesByRegion={ratesByRegion} />
          </Suspense>
        </div>
        <div className="w-[200px] shrink-0">
          {regions.map((r) => (
            <div
              className="flex items-center justify-between border-line border-b py-2 last:border-0"
              key={r.bolge}
            >
              <span className="flex items-center gap-2 text-[12.5px] text-ink-soft">
                <span
                  className={`size-2.5 rounded-full ${regionTone(r.oran)}`}
                />
                {r.bolge}
              </span>
              <span className="font-semibold text-[12.5px] text-ink tabular-nums">
                %{r.oran.toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function DonemCard({ donem }: { donem: Reports["donem"] }) {
  return (
    <Card className="pb-5">
      <CardHeader title="Dönemsel Karşılaştırma" />
      <div className="mt-3 px-5">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_0.8fr] gap-3 border-line border-b pb-2 font-semibold text-[11px] text-ink-muted uppercase tracking-wide">
          <span>Gösterge</span>
          <span className="text-right">Seçili Dönem</span>
          <span className="text-right">Önceki Dönem</span>
          <span className="text-right">Değişim</span>
        </div>
        {donem.map((d) => (
          <div
            className="grid grid-cols-[1.4fr_1fr_1fr_0.8fr] items-center gap-3 border-line border-b py-3 last:border-0"
            key={d.gosterge}
          >
            <span className="font-medium text-[13px] text-ink">
              {d.gosterge}
            </span>
            <span className="text-right font-semibold text-[12.5px] text-ink tabular-nums">
              {d.secili}
            </span>
            <span className="text-right text-[12.5px] text-ink-soft tabular-nums">
              {d.oncki}
            </span>
            <span className="flex items-center justify-end gap-0.5 font-semibold text-[12.5px] text-success tabular-nums">
              <ArrowUp size={12} strokeWidth={2.6} />
              {d.degisim}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function BayiOranCard({ bayiOran }: { bayiOran: Reports["bayiOran"] }) {
  return (
    <Card className="pb-5">
      <CardHeader
        title={
          <span>
            Bayi Bazlı Yenileme Oranı{" "}
            <span className="font-normal text-ink-muted">(Top 5)</span>
          </span>
        }
      />
      <div className="mt-4 flex flex-col gap-3.5 px-5">
        {bayiOran.map((b) => (
          <div key={b.ad}>
            <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
              <span className="font-medium text-ink">{b.ad}</span>
              <span className="font-semibold text-ink tabular-nums">
                {b.oran}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-bank"
                style={{ width: `${b.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

const REPORT_NOTE =
  "Raporlar her gün 03:00'da güncellenir. Tüm veriler KVKK kapsamında anonimleştirilmiş ve toplulaştırılmıştır.";

export function BankRaporlar() {
  const { data, isPending, isError, refetch } = useReports();

  return (
    <BankShell
      actions={
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
                01.04.2025 - 22.04.2025
              </span>
            </span>
          </button>
          <button
            className="flex items-center gap-2 rounded-[10px] bg-bank px-3.5 py-2 font-semibold text-[13px] text-white hover:bg-bank-600"
            type="button"
          >
            <FileText size={16} /> Dışa Aktar
            <ChevronDown size={14} />
          </button>
        </>
      }
      breadcrumb={["Raporlar", "Genel Bakış"]}
      subtitle="Portföy ve yenileme performansınızı detaylı raporlarla analiz edin."
      title="Raporlar"
    >
      {isPending && <LoadingState label="Raporlar yükleniyor…" />}
      {!isPending && (isError || !data) && (
        <ErrorState label="Raporlar yüklenemedi." onRetry={() => refetch()} />
      )}
      {!isPending && !isError && data && (
        <>
          <Tabs className="gap-0" defaultValue="genel">
            <TabsList
              className="mb-5 h-auto w-full justify-start gap-6 border-line border-b p-0"
              variant="line"
            >
              {TABS.map((t) => (
                <TabsTrigger
                  className="flex-none px-0 pb-3 text-[13.5px] text-ink-muted after:bottom-[-1px] after:h-0.5 after:bg-bank data-[state=active]:font-semibold data-[state=active]:text-bank-700 data-[state=active]:after:opacity-100"
                  key={t.id}
                  value={t.id}
                >
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* GENEL BAKIŞ */}
            <TabsContent className="mt-0" value="genel">
              <KpiRow kpis={data.kpis} />
              <div className="mt-5 grid grid-cols-[1.7fr_1fr] gap-5">
                <TrendCard trend={data.trend} />
                <SegmentCard segments={data.segments} />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-5">
                <FunnelCard funnel={data.funnel} />
                <BayiTableCard bayiler={data.bayiler} />
                <RegionCard regions={data.regions} />
              </div>
            </TabsContent>

            {/* YENİLEME PERFORMANSI */}
            <TabsContent className="mt-0" value="yenileme">
              <KpiRow kpis={data.kpis} />
              <div className="mt-5 grid grid-cols-[1.7fr_1fr] gap-5">
                <TrendCard trend={data.trend} twoSeries />
                <FunnelCard funnel={data.funnel} />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-5">
                <DonemCard donem={data.donem} />
                <SegmentCard segments={data.segments} />
                <BayiOranCard bayiOran={data.bayiOran} />
              </div>
            </TabsContent>

            {/* SEGMENT ANALİZİ */}
            <TabsContent className="mt-0" value="segment">
              <KpiRow kpis={data.kpis} />
              <div className="mt-5 grid grid-cols-2 gap-5">
                <SegmentCard segments={data.segments} />
                <TrendCard trend={data.trend} />
              </div>
            </TabsContent>

            {/* BAYİ PERFORMANSI */}
            <TabsContent className="mt-0" value="bayi">
              <KpiRow kpis={data.kpis} />
              <div className="mt-5 grid grid-cols-[1.4fr_1fr] gap-5">
                <BayiTableCard bayiler={data.bayiler} />
                <BayiOranCard bayiOran={data.bayiOran} />
              </div>
            </TabsContent>

            {/* MÜŞTERİ ANALİZİ */}
            <TabsContent className="mt-0" value="musteri">
              <KpiRow kpis={data.kpis} />
              <div className="mt-5 grid grid-cols-[1.7fr_1fr] gap-5">
                <TrendCard trend={data.trend} />
                <FunnelCard funnel={data.funnel} />
              </div>
            </TabsContent>
          </Tabs>

          <p className="mt-6 text-[12px] text-ink-muted">{REPORT_NOTE}</p>
        </>
      )}
    </BankShell>
  );
}
