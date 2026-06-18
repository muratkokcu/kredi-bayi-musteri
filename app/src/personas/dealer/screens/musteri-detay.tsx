import {
  ArrowRight,
  ChevronDown,
  Clock,
  Flame,
  Gauge,
  Info,
  MessageSquarePlus,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getModel } from "@/data/arac-taksonomisi";
import type {
  ContactEvent,
  DealerCustomerDetail,
  DetailRow,
  ExpectationRow,
  FactRow,
  Interaction,
  NeedRow,
  QuickContact,
  ScoreFactor,
  SegmentRow,
} from "@/data/dealer-customer-detail";
import { computeLoan } from "@/lib/finance";
import { formatTRY } from "@/lib/format";
import { useDealerCustomerDetail } from "@/queries/dealer-customer-detail";
import { ErrorState, LoadingState } from "@/ui/async-states";
import { Badge, MiniBar } from "@/ui/badge";
import { Card, CardHeader } from "@/ui/card";
import { ScoreRing } from "@/ui/score-ring";
import { VehicleImage } from "@/ui/vehicle-image";
import { DealerShell } from "../dealer-shell";

// Customer vehicle pulled from the shared taxonomy (Volkswagen Tiguan, SUV).
const tiguan = getModel("volkswagen", "tiguan");
const tiguanModel = `Volkswagen ${tiguan?.model ?? "Tiguan"}`;
const tiguanVaryant = tiguan?.varyantlar[0] ?? "1.5 TSI";

const TABS = [
  { id: "genel", label: "Genel Bakış" },
  { id: "ihtiyac", label: "İhtiyaç Analizi" },
  { id: "eslestirme", label: "Araç & Finansman Eşleştirme" },
  { id: "iletisim", label: "İletişim Geçmişi" },
];

function subToneClass(tone: FactRow["subTone"]): string {
  if (tone === "danger") {
    return "text-danger";
  }
  return "text-ink-muted";
}

function valueToneClass(strong?: boolean): string {
  if (strong) {
    return "font-bold text-dealer-700";
  }
  return "font-semibold text-ink";
}

const NEED_TONE: Record<NeedRow["tone"], string> = {
  dealer: "bg-dealer-tint text-dealer-700",
  success: "bg-success-tint text-success",
  cust: "bg-cust-tint text-cust-600",
  warn: "bg-warn-tint text-warn",
};

