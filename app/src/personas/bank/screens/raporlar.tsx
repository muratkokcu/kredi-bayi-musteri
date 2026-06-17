import {
  ArrowUp,
  CalendarRange,
  Car,
  ChevronDown,
  CircleCheck,
  CreditCard,
  FileText,
} from "lucide-react";
import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart } from "@/ui/area-chart";
import { Card, CardHeader } from "@/ui/card";
import { FunnelChart } from "@/ui/funnel-chart";
import { ScoreRing } from "@/ui/score-ring";
import { StatCard } from "@/ui/stat-card";
import { BankShell } from "../bank-shell";

interface Kpi {
  delta: string;
  icon: ReactNode;
  label: string;
  tone: "bank" | "dealer" | "cust" | "warn" | "teal";
  value: string;
}

const KPIS: Kpi[] = [
  {
    icon: <ScoreRing showValue={false} size={26} stroke={4} value={33} />,
    label: "Yenileme Oranı",
    value: "%32,6",
    delta: "%4,3",
    tone: "teal",
  },
  {
    icon: <Car size={20} strokeWidth={1.9} />,
    label: "Toplam Uygun Müşteri",
    value: "18.492",
    delta: "%12,4",
    tone: "bank",
  },
  {
    icon: <FileText size={20} strokeWidth={1.9} />,
    label: "Teklif Gönderilen",
    value: "6.842",
    delta: "%8,7",
    tone: "warn",
  },
  {
    icon: <CircleCheck size={20} strokeWidth={1.9} />,
    label: "Kabul Edilen",
    value: "2.231",
    delta: "%9,1",
    tone: "cust",
  },
  {
    icon: <CreditCard size={20} strokeWidth={1.9} />,
    label: "Toplam Hacim",
    value: "₺1,28 Milyar",
    delta: "%15,6",
    tone: "dealer",
  },
];

const TREND_LABELS = [
  "May 2024",
  "Haz 2024",
  "Tem 2024",
  "Ağu 2024",
  "Eyl 2024",
  "Eki 2024",
  "Kas 2024",
  "Ara 2024",
  "Oca 2025",
  "Şub 2025",
  "Mar 2025",
  "Nis 2025",
];

const TREND_DATA = [24, 25, 23, 27, 26, 28, 29, 27, 30, 31, 32, 32.6];

const TREND_TICKS = ["%40", "%30", "%20", "%10", "%0"];

interface SegmentRow {
  color: string;
  label: string;
  value: string;
}

const SEGMENTS: SegmentRow[] = [
  { label: "SUV", value: "%38,2", color: "var(--color-bank)" },
  { label: "Sedan", value: "%31,4", color: "var(--color-dealer)" },
  { label: "Hatchback", value: "%27,1", color: "#f59e0b" },
  { label: "MPV", value: "%24,8", color: "#f59e0b" },
  { label: "Diğer", value: "%18,3", color: "var(--color-cust)" },
];

const FUNNEL_STAGES = [
  { label: "Uygun Müşteri", value: "18.492", pct: "%100", frac: 1 },
  { label: "İletişime Geçilen", value: "9.842", pct: "%53,2", frac: 0.78 },
  { label: "Teklif Gönderilen", value: "6.842", pct: "%36,9", frac: 0.58 },
  { label: "Teklif Görüntülenen", value: "3.192", pct: "%17,3", frac: 0.4 },
  { label: "Kabul Edilen", value: "2.231", pct: "%12,1", frac: 0.26 },
];

interface BayiRow {
  ad: string;
  hacim: string;
  oran: string;
  teklif: string;
}

const BAYILER: BayiRow[] = [
  { ad: "Doğuş Oto", teklif: "1.248", oran: "%18,7", hacim: "₺285.4 M" },
  { ad: "Borusan Otomotiv", teklif: "1.102", oran: "%17,3", hacim: "₺238.7 M" },
  { ad: "Otokoç", teklif: "987", oran: "%16,2", hacim: "₺212.3 M" },
  { ad: "Groupe PSA", teklif: "765", oran: "%15,8", hacim: "₺162.6 M" },
  { ad: "Kaya Otomotiv", teklif: "612", oran: "%14,9", hacim: "₺128.9 M" },
];

interface RegionRow {
  bolge: string;
  oran: number;
}

const REGIONS: RegionRow[] = [
  { bolge: "Marmara", oran: 48 },
  { bolge: "Ege", oran: 41 },
  { bolge: "İç Anadolu", oran: 36 },
  { bolge: "Akdeniz", oran: 33 },
  { bolge: "Karadeniz", oran: 24 },
  { bolge: "Doğu Anadolu", oran: 18 },
  { bolge: "Güneydoğu Anadolu", oran: 15 },
];

interface DonemRow {
  degisim: string;
  gosterge: string;
  oncki: string;
  secili: string;
}

const DONEM: DonemRow[] = [
  {
    gosterge: "Yenileme Oranı",
    secili: "%32,6",
    oncki: "%28,3",
    degisim: "%4,3",
  },
  {
    gosterge: "Uygun Müşteri",
    secili: "18.492",
    oncki: "16.446",
    degisim: "%12,4",
  },
  {
    gosterge: "Teklif Gönderilen",
    secili: "6.842",
    oncki: "6.301",
    degisim: "%8,7",
  },
  {
    gosterge: "Kabul Edilen",
    secili: "2.231",
    oncki: "2.045",
    degisim: "%9,1",
  },
  {
    gosterge: "Toplam Hacim",
    secili: "₺1,28 Milyar",
    oncki: "₺1,11 Milyar",
    degisim: "%15,6",
  },
];

