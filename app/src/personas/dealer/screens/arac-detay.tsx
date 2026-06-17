import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Car,
  ChevronDown,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Heart,
  MessageSquareText,
  PackageMinus,
  Pencil,
  Share2,
  Tag,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { getModel } from "@/data/arac-taksonomisi";
import { Badge } from "@/ui/badge";
import { Card, CardHeader } from "@/ui/card";
import { ScoreRing } from "@/ui/score-ring";
import { DealerShell } from "../dealer-shell";

// Vehicle pulled from the shared taxonomy (Volkswagen Tiguan 1.5 TSI, SUV).
const tiguan = getModel("volkswagen", "tiguan");
const KASA_TIPI = "SUV";
const VARYANT = tiguan?.varyantlar[0] ?? "1.5 TSI";

const CHIPS = ["2020", KASA_TIPI, "Otomatik", "Benzin", "Beyaz"];

interface SpecRow {
  label: string;
  value: string;
}

const SPEC_LEFT: SpecRow[] = [
  { label: "Marka / Model", value: `Volkswagen ${tiguan?.model ?? "Tiguan"}` },
  { label: "Versiyon", value: `${VARYANT} e-TSI Life DSG` },
  { label: "Model Yılı", value: "2020" },
  { label: "Yakıt Tipi", value: "Benzin" },
  { label: "Vites", value: "Otomatik" },
  { label: "Çekiş", value: "Önden Çekiş" },
  { label: "Motor Hacmi", value: "1.498 cc" },
  { label: "Motor Gücü", value: "150 PS" },
  { label: "Tork", value: "250 Nm" },
];

const SPEC_RIGHT: SpecRow[] = [
  { label: "Kasa Tipi", value: KASA_TIPI },
  { label: "Kapı Sayısı", value: "5" },
  { label: "Koltuk Sayısı", value: "5" },
  { label: "Renk (Dış)", value: "Beyaz" },
  { label: "Renk (İç)", value: "Siyah" },
  { label: "Kilometre", value: "45.000 km" },
  { label: "Garanti Durumu", value: "Garantisi Devam Ediyor" },
  { label: "Garanti Bitiş", value: "15.06.2025" },
  { label: "Muayene Bitiş", value: "10.06.2026" },
];

interface IdentRow {
  label: string;
  value: string;
}

const IDENT_LEFT: IdentRow[] = [
  { label: "Stok Kodu", value: "KA-2020-1256" },
  { label: "Plaka", value: "34 ABC 123" },
  { label: "Şasi No", value: "WVGZZZ5NZLW123456" },
  { label: "Motor No", value: "DADA123456" },
];

const IDENT_RIGHT: IdentRow[] = [
  { label: "Kilometre", value: "45.000 km" },
  { label: "İlk Tescil Tarihi", value: "10.03.2020" },
  { label: "Renk", value: "Beyaz" },
  { label: "Araç Durumu", value: "Hasarsız" },
];

const TABS = [
  "Genel Bilgiler",
  "Donanım & Özellikler",
  "Hasar & Ekspertiz",
  "Belgeler",
  "Fiyat Geçmişi",
  "Segment Eşleşmesi",
];

interface PriceRow {
  label: string;
  tone?: "success";
  value: string;
}

const PRICE_ROWS: PriceRow[] = [
  { label: "Maliyet", value: "₺1.050.000" },
  { label: "Kär", value: "₺200.000", tone: "success" },
  { label: "Kär Marjı", value: "%16,0" },
];

interface StockRow {
  label: string;
  value: string;
}

const STOCK_ROWS: StockRow[] = [
  { label: "Stokta Kalma Süresi", value: "12 gün" },
  { label: "Stok Giriş Tarihi", value: "10.05.2025" },
];

interface SegRow {
  label: string;
  value: string;
}

const SEG_ROWS: SegRow[] = [
  { label: "SUV Segmenti", value: "₺1,0M - ₺1,5M" },
  { label: "Bütçe Aralığı", value: "30 - 55" },
  { label: "Hedef Müşteri Yaş Aralığı", value: "55" },
  { label: "Kredi Bitiş Süresi", value: "0 - 90 gün" },
];

