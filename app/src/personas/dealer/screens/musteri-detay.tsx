import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Calendar,
  Car,
  ChevronDown,
  Flame,
  Fuel,
  Gauge,
  Hash,
  Info,
  Mail,
  MessageSquare,
  MessageSquarePlus,
  Phone,
  PlusCircle,
  Route,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Users,
  Wallet,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getModel } from "@/data/arac-taksonomisi";
import { Badge, MiniBar } from "@/ui/badge";
import { Card, CardHeader } from "@/ui/card";
import { ScoreRing } from "@/ui/score-ring";
import { DealerShell } from "../dealer-shell";

// Customer vehicle pulled from the shared taxonomy (Volkswagen Tiguan, SUV).
const tiguan = getModel("volkswagen", "tiguan");
const tiguanModel = `Volkswagen ${tiguan?.model ?? "Tiguan"}`;
const tiguanVaryant = tiguan?.varyantlar[0] ?? "1.5 TSI";

const RENEWAL_SCORE = 92;

interface FactRow {
  icon: LucideIcon;
  label: string;
  sub?: string;
  subTone?: "muted" | "danger";
  value: string;
}

const QUICK_FACTS: FactRow[] = [
  {
    icon: Calendar,
    label: "Kredi Bitiş Tarihi",
    value: "22.05.2025",
    sub: "30 gün kaldı",
    subTone: "danger",
  },
  { icon: Hash, label: "Kalan Borç", value: "8 / 36" },
  { icon: Wallet, label: "Kalan Taksit", value: "36" },
  { icon: Target, label: "Bütçe Aralığı", value: "₺1,2M - ₺1,5M" },
  { icon: Car, label: "Segment", value: "SUV" },
];

interface DetailRow {
  label: string;
  strong?: boolean;
  value: string;
}

const MUSTERI_OZET: DetailRow[] = [
  { label: "Ad Soyad", value: "A*** Y******" },
  { label: "Plaka", value: "34 *** 123" },
  { label: "Yaş", value: "34" },
  { label: "İl / İlçe", value: "İstanbul / Kadıköy" },
  { label: "Meslek", value: "Özel Sektör" },
  { label: "Medeni Durum", value: "Evli" },
  { label: "Çocuk", value: "1" },
  { label: "Müşteri Tipi", value: "Bireysel" },
];

const ARAC_KREDI: DetailRow[] = [
  { label: "Marka / Model", value: tiguanModel },
  { label: "Yıl", value: "2020" },
  { label: "Yakıt Tipi", value: "Dizel" },
  { label: "Vites", value: "Otomatik" },
  { label: "Kredi Tutarı", value: "₺980.000" },
  { label: "Kalan Borç", value: "₺245.000", strong: true },
  { label: "Faiz Oranı", value: "%2,15" },
  { label: "Kredi Bitiş Tarihi", value: "22.05.2025" },
  { label: "Kalan Taksit", value: "8 / 36" },
  { label: "Aylık Taksit", value: "₺28.750" },
];

interface ScoreFactor {
  label: string;
  value: number;
}

const SKOR_FAKTORLER: ScoreFactor[] = [
  { label: "Kredi Bitiş Yakınlığı", value: 25 },
  { label: "Ödeme Performansı", value: 25 },
  { label: "Araç Segment Uygunluğu", value: 22 },
  { label: "Bütçe Uygunluğu", value: 12 },
  { label: "Müşteri Sadakati", value: 8 },
];

interface NeedRow {
  icon: LucideIcon;
  label: string;
  tone: "dealer" | "success" | "cust" | "warn";
  value: string;
}

const IHTIYAC_ANALIZI: NeedRow[] = [
  { icon: Car, label: "Araç Tipi Tercihi", value: "SUV", tone: "success" },
  {
    icon: Route,
    label: "Kullanım Amacı",
    value: "Aile & Günlük Kullanım",
    tone: "dealer",
  },
  {
    icon: ShieldCheck,
    label: "Öncelikli Özellikler",
    value: "Güvenlik, Konfor, Bagaj Hacmi",
    tone: "cust",
  },
  {
    icon: Fuel,
    label: "Yakıt Tercihi",
    value: "Dizel / Hibrit",
    tone: "dealer",
  },
  {
    icon: Wallet,
    label: "Tahmini Bütçe",
    value: "₺1,2M - ₺1,5M",
    tone: "success",
  },
  { icon: Flame, label: "Takip Seviyesi", value: "Sıcak", tone: "warn" },
];

interface SegmentRow {
  araclar: string;
  id: string;
  label: string;
  tone: "success" | "dealer" | "warn";
  uygunluk: string;
}

const SEGMENTLER: SegmentRow[] = [
  {
    id: "suv",
    label: "SUV",
    araclar: "Volkswagen Tiguan, Nissan Qashqai, Hyundai Tucson",
    uygunluk: "Çok Uygun",
    tone: "success",
  },
  {
    id: "c-suv",
    label: "C-SUV",
    araclar: "Peugeot 3008, Kia Sportage, Toyota RAV4",
    uygunluk: "Uygun",
    tone: "dealer",
  },
  {
    id: "d-sedan",
    label: "D-Sedan",
    araclar: "Skoda Superb, Toyota Camry",
    uygunluk: "Orta",
    tone: "warn",
  },
];

interface Interaction {
  desc: string;
  icon: LucideIcon;
  id: string;
  title: string;
  tone: string;
}