const BAYI_ORAN: { ad: string; oran: string; pct: number }[] = [
  { ad: "Doğuş Oto", oran: "%38,7", pct: 100 },
  { ad: "Borusan Otomotiv", oran: "%36,1", pct: 93 },
  { ad: "Otokoç", oran: "%33,4", pct: 86 },
  { ad: "Groupe PSA", oran: "%31,2", pct: 81 },
  { ad: "Kaya Otomotiv", oran: "%28,9", pct: 75 },
];

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

function KpiRow() {
  return (
    <div className="grid grid-cols-5 gap-4">
      {KPIS.map((k) => (
        <StatCard
          icon={k.icon}
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
          tone={k.tone}
          value={k.value}
        />
      ))}
    </div>
  );
}

/** Inline hand-drawn donut for segment dağılımı, centered overall figure. */
function SegmentDonut() {
  const size = 168;
  const stroke = 22;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const fracs = [0.27, 0.23, 0.18, 0.17, 0.15];
  const colors = SEGMENTS.map((s) => s.color);
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
              key={SEGMENTS[i].label}
              r={r}
              stroke={colors[i]}
              strokeDasharray={`${dash - 3} ${c - dash + 3}`}
              strokeDashoffset={-offset}
              strokeWidth={stroke}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
        })}
      </svg>
      <span className="absolute flex flex-col items-center">
        <span className="font-bold text-[24px] text-ink leading-6 tracking-tight">
          %32,6
        </span>
        <span className="mt-0.5 text-[11px] text-ink-muted">
          Genel Ortalama
        </span>
      </span>
    </span>
  );
}

function SegmentCard() {
  return (
    <Card className="pb-5">
      <CardHeader title="Segment Bazlı Yenileme Oranı" />
      <div className="mt-3 flex items-center gap-6 px-5">
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
    </Card>
  );
}

function TrendCard({ twoSeries = false }: { twoSeries?: boolean }) {
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
          data={TREND_DATA}
          height={236}
          highlight={11}
          highlightLabel="Nis 2025"
          highlightValue="%32,6"
          labels={TREND_LABELS}
          yTicks={TREND_TICKS}
        />
      </div>
    </Card>
  );
}

function FunnelCard() {
  return (
    <Card className="pb-5">
      <CardHeader title="Yenileme Hunisi" />
      <div className="mt-4 px-5">
        <FunnelChart stages={FUNNEL_STAGES} />
      </div>
    </Card>
  );
}

function BayiTableCard() {
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
        {BAYILER.map((b) => (
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
function RegionCard() {
  return (
    <Card className="pb-5">
      <CardHeader title="Bölge Bazlı Yenileme Oranı" />
      <div className="mt-4 flex gap-5 px-5">
        <div className="relative flex h-44 flex-1 items-center justify-center overflow-hidden rounded-xl bg-canvas">
          <svg
            aria-hidden="true"
            className="text-bank/30"
            fill="currentColor"
            height="120"
            viewBox="0 0 200 90"
            width="220"
          >
            <path d="M14 44 C20 30 40 22 64 24 C80 18 110 16 134 22 C158 20 184 30 192 44 C188 56 168 64 140 62 C120 70 88 70 64 62 C40 64 18 56 14 44 Z" />
            <circle cx="48" cy="40" fill="var(--color-bank)" r="6" />
            <circle cx="78" cy="46" fill="var(--color-bank-600)" r="5" />
            <circle
              cx="116"
              cy="42"
              fill="var(--color-bank)"
              opacity="0.5"
              r="5"
            />
            <circle
              cx="150"
              cy="48"
              fill="var(--color-bank)"
              opacity="0.3"
              r="4"
            />
          </svg>
          <div className="absolute right-3 bottom-3 flex flex-col items-end gap-1 text-[10px] text-ink-muted">
            <span>%50</span>
            <span className="h-12 w-2 rounded-full bg-gradient-to-b from-bank to-bank/15" />
            <span>%10</span>
          </div>
        </div>
        <div className="w-[200px] shrink-0">
          {REGIONS.map((r) => (
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

function DonemCard() {
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
        {DONEM.map((d) => (
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

function BayiOranCard() {
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
        {BAYI_ORAN.map((b) => (
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
          <KpiRow />
          <div className="mt-5 grid grid-cols-[1.7fr_1fr] gap-5">
            <TrendCard />
            <SegmentCard />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-5">
            <FunnelCard />
            <BayiTableCard />
            <RegionCard />
          </div>
        </TabsContent>

        {/* YENİLEME PERFORMANSI */}
        <TabsContent className="mt-0" value="yenileme">
          <KpiRow />
          <div className="mt-5 grid grid-cols-[1.7fr_1fr] gap-5">
            <TrendCard twoSeries />
            <FunnelCard />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-5">
            <DonemCard />
            <SegmentCard />
            <BayiOranCard />
          </div>
        </TabsContent>

        {/* SEGMENT ANALİZİ */}
        <TabsContent className="mt-0" value="segment">
          <KpiRow />
          <div className="mt-5 grid grid-cols-2 gap-5">
            <SegmentCard />
            <TrendCard />
          </div>
        </TabsContent>

        {/* BAYİ PERFORMANSI */}
        <TabsContent className="mt-0" value="bayi">
          <KpiRow />
          <div className="mt-5 grid grid-cols-[1.4fr_1fr] gap-5">
            <BayiTableCard />
            <BayiOranCard />
          </div>
        </TabsContent>

        {/* MÜŞTERİ ANALİZİ */}
        <TabsContent className="mt-0" value="musteri">
          <KpiRow />
          <div className="mt-5 grid grid-cols-[1.7fr_1fr] gap-5">
            <TrendCard />
            <FunnelCard />
          </div>
        </TabsContent>
      </Tabs>

      <p className="mt-6 text-[12px] text-ink-muted">{REPORT_NOTE}</p>
    </BankShell>
  );
}
