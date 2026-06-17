import {
  Bolt,
  Car,
  CarFront,
  ChevronLeft,
  Heart,
  type LucideIcon,
  Pencil,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { getModel, vitesTipleri, yakitTipleri } from "@/data/arac-taksonomisi";
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
  { label: "Elektrikli", icon: Bolt },
  { label: "MPV", icon: Truck },
];

const MODEL_YILLARI = ["2020+", "2022+", "2024+"];
const KILOMETRE_ARALIKLARI = ["0 - 30.000", "30.000 - 80.000", "80.000+"];

interface KayitliArama {
  ad: string;
  adet: string;
  detay: string;
}

const KAYITLI_ARAMALAR: KayitliArama[] = [
  { ad: "Aile Aracı", detay: "SUV · Otomatik", adet: "12 araç" },
  { ad: "Ekonomik Sedan", detay: "Sedan · Dizel", adet: "8 araç" },
  { ad: "Elektrikli Tercihim", detay: "Elektrik · 2024+", adet: "5 araç" },
];

const tiguan = getModel("volkswagen", "tiguan");
const octavia = getModel("skoda", "octavia");
const rav4 = getModel("toyota", "rav4");

interface OnerilenArac {
  ad: string;
  etiketler: string[];
  pesinat: string;
  taksit: string;
  varyant: string;
}

const ONERILEN_ARACLAR: OnerilenArac[] = [
  {
    ad: `Volkswagen ${tiguan?.model ?? "Tiguan"}`,
    varyant: `1.5 TSI · ${tiguan?.varyantlar[0] ?? "1.5 TSI"} DSG`,
    etiketler: ["SUV", "Otomatik", "Benzin", "2023"],
    taksit: "₺18.750",
    pesinat: "₺250.000 peşinat",
  },
  {
    ad: `Skoda ${octavia?.model ?? "Octavia"}`,
    varyant: `1.5 TSI · ${octavia?.varyantlar[1] ?? "1.5 TSI"}`,
    etiketler: ["Sedan", "Otomatik", "Benzin", "2023"],
    taksit: "₺17.250",
    pesinat: "₺220.000 peşinat",
  },
  {
    ad: `Toyota ${rav4?.model ?? "RAV4"}`,
    varyant: `2.5 Hybrid · ${rav4?.varyantlar[1] ?? "2.5 Hybrid"}`,
    etiketler: ["SUV", "Otomatik", "Hibrit", "2024"],
    taksit: "₺22.950",
    pesinat: "₺320.000 peşinat",
  },
];

function fmtTry(value: number): string {
  return `₺${value.toLocaleString("tr-TR")}`;
}

interface ChipProps {
  active: boolean;
  label: string;
  onSelect: () => void;
}

function Chip({ active, label, onSelect }: ChipProps) {
  return (
    <button
      className={`rounded-full border px-3.5 py-1.5 font-medium text-[12.5px] transition-colors ${
        active
          ? "border-cust bg-cust text-white"
          : "border-line bg-surface text-ink-soft"
      }`}
      onClick={onSelect}
      type="button"
    >
      {label}
    </button>
  );
}

interface SectionTitleProps {
  title: string;
}

function SectionTitle({ title }: SectionTitleProps) {
  return <div className="font-semibold text-[15px] text-ink">{title}</div>;
}