interface QuickStat {
  icon: typeof Eye;
  label: string;
  sub: string;
  value: string;
  valueTone?: "warn";
}

const QUICK_STATS: QuickStat[] = [
  { icon: Eye, label: "Görüntülenme", value: "24", sub: "Son 7 gün" },
  {
    icon: MessageSquareText,
    label: "Teklif Sayısı",
    value: "3",
    sub: "Toplam",
  },
  { icon: Heart, label: "Favoriye Ekleme", value: "7", sub: "Toplam" },
  {
    icon: BarChart3,
    label: "Rekabet Durumu",
    value: "Orta",
    sub: "Piyasada 12 adet benzer araç",
    valueTone: "warn",
  },
  {
    icon: Tag,
    label: "Ortalama Piyasa Fiyatı",
    value: "₺1.210.000",
    sub: "Son 30 gün",
  },
];

interface ActionItem {
  danger?: boolean;
  icon: typeof Tag;
  label: string;
}

const ACTIONS: ActionItem[] = [
  { icon: Tag, label: "Fiyatı Düzenle" },
  { icon: PackageMinus, label: "Stoktan Çıkar" },
  { icon: Copy, label: "Kopyala" },
  { icon: ExternalLink, label: "Sahibinden" },
  { icon: Share2, label: "Paylaş" },
  { icon: Download, label: "Rapor İndir" },
  { icon: Trash2, label: "Aracı Sil", danger: true },
];

