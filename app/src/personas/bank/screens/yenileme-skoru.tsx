import {
  Activity,
  CalendarClock,
  Car,
  type Clock,
  History,
  Info,
  Plus,
  Sigma,
  TrendingDown,
  TrendingUp,
  Upload,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardHeader } from "@/ui/card";
import { BankShell } from "../bank-shell";

interface ScoreParam {
  desc: string;
  icon: typeof Clock;
  id: string;
  label: string;
  options: string[];
  selectLabel: string;
  selectValue: string;
  weight: number;
}

const PARAMS: ScoreParam[] = [
  {
    id: "kalan-sure",
    icon: CalendarClock,
    label: "Kredi Bitişine Kalan Süre",
    desc: "Kredinin bitiş tarihine kalan süre azaldıkça skor artar.",
    selectLabel: "Son X ay eşiği",
    selectValue: "12 Ay",
    options: ["3 Ay", "6 Ay", "12 Ay", "18 Ay", "24 Ay"],
    weight: 25,
  },
  {
    id: "arac-yasi",
    icon: Car,
    label: "Araç Yaşı",
    desc: "Aracın yaşı arttıkça yenileme olasılığı artar.",
    selectLabel: "Yaş eşiği",
    selectValue: "8 Yaş ve üzeri",
    options: [
      "4 Yaş ve üzeri",
      "6 Yaş ve üzeri",
      "8 Yaş ve üzeri",
      "10 Yaş ve üzeri",
    ],
    weight: 20,
  },
  {
    id: "odeme-performansi",
    icon: Wallet,
    label: "Ödeme Performansı",
    desc: "Düzenli ödeme yapan müşterilerin skoru daha yüksek olur.",
    selectLabel: "Gecikme toleransı",
    selectValue: "30 Gün",
    options: ["0 Gün", "15 Gün", "30 Gün", "60 Gün"],
    weight: 20,
  },
  {
    id: "gecikme-gecmisi",
    icon: TrendingDown,
    label: "Gecikme Geçmişi",
    desc: "Geçmiş gecikmeler skor üzerinde negatif etki yaratır.",
    selectLabel: "Ceza katsayısı",
    selectValue: "Orta",
    options: ["Düşük", "Orta", "Yüksek"],
    weight: 15,
  },
  {
    id: "segment-talebi",
    icon: TrendingUp,
    label: "Segment Talebi",
    desc: "Müşterinin bulunduğu segmentin güncel piyasa talebi.",
    selectLabel: "Talep kaynağı",
    selectValue: "Piyasa Analizi",
    options: ["Piyasa Analizi", "İç Veri", "Karma Model"],
    weight: 10,
  },
  {
    id: "etkilesim-gecmisi",
    icon: Activity,
    label: "Etkileşim Geçmişi",
    desc: "Bayiler ve müşteri arasındaki geçmiş etkileşimler.",
    selectLabel: "Etkileşim süresi",
    selectValue: "Son 6 Ay",
    options: ["Son 3 Ay", "Son 6 Ay", "Son 12 Ay", "Tüm Zamanlar"],
    weight: 10,
  },
];

const TABS = ["Parametreler", "Segment Ayarları", "Simülasyon Geçmişi"];

interface Bucket {
  color: string;
  count: string;
  frac: number;
  label: string;
  pct: string;
}

const BUCKETS: Bucket[] = [
  {
    label: "Düşük (0-49)",
    count: "76.245",
    pct: "%31",
    frac: 31,
    color: "var(--color-danger)",
  },
  {
    label: "Orta (50-74)",
    count: "89.312",
    pct: "%36",
    frac: 36,
    color: "var(--color-warn)",
  },
  {
    label: "Yüksek (75-100)",
    count: "80.273",
    pct: "%33",
    frac: 33,
    color: "var(--color-success)",
  },
];

const FORMULA_ROWS: { label: string; weight: string }[] = [
  { label: "Kredi Bitişine Kalan Süre", weight: "%25" },
  { label: "Araç Yaşı", weight: "%20" },
  { label: "Ödeme Performansı", weight: "%20" },
  { label: "Gecikme Geçmişi", weight: "%15" },
  { label: "Segment Talebi", weight: "%10" },
  { label: "Etkileşim Geçmişi", weight: "%10" },
];

function ParamRow({ param }: { param: ScoreParam }) {
  const [weight, setWeight] = useState(param.weight);
  const Icon = param.icon;
  return (
    <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1.2fr)] items-center gap-5 border-line border-b px-5 py-4 last:border-0">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-bank-tint text-bank-600">
          <Icon size={18} strokeWidth={1.9} />
        </span>
        <div className="leading-tight">
          <div className="font-semibold text-[13.5px] text-ink">
            {param.label}
          </div>
          <p className="mt-0.5 text-[12px] text-ink-muted leading-4">
            {param.desc}
          </p>
        </div>
      </div>

      <div>
        <div className="mb-1.5 font-medium text-[11.5px] text-ink-muted">
          {param.selectLabel}
        </div>
        <Select defaultValue={param.selectValue}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {param.options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="mb-1.5 flex items-center gap-1 font-medium text-[11.5px] text-ink-muted">
          Ağırlık <Info size={12} />
        </div>
        <div className="flex items-center gap-3">
          <Slider
            aria-label={`${param.label} ağırlığı`}
            className="flex-1"
            max={50}
            min={0}
            onValueChange={(v) => setWeight(v[0] ?? 0)}
            step={5}
            value={[weight]}
          />
          <span className="w-10 text-right font-semibold text-[13px] text-ink tabular-nums">
            %{weight}
          </span>
        </div>
      </div>
    </div>
  );
}

