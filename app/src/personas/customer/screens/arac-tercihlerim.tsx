import { useRouter } from "@tanstack/react-router";
import {
  Calendar,
  Car,
  CarFront,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Fuel,
  Gauge,
  Heart,
  HelpCircle,
  type LucideIcon,
  Pencil,
  Settings2,
  SlidersHorizontal,
  Truck,
  Zap,
} from "lucide-react";
import { useState } from "react";
import suvImg from "@/assets/beyaz-suv.png";
import { Slider } from "@/components/ui/slider";
import { getModel, vitesTipleri, yakitTipleri } from "@/data/arac-taksonomisi";
import type {
  KayitliArama,
  OnerilenArac,
} from "@/data/vehicle-preferences";
import { useVehiclePreferences } from "@/queries/vehicle-preferences";
import { ErrorState, LoadingState, EmptyState } from "@/ui/async-states";
import { VehicleImage } from "@/ui/vehicle-image";
import { MobileShell } from "../mobile-shell";

interface TipAlani {
  icon: LucideIcon;
  label: string;
}

const TIP_ALANLARI: TipAlani[] = [
  { label: "SUV", icon: CarFront },
  { label: "Sedan", icon: Car },
  { label: "Hatchback", icon: Car },
  { label: "Crossover", icon: CarFront },
  { label: "Elektrikli", icon: Zap },
  { label: "Ticari", icon: Truck },
];

const YAKIT_SECENEKLERI = ["Farketmez", ...yakitTipleri];
const VITES_SECENEKLERI = [...vitesTipleri, "Farketmez"];
const MODEL_SECENEKLERI = [
  "2020 ve sonrası",
  "2022 ve sonrası",
  "2024 ve sonrası",
  "Farketmez",
];
const KM_SECENEKLERI = [
  "Farketmez",
  "0 - 30.000",
  "30.000 - 80.000",
  "80.000+",
];
const PESINAT_SECENEKLERI = [
  "₺150.000 - ₺500.000",
  "₺0 - ₺150.000",
  "₺500.000 ve üzeri",
];

// Recommended-vehicle name + variant are taxonomy-derived presentation, kept
// inline; the etiketler / taksit / peşinat / segment fields are server data.
const tiguan = getModel("volkswagen", "tiguan");
const octavia = getModel("skoda", "octavia");
const seal = getModel("byd", "seal");

const ONERILEN_ARAC_ADLARI: { ad: string; varyant: string }[] = [
  {
    ad: `Volkswagen ${tiguan?.model ?? "Tiguan"}`,
    varyant: `1.5 TSI · ${tiguan?.varyantlar[0] ?? "1.5 TSI"} DSG`,
  },
  {
    ad: `Skoda ${octavia?.model ?? "Octavia"}`,
    varyant: `1.5 TSI · ${octavia?.varyantlar[1] ?? "1.5 TSI"} Premium DSG`,
  },
  {
    ad: `BYD ${seal?.model ?? "Seal"}`,
    varyant: "Elektrikli · Tek Motor · Otomatik",
  },
];

function fmtTry(value: number): string {
  return `₺${value.toLocaleString("tr-TR")}`;
}

function nextOption(list: string[], current: string): string {
  const index = list.indexOf(current);
  return list[(index + 1) % list.length];
}

interface SectionTitleProps {
  title: string;
}

function SectionTitle({ title }: SectionTitleProps) {
  return <div className="font-semibold text-[15px] text-ink">{title}</div>;
}

function KayitliAramalarList({ aramalar }: { aramalar: KayitliArama[] }) {
  if (aramalar.length === 0) {
    return <EmptyState label="Kayıtlı arama bulunamadı." />;
  }
  return (
    <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-1">
      {aramalar.map((arama) => (
        <div
          className="flex w-[218px] shrink-0 flex-col gap-2 rounded-2xl bg-surface p-3.5 shadow-[var(--shadow-card)]"
          key={arama.ad}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate font-semibold text-[13.5px] text-ink">
                {arama.ad}
              </div>
              <div className="text-[11px] text-ink-muted">{arama.detay}</div>
              <div className="mt-1 font-semibold text-[12px] text-ink">
                {arama.fiyat}
              </div>
            </div>
            <VehicleImage
              className="h-12 w-[72px] shrink-0 rounded-lg bg-transparent"
              iconSize={24}
              name={arama.name}
              segment={arama.segment}
            />
          </div>
          <span className="inline-flex w-fit items-center rounded-full bg-cust-tint px-2.5 py-1 font-semibold text-[10.5px] text-cust-600">
            {arama.adet}
          </span>
        </div>
      ))}
    </div>
  );
}