function IdentList({ rows }: { rows: IdentRow[] }) {
  return (
    <dl className="flex flex-col gap-2.5">
      {rows.map((r) => (
        <div className="flex items-center justify-between gap-4" key={r.label}>
          <dt className="text-[12.5px] text-ink-soft">{r.label}</dt>
          <dd className="font-semibold text-[13px] text-ink tabular-nums">
            {r.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function SpecList({ rows }: { rows: SpecRow[] }) {
  return (
    <dl>
      {rows.map((r) => (
        <div
          className="flex items-center justify-between gap-4 border-line border-b py-3 last:border-0"
          key={r.label}
        >
          <dt className="text-[13px] text-ink-soft">{r.label}</dt>
          <dd className="font-semibold text-[13px] text-ink tabular-nums">
            {r.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function priceValueClass(tone?: "success") {
  return tone === "success" ? "text-success" : "text-ink";
}

export function DealerAracDetay() {
  return (
    <DealerShell
      actions={
        <div className="flex items-center gap-2.5">
          <button
            className="flex size-10 items-center justify-center rounded-[10px] border border-line-strong bg-surface text-ink-soft hover:bg-canvas"
            type="button"
          >
            <ArrowLeft size={18} strokeWidth={1.9} />
          </button>
          <button
            className="flex size-10 items-center justify-center rounded-[10px] border border-line-strong bg-surface text-ink-soft hover:bg-canvas"
            type="button"
          >
            <ArrowRight size={18} strokeWidth={1.9} />
          </button>
          <button
            className="flex items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-3.5 py-2 font-semibold text-[13px] text-dealer-700 hover:bg-canvas"
            type="button"
          >
            Düzenle
          </button>
          <button
            className="flex items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-3.5 py-2 font-semibold text-[13px] text-dealer-700 hover:bg-canvas"
            type="button"
          >
            <MessageSquareText size={16} strokeWidth={1.9} /> Fiyat Geçmişi
          </button>
          <button
            className="flex items-center gap-2 rounded-[10px] bg-dealer px-4 py-2.5 font-semibold text-[13px] text-white hover:bg-dealer-600"
            type="button"
          >
            <Download size={16} strokeWidth={2} /> Stoktan Çıkar
          </button>
        </div>
      }
      breadcrumb={["Stok Yönetimi", "Araç Listesi", "Araç Detayı"]}
      highlight={<Badge tone="success">Stokta</Badge>}
      subtitle="Araç bilgilerini görüntüleyin, fiyat ve stok durumunu yönetin."
      title="Araç Detayı"
    >
      <div className="grid grid-cols-3 gap-5">
        {/* left column */}
        <div className="col-span-2 flex flex-col gap-5">
          <Card className="p-5">
            {/* image + title + identity */}
            <div className="flex gap-6">
              <div className="flex h-44 w-72 shrink-0 items-center justify-center rounded-xl border border-line bg-canvas text-ink-muted">
                <Car size={56} strokeWidth={1.4} />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-[22px] text-ink tracking-tight">
                  Volkswagen {tiguan?.model ?? "Tiguan"}
                </h2>
                <p className="mt-1 text-[14px] text-ink-soft">
                  {VARYANT} e-TSI Life DSG
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {CHIPS.map((c) => (
                    <span
                      className="rounded-full bg-canvas px-3 py-1 font-medium text-[12.5px] text-ink-soft"
                      key={c}
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-x-10 border-line border-t pt-4">
                  <IdentList rows={IDENT_LEFT} />
                  <IdentList rows={IDENT_RIGHT} />
                </div>
              </div>
            </div>

            {/* thumbnail strip */}
            <div className="mt-5 flex items-center gap-3">
              <button
                className="flex h-14 w-20 items-center justify-center rounded-lg border-2 border-dealer bg-canvas text-ink-muted"
                type="button"
              >
                <Car size={22} strokeWidth={1.5} />
              </button>
              {["b", "c", "d"].map((id) => (
                <button
                  className="flex h-14 w-20 items-center justify-center rounded-lg border border-line bg-canvas text-ink-muted hover:border-line-strong"
                  key={id}
                  type="button"
                >
                  <Car size={22} strokeWidth={1.5} />
                </button>
              ))}
              <button
                className="flex h-14 w-16 items-center justify-center rounded-lg bg-dealer-tint font-semibold text-[13px] text-dealer-700"
                type="button"
              >
                +8
              </button>
            </div>

            {/* tab row */}
            <div className="mt-5 flex items-center gap-7 border-line border-b">
              {TABS.map((t, i) => {
                const active = i === 0;
                const cls = active
                  ? "border-dealer text-dealer-700"
                  : "border-transparent text-ink-soft hover:text-ink";
                return (
                  <button
                    className={`-mb-px border-b-2 pb-3 font-semibold text-[13.5px] ${cls}`}
                    key={t}
                    type="button"
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            {/* Araç Bilgileri spec table */}
            <h3 className="mt-5 font-bold text-[15px] text-ink">
              Araç Bilgileri
            </h3>
            <div className="mt-2 grid grid-cols-2 gap-x-10">
              <SpecList rows={SPEC_LEFT} />
              <SpecList rows={SPEC_RIGHT} />
            </div>

            <button
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-[10px] border border-line py-2.5 font-semibold text-[13px] text-dealer-700 hover:bg-canvas"
              type="button"
            >
              Daha Fazla Bilgi <ChevronDown size={15} strokeWidth={2} />
            </button>
          </Card>

          {/* Hızlı İstatistikler */}
          <Card className="pb-5">
            <CardHeader title="Hızlı İstatistikler" />
            <div className="mt-4 grid grid-cols-5 gap-4 px-5">
              {QUICK_STATS.map((s) => {
                const valueCls =
                  s.valueTone === "warn" ? "text-warn" : "text-ink";
                return (
                  <div
                    className="rounded-xl border border-line p-3.5"
                    key={s.label}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-ink-muted">
                        {s.label}
                      </span>
                      <s.icon
                        className="text-dealer"
                        size={15}
                        strokeWidth={1.9}
                      />
                    </div>
                    <div
                      className={`mt-1.5 font-bold text-[20px] tracking-tight ${valueCls}`}
                    >
                      {s.value}
                    </div>
                    <div className="mt-1 text-[11.5px] text-ink-muted">
                      {s.sub}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* right column */}
        <div className="flex flex-col gap-5">
          {/* price card */}
          <Card className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[12.5px] text-ink-muted">Satış Fiyatı</div>
                <div className="mt-0.5 font-bold text-[26px] text-ink tabular-nums tracking-tight">
                  ₺1.250.000
                </div>
              </div>
              <button
                className="flex items-center gap-1.5 rounded-[10px] border border-line-strong bg-surface px-3 py-2 font-semibold text-[12.5px] text-dealer-700 hover:bg-canvas"
                type="button"
              >
                <Pencil size={14} strokeWidth={2} /> Fiyatı Düzenle
              </button>
            </div>

            <dl className="mt-4 flex flex-col gap-2.5">
              {PRICE_ROWS.map((r) => (
                <div
                  className="flex items-center justify-between gap-3"
                  key={r.label}
                >
                  <dt className="text-[12.5px] text-ink-soft">{r.label}</dt>
                  <dd
                    className={`font-bold text-[13px] tabular-nums ${priceValueClass(
                      r.tone
                    )}`}
                  >
                    {r.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 border-line border-t pt-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[12.5px] text-ink-soft">Stok Durumu</span>
                <Badge tone="success">Stokta</Badge>
              </div>
              <dl className="mt-2.5 flex flex-col gap-2.5">
                {STOCK_ROWS.map((r) => (
                  <div
                    className="flex items-center justify-between gap-3"
                    key={r.label}
                  >
                    <dt className="text-[12.5px] text-ink-soft">{r.label}</dt>
                    <dd className="font-bold text-[13px] text-ink tabular-nums">
                      {r.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Card>

          {/* Segment Eşleşmesi */}
          <Card className="pb-5">
            <CardHeader
              action={<Badge tone="success">Yüksek Uyum</Badge>}
              title="Segment Eşleşmesi"
            />
            <div className="mt-4 flex items-center gap-4 px-5">
              <ScoreRing size={84} stroke={8} value={92} />
              <div className="font-semibold text-[14px] text-ink leading-5">
                Yenileme
                <br />
                Skoru
              </div>
            </div>
            <dl className="mt-4 flex flex-col gap-2.5 px-5">
              {SEG_ROWS.map((r) => (
                <div
                  className="flex items-center justify-between gap-3"
                  key={r.label}
                >
                  <dt className="text-[12.5px] text-dealer-700">{r.label}</dt>
                  <dd className="font-bold text-[13px] text-ink tabular-nums">
                    {r.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>

          {/* Notlar */}
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <FileText className="text-ink-muted" size={15} />
              <h3 className="font-semibold text-[14px] text-ink">Notlar</h3>
            </div>
            <div className="mt-3 flex gap-2.5 rounded-xl bg-warn-tint px-3.5 py-3">
              <TriangleAlert
                className="mt-0.5 shrink-0 text-warn"
                size={16}
                strokeWidth={2}
              />
              <p className="text-[12.5px] text-ink-soft leading-5">
                Araç 10.05.2025 tarihinde takasa giriş yaptı. Pazarlık payı
                bulunmaktadır.
              </p>
            </div>
            <button
              className="mt-3 flex w-full items-center justify-between gap-2 rounded-xl border border-line px-3.5 py-3 text-[12.5px] text-ink-muted hover:bg-canvas"
              type="button"
            >
              Not eklemek için tıklayın...
              <Pencil size={14} strokeWidth={1.9} />
            </button>
          </Card>

          {/* İşlemler */}
          <Card className="pb-5">
            <CardHeader title="İşlemler" />
            <div className="mt-4 grid grid-cols-2 gap-2.5 px-5">
              {ACTIONS.map((a) => {
                const cls = a.danger
                  ? "border-danger/30 text-danger hover:bg-danger-tint"
                  : "border-line text-ink-soft hover:bg-canvas";
                return (
                  <button
                    className={`flex items-center gap-2 rounded-[10px] border px-3 py-2.5 font-medium text-[12.5px] ${cls}`}
                    key={a.label}
                    type="button"
                  >
                    <a.icon size={15} strokeWidth={1.9} /> {a.label}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </DealerShell>
  );
}