export function BankYenilemeSkoru() {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <BankShell
      actions={
        <>
          <button
            className="flex items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-3.5 py-2 font-medium text-[13px] text-ink-soft hover:bg-canvas"
            type="button"
          >
            <Info size={16} /> Algoritma Hakkında
          </button>
          <button
            className="flex items-center gap-2 rounded-[10px] bg-bank px-3.5 py-2 font-semibold text-[13px] text-white hover:bg-bank-600"
            type="button"
          >
            <Upload size={16} /> Değişiklikleri Kaydet
          </button>
        </>
      }
      breadcrumb={["Yenileme Skoru", "Skor Ayarları"]}
      subtitle="Yenileme skorunun hesaplanmasında kullanılan parametreleri ve ağırlıkları yapılandırın."
      title="Yenileme Skoru Ayarları"
    >
      <div className="grid grid-cols-3 gap-5">
        {/* left: parameters */}
        <div className="col-span-2 flex flex-col gap-5">
          <Card className="overflow-hidden">
            <div className="flex gap-6 border-line border-b px-5 pt-4">
              {TABS.map((tab) => (
                <button
                  className={`-mb-px border-b-2 pb-3 font-semibold text-[13.5px] ${
                    tab === activeTab
                      ? "border-bank text-bank-700"
                      : "border-transparent text-ink-muted hover:text-ink-soft"
                  }`}
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  type="button"
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="px-5 pt-4 pb-1">
              <h3 className="font-semibold text-[14px] text-ink">
                Skor Parametreleri
              </h3>
            </div>

            <div>
              {PARAMS.map((p) => (
                <ParamRow key={p.id} param={p} />
              ))}
            </div>

            <div className="border-line border-t px-5 py-3.5">
              <button
                className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-line-strong border-dashed py-2.5 font-semibold text-[13px] text-ink-soft hover:bg-canvas"
                type="button"
              >
                <Plus size={16} /> Yeni Parametre Ekle
              </button>
            </div>
          </Card>
        </div>

        {/* right: preview + formula */}
        <div className="flex flex-col gap-5">
          <Card className="pb-5">
            <CardHeader
              action={<Info className="text-ink-muted" size={15} />}
              title="Skor Dağılımı Önizleme"
            />
            <div className="mt-4 flex items-center justify-between px-5">
              <span className="text-[12.5px] text-ink-muted">
                Toplam Müşteri
              </span>
              <span className="font-bold text-[22px] text-ink tabular-nums">
                245.830
              </span>
            </div>

            {/* stacked distribution bar */}
            <div className="mt-3 flex h-2.5 gap-1 px-5">
              {BUCKETS.map((b) => (
                <span
                  className="h-full rounded-full"
                  key={b.label}
                  style={{ flex: b.frac, background: b.color }}
                />
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-2.5 px-5">
              {BUCKETS.map((b) => (
                <div className="flex items-center gap-2.5" key={b.label}>
                  <span
                    className="size-2.5 rounded-full"
                    style={{ background: b.color }}
                  />
                  <span className="flex-1 text-[12.5px] text-ink-soft">
                    {b.label}
                  </span>
                  <span className="font-bold text-[12.5px] text-ink tabular-nums">
                    {b.count}
                  </span>
                  <span className="w-12 text-right text-[12.5px] text-ink-muted tabular-nums">
                    ({b.pct})
                  </span>
                </div>
              ))}
            </div>

            <div className="mx-5 mt-4 flex items-start gap-2.5 rounded-[10px] border border-success/20 bg-success-tint px-3.5 py-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                <TrendingUp size={15} strokeWidth={2} />
              </span>
              <p className="text-[12px] text-ink-soft leading-4">
                Mevcut ayarlara göre yüksek skorlu müşteri oranı{" "}
                <span className="font-bold text-success">%33</span> olarak
                hesaplanmıştır.
              </p>
            </div>
          </Card>

          <Card className="pb-5">
            <CardHeader title="Skor Hesaplama Formülü" />
            <p className="mt-1 px-5 text-[12px] text-ink-muted leading-4">
              Yenileme skoru aşağıdaki formül ile hesaplanır.
            </p>

            <div className="mx-5 mt-3 flex items-center gap-2 rounded-[10px] bg-canvas px-3.5 py-2.5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-bank-tint text-bank-700">
                <Sigma size={14} strokeWidth={2.2} />
              </span>
              <span className="text-[12.5px] text-ink-soft">
                <span className="font-bold text-ink">Skor</span> = Σ ( Parametre
                Puanı × Ağırlık )
              </span>
            </div>

            <dl className="mt-4 flex flex-col gap-2.5 px-5">
              {FORMULA_ROWS.map((r) => (
                <div
                  className="flex items-center justify-between"
                  key={r.label}
                >
                  <dt className="text-[12.5px] text-ink-soft">{r.label}</dt>
                  <dd className="font-semibold text-[12.5px] text-ink tabular-nums">
                    {r.weight}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mx-0 mt-3 flex items-center justify-between border-line border-t px-5 pt-3">
              <span className="font-semibold text-[13px] text-ink">Toplam</span>
              <span className="font-bold text-[14px] text-bank-700 tabular-nums">
                %100
              </span>
            </div>
          </Card>

          <Card className="px-5 py-4">
            <div className="font-semibold text-[13px] text-ink">
              Son Güncelleme
            </div>
            <div className="mt-1 text-[12.5px] text-ink-muted tabular-nums">
              22.04.2025 14:30 · Ahmet Kaya
            </div>
            <button
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-[10px] border border-line-strong py-2 font-semibold text-[12.5px] text-ink-soft hover:bg-canvas"
              type="button"
            >
              <History size={15} /> Değişiklik Geçmişini Görüntüle
            </button>
          </Card>
        </div>
      </div>
    </BankShell>
  );
}
