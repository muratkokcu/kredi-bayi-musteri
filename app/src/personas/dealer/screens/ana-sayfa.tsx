import type { LucideIcon } from "lucide-react";
import {
  ArrowDown,
  ArrowUp,
  CalendarRange,
  Car,
  CheckCircle2,
  ChevronDown,
  Clock,
  Coins,
  Eye,
  FileText,
  Gauge,
  Headphones,
  Info,
  MessageSquare,
  Phone,
  Sparkles,
  Star,
  UserPlus,
  XCircle,
} from "lucide-react";
import { getMarka, getModel } from "@/data/arac-taksonomisi";
import { MiniBar } from "@/ui/badge";
import { Card, CardHeader } from "@/ui/card";
import { FunnelChart } from "@/ui/funnel-chart";
import { KpiCard } from "@/ui/kpi";
import { DealerShell } from "../dealer-shell";

const DEALER_COLOR = "var(--color-dealer)";

interface KpiDef {
  delta: string;
  icon: LucideIcon;
  label: string;
  positive: boolean;
  value: string;
}

const KPIS: KpiDef[] = [
  {
    icon: Sparkles,
    label: "Yeni Fırsatlar",
    value: "48",
    delta: "%20",
    positive: true,
  },
  {
    icon: FileText,
    label: "Bekleyen Teklifler",
    value: "23",
    delta: "%15",
    positive: true,
  },
  {
    icon: CheckCircle2,
    label: "Kabul Edilen Teklifler",
    value: "12",
    delta: "%33",
    positive: true,
  },
  {
    icon: XCircle,
    label: "Reddedilen Teklifler",
    value: "6",
    delta: "%14",
    positive: false,
  },
  {
    icon: Coins,
    label: "Tahmini Kazanç",
    value: "₺1.285.000",
    delta: "%18",
    positive: true,
  },
];

const FUNNEL_STAGES = [
  {
    label: "Fırsat Havuzu",
    sub: "Uygun müşteriler",
    value: "48",
    pct: "%100",
    frac: 1,
  },
  {
    label: "Teklif Oluşturulan",
    sub: "Teklif gönderilen fırsatlar",
    value: "24",
    pct: "%50",
    frac: 0.78,
  },
  {
    label: "İnceleme Aşamasında",
    sub: "Müşterinin incelediği teklifler",
    value: "14",
    pct: "%29",
    frac: 0.58,
  },
  {
    label: "Görüşme Yapılan",
    sub: "Müşteri ile görüşülen fırsatlar",
    value: "12",
    pct: "%25",
    frac: 0.42,
  },
  {
    label: "Kazanılan",
    sub: "Kapanan satışlar",
    value: "9",
    pct: "%19",
    frac: 0.3,
  },
];

interface SegmentDef {
  color: string;
  frac: number;
  label: string;
  value: string;
}

const SEGMENTS: SegmentDef[] = [
  { label: "SUV", value: "%38", frac: 0.38, color: "var(--color-dealer)" },
  { label: "Sedan", value: "%28", frac: 0.28, color: "var(--color-bank)" },
  { label: "Hatchback", value: "%17", frac: 0.17, color: "#f59e0b" },
  { label: "MPV", value: "%9", frac: 0.09, color: "var(--color-cust)" },
  { label: "Diğer", value: "%8", frac: 0.08, color: "#94a3b8" },
];

interface ActivityDef {
  icon: LucideIcon;
  id: string;
  name: string;
  sub: string;
  text: string;
  time: string;
  tone: string;
}

const ACTIVITIES: ActivityDef[] = [
  {
    id: "ahmet",
    icon: CheckCircle2,
    tone: "bg-success-tint text-success",
    name: "Ahmet Yılmaz",
    text: "teklifinizi kabul etti",
    sub: "Volkswagen Tiguan",
    time: "10:24",
  },
  {
    id: "mehmet",
    icon: Eye,
    tone: "bg-dealer-tint text-dealer-700",
    name: "Mehmet Demir",
    text: "teklifinizi görüntüledi",
    sub: "Toyota Corolla · ₺980.000 TL",
    time: "09:48",
  },
  {
    id: "havuz",
    icon: UserPlus,
    tone: "bg-cust-tint text-cust-600",
    name: "Yeni fırsat",
    text: "havuzuna 6 müşteri eklendi",
    sub: "SUV segmenti",
    time: "09:15",
  },
  {
    id: "ayse",
    icon: Phone,
    tone: "bg-warn-tint text-warn",
    name: "Ayşe Kara",
    text: "görüşme kaydı eklendi",
    sub: "İlk görüşme tamamlandı",
    time: "Dün 16:30",
  },
  {
    id: "hakan",
    icon: XCircle,
    tone: "bg-danger-tint text-danger",
    name: "Hakan Şahin",
    text: "teklifinizi reddetti",
    sub: "Peugeot 3008 · ₺1.150.000 TL",
    time: "Dün 14:22",
  },
];

interface VehicleDef {
  marka: string;
  model: string;
  pct: number;
  sayisi: number;
}

const POPULAR_RAW: VehicleDef[] = [
  { marka: "volkswagen", model: "tiguan", sayisi: 8, pct: 100 },
  { marka: "toyota", model: "corolla", sayisi: 7, pct: 88 },
  { marka: "peugeot", model: "3008", sayisi: 6, pct: 75 },
  { marka: "renault", model: "clio", sayisi: 5, pct: 63 },
  { marka: "hyundai", model: "i20", sayisi: 4, pct: 50 },
];