export function CustomerAracTercihlerim() {
  const [secilenTip, setSecilenTip] = useState("SUV");
  const [butce, setButce] = useState([10_000, 25_000]);
  const [pesinat, setPesinat] = useState([150_000, 600_000]);
  const [yakit, setYakit] = useState("Hibrit");
  const [vites, setVites] = useState("Otomatik");
  const [modelYili, setModelYili] = useState("2022+");
  const [kilometre, setKilometre] = useState("0 - 30.000");

  return (
    <MobileShell
      bottomBar={
        <div className="border-line border-t bg-surface px-5 pt-3 pb-5">
          <button
            className="w-full rounded-2xl bg-cust py-3.5 font-semibold text-[15px] text-white shadow-[var(--shadow-card)]"
            type="button"
          >
            Tercihleri Kaydet
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-5 px-5 pt-2 pb-6">
        {/* back header */}
        <div className="relative -mx-5 flex items-center justify-between overflow-hidden bg-cust-ink px-5 py-3 text-white">
          <button
            className="flex size-9 items-center justify-center rounded-full bg-white/10"
            type="button"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-semibold text-[16px]">Araç Tercihlerim</span>
          <button
            className="flex items-center gap-1 font-semibold text-[12.5px] text-white/90"
            type="button"
          >
            <Pencil size={13} /> Düzenle
          </button>
          <Car
            aria-hidden="true"
            className="absolute -right-2 bottom-0 text-white/10"
            size={72}
            strokeWidth={1.4}
          />
        </div>

        <div className="-mt-1">
          <div className="font-bold text-[18px] text-ink">
            Hayalindeki aracı birlikte bulalım
          </div>
          <div className="text-[12.5px] text-ink-muted">
            Tercihlerini seç, sana en uygun araçları önerelim.
          </div>
        </div>

        {/* Tip Alanları */}
        <div className="flex flex-col gap-3">
          <SectionTitle title="Tip Alanları" />
          <div className="grid grid-cols-3 gap-2.5">
            {TIP_ALANLARI.map(({ label, icon: Icon }) => {
              const on = label === secilenTip;
              return (
                <button
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border py-3 transition-colors ${
                    on
                      ? "border-cust bg-cust-tint text-cust-600"
                      : "border-line bg-surface text-ink-soft"
                  }`}
                  key={label}
                  onClick={() => setSecilenTip(label)}
                  type="button"
                >
                  <Icon
                    className={on ? "text-cust" : "text-ink-muted"}
                    size={22}
                    strokeWidth={1.9}
                  />
                  <span className="font-medium text-[12px]">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bütçe Aralığı */}
        <div className="flex flex-col gap-4 rounded-2xl bg-surface p-4 shadow-[var(--shadow-card)]">
          <SectionTitle title="Bütçe Aralığı" />
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-[12.5px]">
              <span className="text-ink-muted">Aylık taksit</span>
              <span className="font-semibold text-cust-600">
                {fmtTry(butce[0])} - {fmtTry(butce[1])}
              </span>
            </div>
            <Slider
              max={40_000}
              min={5000}
              minStepsBetweenThumbs={1}
              onValueChange={setButce}
              step={500}
              value={butce}
            />
          </div>
          <div className="flex flex-col gap-2.5 border-line border-t pt-3">
            <div className="flex items-center justify-between text-[12.5px]">
              <span className="text-ink-muted">Peşinat</span>
              <span className="font-semibold text-cust-600">
                {fmtTry(pesinat[0])} - {fmtTry(pesinat[1])}
              </span>
            </div>
            <Slider
              max={1_000_000}
              min={50_000}
              minStepsBetweenThumbs={1}
              onValueChange={setPesinat}
              step={10_000}
              value={pesinat}
            />
          </div>
        </div>

        {/* Diğer Tercihlerim */}
        <div className="flex flex-col gap-4">
          <SectionTitle title="Diğer Tercihlerim" />

          <div className="flex flex-col gap-2">
            <span className="text-[12.5px] text-ink-muted">Yakıt Tipi</span>
            <div className="flex flex-wrap gap-2">
              {yakitTipleri.map((tip) => (
                <Chip
                  active={tip === yakit}
                  key={tip}
                  label={tip}
                  onSelect={() => setYakit(tip)}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[12.5px] text-ink-muted">Vites Tipi</span>
            <div className="flex flex-wrap gap-2">
              {vitesTipleri.map((tip) => (
                <Chip
                  active={tip === vites}
                  key={tip}
                  label={tip}
                  onSelect={() => setVites(tip)}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[12.5px] text-ink-muted">Model Yılı</span>
            <div className="flex flex-wrap gap-2">
              {MODEL_YILLARI.map((yil) => (
                <Chip
                  active={yil === modelYili}
                  key={yil}
                  label={yil}
                  onSelect={() => setModelYili(yil)}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[12.5px] text-ink-muted">Kilometre</span>
            <div className="flex flex-wrap gap-2">
              {KILOMETRE_ARALIKLARI.map((km) => (
                <Chip
                  active={km === kilometre}
                  key={km}
                  label={km}
                  onSelect={() => setKilometre(km)}
                />
              ))}
            </div>
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
          <div className="flex gap-3 overflow-x-auto">
            {KAYITLI_ARAMALAR.map((arama) => (
              <div
                className="flex w-[140px] shrink-0 flex-col gap-1 rounded-2xl bg-surface p-3.5 shadow-[var(--shadow-card)]"
                key={arama.ad}
              >
                <span className="flex size-9 items-center justify-center rounded-xl bg-cust-tint text-cust">
                  <Car size={18} strokeWidth={1.9} />
                </span>
                <div className="mt-1 font-semibold text-[13px] text-ink">
                  {arama.ad}
                </div>
                <div className="text-[11px] text-ink-muted">{arama.detay}</div>
                <div className="font-semibold text-[11px] text-cust-600">
                  {arama.adet}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sana Özel Önerilen Araçlar */}
        <div className="flex flex-col gap-3">
          <SectionTitle title="Sana Özel Önerilen Araçlar" />
          <div className="flex flex-col gap-3">
            {ONERILEN_ARACLAR.map((arac) => (
              <div
                className="rounded-2xl bg-surface p-3.5 shadow-[var(--shadow-card)]"
                key={arac.ad}
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl bg-canvas text-ink-muted">
                    <Car size={28} strokeWidth={1.5} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-[14px] text-ink">
                          {arac.ad}
                        </div>
                        <div className="truncate text-[11.5px] text-ink-muted">
                          {arac.varyant}
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
                    <div className="text-[10.5px] text-ink-muted">
                      Aylık taksit
                    </div>
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
            ))}
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
