import {
  ArrowRight,
  Check,
  CircleDollarSign,
  Clock,
  Eye,
  FileText,
  LayoutGrid,
  List,
  Mail,
  MessageCircle,
  MessagesSquare,
  MoreHorizontal,
  Phone,
  PhoneCall,
  Plus,
  SlidersHorizontal,
  Trophy,
} from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Column, OfferCard } from "@/data/dealer-offers";
import { useDealerOffers } from "@/queries/dealer-offers";
import { EmptyState, ErrorState, LoadingState } from "@/ui/async-states";
import { Card, CardHeader } from "@/ui/card";
import { ScoreRing } from "@/ui/score-ring";
import { StatCard } from "@/ui/stat-card";
import { DealerShell } from "../dealer-shell";

// ---------------------------------------------------------------------------
// KPI ROW
// ---------------------------------------------------------------------------

interface Kpi {
  icon: ReactNode;
  label: string;
  sub: string;
  tone: "dealer" | "warn" | "teal" | "cust" | "bank";
  value: string;
}

const KPIS: Kpi[] = [
  {
    icon: <FileText size={20} strokeWidth={1.9} />,
    label: "Toplam Teklif",
    value: "48",
    sub: "Tüm zamanlar",
    tone: "dealer",
  },
  {
    icon: <CircleDollarSign size={20} strokeWidth={1.9} />,
    label: "Toplam Teklif Tutarı",
    value: "₺12.450.000",
    sub: "Tüm zamanlar",
    tone: "bank",
  },
  {
    icon: (
      <ScoreRing
        color="currentColor"
        showValue={false}
        size={26}
        stroke={4}
        trackColor="color-mix(in oklab, currentColor 22%, transparent)"
        value={32}
      />
    ),
    label: "Kazanma Oranı",
    value: "%32",
    sub: "Son 30 gün",
    tone: "teal",
  },
  {
    icon: <Clock size={20} strokeWidth={1.9} />,
    label: "Ortalama Yanıt Süresi",
    value: "2,4 saat",
    sub: "Son 30 gün",
    tone: "warn",
  },
  {
    icon: <Trophy size={20} strokeWidth={1.9} />,
    label: "Kapanan Satışlar",
    value: "15",
    sub: "Son 30 gün",
    tone: "cust",
  },
  {
    icon: <CircleDollarSign size={20} strokeWidth={1.9} />,
    label: "Toplam Kazanç (Tahmini)",
    value: "₺2.980.000",
    sub: "Son 30 gün",
    tone: "dealer",
  },
];

// ---------------------------------------------------------------------------
// KANBAN BOARD
// ---------------------------------------------------------------------------

// Column type + seed live in src/data/dealer-offers.ts; rows arrive via
// useDealerOffers(). The stage filter options are derived from those rows.

interface StageOption {
  id: string;
  title: string;
}

/** Stage filter options come from the loaded pipeline columns. */
function buildFilters(columns: Column[]): StageOption[] {
  return columns.map((c) => ({ id: c.id, title: c.title }));
}

function columnFooterLabel(col: Column): string {
  if (col.id === "taslak") {
    return "+ Yeni Teklif";
  }
  return `Tümünü Gör (${col.count})`;
}

type SortKey = "guncelleme" | "tutar" | "musteri";

const SORTS: { id: SortKey; label: string }[] = [
  { id: "guncelleme", label: "Son Güncelleme" },
  { id: "tutar", label: "Teklif Tutarı" },
  { id: "musteri", label: "Müşteri Adı" },
];

const DIGITS_RE = /\D/g;

function amountNum(amount: string): number {
  return Number.parseInt(amount.replace(DIGITS_RE, ""), 10) || 0;
}

function sortCards<T extends OfferCard>(cards: T[], by: SortKey): T[] {
  if (by === "tutar") {
    return [...cards].sort((a, b) => amountNum(b.amount) - amountNum(a.amount));
  }
  if (by === "musteri") {
    return [...cards].sort((a, b) =>
      a.customer.localeCompare(b.customer, "tr")
    );
  }
  return cards;
}