function OnerilenAraclarList({ araclar }: { araclar: OnerilenArac[] }) {
  if (araclar.length === 0) {
    return <EmptyState label="Önerilen araç bulunamadı." />;
  }
  return (
    <div className="flex flex-col gap-3">
      {araclar.map((arac, i) => {
        // Name + variant are taxonomy-derived presentation, kept inline.
        const ad = ONERILEN_ARAC_ADLARI[i]?.ad ?? `Önerilen Araç ${i + 1}`;
        const varyant = ONERILEN_ARAC_ADLARI[i]?.varyant ?? "";
        return (
          <div
            className="rounded-2xl bg-surface p-3.5 shadow-[var(--shadow-card)]"
            key={ad}
          >
            <div className="flex items-start gap-3">
              <VehicleImage
                className="h-16 w-20 shrink-0 rounded-xl"
                iconSize={28}
                name={ad}
                segment={arac.segment}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-[14px] text-ink">
                      {ad}
                    </div>
                    <div className="truncate text-[11.5px] text-ink-muted">
                      {varyant}
                    </div>
                  </div>
                  <button
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-cust-tint text-cust"
                    type="button"
                  >
                    <Heart size={16} strokeWidth={1.9} />
                  </button>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {arac.etiketler.map((etiket) => (
                    <span
                      className="rounded-md bg-canvas px-1.5 py-0.5 text-[10px] text-ink-soft"
                      key={etiket}
                    >
                      {etiket}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-line border-t pt-3">
              <div>
                <div className="text-[10.5px] text-ink-muted">Aylık taksit</div>
                <div className="font-bold text-[16px] text-ink">
                  {arac.taksit}
                </div>
                <div className="text-[10.5px] text-ink-muted">
                  {arac.pesinat}
                </div>
              </div>
              <button
                className="rounded-full bg-cust px-5 py-2.5 font-semibold text-[13px] text-white"
                type="button"
              >
                Teklif Gör
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CustomerAracTercihlerim() {
  const router = useRouter();
  const [secilenTipler, setSecilenTipler] = useState<string[]>(["SUV"]);
  const toggleTip = (label: string) =>
    setSecilenTipler((prev) =>
      prev.includes(label)
        ? prev.filter((t) => t !== label)
        : [...prev, label]
    );
  const [butce, setButce] = useState([10_000, 25_000]);
  const [pesinatLabel, setPesinatLabel] = useState(PESINAT_SECENEKLERI[0]);
  const [yakit, setYakit] = useState("Farketmez");
  const [vites, setVites] = useState("Otomatik");
  const [modelYili, setModelYili] = useState("2020 ve sonrası");
  const [kilometre, setKilometre] = useState("Farketmez");

  const { data, isPending, isError, refetch } = useVehiclePreferences();

  const digerTercihler = [
    {
      id: "yakit",
      icon: Fuel,
      label: "Yakıt Tipi",
      value: yakit,
      onCycle: () => setYakit(nextOption(YAKIT_SECENEKLERI, yakit)),
    },
    {
      id: "vites",
      icon: Settings2,
      label: "Vites Tipi",
      value: vites,
      onCycle: () => setVites(nextOption(VITES_SECENEKLERI, vites)),
    },
    {
      id: "model",
      icon: Calendar,
      label: "Model Yılı",
      value: modelYili,
      onCycle: () => setModelYili(nextOption(MODEL_SECENEKLERI, modelYili)),
    },
    {
      id: "km",
      icon: Gauge,
      label: "Kilometre",
      value: kilometre,
      onCycle: () => setKilometre(nextOption(KM_SECENEKLERI, kilometre)),
    },
  ];

  return (
    <MobileShell tab="Ana Sayfa">
      <div className="flex flex-col pb-6">
        {/* back header */}
        <div className="flex items-center justify-between px-5 py-3">
          <button
            className="flex size-9 items-center justify-center rounded-full bg-surface text-ink-soft shadow-[var(--shadow-card)]"
            onClick={() => router.history.back()}
            type="button"
          >
            <ChevronLeft size={20} strokeWidth={2.2} />
          </button>
          <span className="font-bold text-[16px] text-ink">
            Araç Tercihlerim
          </span>
          <button
            className="flex size-9 items-center justify-center rounded-full bg-surface text-ink-soft shadow-[var(--shadow-card)]"
            type="button"
          >
            <HelpCircle size={18} strokeWidth={1.9} />
          </button>
        </div>

        {/* hero */}
        <div className="flex items-center gap-2 px-5 pt-1 pb-4">
          <div className="flex-1">
            <h1 className="font-bold text-[19px] text-ink leading-tight">
              Hayalindeki aracı birlikte bulalım
            </h1>
            <p className="mt-1 text-[12px] text-ink-muted leading-4">
              Tercihlerini seç, sana en uygun araçları ve teklifleri sunalım.
            </p>
          </div>
          <div className="relative h-[88px] w-[112px] shrink-0">
            <span
              aria-hidden="true"
              className="absolute top-1/2 right-[-14px] size-[88px] -translate-y-1/2 rounded-full bg-cust-tint"
            />
            <img
              alt="Önerilen SUV"
              className="absolute top-1/2 right-[-20px] w-[132px] max-w-none -translate-y-1/2"
              height={64}
              src={suvImg}
              width={132}
            />
          </div>
        </div>

        <div className="flex flex-col gap-5 px-5">
          {/* İlgi Alanlarım */}
          <div className="flex flex-col gap-3 rounded-2xl bg-surface p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between">
              <SectionTitle title="İlgi Alanlarım" />
              <button
                className="flex items-center gap-1 font-semibold text-[12px] text-cust"
                type="button"
              >
                Düzenle <Pencil size={12} strokeWidth={2.1} />
              </button>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {TIP_ALANLARI.map(({ label, icon: Icon }) => {
                const on = secilenTipler.includes(label);
                return (
                  <button
                    aria-pressed={on}
                    className={`relative flex flex-col items-center gap-1.5 rounded-xl border py-2.5 transition-colors ${
                      on
                        ? "border-2 border-cust bg-cust-tint text-cust-600"
                        : "border-line bg-surface text-ink-soft"
                    }`}
                    key={label}
                    onClick={() => toggleTip(label)}
                    type="button"
                  >
                    {on ? (
                      <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-cust text-white">
                        <Check size={10} strokeWidth={3} />
                      </span>
                    ) : null}
                    <Icon
                      className={on ? "text-cust" : "text-ink-muted"}
                      size={19}
                      strokeWidth={1.9}
                    />
                    <span className="font-medium text-[9.5px] leading-none">
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bütçe Aralığım */}
          <div className="flex flex-col gap-3 rounded-2xl bg-surface p-4 shadow-[var(--shadow-card)]">
            <SectionTitle title="Bütçe Aralığım" />
            <div className="grid grid-cols-2 gap-4">
              {/* aylık taksit slider */}
              <div className="flex flex-col gap-2.5 pr-4">
                <span className="text-[12px] text-ink-muted">Aylık taksit</span>
                <span className="font-bold text-[15px] text-cust-600">
                  {fmtTry(butce[0])} - {fmtTry(butce[1])}
                </span>
                <Slider
                  max={40_000}
                  min={5000}
                  minStepsBetweenThumbs={1}
                  onValueChange={setButce}
                  step={500}
                  value={butce}
                />
                <div className="flex items-center justify-between text-[10.5px] text-ink-muted">
                  <span>₺5.000</span>
                  <span>₺40.000+</span>
                </div>
              </div>
              {/* peşinat tappable row */}
              <button
                className="flex items-center justify-between gap-2 border-line border-l pl-4 text-left"
                onClick={() =>
                  setPesinatLabel(nextOption(PESINAT_SECENEKLERI, pesinatLabel))
                }
                type="button"
              >
                <div className="flex flex-col gap-2.5">
                  <span className="text-[12px] text-ink-muted">Peşinat</span>
                  <span className="font-bold text-[15px] text-ink">
                    {pesinatLabel}
                  </span>
                </div>
                <ChevronRight
                  className="shrink-0 text-ink-muted"
                  size={18}
                  strokeWidth={2}
                />
              </button>
            </div>
          </div>

          {/* Diğer Tercihlerim */}
          <div className="flex flex-col gap-3">
            <SectionTitle title="Diğer Tercihlerim" />
            <div className="-mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1">
              {digerTercihler.map(
                ({ id, icon: Icon, label, value, onCycle }) => (
                  <button
                    className="flex w-[150px] shrink-0 items-center gap-2.5 rounded-2xl bg-surface p-3 text-left shadow-[var(--shadow-card)]"
                    key={id}
                    onClick={onCycle}
                    type="button"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-cust-tint text-cust">
                      <Icon size={17} strokeWidth={1.9} />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[10.5px] text-ink-muted">
                        {label}
                      </div>
                      <div className="truncate font-bold text-[12.5px] text-ink">
                        {value}
                      </div>
                    </div>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Kayıtlı Aramalarım */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <SectionTitle title="Kayıtlı Aramalarım" />
              <button
                className="font-semibold text-[12px] text-cust"
                type="button"
              >
                Tümünü Gör
              </button>
            </div>
            {isPending && <LoadingState />}
            {!isPending && (isError || !data) && (
              <ErrorState onRetry={() => refetch()} />
            )}
            {!isPending && !isError && data && (
              <KayitliAramalarList aramalar={data.kayitliAramalar} />
            )}
          </div>

          {/* Sana Özel Önerilen Araçlar */}
          <div className="flex flex-col gap-3">
            <div className="flex items-end justify-between">
              <div>
                <SectionTitle title="Sana Özel Önerilen Araçlar" />
                <div className="mt-0.5 text-[11px] text-ink-muted">
                  {data?.toplamArac ?? "—"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-1 text-[11.5px] text-ink-soft"
                  type="button"
                >
                  Sırala:{" "}
                  <span className="font-semibold text-ink">Önerilen</span>
                  <ChevronDown size={13} strokeWidth={2.1} />
                </button>
                <button
                  className="flex size-8 items-center justify-center rounded-lg bg-cust-tint text-cust"
                  type="button"
                >
                  <SlidersHorizontal size={15} strokeWidth={2} />
                </button>
              </div>
            </div>
            {isPending && <LoadingState />}
            {!isPending && (isError || !data) && (
              <ErrorState onRetry={() => refetch()} />
            )}
            {!isPending && !isError && data && (
              <OnerilenAraclarList araclar={data.onerilenAraclar} />
            )}
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
