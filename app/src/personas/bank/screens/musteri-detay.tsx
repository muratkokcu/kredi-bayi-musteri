import { ArrowRight, Download, History, Pencil } from "lucide-react";
import type {
  CustomerDetail,
  Interaction,
  KeyVal,
  OzetAlan,
  SkorFaktor,
  TimelineEvent,
} from "@/data/customer-detail";
import { getModel } from "@/data/arac-taksonomisi";
import { useCustomerDetail } from "@/queries/customer-detail";
import { ErrorState, LoadingState } from "@/ui/async-states";
import { Badge, MiniBar } from "@/ui/badge";
import { Card, CardHeader } from "@/ui/card";
import { ScoreRing } from "@/ui/score-ring";
import { VehicleImage } from "@/ui/vehicle-image";
import { BankShell } from "../bank-shell";

const WS_RE = /\s+/;

// Vehicle pulled from the shared taxonomy (Volkswagen Tiguan 1.5 TSI, SUV).
const vehicleModel = getModel("volkswagen", "tiguan");
const kasaTipi = "SUV";
const aracAdi = `Volkswagen ${vehicleModel?.model ?? "Tiguan"}`;
const aracMarkaModel = `${aracAdi} ${vehicleModel?.varyantlar[0] ?? "1.5 TSI"}`;

function bayiInitials(name: string): string {
  const parts = name.trim().split(WS_RE);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toLocaleUpperCase("tr");
  }
  return name.slice(0, 2).toLocaleUpperCase("tr");
}

