import { ArrowRight, Calendar, ChevronDown, Zap } from "lucide-react";
import { useBankDashboard } from "@/queries/bank-dashboard";
import { ErrorState, LoadingState } from "@/ui/async-states";
import { AreaChart } from "../../../ui/area-chart";
import { MiniBar } from "../../../ui/badge";
import { Card, CardHeader } from "../../../ui/card";
import { FunnelChart } from "../../../ui/funnel-chart";
import { KpiCard } from "../../../ui/kpi";
import { BankShell } from "../bank-shell";

const SHELL_PROPS = {
  actions: (
    <button
      className="flex items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-3.5 py-2 font-medium text-[13px] text-ink-soft hover:bg-canvas"
      type="button"
    >
      <Calendar size={16} strokeWidth={1.9} />
      01 Mayıs - 31 Mayıs 2025
      <ChevronDown className="text-ink-muted" size={15} strokeWidth={1.9} />
    </button>
  ),
  highlight: "Ahmet Bey",
  subtitle:
    "Portföy yenileme fırsatlarınızı ve bayi performansınızı takip edin.",
  title: "Hoş geldiniz,",
} as const;

export function BankDashboard() {
  const { data, isPending, isError, refetch } = useBankDashboard();

  if (isPending) {
    return (
      <BankShell {...SHELL_PROPS}>
        <LoadingState />
      </BankShell>
    );
  }

  if (isError || !data) {
    return (
      <BankShell {...SHELL_PROPS}>
        <ErrorState onRetry={() => refetch()} />
      </BankShell>
    );
  }

  return (
    <BankShell {...SHELL_PROPS}>
      {/* KPI row */}
      <div className="grid grid-cols-4 gap-5">
        {data.kpis.map((kpi) => (
          <KpiCard
            delta={kpi.delta}
            icon={kpi.icon}
            key={kpi.label}
            label={kpi.label}
            positive={kpi.positive}
            value={kpi.value}
          />
        ))}
      </div>

      {/* middle row */}
      <div className="mt-5 grid grid-cols-3 gap-5">
        <Card className="col-span-2 pb-5">
          <CardHeader
            action={
              <button
                className="flex items-center gap-1.5 rounded-[9px] border border-line-strong px-3 py-1.5 font-medium text-[12.5px] text-ink-soft"
                type="button"
              >
                Aylık
                <ChevronDown size={14} strokeWidth={2} />
              </button>
            }
            subtitle="Son 12 ayın yenileme fırsatı skoru trendi"
            title="Yenileme Fırsatı Trendi"
          />
          <div className="px-3 pt-3">
            <AreaChart
              data={data.trend}
              height={210}
              highlight={data.trendHighlight}
              highlightLabel={data.trendHighlightLabel}
              highlightValue={data.trendHighlightValue}
              labels={data.months}
            />
          </div>
        </Card>

        <Card className="pb-5">
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <Zap className="text-bank" size={16} /> AI İçgörüler
              </span>
            }
          />
          <div className="mt-3 flex flex-col gap-4 px-5">
            {data.insights.map((it) => (
              <div className="flex gap-3" key={it.id}>
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-[10px] ${it.tint}`}
                >
                  <it.icon size={17} strokeWidth={1.9} />
                </div>
                <p className="text-[13px] text-ink-soft leading-[18px]">
                  {it.text}
                </p>
              </div>
            ))}
          </div>
          <div className="px-5 pt-4">
            <button
              className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-line-strong py-2.5 font-semibold text-[13px] text-bank-700"
              type="button"
            >
              Tüm İçgörüleri Görüntüle <ArrowRight size={15} />
            </button>
          </div>
        </Card>
      </div>

      {/* bottom row */}
      <div className="mt-5 grid grid-cols-3 gap-5">
        <Card className="col-span-2 pb-3">
          <CardHeader
            action={
              <button
                className="font-semibold text-[12.5px] text-bank-700"
                type="button"
              >
                Tümünü Görüntüle
              </button>
            }
            title="En Aktif Bayiler"
          />
          <div className="mt-4 px-5">
            <div className="grid grid-cols-[1fr_auto_180px] items-center gap-4 border-line border-b pb-2 font-semibold text-[11.5px] text-ink-muted uppercase tracking-wide">
              <span>Bayi Adı</span>
              <span>Teklif Aşamasına Geçen</span>
              <span className="text-right">Dönüşüm Oranı</span>
            </div>
            {data.dealers.map((d) => (
              <div
                className="grid grid-cols-[1fr_auto_180px] items-center gap-4 border-line border-b py-3 last:border-0"
                key={d.name}
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-canvas font-bold text-[9px] text-ink-soft">
                    {d.logo}
                  </div>
                  <span className="font-medium text-[13.5px] text-ink">
                    {d.name}
                  </span>
                </div>
                <span className="text-right font-semibold text-[13.5px] text-ink tabular-nums">
                  {d.count}
                </span>
                <div className="flex items-center gap-2.5">
                  <MiniBar value={d.conv * 2.4} />
                  <span className="w-9 shrink-0 text-right font-semibold text-[13px] text-ink tabular-nums">
                    %{d.conv}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="pb-5">
          <CardHeader title="Yenileme Süreci Funnel" />
          <div className="mt-4 px-5">
            <FunnelChart stages={data.funnel} />
          </div>
          <div className="px-5 pt-5">
            <button
              className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-line-strong py-2.5 font-semibold text-[13px] text-bank-700"
              type="button"
            >
              Funnel Analizini Görüntüle <ArrowRight size={15} />
            </button>
          </div>
        </Card>
      </div>
    </BankShell>
  );
}