const ETKILESIMLER: Interaction[] = [
  {
    id: "telefon",
    icon: Phone,
    title: "Telefon",
    desc: "Arama yapıldı",
    tone: "bg-success-tint text-success",
  },
  {
    id: "eposta",
    icon: Mail,
    title: "E-posta",
    desc: "Kampanya e-postası gönderildi",
    tone: "bg-dealer-tint text-dealer-700",
  },
  {
    id: "sms",
    icon: MessageSquare,
    title: "SMS",
    desc: "Kampanya SMS'i gönderildi",
    tone: "bg-cust-tint text-cust-600",
  },
];

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

function HeaderCard() {
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
          {QUICK_FACTS.map(({ icon: Icon, label, value, sub, subTone }) => (
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

function MusteriOzetiCard() {
  return (
    <Card className="pb-4">
      <CardHeader title="Müşteri Özeti" />
      <div className="px-5">
        <DetailList rows={MUSTERI_OZET} />
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

function AracKrediCard() {
  return (
    <Card className="pb-4">
      <CardHeader title="Araç & Kredi Bilgileri" />
      <div className="mt-4 flex gap-5 px-5">
        <div className="flex h-24 w-32 shrink-0 flex-col items-center justify-center gap-1 rounded-xl bg-canvas text-ink-muted">
          <Car aria-hidden="true" size={34} strokeWidth={1.6} />
          <span className="font-medium text-[10.5px] text-ink-soft">
            {tiguanVaryant}
          </span>
        </div>
        <div className="flex-1">
          <DetailList rows={ARAC_KREDI} />
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

function IhtiyacAnaliziCard() {
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
        {IHTIYAC_ANALIZI.map(({ icon: Icon, label, value, tone }) => (
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

function YenilemePotansiyeliCard() {
  return (
    <Card className="pb-5">
      <CardHeader title="Yenileme Potansiyeli" />
      <div className="mt-4 flex items-center gap-4 px-5">
        <div className="relative flex flex-col items-center">
          <ScoreRing size={104} stroke={9} value={RENEWAL_SCORE} />
          <span className="mt-2 text-[10px] text-ink-muted">Yenileme Skoru</span>
          <span className="font-semibold text-[11px] text-success">Yüksek</span>
        </div>
        <ul className="flex-1 flex-col gap-2">
          {SKOR_FAKTORLER.map((f) => (
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

function OnerilenSegmentlerCard() {
  return (
    <Card className="pb-4">
      <CardHeader title="Önerilen Araç Segmentleri" />
      <div className="mt-3 flex flex-col px-5">
        {SEGMENTLER.map((s) => (
          <div
            className="flex items-center gap-3 border-line border-b py-3 last:border-0"
            key={s.id}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-canvas text-ink-soft">
              <Car aria-hidden="true" size={17} strokeWidth={1.9} />
            </span>
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

function SonEtkilesimlerCard() {
  return (
    <Card className="pb-4">
      <CardHeader title="Son Etkileşimler" />
      <ol className="mt-3 flex flex-col px-5">
        {ETKILESIMLER.map(({ icon: Icon, id, title, desc, tone }) => (
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

function GenelBakis() {
  return (
    <div className="grid grid-cols-3 gap-5">
      <div className="flex flex-col gap-5">
        <MusteriOzetiCard />
        <IhtiyacAnaliziCard />
      </div>
      <div className="flex flex-col gap-5">
        <AracKrediCard />
        <OnerilenSegmentlerCard />
      </div>
      <div className="flex flex-col gap-5">
        <YenilemePotansiyeliCard />
        <SonEtkilesimlerCard />
      </div>
    </div>
  );
}

function PlaceholderPane({
  icon: Icon,
  text,
}: {
  icon: LucideIcon;
  text: string;
}) {
  return (
    <Card className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-dealer-tint text-dealer-700">
        <Icon aria-hidden="true" size={22} strokeWidth={1.9} />
      </span>
      <p className="max-w-sm text-[13px] text-ink-soft">{text}</p>
    </Card>
  );
}

export function DealerMusteriDetay() {
  return (
    <DealerShell
      actions={
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
      }
      breadcrumb={["Fırsat Havuzu", "Müşteri Detay"]}
      highlight={<Badge tone="success">Yüksek Skor</Badge>}
      subtitle="Müşteri bilgilerini inceleyin, ihtiyaç analizini tamamlayın ve teklif oluşturun."
      title="Müşteri Detayı"
    >
      <HeaderCard />

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
          <GenelBakis />
        </TabsContent>
        <TabsContent className="mt-0" value="ihtiyac">
          <PlaceholderPane
            icon={Gauge}
            text="İhtiyaç analizi formunu tamamlayarak müşteriye en uygun araç ve finansman seçeneklerini eşleştirin."
          />
        </TabsContent>
        <TabsContent className="mt-0" value="eslestirme">
          <PlaceholderPane
            icon={Sparkles}
            text="Müşterinin profiline göre önerilen araç ve finansman paketleri burada listelenir."
          />
        </TabsContent>
        <TabsContent className="mt-0" value="iletisim">
          <PlaceholderPane
            icon={Users}
            text="Telefon, e-posta ve SMS dahil tüm iletişim geçmişi bu sekmede görüntülenir."
          />
        </TabsContent>
      </Tabs>
    </DealerShell>
  );
}
