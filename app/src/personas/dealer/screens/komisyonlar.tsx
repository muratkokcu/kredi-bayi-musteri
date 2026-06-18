import {
  ArrowUp,
  CalendarRange,
  ChevronDown,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  CommissionHareket,
  CommissionIslemDurum,
  CommissionMonthBar,
  Commissions,
} from "@/data/commissions";
import { useCommissions } from "@/queries/commissions";
import { ErrorState, LoadingState } from "@/ui/async-states";
import { Badge } from "@/ui/badge";
import { Card, CardHeader } from "@/ui/card";
import { StatCard } from "@/ui/stat-card";
import { formatPercent, formatTRY, formatTRYCompact } from "@/lib/format";
import { DealerShell } from "../dealer-shell";

const DURUM_TONE: Record<CommissionIslemDurum, "success" | "warn" | "dealer"> = {
  Ödendi: "success",
  Bekliyor: "warn",
  İşlemde: "dealer",
};

const SHELL_PROPS = {
  actions: <DateRangePill />,
  subtitle: "Kazançlarınızı ve ödeme durumlarınızı takip edin.",
  title: "Komisyonlar",
} as const;

function DateRangePill() {
  return (
    <button
      className="flex items-center gap-2.5 rounded-[10px] border border-line-strong bg-surface px-3.5 py-2 text-left hover:bg-canvas"
      type="button"
    >
      <CalendarRange className="text-ink-muted" size={16} strokeWidth={1.9} />
      <span className="leading-tight">
        <span className="block text-[11px] text-ink-muted">Dönem</span>
        <span className="block font-medium text-[12.5px] text-ink tabular-nums">
          Ocak - Ağustos 2025
        </span>
      </span>
      <ChevronDown className="text-ink-muted" size={15} strokeWidth={1.9} />
    </button>
  );
}

function KpiRow({ kpis }: { kpis: Commissions["kpis"] }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {kpis.map((k) => (
        <StatCard
          icon={k.icon}
          key={k.label}
          label={k.label}
          sub={
            <span className="inline-flex items-center gap-1">
              <span
                className={`inline-flex items-center gap-0.5 font-semibold ${
                  k.positive ? "text-success" : "text-danger"
                }`}
              >
                <ArrowUp
                  className={k.positive ? "" : "rotate-180"}
                  size={12}
                  strokeWidth={2.6}
                />
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

function EarningsTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  label?: string;
  payload?: { value: number }[];
}) {
  if (!(active && payload && payload.length > 0)) {
    return null;
  }
  return (
    <div className="rounded-lg border border-line-strong bg-surface px-2.5 py-1.5 shadow-[var(--shadow-pop)]">
      <div className="text-[11px] text-ink-muted">{label}</div>
      <div className="font-bold text-[13px] text-ink tabular-nums">
        {formatTRY(payload[0].value)}
      </div>
    </div>
  );
}

function EarningsChart({ monthly }: { monthly: CommissionMonthBar[] }) {
  const chartData = monthly.map((m) => ({ month: m.label, value: m.amount }));

  return (
    <div className="mt-4 px-5">
      <ResponsiveContainer height={224} width="100%">
        <BarChart
          data={chartData}
          margin={{ top: 14, right: 12, bottom: 0, left: -8 }}
        >
          <CartesianGrid stroke="var(--color-line)" vertical={false} />
          <XAxis
            axisLine={false}
            dataKey="month"
            tick={{ fill: "var(--color-ink-muted)", fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "var(--color-ink-muted)", fontSize: 12 }}
            tickFormatter={formatTRYCompact}
            tickLine={false}
            width={56}
          />
          <Tooltip
            content={<EarningsTooltip />}
            cursor={{ fill: "var(--color-dealer-tint)" }}
          />
          <Bar dataKey="value" fill="var(--color-dealer)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function EarningsCard({ monthly }: { monthly: CommissionMonthBar[] }) {
  return (
    <Card className="pb-5">
      <CardHeader
        action={
          <span className="inline-flex items-center gap-1 font-semibold text-[12.5px] text-success">
            <TrendingUp size={14} strokeWidth={2.2} />
            %18,4
          </span>
        }
        subtitle="Son 8 ayda kazanılan komisyon tutarları"
        title="Aylık Kazanç"
      />
      <EarningsChart monthly={monthly} />
    </Card>
  );
}

function TransactionsCard({
  hareketler,
}: {
  hareketler: CommissionHareket[];
}) {
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
        subtitle="Tamamlanan yenileme işlemlerinden kazanılan komisyonlar"
        title="Komisyon Hareketleri"
      />
      <div className="mt-3 px-5 pb-2">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-line border-b text-left font-semibold text-[11px] text-ink-muted uppercase tracking-wide">
              <th className="pb-2.5 font-semibold">Tarih</th>
              <th className="pb-2.5 font-semibold">Müşteri</th>
              <th className="pb-2.5 font-semibold">Araç</th>
              <th className="pb-2.5 text-right font-semibold">Teklif Tutarı</th>
              <th className="pb-2.5 text-right font-semibold">Komisyon Oranı</th>
              <th className="pb-2.5 text-right font-semibold">Komisyon</th>
              <th className="pb-2.5 text-right font-semibold">Durum</th>
            </tr>
          </thead>
          <tbody>
            {hareketler.map((h) => (
              <tr className="border-line border-b last:border-0" key={h.id}>
                <td className="py-3 text-[12.5px] text-ink-soft tabular-nums">
                  {h.tarih}
                </td>
                <td className="py-3 font-semibold text-[13px] text-ink">
                  {h.musteri}
                </td>
                <td className="py-3 text-[12.5px] text-ink-soft">{h.arac}</td>
                <td className="py-3 text-right text-[12.5px] text-ink tabular-nums">
                  {formatTRY(h.teklif)}
                </td>
                <td className="py-3 text-right text-[12.5px] text-ink-soft tabular-nums">
                  {formatPercent(h.oran, 2)}
                </td>
                <td className="py-3 text-right font-semibold text-[13px] text-ink tabular-nums">
                  {formatTRY(h.komisyon)}
                </td>
                <td className="py-3 text-right">
                  <Badge tone={DURUM_TONE[h.durum]}>{h.durum}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function DealerKomisyonlar() {
  const { data, isPending, isError, refetch } = useCommissions();

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
      <KpiRow kpis={data.kpis} />

      <div className="mt-5 grid grid-cols-1 gap-5">
        <EarningsCard monthly={data.monthly} />
        <TransactionsCard hareketler={data.hareketler} />
      </div>
    </DealerShell>
  );
}