interface ListRow extends OfferCard {
  stageDot: string;
  stageId: string;
  stageTitle: string;
}

const LIST_HEADERS = [
  { key: "musteri", label: "Müşteri" },
  { key: "arac", label: "Araç" },
  { key: "tutar", label: "Teklif Tutarı" },
  { key: "asama", label: "Aşama" },
  { key: "durum", label: "Durum" },
  { key: "actions", label: "" },
];

function ListView({ rows }: { rows: ListRow[] }) {
  if (rows.length === 0) {
    return (
      <Card className="mt-4 py-16 text-center text-[13px] text-ink-muted">
        Seçili aşamalarda teklif bulunmuyor.
      </Card>
    );
  }
  return (
    <Card className="mt-4 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-canvas/60">
            {LIST_HEADERS.map((h) => (
              <th
                className="px-4 py-2.5 text-left font-semibold text-[11px] text-ink-muted uppercase tracking-wide first:pl-5"
                key={h.key}
              >
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr className="border-line border-t hover:bg-canvas/50" key={r.id}>
              <td className="px-4 py-3 pl-5">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex size-8 items-center justify-center rounded-full font-bold text-[11px] ${r.avatarTone}`}
                  >
                    {r.initials}
                  </span>
                  <span className="font-semibold text-[13px] text-ink">
                    {r.customer}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-[13px] text-ink-soft">
                {r.vehicle}
              </td>
              <td className="px-4 py-3 font-bold text-[13px] text-dealer-700 tabular-nums">
                {r.amount}
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-canvas px-2.5 py-1 font-medium text-[11.5px] text-ink-soft">
                  <span className={`size-2 rounded-full ${r.stageDot}`} />
                  {r.stageTitle}
                </span>
              </td>
              <td className="px-4 py-3 text-[11.5px] text-ink-muted">
                {r.status}
              </td>
              <td className="px-4 py-3 pr-5 text-right">
                <button className="text-ink-muted hover:text-ink" type="button">
                  <MoreHorizontal size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function KanbanCardItem({ card }: { card: OfferCard }) {
  return (
    <div className="rounded-[12px] border border-line bg-surface px-3 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start gap-2.5">
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-full font-bold text-[11px] ${card.avatarTone}`}
        >
          {card.initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-1">
            <span className="truncate font-semibold text-[12.5px] text-ink">
              {card.customer}
            </span>
            <button
              className="-mt-0.5 -mr-1 shrink-0 text-ink-muted hover:text-ink"
              type="button"
            >
              <MoreHorizontal size={15} />
            </button>
          </div>
          <div className="mt-0.5 truncate text-[11.5px] text-ink-soft">
            {card.vehicle}
          </div>
          <div className="mt-1 font-bold text-[13.5px] text-dealer-700 tabular-nums">
            {card.amount}
          </div>
        </div>
      </div>
      <div className="mt-2 border-line border-t pt-1.5 text-[10.5px] text-ink-muted">
        {card.status}
      </div>
    </div>
  );
}

function KanbanColumn({ col }: { col: Column }) {
  return (
    <div className="flex w-[226px] shrink-0 flex-col rounded-[14px] bg-canvas/70 p-2.5">
      <div className="flex items-start justify-between px-1 pb-2.5">
        <div className="leading-tight">
          <div className="flex items-center gap-2">
            <span className={`size-2 rounded-full ${col.dot}`} />
            <span className="font-semibold text-[13.5px] text-ink">
              {col.title}
            </span>
          </div>
          <div className="mt-1 pl-4 text-[11.5px] text-ink-muted tabular-nums">
            {col.total}
          </div>
        </div>
        <span className="flex min-w-5 items-center justify-center rounded-full bg-surface px-1.5 py-0.5 font-semibold text-[11px] text-ink-soft">
          {col.count}
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        {col.cards.map((card) => (
          <KanbanCardItem card={card} key={card.id} />
        ))}
      </div>
      <button
        className={`mt-2.5 w-full rounded-[10px] py-2 text-center font-semibold text-[12px] ${col.accent} hover:bg-surface`}
        type="button"
      >
        {columnFooterLabel(col)}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SON AKTİVİTELER (activity feed)
// ---------------------------------------------------------------------------

interface Activity {
  icon: ReactNode;
  iconTone: string;
  id: string;
  sub: string;
  text: ReactNode;
  time: string;
}

const ACTIVITIES: Activity[] = [
  {
    id: "a1",
    icon: <Eye size={15} strokeWidth={1.9} />,
    iconTone: "bg-cust-tint text-cust-600",
    text: (
      <>
        <span className="font-semibold text-ink">B*** Y*******</span>{" "}
        teklifinizi görüntüledi.
      </>
    ),
    sub: "Toyota Corolla · ₺980.000",
    time: "Bugün 09:40",
  },
  {
    id: "a2",
    icon: <Mail size={15} strokeWidth={1.9} />,
    iconTone: "bg-dealer-tint text-dealer-700",
    text: (
      <>
        <span className="font-semibold text-ink">E*** Y*******</span> kişisine
        teklif gönderildi.
      </>
    ),
    sub: "Volkswagen Tiguan · ₺1.250.000",
    time: "Bugün 11:30",
  },
  {
    id: "a3",
    icon: <Phone size={15} strokeWidth={1.9} />,
    iconTone: "bg-success-tint text-success",
    text: (
      <>
        <span className="font-semibold text-ink">M*** T*******</span> ile
        görüşme yapıldı.
      </>
    ),
    sub: "Honda Civic · ₺890.000",
    time: "Bugün 10:15",
  },
  {
    id: "a4",
    icon: <MessageCircle size={15} strokeWidth={1.9} />,
    iconTone: "bg-success-tint text-success",
    text: (
      <>
        <span className="font-semibold text-ink">A*** K*******</span> ile
        WhatsApp mesajlaşıldı.
      </>
    ),
    sub: "Volkswagen Tiguan · ₺1.250.000",
    time: "Dün 16:22",
  },
];

const ACTIVITY_TABS = ["Tümü", "E-posta", "SMS", "Arama", "WhatsApp"];

function SonAktivitelerCard() {
  return (
    <Card className="flex flex-col pb-2">
      <CardHeader title="Son Aktiviteler" />
      <div className="mt-3 flex items-center gap-5 border-line border-b px-5 text-[12.5px]">
        {ACTIVITY_TABS.map((tab, i) => (
          <button
            className={
              i === 0
                ? "border-dealer border-b-2 pb-2.5 font-semibold text-dealer-700"
                : "border-transparent border-b-2 pb-2.5 text-ink-muted hover:text-ink-soft"
            }
            key={tab}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex flex-col px-5">
        {ACTIVITIES.map((a) => (
          <div
            className="flex items-start gap-3 border-line border-b py-3.5 last:border-0"
            key={a.id}
          >
            <span
              className={`flex size-8 shrink-0 items-center justify-center rounded-full ${a.iconTone}`}
            >
              {a.icon}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[12.5px] text-ink-soft leading-4">
                {a.text}
              </div>
              <div className="mt-1 text-[11.5px] text-ink-muted">{a.sub}</div>
            </div>
            <span className="shrink-0 text-[11.5px] text-ink-muted tabular-nums">
              {a.time}
            </span>
          </div>
        ))}
      </div>
      <button
        className="mt-1 w-full py-3 text-center font-semibold text-[12.5px] text-dealer-700 hover:bg-canvas/60"
        type="button"
      >
        Tüm Aktiviteleri Gör
      </button>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// YAKLAŞAN AKSİYONLAR (upcoming actions / reminders)
// ---------------------------------------------------------------------------

interface ActionItem {
  cta: string;
  icon: ReactNode;
  iconTone: string;
  id: string;
  status: string;
  text: ReactNode;
  time: string;
  vehicle: string;
}

const ACTIONS: ActionItem[] = [
  {
    id: "ac1",
    icon: <PhoneCall size={15} strokeWidth={1.9} />,
    iconTone: "bg-danger-tint text-danger",
    text: (
      <>
        <span className="font-semibold text-ink">B*** Y*******</span> ile arama
        yap
      </>
    ),
    vehicle: "Toyota Corolla",
    status: "Gönderildi",
    time: "Bugün 14:00",
    cta: "Ara",
  },
  {
    id: "ac2",
    icon: <MessagesSquare size={15} strokeWidth={1.9} />,
    iconTone: "bg-cust-tint text-cust-600",
    text: (
      <>
        <span className="font-semibold text-ink">K*** Y*******</span> ile teklif
        hakkında görüş
      </>
    ),
    vehicle: "Peugeot 3008",
    status: "Görüntülendi",
    time: "Yarın 10:30",
    cta: "Ara",
  },
  {
    id: "ac3",
    icon: <FileText size={15} strokeWidth={1.9} />,
    iconTone: "bg-dealer-tint text-dealer-700",
    text: (
      <>
        <span className="font-semibold text-ink">E*** Y*******</span> teklif
        takibi
      </>
    ),
    vehicle: "Volkswagen Tiguan",
    status: "Gönderildi",
    time: "17.05.2025",
    cta: "Hatırlat",
  },
  {
    id: "ac4",
    icon: <FileText size={15} strokeWidth={1.9} />,
    iconTone: "bg-warn-tint text-warn",
    text: (
      <>
        <span className="font-semibold text-ink">S*** D*******</span> ile
        yeniden iletişime geç
      </>
    ),
    vehicle: "Toyota Corolla",
    status: "Taslak",
    time: "19.05.2025",
    cta: "Hatırlat",
  },
];

function YaklasanAksiyonlarCard() {
  return (
    <Card className="flex flex-col pb-2">
      <CardHeader title="Yaklaşan Aksiyonlar" />
      <div className="mt-3 flex flex-col px-5">
        {ACTIONS.map((a) => (
          <div
            className="flex items-center gap-3 border-line border-b py-3.5 last:border-0"
            key={a.id}
          >
            <span
              className={`flex size-8 shrink-0 items-center justify-center rounded-full ${a.iconTone}`}
            >
              {a.icon}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12.5px] text-ink-soft leading-4">
                {a.text}
              </div>
              <div className="mt-1 text-[11.5px] text-ink-muted">
                {a.vehicle} · {a.status}
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <span className="text-[11.5px] text-ink-muted tabular-nums">
                {a.time}
              </span>
              <button
                className="rounded-[8px] border border-line-strong px-2.5 py-1 font-semibold text-[11px] text-dealer-700 hover:bg-dealer-tint"
                type="button"
              >
                {a.cta}
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        className="mt-1 flex w-full items-center justify-center gap-1.5 py-3 text-center font-semibold text-[12.5px] text-dealer-700 hover:bg-canvas/60"
        type="button"
      >
        Tüm Aksiyonları Gör <ArrowRight size={14} />
      </button>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// TEKLİF PERFORMANSI (donut)
// ---------------------------------------------------------------------------

interface DonutSlice {
  color: string;
  count: number;
  frac: number;
  label: string;
  pct: string;
}

const SLICES: DonutSlice[] = [
  {
    label: "Gönderildi",
    count: 12,
    pct: "%25",
    frac: 0.25,
    color: "var(--color-dealer)",
  },
  {
    label: "Görüntülendi",
    count: 8,
    pct: "%17",
    frac: 0.17,
    color: "var(--color-cust)",
  },
  {
    label: "Görüşme",
    count: 6,
    pct: "%12",
    frac: 0.12,
    color: "var(--color-success)",
  },
  {
    label: "Kabul",
    count: 9,
    pct: "%19",
    frac: 0.19,
    color: "#16a34a",
  },
  {
    label: "Reddedildi",
    count: 6,
    pct: "%12",
    frac: 0.12,
    color: "var(--color-danger)",
  },
  {
    label: "Taslak",
    count: 7,
    pct: "%15",
    frac: 0.15,
    color: "#f59e0b",
  },
];

function DonutTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: DonutSlice }[];
}) {
  if (!(active && payload && payload.length > 0)) {
    return null;
  }
  const s = payload[0].payload;
  return (
    <div className="rounded-lg border border-line-strong bg-surface px-2.5 py-1.5 shadow-[var(--shadow-pop)]">
      <div className="text-[11px] text-ink-muted">{s.label}</div>
      <div className="font-bold text-[13px] text-ink tabular-nums">
        {s.count} <span className="text-ink-muted">({s.pct})</span>
      </div>
    </div>
  );
}

function PerformansDonut() {
  // Old ring: size 168, stroke 22 → centerline r = 73, so the band spans
  // r ± stroke/2 = 62…84. Mirror that as inner/outer radius here.
  const size = 168;
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <ResponsiveContainer height={size} width={size}>
        <PieChart>
          <Pie
            data={SLICES}
            dataKey="frac"
            innerRadius={62}
            nameKey="label"
            outerRadius={84}
            paddingAngle={2}
            stroke="none"
          >
            {SLICES.map((s) => (
              <Cell fill={s.color} key={s.label} />
            ))}
          </Pie>
          <Tooltip content={<DonutTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <span className="pointer-events-none absolute flex flex-col items-center">
        <span className="text-[11px] text-ink-muted">Toplam Teklif</span>
        <span className="font-bold text-[28px] text-ink leading-8 tracking-tight">
          48
        </span>
      </span>
    </span>
  );
}

function TeklifPerformansiCard() {
  return (
    <Card className="flex flex-col pb-2">
      <CardHeader title="Teklif Performansı" />
      <div className="mt-2 flex items-center gap-5 px-5">
        <PerformansDonut />
        <div className="flex-1">
          {SLICES.map((s) => (
            <div
              className="flex items-center justify-between py-1.5"
              key={s.label}
            >
              <span className="flex items-center gap-2.5">
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: s.color }}
                />
                <span className="text-[12.5px] text-ink-soft">{s.label}</span>
              </span>
              <span className="font-semibold text-[12.5px] text-ink tabular-nums">
                {s.count} <span className="text-ink-muted">({s.pct})</span>
              </span>
            </div>
          ))}
        </div>
      </div>
      <button
        className="mt-2 flex w-full items-center justify-center gap-1.5 border-line border-t py-3 text-center font-semibold text-[12.5px] text-dealer-700 hover:bg-canvas/60"
        type="button"
      >
        Detaylı Raporu Gör <ArrowRight size={14} />
      </button>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// SCREEN
// ---------------------------------------------------------------------------

export function DealerTeklifler() {
  const { data, isPending, isError, refetch } = useDealerOffers();
  const columns = useMemo(() => data ?? [], [data]);

  const [sortBy, setSortBy] = useState<SortKey>("guncelleme");
  // `null` = every stage selected (default); a Set narrows the selection.
  const [stages, setStages] = useState<Set<string> | null>(null);
  const isStageOn = (id: string) => stages === null || stages.has(id);
  const toggleStage = (id: string) =>
    setStages((prev) => {
      const next = new Set(prev ?? columns.map((c) => c.id));
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  const [view, setView] = useState<"kanban" | "liste">("kanban");

  const stageOptions = useMemo(() => buildFilters(columns), [columns]);
  const shownColumns = columns
    .filter((c) => isStageOn(c.id))
    .map((c) => ({
      ...c,
      cards: sortCards(c.cards, sortBy),
    }));
  const listRows: ListRow[] = sortCards(
    shownColumns.flatMap((c) =>
      c.cards.map((card) => ({
        ...card,
        stageId: c.id,
        stageTitle: c.title,
        stageDot: c.dot,
      }))
    ),
    sortBy
  );

  function renderBoard() {
    if (isPending) {
      return <LoadingState label="Teklifler yükleniyor…" />;
    }
    if (isError) {
      return (
        <ErrorState
          label="Teklifler yüklenemedi."
          onRetry={() => refetch()}
        />
      );
    }
    if (shownColumns.length === 0) {
      return <EmptyState label="Seçili aşamalarda teklif bulunmuyor." />;
    }
    if (view === "kanban") {
      return (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {shownColumns.map((col) => (
            <KanbanColumn col={col} key={col.id} />
          ))}
        </div>
      );
    }
    return <ListView rows={listRows} />;
  }

  return (
    <DealerShell
      actions={
        <button
          className="flex items-center gap-2 rounded-[10px] bg-dealer px-3.5 py-2 font-semibold text-[13px] text-white hover:bg-dealer-600"
          onClick={() => toast.success("Yeni teklif oluşturma akışı açılıyor…")}
          type="button"
        >
          <Plus size={16} /> Teklif Oluştur
        </button>
      }
      breadcrumb={["Teklifler", "Aktif Teklifler"]}
      info
      subtitle="Teklif süreçlerinizi aşamalara göre takip edin ve müşteri etkileşimlerinizi yönetin."
      title="Aktif Teklifler & Takip"
    >
      {/* KPI ROW */}
      <div className="grid grid-cols-6 gap-4">
        {KPIS.map((k) => (
          <StatCard
            icon={k.icon}
            key={k.label}
            label={k.label}
            sub={k.sub}
            tone={k.tone}
            value={k.value}
          />
        ))}
      </div>

      {/* VIEW SWITCHER */}
      <div className="mt-6 flex items-center justify-end gap-2.5">
        <div className="flex items-center gap-1 rounded-[10px] border border-line-strong bg-surface p-1">
          <button
            className={`flex items-center gap-1.5 rounded-[7px] px-3 py-1.5 text-[12.5px] ${
              view === "kanban"
                ? "bg-dealer-tint font-semibold text-dealer-700"
                : "font-medium text-ink-soft hover:bg-canvas"
            }`}
            onClick={() => setView("kanban")}
            type="button"
          >
            <LayoutGrid size={15} /> Kanban
          </button>
          <button
            className={`flex items-center gap-1.5 rounded-[7px] px-3 py-1.5 text-[12.5px] ${
              view === "liste"
                ? "bg-dealer-tint font-semibold text-dealer-700"
                : "font-medium text-ink-soft hover:bg-canvas"
            }`}
            onClick={() => setView("liste")}
            type="button"
          >
            <List size={15} /> Liste
          </button>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <button
              aria-label="Filtrele ve sırala"
              className="flex size-9 items-center justify-center rounded-[10px] border border-line-strong bg-surface text-ink-soft hover:bg-canvas"
              type="button"
            >
              <SlidersHorizontal size={16} />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64 p-0">
            <div className="border-line border-b px-4 py-2.5 font-semibold text-[13px] text-ink">
              Filtrele & Sırala
            </div>
            <div className="px-4 py-3">
              <div className="mb-1.5 font-medium text-[11px] text-ink-muted uppercase tracking-wide">
                Sıralama
              </div>
              <div className="flex flex-col gap-0.5">
                {SORTS.map((s) => (
                  <button
                    className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[13px] ${
                      sortBy === s.id
                        ? "bg-dealer-tint font-semibold text-dealer-700"
                        : "text-ink-soft hover:bg-canvas"
                    }`}
                    key={s.id}
                    onClick={() => setSortBy(s.id)}
                    type="button"
                  >
                    {s.label}
                    {sortBy === s.id && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-line border-t px-4 py-3">
              <div className="mb-2 font-medium text-[11px] text-ink-muted uppercase tracking-wide">
                Aşamalar
              </div>
              <div className="flex flex-col gap-2">
                {stageOptions.map((c) => (
                  <div
                    className="flex items-center gap-2.5 text-[13px] text-ink-soft"
                    key={c.id}
                  >
                    <Checkbox
                      checked={isStageOn(c.id)}
                      id={`stage-${c.id}`}
                      onCheckedChange={() => toggleStage(c.id)}
                    />
                    <label className="cursor-pointer" htmlFor={`stage-${c.id}`}>
                      {c.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* BOARD / LIST */}
      {renderBoard()}

      {/* BOTTOM ROW */}
      <div className="mt-6 grid grid-cols-[1.15fr_1.15fr_1fr] gap-5">
        <SonAktivitelerCard />
        <YaklasanAksiyonlarCard />
        <TeklifPerformansiCard />
      </div>
    </DealerShell>
  );
}
