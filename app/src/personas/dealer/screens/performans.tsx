import {
  ArrowRight,
  ArrowUp,
  CalendarRange,
  ChevronDown,
  CircleCheck,
  Clock,
  Coins,
  Download,
  FileSignature,
  FileText,
  Percent,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import type { ReactNode } from "react";
import { AreaChart } from "@/ui/area-chart";
import { MiniBar } from "@/ui/badge";
import { Card, CardHeader } from "@/ui/card";
import { FunnelChart } from "@/ui/funnel-chart";
import { StatCard } from "@/ui/stat-card";
import { DealerShell } from "../dealer-shell";

interface Kpi {
  delta: string;
  icon: ReactNode;
  label: string;
  tone: "dealer" | "cust" | "warn" | "teal" | "bank";
  value: string;
}

const KPIS: Kpi[] = [
  {
    icon: <FileText size={20} strokeWidth={1.9} />,
    label: "Toplam Teklif",
    value: "128",
    delta: "%18,5",
    tone: "dealer",
  },
  {
    icon: <CircleCheck size={20} strokeWidth={1.9} />,
    label: "Kazanılan Teklif",
    value: "32",
    delta: "%23,1",
    tone: "teal",
  },
  {
    icon: <Percent size={20} strokeWidth={1.9} />,
    label: "Kazanma Oranı",
    value: "%25,0",
    delta: "%3,2",
    tone: "cust",
  },
  {
    icon: <Coins size={20} strokeWidth={1.9} />,
    label: "Toplam Teklif Tutarı",
    value: "₺28.450.000",
    delta: "%21,7",
    tone: "warn",
  },
  {
    icon: <ShoppingCart size={20} strokeWidth={1.9} />,
    label: "Kapanan Satışlar",
    value: "18",
    delta: "%12,5",
    tone: "bank",
  },
  {
    icon: <Wallet size={20} strokeWidth={1.9} />,
    label: "Toplam Kazanç",
    value: "₺3.240.000",
    delta: "%15,8",
    tone: "dealer",
  },
];

const FUNNEL_STAGES = [
  { label: "Toplam Teklif", value: "128", pct: "%100", frac: 1 },
  { label: "Görüntülenen Teklif", value: "68", pct: "%53,1", frac: 0.78 },
  { label: "Görüşme Aşamasındaki", value: "42", pct: "%32,8", frac: 0.58 },
  { label: "Kabul Edilen", value: "32", pct: "%25,0", frac: 0.4 },
  { label: "Kapanan Satış", value: "18", pct: "%14,1", frac: 0.24 },
];

const TREND_LABELS = ["1 May", "8 May", "15 May", "22 May", "31 May"];

const OFFER_TREND = [
  15, 19, 18, 25, 26, 28, 27, 22, 20, 25, 26, 23, 31, 36, 32, 25, 25, 25, 31,
];

const SALES_TREND = [
  3, 5, 6, 9, 11, 10, 9, 7, 6, 8, 9, 8, 13, 18, 15, 11, 11, 12, 15,
];

const OFFER_LABELS = [
  "1 May",
  "",
  "",
  "8 May",
  "",
  "",
  "15 May",
  "",
  "",
  "22 May",
  "",
  "",
  "",
  "",
  "",
  "31 May",
  "",
  "",
  "",
];

const OFFER_TICKS = ["40", "30", "20", "10", "0"];

interface StatusRow {
  color: string;
  count: string;
  label: string;
  pct: string;
}

const STATUS: StatusRow[] = [
  { label: "Taslak", count: "22", pct: "%17,2", color: "#94a3b8" },
  {
    label: "Gönderildi",
    count: "48",
    pct: "%37,5",
    color: "var(--color-dealer)",
  },
  { label: "Görüntülendi", count: "26", pct: "%20,3", color: "#16a34a" },
  { label: "Görüşme", count: "16", pct: "%12,5", color: "#f59e0b" },
  { label: "Kabul", count: "10", pct: "%7,8", color: "#84cc16" },
  { label: "Reddedildi", count: "6", pct: "%4,7", color: "#ef4444" },
];

interface SegmentRow {
  kapanan: number;
  oran: string;
  pct: number;
  segment: string;
  teklif: number;
  yanit: string;
}

const SEGMENTS: SegmentRow[] = [
  {
    segment: "SUV",
    teklif: 54,
    oran: "%27,8",
    yanit: "2,1 saat",
    kapanan: 15,
    pct: 100,
  },
  {
    segment: "Sedan",
    teklif: 38,
    oran: "%21,9",
    yanit: "2,6 saat",
    kapanan: 11,
    pct: 73,
  },
  {
    segment: "Hatchback",
    teklif: 18,
    oran: "%22,2",
    yanit: "3,1 saat",
    kapanan: 6,
    pct: 40,
  },
  {
    segment: "Ticari",
    teklif: 14,
    oran: "%28,6",
    yanit: "1,8 saat",
    kapanan: 4,
    pct: 27,
  },
  {
    segment: "Diğer",
    teklif: 10,
    oran: "%10,0",
    yanit: "4,2 saat",
    kapanan: 1,
    pct: 9,
  },
];

interface AdvisorRow {
  ad: string;
  initials: string;
  kapanan: number;
  oran: string;
  pct: number;
  teklif: number;
  tone: string;
}

const ADVISORS: AdvisorRow[] = [
  {
    ad: "Mehmet Kaya",
    initials: "MK",
    teklif: 34,
    oran: "%29,4",
    kapanan: 10,
    pct: 100,
    tone: "bg-dealer-tint text-dealer-700",
  },
  {
    ad: "Ayşe Yılmaz",
    initials: "AY",
    teklif: 28,
    oran: "%25,0",
    kapanan: 7,
    pct: 70,
    tone: "bg-cust-tint text-cust-600",
  },
  {
    ad: "Burak Demir",
    initials: "BD",
    teklif: 24,
    oran: "%20,8",
    kapanan: 5,
    pct: 50,
    tone: "bg-bank-tint text-bank-700",
  },
  {
    ad: "Selin Arslan",
    initials: "SA",
    teklif: 22,
    oran: "%18,2",
    kapanan: 4,
    pct: 40,
    tone: "bg-warn-tint text-warn",
  },
  {
    ad: "Onur Güngör",
    initials: "OG",
    teklif: 20,
    oran: "%15,0",
    kapanan: 3,
    pct: 30,
    tone: "bg-dealer-tint text-dealer-700",
  },
];

interface VehicleRow {
  ad: string;
  oran: string;
  rank: number;
  teklif: string;
}

const VEHICLES: VehicleRow[] = [
  { rank: 1, ad: "Volkswagen Tiguan", teklif: "45 teklif", oran: "%25,8" },
  { rank: 2, ad: "Toyota Corolla", teklif: "28 teklif", oran: "%16,1" },
  { rank: 3, ad: "Peugeot 3008", teklif: "22 teklif", oran: "%12,6" },
  { rank: 4, ad: "Honda Civic", teklif: "18 teklif", oran: "%10,3" },
  { rank: 5, ad: "Renault Clio", teklif: "15 teklif", oran: "%8,6" },
];

function KpiRow() {
  return (
    <div className="grid grid-cols-6 gap-4">
      {KPIS.map((k) => (
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

function FunnelCard() {
  return (
    <Card className="flex flex-col pb-0">
      <CardHeader title="Tekliften Satışa Dönüşüm Hunisi" />
      <div className="mt-5 px-5">
        <FunnelChart color="var(--color-dealer)" stages={FUNNEL_STAGES} />
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

function TrendCard() {
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
            data={SALES_TREND}
            height={236}
            labels={OFFER_LABELS}
            yTicks={OFFER_TICKS}
          />
        </div>
        <AreaChart
          color="var(--color-dealer)"
          data={OFFER_TREND}
          height={236}
          labels={TREND_LABELS}
          yTicks={OFFER_TICKS}
        />
      </div>
    </Card>
  );
}

/** Inline hand-drawn donut for Tekliflerin Durum Dağılımı with centered total. */
function StatusDonut() {
  const size = 150;
  const stroke = 20;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const fracs = [0.172, 0.375, 0.203, 0.125, 0.078, 0.047];
  let acc = 0;
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
        {fracs.map((f, i) => {
          const dash = f * c;
          const offset = acc * c;
          acc += f;
          return (
            <circle
              cx={size / 2}
              cy={size / 2}
              fill="none"
              key={STATUS[i].label}
              r={r}
              stroke={STATUS[i].color}
              strokeDasharray={`${dash - 3} ${c - dash + 3}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              strokeWidth={stroke}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
        })}
      </svg>
      <span className="absolute flex flex-col items-center">
        <span className="text-[11px] text-ink-muted">Toplam</span>
        <span className="font-bold text-[24px] text-ink leading-7 tracking-tight">
          128
        </span>
      </span>
    </span>
  );
}

function StatusCard() {
  return (
    <Card className="pb-5">
      <CardHeader title="Tekliflerin Durum Dağılımı" />
      <div className="mt-3 flex items-center gap-5 px-5">
        <StatusDonut />
        <div className="flex-1">
          {STATUS.map((s) => (
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

function SegmentCard() {
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
        {SEGMENTS.map((s) => (
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

function AdvisorCard() {
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
        {ADVISORS.map((a) => (
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
  const w = 120;
  const h = 36;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const path = points
    .map((p, i) => {
      const x = (w * i) / (points.length - 1);
      const y = h - 4 - ((h - 8) * (p - min)) / (max - min);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
  return (
    <svg
      aria-hidden="true"
      className="shrink-0"
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      width={w}
    >
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );
}

interface SpeedStat {
  color: string;
  delta: string;
  icon: ReactNode;
  label: string;
  tint: string;
  value: string;
}

const SPEED_STATS: SpeedStat[] = [
  {
    label: "Ortalama Yanıt Süresi",
    value: "2,4 saat",
    delta: "%0,4 daha hızlı",
    icon: <Clock size={20} strokeWidth={1.9} />,
    color: "var(--color-dealer)",
    tint: "bg-dealer-tint text-dealer-700",
  },
  {
    label: "Ortalama Kredi Onay Süresi",
    value: "4,2 saat",
    delta: "%1,1 daha hızlı",
    icon: <FileSignature size={20} strokeWidth={1.9} />,
    color: "#7c3aed",
    tint: "bg-[#f1ebfd] text-[#7c3aed]",
  },
];

function SpeedCard({ stat }: { stat: SpeedStat }) {
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

function VehicleCard() {
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
        {VEHICLES.map((v) => (
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

export function DealerPerformans() {
  return (
    <DealerShell
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
      }
      breadcrumb={["Performans", "Analitik"]}
      subtitle="Satış performansınızı analiz edin, hedeflerinizi takip edin ve işinizi büyütün."
      title="Performans & Analitik"
    >
      <KpiRow />

      <div className="mt-5 grid grid-cols-3 gap-5">
        <FunnelCard />
        <TrendCard />
        <StatusCard />
      </div>

      <div className="mt-5 grid grid-cols-[1fr_1fr_0.92fr] gap-5">
        <SegmentCard />
        <AdvisorCard />
        <div className="flex flex-col gap-5">
          {SPEED_STATS.map((s) => (
            <SpeedCard key={s.label} stat={s} />
          ))}
          <TargetCard />
        </div>
      </div>

      <div className="mt-5">
        <VehicleCard />
      </div>
    </DealerShell>
  );
}