function DetailList({ rows }: { rows: DetailRow[] }) {
  return (
    <dl className="mt-1 flex flex-col">
      {rows.map((r) => (
        <div
          className="flex items-center justify-between gap-4 border-line border-b py-2.5 last:border-0"
          key={r.label}
        >
          <dt className="text-[12.5px] text-ink-soft">{r.label}</dt>
          <dd
            className={`text-right text-[13px] tabular-nums ${valueToneClass(
              r.strong
            )}`}
          >
            {r.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function HeaderCard({ quickFacts }: { quickFacts: FactRow[] }) {
  return (
    <Card className="px-6 py-5">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <div className="flex items-center gap-4">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-dealer-tint font-bold text-[18px] text-dealer-700">
            AY
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-[17px] text-ink tracking-tight">
                A*** Y******
              </h2>
              <Badge tone="dealer">Aktif</Badge>
              <Badge tone="success">Yüksek Skor</Badge>
            </div>
            <div className="mt-1 flex items-center gap-3 text-[12px] text-ink-muted tabular-nums">
              <span>34 *** 123</span>
              <span className="text-line-strong">•</span>
              <span>İstanbul / Kadıköy</span>
            </div>
          </div>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-x-7 gap-y-3">
          {quickFacts.map(({ icon: Icon, label, value, sub, subTone }) => (
            <div className="flex items-start gap-2" key={label}>
              <Icon
                aria-hidden="true"
                className="mt-0.5 text-ink-muted"
                size={15}
                strokeWidth={1.9}
              />
              <div className="leading-tight">
                <div className="text-[11px] text-ink-muted">{label}</div>
                <div className="font-bold text-[13.5px] text-ink tabular-nums">
                  {value}
                </div>
                {sub && (
                  <div className={`text-[11px] ${subToneClass(subTone)}`}>
                    {sub}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="flex items-start gap-2">
            <ShieldCheck
              aria-hidden="true"
              className="mt-0.5 text-dealer"
              size={15}
              strokeWidth={1.9}
            />
            <div className="leading-tight">
              <div className="text-[11px] text-ink-muted">Uygunluk</div>
              <div className="font-bold text-[13.5px] text-ink">Çok Uygun</div>
              <div className="flex items-center gap-0.5 text-warn">
                {["s1", "s2", "s3", "s4"].map((s) => (
                  <Star
                    aria-hidden="true"
                    fill="currentColor"
                    key={s}
                    size={11}
                  />
                ))}
                <Star aria-hidden="true" size={11} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function MusteriOzetiCard({ rows }: { rows: DetailRow[] }) {
  return (
    <Card className="pb-4">
      <CardHeader title="Müşteri Özeti" />
      <div className="px-5">
        <DetailList rows={rows} />
        <button
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-[10px] border border-line border-dashed py-2.5 font-semibold text-[12.5px] text-dealer-700 hover:bg-dealer-tint"
          type="button"
        >
          Daha Fazla Bilgi
          <ChevronDown aria-hidden="true" size={15} strokeWidth={2} />
        </button>
      </div>
    </Card>
  );
}

function AracKrediCard({ rows }: { rows: DetailRow[] }) {
  // Araç Marka / Model row is taxonomy-derived presentation, kept inline.
  const aracKredi: DetailRow[] = [
    { label: "Marka / Model", value: tiguanModel },
    ...rows,
  ];

  return (
    <Card className="pb-4">
      <CardHeader title="Araç & Kredi Bilgileri" />
      <div className="mt-4 flex gap-5 px-5">
        <div className="flex h-24 w-32 shrink-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl bg-canvas">
          <VehicleImage
            className="h-14 w-full"
            iconSize={34}
            name="Volkswagen Tiguan"
            segment="SUV"
          />
          <span className="font-medium text-[10.5px] text-ink-soft">
            {tiguanVaryant}
          </span>
        </div>
        <div className="flex-1">
          <DetailList rows={aracKredi} />
        </div>
      </div>
      <div className="mt-3 flex justify-end px-5">
        <button
          className="flex items-center gap-1.5 font-semibold text-[12.5px] text-dealer-700 hover:underline"
          type="button"
        >
          Kredi Detayları
          <ArrowRight aria-hidden="true" size={15} strokeWidth={2} />
        </button>
      </div>
    </Card>
  );
}

function IhtiyacAnaliziCard({ rows }: { rows: NeedRow[] }) {
  return (
    <Card className="pb-4">
      <CardHeader
        action={
          <button
            className="rounded-[8px] border border-dealer px-3 py-1.5 font-semibold text-[12px] text-dealer-700 hover:bg-dealer-tint"
            type="button"
          >
            Tamamla
          </button>
        }
        title="İhtiyaç Analizi Özeti"
      />
      <div className="mt-3 flex flex-col px-5">
        {rows.map(({ icon: Icon, label, value, tone }) => (
          <div
            className="flex items-center gap-3 border-line border-b py-2.5 last:border-0"
            key={label}
          >
            <span
              className={`flex size-8 shrink-0 items-center justify-center rounded-full ${NEED_TONE[tone]}`}
            >
              <Icon aria-hidden="true" size={15} strokeWidth={2} />
            </span>
            <span className="text-[12.5px] text-ink-soft">{label}</span>
            <span className="ml-auto flex items-center gap-1 text-right font-semibold text-[12.5px] text-ink">
              {label === "Takip Seviyesi" && (
                <Flame aria-hidden="true" className="text-danger" size={14} />
              )}
              {value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function YenilemePotansiyeliCard({
  score,
  factors,
}: {
  score: number;
  factors: ScoreFactor[];
}) {
  return (
    <Card className="pb-5">
      <CardHeader title="Yenileme Potansiyeli" />
      <div className="mt-4 flex items-center gap-4 px-5">
        <div className="relative flex flex-col items-center">
          <ScoreRing size={104} stroke={9} value={score} />
          <span className="mt-2 text-[10px] text-ink-muted">
            Yenileme Skoru
          </span>
          <span className="font-semibold text-[11px] text-success">Yüksek</span>
        </div>
        <ul className="flex-1 flex-col gap-2">
          {factors.map((f) => (
            <li className="mb-2 last:mb-0" key={f.label}>
              <div className="mb-1 flex items-center justify-between gap-2 text-[11.5px]">
                <span className="flex items-center gap-1.5 text-ink-soft">
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-success"
                  />
                  {f.label}
                </span>
                <span className="font-semibold text-ink tabular-nums">
                  %{f.value}
                </span>
              </div>
              <MiniBar color="var(--color-dealer)" value={f.value * 4} />
            </li>
          ))}
        </ul>
      </div>
      <div className="mx-5 mt-4 flex items-start gap-2.5 rounded-[12px] bg-dealer-tint px-3.5 py-3">
        <Info
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-dealer-700"
          size={16}
          strokeWidth={2}
        />
        <p className="text-[12px] text-dealer-700 leading-4">
          <span className="font-semibold">
            Müşterinizin yenileme potansiyeli çok yüksek.
          </span>{" "}
          Zamanında ve doğru teklif ile dönüşüm olasılığı artar.
        </p>
      </div>
    </Card>
  );
}

function OnerilenSegmentlerCard({ rows }: { rows: SegmentRow[] }) {
  return (
    <Card className="pb-4">
      <CardHeader title="Önerilen Araç Segmentleri" />
      <div className="mt-3 flex flex-col px-5">
        {rows.map((s) => (
          <div
            className="flex items-center gap-3 border-line border-b py-3 last:border-0"
            key={s.id}
          >
            <VehicleImage
              className="size-9 shrink-0 rounded-full"
              iconSize={17}
              name={s.araclar}
              segment={s.label}
            />
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-[13px] text-ink">
                {s.label}
              </div>
              <div className="truncate text-[11.5px] text-ink-muted">
                {s.araclar}
              </div>
            </div>
            <Badge tone={s.tone}>{s.uygunluk}</Badge>
          </div>
        ))}
        <button
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-[10px] border border-line py-2.5 font-semibold text-[12.5px] text-dealer-700 hover:bg-dealer-tint"
          type="button"
        >
          Tüm Önerileri Görüntüle
          <ArrowRight aria-hidden="true" size={15} strokeWidth={2} />
        </button>
      </div>
    </Card>
  );
}

function SonEtkilesimlerCard({ rows }: { rows: Interaction[] }) {
  return (
    <Card className="pb-4">
      <CardHeader title="Son Etkileşimler" />
      <ol className="mt-3 flex flex-col px-5">
        {rows.map(({ icon: Icon, id, title, desc, tone }) => (
          <li
            className="flex items-center gap-3 border-line border-b py-3 last:border-0"
            key={id}
          >
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-full ${tone}`}
            >
              <Icon aria-hidden="true" size={16} strokeWidth={2} />
            </span>
            <div>
              <div className="font-semibold text-[13px] text-ink">{title}</div>
              <div className="text-[11.5px] text-ink-muted">{desc}</div>
            </div>
          </li>
        ))}
        <button
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-[10px] border border-line py-2.5 font-semibold text-[12.5px] text-dealer-700 hover:bg-dealer-tint"
          type="button"
        >
          Tüm Geçmişi Görüntüle
          <ArrowRight aria-hidden="true" size={15} strokeWidth={2} />
        </button>
      </ol>
    </Card>
  );
}

function GenelBakis({ data }: { data: DealerCustomerDetail }) {
  return (
    <div className="grid grid-cols-3 gap-5">
      <div className="flex flex-col gap-5">
        <MusteriOzetiCard rows={data.musteriOzet} />
        <IhtiyacAnaliziCard rows={data.ihtiyacAnalizi} />
      </div>
      <div className="flex flex-col gap-5">
        <AracKrediCard rows={data.aracKredi} />
        <OnerilenSegmentlerCard rows={data.segmentler} />
      </div>
      <div className="flex flex-col gap-5">
        <YenilemePotansiyeliCard
          factors={data.skorFaktorler}
          score={data.renewalScore}
        />
        <SonEtkilesimlerCard rows={data.etkilesimler} />
      </div>
    </div>
  );
}

// --- İhtiyaç Analizi sekmesi ------------------------------------------------
function BeklentilerCard({ rows }: { rows: ExpectationRow[] }) {
  return (
    <Card className="pb-4">
      <CardHeader
        action={
          <Gauge
            aria-hidden="true"
            className="text-dealer-700"
            size={18}
            strokeWidth={1.9}
          />
        }
        title="Beklentiler & Finansman Profili"
      />
      <div className="px-5">
        <DetailList rows={rows} />
        <p className="mt-3 rounded-[12px] bg-canvas px-3.5 py-3 text-[12px] text-ink-soft leading-5">
          Müşteri, mevcut aracını takas ederek SUV segmentinde yenileme yapmayı
          planlıyor. Aylık ödeme hedefini aşmayan, 48 ay vadeli bir teklif
          dönüşüm olasılığını en üst düzeye çıkarır.
        </p>
      </div>
    </Card>
  );
}

function IhtiyacAnaliziTab({ data }: { data: DealerCustomerDetail }) {
  return (
    <div className="grid grid-cols-3 gap-5">
      <div className="col-span-2 flex flex-col gap-5">
        <IhtiyacAnaliziCard rows={data.ihtiyacAnalizi} />
        <BeklentilerCard rows={data.beklentiler} />
      </div>
      <div className="flex flex-col gap-5">
        <MusteriOzetiCard rows={data.musteriOzet} />
      </div>
    </div>
  );
}

// --- Araç & Finansman Eşleştirme sekmesi ------------------------------------
// Financing scenarios are computed via computeLoan, not record data — kept inline.
const ESLESME_FIYAT = 1_450_000;
const ESLESME_PESINAT = 300_000;
const ESLESME_FAIZ = 0.0215;
const ESLESME_VADELER = [36, 48, 60];

function FinansmanSenaryolariCard() {
  return (
    <Card className="pb-4">
      <CardHeader
        action={
          <Sparkles
            aria-hidden="true"
            className="text-dealer-700"
            size={18}
            strokeWidth={1.9}
          />
        }
        subtitle={`${formatTRY(ESLESME_FIYAT)} araç · ${formatTRY(ESLESME_PESINAT)} peşinat`}
        title="Finansman Senaryoları"
      />
      <div className="mt-3 px-5">
        <div className="grid grid-cols-[1fr_1.2fr_1.4fr] gap-3 border-line border-b pb-2 font-medium text-[11.5px] text-ink-muted">
          <span>Vade</span>
          <span className="text-right">Aylık Taksit</span>
          <span className="text-right">Toplam Geri Ödeme</span>
        </div>
        {ESLESME_VADELER.map((vade) => {
          const plan = computeLoan({
            price: ESLESME_FIYAT,
            downPayment: ESLESME_PESINAT,
            months: vade,
            baseMonthlyRate: ESLESME_FAIZ,
          });
          return (
            <div
              className="grid grid-cols-[1fr_1.2fr_1.4fr] items-center gap-3 border-line border-b py-2.5 text-[12.5px] tabular-nums last:border-0"
              key={vade}
            >
              <span className="font-semibold text-ink">{vade} Ay</span>
              <span className="text-right font-bold text-dealer-700">
                {formatTRY(plan.monthlyPayment)}
              </span>
              <span className="text-right text-ink-soft">
                {formatTRY(plan.toplamGeriOdeme)}
              </span>
            </div>
          );
        })}
        <p className="mt-3 text-[11px] text-ink-muted">
          KKDF + BSMV dahil efektif orana göre hesaplanmıştır.
        </p>
      </div>
    </Card>
  );
}

function EslestirmeTab({ data }: { data: DealerCustomerDetail }) {
  return (
    <div className="grid grid-cols-3 gap-5">
      <div className="col-span-2 flex flex-col gap-5">
        <OnerilenSegmentlerCard rows={data.segmentler} />
        <FinansmanSenaryolariCard />
      </div>
      <div className="flex flex-col gap-5">
        <AracKrediCard rows={data.aracKredi} />
      </div>
    </div>
  );
}

// --- İletişim Geçmişi sekmesi -----------------------------------------------
const CONTACT_TONE: Record<ContactEvent["tone"], string> = {
  success: "bg-success-tint text-success",
  dealer: "bg-dealer-tint text-dealer-700",
  warn: "bg-warn-tint text-warn",
};

function IletisimZamanCizelgesiCard({ rows }: { rows: ContactEvent[] }) {
  return (
    <Card className="pb-4">
      <CardHeader
        action={
          <span className="flex items-center gap-1.5 text-[12px] text-ink-muted">
            <Users aria-hidden="true" size={14} strokeWidth={1.9} /> Mehmet Kaya
          </span>
        }
        title="İletişim Geçmişi"
      />
      <ol className="mt-4 px-5">
        {rows.map((e, i) => {
          const isLast = i === rows.length - 1;
          return (
            <li className="flex gap-3" key={e.id}>
              <div className="flex flex-col items-center">
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full ${CONTACT_TONE[e.tone]}`}
                >
                  <e.channel aria-hidden="true" size={16} strokeWidth={2} />
                </span>
                {isLast ? null : <span className="w-px flex-1 bg-line" />}
              </div>
              <div className={`flex-1 ${isLast ? "pb-0" : "pb-5"}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-[11.5px] text-ink-muted tabular-nums">
                    <Clock aria-hidden="true" size={12} /> {e.date}
                  </span>
                  <Badge tone={e.tone}>{e.outcome}</Badge>
                </div>
                <p className="mt-1 text-[12.5px] text-ink-soft leading-4">
                  {e.desc}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

function HizliIletisimCard({ rows }: { rows: QuickContact[] }) {
  return (
    <Card className="p-5">
      <h3 className="font-semibold text-[15px] text-ink">Hızlı İletişim</h3>
      <div className="mt-3 grid grid-cols-3 gap-2.5">
        {rows.map((a) => (
          <button
            className="flex flex-col items-center gap-1.5 rounded-[12px] border border-line py-3 font-semibold text-[12px] text-dealer-700 hover:bg-dealer-tint"
            key={a.id}
            type="button"
          >
            <a.icon aria-hidden="true" size={18} strokeWidth={1.9} />
            {a.label}
          </button>
        ))}
      </div>
    </Card>
  );
}

function IletisimTab({ data }: { data: DealerCustomerDetail }) {
  return (
    <div className="grid grid-cols-3 gap-5">
      <div className="col-span-2 flex flex-col gap-5">
        <IletisimZamanCizelgesiCard rows={data.iletisimGecmisi} />
      </div>
      <div className="flex flex-col gap-5">
        <SonEtkilesimlerCard rows={data.etkilesimler} />
        <HizliIletisimCard rows={data.hizliIletisim} />
      </div>
    </div>
  );
}

const SHELL_PROPS = {
  actions: (
    <div className="flex items-center gap-2.5">
      <button
        className="flex items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-3.5 py-2 font-medium text-[13px] text-ink-soft hover:bg-canvas"
        type="button"
      >
        <MessageSquarePlus aria-hidden="true" size={16} strokeWidth={1.9} />
        Not Ekle
      </button>
      <button
        className="flex items-center gap-2 rounded-[10px] bg-dealer px-3.5 py-2 font-semibold text-[13px] text-white hover:bg-dealer-600"
        type="button"
      >
        <PlusCircle aria-hidden="true" size={16} strokeWidth={2} />
        Teklif Oluştur
      </button>
    </div>
  ),
  breadcrumb: ["Fırsat Havuzu", "Müşteri Detay"],
  highlight: <Badge tone="success">Yüksek Skor</Badge>,
  subtitle:
    "Müşteri bilgilerini inceleyin, ihtiyaç analizini tamamlayın ve teklif oluşturun.",
  title: "Müşteri Detayı",
} as const;

function CustomerDetailBody({ data }: { data: DealerCustomerDetail }) {
  return (
    <>
      <HeaderCard quickFacts={data.quickFacts} />

      <Tabs className="mt-5 gap-0" defaultValue="genel">
        <TabsList
          className="mb-5 h-auto w-full justify-start gap-6 border-line border-b p-0"
          variant="line"
        >
          {TABS.map((t) => (
            <TabsTrigger
              className="flex-none px-0 pb-3 text-[13.5px] text-ink-muted after:bottom-[-1px] after:h-0.5 after:bg-dealer data-[state=active]:font-semibold data-[state=active]:text-dealer-700 data-[state=active]:after:opacity-100"
              key={t.id}
              value={t.id}
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent className="mt-0" value="genel">
          <GenelBakis data={data} />
        </TabsContent>
        <TabsContent className="mt-0" value="ihtiyac">
          <IhtiyacAnaliziTab data={data} />
        </TabsContent>
        <TabsContent className="mt-0" value="eslestirme">
          <EslestirmeTab data={data} />
        </TabsContent>
        <TabsContent className="mt-0" value="iletisim">
          <IletisimTab data={data} />
        </TabsContent>
      </Tabs>
    </>
  );
}

export function DealerMusteriDetay() {
  const { data, isPending, isError, refetch } = useDealerCustomerDetail();

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
      <CustomerDetailBody data={data} />
    </DealerShell>
  );
}