const POPULAR_PCT: Record<string, string> = {
  tiguan: "%22",
  corolla: "%19",
  "3008": "%17",
  clio: "%14",
  i20: "%11",
};

interface PopularVehicle {
  pct: number;
  pctLabel: string;
  sayisi: number;
  title: string;
}

const POPULAR_VEHICLES: PopularVehicle[] = POPULAR_RAW.map((v) => {
  const marka = getMarka(v.marka);
  const model = getModel(v.marka, v.model);
  const markaAd = marka?.marka ?? v.marka;
  const modelAd = model?.model ?? v.model;
  return {
    title: `${markaAd} ${modelAd}`,
    sayisi: v.sayisi,
    pct: v.pct,
    pctLabel: POPULAR_PCT[v.model] ?? "",
  };
});

interface PerfDef {
  delta: string;
  icon: LucideIcon;
  label: string;
  positive: boolean;
  tone: string;
  value: string;
}

const PERFORMANCE: PerfDef[] = [
  {
    icon: MessageSquare,
    tone: "bg-dealer-tint text-dealer-700",
    label: "Teklif Gönderim Oranı",
    value: "%50",
    delta: "%8",
    positive: true,
  },
  {
    icon: Phone,
    tone: "bg-success-tint text-success",
    label: "Görüşme Oranı",
    value: "%37",
    delta: "%5",
    positive: true,
  },
  {
    icon: Clock,
    tone: "bg-warn-tint text-warn",
    label: "Kapanış Oranı",
    value: "%25",
    delta: "%6",
    positive: true,
  },
  {
    icon: Gauge,
    tone: "bg-danger-tint text-danger",
    label: "Ortalama Kapanış Süresi",
    value: "18 gün",
    delta: "%2",
    positive: false,
  },
  {
    icon: Star,
    tone: "bg-dealer-tint text-dealer-700",
    label: "Müşteri Memnuniyeti",
    value: "4.6 / 5",
    delta: "%0,3",
    positive: true,
  },
];

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

function KpiRow() {
  return (
    <div className="grid grid-cols-5 gap-4">
      {KPIS.map((k) => (
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

function PipelineCard() {
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
        <FunnelChart color={DEALER_COLOR} stages={FUNNEL_STAGES} />
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

function SegmentDonut() {
  const size = 168;
  const stroke = 24;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
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
        {SEGMENTS.map((s) => {
          const dash = s.frac * c;
          const offset = acc * c;
          acc += s.frac;
          return (
            <circle
              cx={size / 2}
              cy={size / 2}
              fill="none"
              key={s.label}
              r={r}
              stroke={s.color}
              strokeDasharray={`${dash - 3} ${c - dash + 3}`}
              strokeDashoffset={-offset}
              strokeWidth={stroke}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
        })}
      </svg>
      <span className="absolute flex flex-col items-center">
        <span className="text-[11px] text-ink-muted">Toplam</span>
        <span className="font-bold text-[26px] text-ink leading-7 tracking-tight">
          48
        </span>
        <span className="text-[11px] text-ink-muted">Fırsat</span>
      </span>
    </span>
  );
}

function SegmentCard() {
  return (
    <Card className="pb-1">
      <CardHeader title="Segment Dağılımı" />
      <div className="mt-3 flex items-center gap-5 px-5">
        <SegmentDonut />
        <div className="flex-1">
          {SEGMENTS.map((s) => (
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

function ActivitiesCard() {
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
        {ACTIVITIES.map(({ icon: Icon, ...a }) => (
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

function PopularVehiclesCard() {
  return (
    <Card className="pb-4">
      <CardHeader title="En Çok İlgi Gören Araçlar" />
      <div className="mt-3 px-5">
        {POPULAR_VEHICLES.map((v, i) => (
          <div
            className="flex items-center gap-3 border-line border-b py-3 last:border-0"
            key={v.title}
          >
            <span className="w-4 shrink-0 text-center font-bold text-[13px] text-ink-muted tabular-nums">
              {i + 1}
            </span>
            <span className="flex h-8 w-11 shrink-0 items-center justify-center rounded-md bg-canvas text-ink-muted">
              <Car size={16} strokeWidth={1.8} />
            </span>
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

function PerformanceCard() {
  return (
    <Card className="pb-2">
      <CardHeader
        action={<PeriodSelect label="Bu Ay" />}
        title="Performans Özeti"
      />
      <div className="mt-3 px-5">
        {PERFORMANCE.map(({ icon: Icon, ...p }) => (
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

export function DealerDashboard() {
  return (
    <DealerShell
      actions={<DateRangePill />}
      highlight="Mehmet 👋"
      subtitle="Bugün 22 Nisan 2025 Salı"
      title="Günaydın,"
    >
      <KpiRow />

      <div className="mt-5 grid grid-cols-3 gap-5">
        <PipelineCard />
        <SegmentCard />
        <ActivitiesCard />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-5">
        <PopularVehiclesCard />
        <PerformanceCard />
        <AnnouncementsCard />
      </div>
    </DealerShell>
  );
}