function KeyVals({ rows }: { rows: KeyVal[] }) {
  return (
    <dl className="flex flex-col gap-3.5">
      {rows.map((r) => (
        <div className="grid grid-cols-[8.5rem_1fr] gap-x-3" key={r.label}>
          <dt className="text-[12.5px] text-ink-muted">{r.label}</dt>
          <dd className="text-[13px] tabular-nums">
            <span
              className={
                r.strong ? "font-bold text-bank-700" : "font-semibold text-ink"
              }
            >
              {r.value}
            </span>
            {r.sub ? (
              <span className="block text-[11px] text-ink-muted">
                ({r.sub})
              </span>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function FooterLink({ label }: { label: string }) {
  return (
    <button
      className="mx-5 mt-1 flex items-center justify-center gap-1.5 border-line border-t pt-3 font-semibold text-[12.5px] text-bank-700"
      type="button"
    >
      {label} <ArrowRight size={14} strokeWidth={2.1} />
    </button>
  );
}

function SummaryCard({
  initials,
  musteriKodu,
  score,
  scoreLabel,
  ozetAlanlar,
}: {
  initials: string;
  musteriKodu: string;
  score: number;
  scoreLabel: string;
  ozetAlanlar: OzetAlan[];
}) {
  return (
    <Card className="flex items-stretch gap-6 p-6">
      <div className="flex flex-1 items-center gap-5">
        <span className="flex size-[68px] shrink-0 items-center justify-center rounded-full bg-bank-tint font-bold text-[22px] text-bank-700">
          {initials}
        </span>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-[19px] text-ink">{musteriKodu}</h2>
            <span className="inline-flex items-center rounded-full bg-bank-tint px-2.5 py-0.5 font-bold text-[13px] text-bank-700 tabular-nums">
              {score}
            </span>
            <span className="font-semibold text-[13px] text-bank-700">
              {scoreLabel}
            </span>
          </div>
          <div className="flex gap-10">
            {ozetAlanlar.map((a) => (
              <div key={a.label}>
                <div className="text-[12px] text-ink-muted">{a.label}</div>
                <div className="mt-0.5 font-semibold text-[13.5px] text-ink tabular-nums">
                  {a.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-[320px] shrink-0 flex-col gap-1.5 rounded-2xl bg-canvas p-4">
        <div className="font-semibold text-[13.5px] text-ink">
          Yenileme Potansiyeli
        </div>
        <p className="text-[12px] text-ink-soft leading-4">
          Bu müşterinin önümüzdeki 90 gün içinde kredi yenileme olasılığı
          yüksektir.
        </p>
        <button
          className="mt-1 inline-flex items-center gap-1 font-semibold text-[12.5px] text-bank-700"
          type="button"
        >
          Neden yüksek? <ArrowRight size={13} strokeWidth={2.1} />
        </button>
      </div>
    </Card>
  );
}

function ScoreCard({
  score,
  factors,
}: {
  score: number;
  factors: SkorFaktor[];
}) {
  return (
    <Card className="pb-4">
      <CardHeader title="Yenileme Skoru Detayı" />
      <div className="mt-4 flex items-center gap-4 px-5">
        <div className="relative inline-flex shrink-0 items-center justify-center">
          <ScoreRing showValue={false} size={104} stroke={9} value={score} />
          <span className="absolute flex flex-col items-center">
            <span className="font-bold text-[26px] text-ink tabular-nums leading-none">
              {score}
            </span>
            <span className="mt-1 font-semibold text-[11px] text-bank-700">
              Yüksek
            </span>
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-3">
          {factors.map((f) => (
            <div className="flex items-center gap-2" key={f.label}>
              <f.icon
                className="shrink-0 text-ink-muted"
                size={14}
                strokeWidth={1.9}
              />
              <span className="w-[112px] shrink-0 text-[11px] text-ink-soft leading-tight">
                {f.label}
              </span>
              <div className="flex-1">
                <MiniBar value={(f.score / f.max) * 100} />
              </div>
              <span className="w-10 shrink-0 text-right font-semibold text-[11.5px] text-ink tabular-nums">
                {f.score}/{f.max}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-5 mt-4 flex items-center justify-between border-line border-t pt-3">
        <span className="font-semibold text-[13px] text-ink">Toplam</span>
        <span className="font-bold text-[15px] text-bank-700 tabular-nums">
          {score} / 100
        </span>
      </div>
    </Card>
  );
}

function InteractionsCard({ rows }: { rows: Interaction[] }) {
  return (
    <Card className="pb-3">
      <CardHeader title="Bayi Etkileşim Geçmişi" />
      <div className="mt-3 px-5">
        <div className="grid grid-cols-[1.7fr_1.2fr_1.4fr_auto] gap-4 border-line border-b pb-2 font-medium text-[11.5px] text-ink-muted">
          <span>Bayi Adı</span>
          <span>Son Etkileşim</span>
          <span>Etkileşim Türü</span>
          <span>Durum</span>
        </div>
        {rows.map((e) => (
          <div
            className="grid grid-cols-[1.7fr_1.2fr_1.4fr_auto] items-center gap-4 border-line border-b py-3 last:border-0"
            key={e.id}
          >
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line bg-canvas font-semibold text-[10.5px] text-ink-soft">
                {bayiInitials(e.bayi)}
              </span>
              <span className="font-medium text-[13px] text-ink">{e.bayi}</span>
            </div>
            <span className="text-[12.5px] text-ink-soft tabular-nums">
              {e.tarih}
            </span>
            <span className="text-[12.5px] text-ink-soft">{e.islem}</span>
            <Badge tone={e.tone}>{e.durum}</Badge>
          </div>
        ))}
      </div>
      <FooterLink label="Tüm etkileşimleri görüntüle" />
    </Card>
  );
}

function TimelineCard({ events }: { events: TimelineEvent[] }) {
  return (
    <Card className="pb-3">
      <CardHeader title="Müşteri Zaman Çizelgesi" />
      <ol className="mt-4 px-5">
        {events.map((ev, i) => {
          const isLast = i === events.length - 1;
          return (
            <li className="flex gap-3" key={ev.id}>
              <span className="w-[68px] shrink-0 pt-px text-[11.5px] text-ink-muted tabular-nums">
                {ev.date}
              </span>
              <div className="relative flex flex-col items-center">
                <span className="mt-1 size-2.5 shrink-0 rounded-full bg-bank ring-4 ring-bank-tint" />
                {isLast ? null : <span className="w-px flex-1 bg-line" />}
              </div>
              <div className={`flex-1 ${isLast ? "pb-0" : "pb-5"}`}>
                <div className="font-semibold text-[13px] text-ink">
                  {ev.title}
                </div>
                <div className="mt-0.5 text-[12px] text-ink-muted leading-4">
                  {ev.desc}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      <FooterLink label="Tüm zaman çizelgesini görüntüle" />
    </Card>
  );
}

const SHELL_PROPS = {
  actions: (
    <>
      <button
        className="flex items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-3.5 py-2 font-medium text-[13px] text-ink-soft hover:bg-canvas"
        type="button"
      >
        <Download size={16} /> Rapor İndir
      </button>
      <button
        className="flex items-center gap-2 rounded-[10px] bg-bank px-3.5 py-2 font-semibold text-[13px] text-white hover:bg-bank-600"
        type="button"
      >
        <History size={16} /> Teklif Geçmişini Görüntüle
      </button>
    </>
  ),
  breadcrumb: ["Müşteri Portföyü", "Müşteri Detay"],
  title: "Müşteri Detay",
} as const;

function CustomerDetailBody({ data }: { data: CustomerDetail }) {
  // Araç Marka / Model row is taxonomy-derived presentation, kept inline.
  const aracBilgi: KeyVal[] = [
    { label: "Araç Marka / Model", value: aracMarkaModel },
    ...data.aracBilgi,
  ];

  return (
    <>
      <SummaryCard
        initials={data.initials}
        musteriKodu={data.musteriKodu}
        ozetAlanlar={data.ozetAlanlar}
        score={data.score}
        scoreLabel={data.scoreLabel}
      />

      <div className="mt-5 grid grid-cols-5 gap-5">
        {/* left column */}
        <div className="col-span-3 flex flex-col gap-5">
          <Card className="pb-5">
            <CardHeader title="Kredi ve Araç Bilgileri" />
            <div className="mt-4 flex gap-6 px-5">
              <VehicleImage
                className="h-24 w-36 shrink-0 rounded-xl"
                iconSize={34}
                name={aracAdi}
                segment={kasaTipi}
              />
              <div className="grid flex-1 grid-cols-2 gap-x-8">
                <KeyVals rows={aracBilgi} />
                <KeyVals rows={data.krediBilgi} />
              </div>
            </div>
          </Card>

          <InteractionsCard rows={data.etkilesimler} />
        </div>

        {/* right column */}
        <div className="col-span-2 flex flex-col gap-5">
          <ScoreCard factors={data.skorFaktorler} score={data.score} />

          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-[15px] text-ink">Notlar</h3>
              <button
                className="text-ink-muted hover:text-bank-700"
                type="button"
              >
                <Pencil size={15} strokeWidth={1.9} />
              </button>
            </div>
            <div className="rounded-xl bg-canvas p-4">
              <p className="text-[12.5px] text-ink-soft leading-5">
                {data.notText}
              </p>
              <div className="mt-3 text-[11px] text-ink-muted">
                {data.notMeta}
              </div>
            </div>
          </Card>

          <TimelineCard events={data.timeline} />
        </div>
      </div>
    </>
  );
}

export function BankMusteriDetay() {
  const { data, isPending, isError, refetch } = useCustomerDetail();

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
      <CustomerDetailBody data={data} />
    </BankShell>
  );
}
