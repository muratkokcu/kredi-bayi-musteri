import {
  Car,
  CircleCheck,
  Download,
  FileText,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";
import {
  getModel,
  kasaTipiKategori,
  kategoriLabel,
} from "@/data/arac-taksonomisi";
import { Badge, MiniBar } from "@/ui/badge";
import { Card, CardHeader } from "@/ui/card";
import { ScoreRing } from "@/ui/score-ring";
import { BankShell } from "../bank-shell";

// Vehicle pulled from the shared taxonomy (Volkswagen Tiguan 1.5 TSI, SUV).
const vehicleModel = getModel("volkswagen", "tiguan");
const kasaTipi = "SUV";
const segment = kategoriLabel(kasaTipiKategori[kasaTipi]);

const ARAC_BILGI: { label: string; value: string }[] = [
  {
    label: "Araç Markası",
    value: `Volkswagen ${vehicleModel?.model ?? "Tiguan"}`,
  },
  { label: "Varyant", value: vehicleModel?.varyantlar[0] ?? "1.5 TSI" },
  { label: "Model Yılı", value: "2021" },
  { label: "Kasa Tipi", value: `${kasaTipi} · ${segment}` },
  { label: "Plaka", value: "34 ABC 123" },
  { label: "Güncel Değer", value: "₺1.685.000" },
];

const KREDI_BILGI: { label: string; value: string; strong?: boolean }[] = [
  { label: "Kredi Tutarı", value: "₺1.450.000" },
  { label: "Kalan Borç", value: "₺685.000", strong: true },
  { label: "Aylık Taksit", value: "₺28.750" },
  { label: "Faiz Oranı", value: "%1,89" },
  { label: "Kalan Taksit", value: "22 / 48" },
  { label: "Kredi Bitiş", value: "03.09.2025" },
];

const SKOR_FAKTORLER: { label: string; value: number }[] = [
  { label: "Ödeme Performansı", value: 95 },
  { label: "Kredi Bitişine Kalan", value: 88 },
  { label: "Araç Yaşı", value: 76 },
  { label: "Segment Talebi", value: 82 },
];

interface Interaction {
  bayi: string;
  durum: string;
  id: string;
  islem: string;
  tarih: string;
  tone: "success" | "warn" | "neutral" | "danger";
}

const ETKILESIMLER: Interaction[] = [
  {
    id: "1",
    bayi: "Doğuş Otomotiv",
    tarih: "15.06.2025",
    islem: "Teklif Gönderildi",
    durum: "Aktif",
    tone: "success",
  },
  {
    id: "2",
    bayi: "Borusan Otomotiv",
    tarih: "12.06.2025",
    islem: "İletişime Geçildi",
    durum: "Beklemede",
    tone: "warn",
  },
  {
    id: "3",
    bayi: "Otokoç",
    tarih: "08.06.2025",
    islem: "Görüşme Yapıldı",
    durum: "Tamamlandı",
    tone: "neutral",
  },
  {
    id: "4",
    bayi: "Groupe PSA",
    tarih: "02.06.2025",
    islem: "Teklif Gönderildi",
    durum: "Reddedildi",
    tone: "danger",
  },
];

interface TimelineEvent {
  date: string;
  desc: string;
  icon: typeof Sparkles;
  id: string;
  title: string;
  tone: string;
}

const TIMELINE: TimelineEvent[] = [
  {
    id: "1",
    date: "15.06.2025",
    title: "Yenileme için uygun hale geldi",
    desc: "Skor 70 eşiğini geçti, fırsat havuzuna eklendi.",
    icon: Sparkles,
    tone: "bg-bank-tint text-bank-600",
  },
  {
    id: "2",
    date: "15.06.2025",
    title: "Bayiye atandı",
    desc: "Doğuş Otomotiv'e otomatik yönlendirildi.",
    icon: Send,
    tone: "bg-dealer-tint text-dealer-700",
  },
  {
    id: "3",
    date: "12.06.2025",
    title: "İletişime geçildi",
    desc: "Borusan Otomotiv telefon ile aradı.",
    icon: Phone,
    tone: "bg-warn-tint text-warn",
  },
  {
    id: "4",
    date: "08.06.2025",
    title: "Görüşme tamamlandı",
    desc: "Otokoç showroom ziyareti gerçekleşti.",
    icon: CircleCheck,
    tone: "bg-cust-tint text-cust-600",
  },
];

function InfoGrid({
  rows,
}: {
  rows: { label: string; value: string; strong?: boolean }[];
}) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
      {rows.map((r) => (
        <div className="flex items-center justify-between gap-3" key={r.label}>
          <dt className="text-[12.5px] text-ink-muted">{r.label}</dt>
          <dd
            className={`text-[13px] tabular-nums ${
              r.strong ? "font-bold text-bank-700" : "font-medium text-ink"
            }`}
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
    <Card className="flex items-center gap-6 px-6 py-5">
      <div className="flex items-center gap-4">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-bank-tint font-bold text-[22px] text-bank-700">
          ME
        </span>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-[18px] text-ink">Müşteri-000124</h2>
            <Badge tone="success">Aktif</Badge>
          </div>
          <div className="mt-1 flex gap-4 text-[12px] text-ink-muted tabular-nums">
            <span>KRD-2021-001245</span>
            <span>MUS-000124</span>
          </div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-8">
        <div className="text-center">
          <div className="text-[12px] text-ink-muted">Kredi Skoru</div>
          <div className="font-bold text-[20px] text-ink">742</div>
        </div>
        <div className="text-center">
          <div className="text-[12px] text-ink-muted">Müşteri Yaşı</div>
          <div className="font-bold text-[20px] text-ink">4,2 yıl</div>
        </div>
        <div className="rounded-[12px] bg-bank-tint px-4 py-3">
          <div className="text-[12px] text-bank-700">Yenileme Potansiyeli</div>
          <div className="font-bold text-[15px] text-bank-700">Yüksek</div>
          <button
            className="mt-0.5 text-[12px] text-bank-600 underline-offset-2 hover:underline"
            type="button"
          >
            Neden uygun? →
          </button>
        </div>
      </div>
    </Card>
  );
}

export function BankMusteriDetay() {
  return (
    <BankShell
      actions={
        <button
          className="flex items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-3.5 py-2 font-medium text-[13px] text-ink-soft hover:bg-canvas"
          type="button"
        >
          <Download size={16} /> Rapor İndir
        </button>
      }
      breadcrumb={["Müşteri Portföyü", "Müşteri Detay"]}
      title="Müşteri Detay"
    >
      <HeaderCard />

      <div className="mt-5 grid grid-cols-3 gap-5">
        {/* left column */}
        <div className="col-span-2 flex flex-col gap-5">
          <Card className="pb-5">
            <CardHeader title="Kredi ve Araç Bilgileri" />
            <div className="mt-4 flex gap-5 px-5">
              <div className="flex h-24 w-36 shrink-0 items-center justify-center rounded-xl bg-canvas text-ink-muted">
                <Car size={34} strokeWidth={1.6} />
              </div>
              <div className="grid flex-1 grid-cols-2 gap-8">
                <InfoGrid rows={ARAC_BILGI} />
                <InfoGrid rows={KREDI_BILGI} />
              </div>
            </div>
          </Card>

          <Card className="pb-2">
            <CardHeader
              action={
                <button
                  className="font-semibold text-[12.5px] text-bank-700"
                  type="button"
                >
                  Tüm aktiviteler
                </button>
              }
              title="Bayi Etkileşim Geçmişi"
            />
            <div className="mt-3 px-5">
              <div className="grid grid-cols-[1.4fr_1fr_1.4fr_auto] gap-4 border-line border-b pb-2 font-semibold text-[11px] text-ink-muted uppercase tracking-wide">
                <span>Bayi</span>
                <span>Tarih</span>
                <span>İşlem</span>
                <span>Durum</span>
              </div>
              {ETKILESIMLER.map((e) => (
                <div
                  className="grid grid-cols-[1.4fr_1fr_1.4fr_auto] items-center gap-4 border-line border-b py-3 last:border-0"
                  key={e.id}
                >
                  <span className="font-medium text-[13px] text-ink">
                    {e.bayi}
                  </span>
                  <span className="text-[12.5px] text-ink-soft tabular-nums">
                    {e.tarih}
                  </span>
                  <span className="text-[12.5px] text-ink-soft">{e.islem}</span>
                  <Badge tone={e.tone}>{e.durum}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* right column */}
        <div className="flex flex-col gap-5">
          <Card className="pb-5">
            <CardHeader title="Yenileme Skoru Detayı" />
            <div className="mt-4 flex items-center gap-4 px-5">
              <ScoreRing size={86} stroke={8} value={85} />
              <div className="flex-1">
                <div className="font-semibold text-[13px] text-ink">
                  Yüksek Potansiyel
                </div>
                <p className="mt-0.5 text-[12px] text-ink-muted leading-4">
                  Müşteri yenileme için güçlü sinyaller veriyor.
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-3 px-5">
              {SKOR_FAKTORLER.map((f) => (
                <div key={f.label}>
                  <div className="mb-1 flex justify-between text-[12px]">
                    <span className="text-ink-soft">{f.label}</span>
                    <span className="font-semibold text-ink tabular-nums">
                      {f.value}/100
                    </span>
                  </div>
                  <MiniBar value={f.value} />
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-line border-t px-5 pt-3">
              <span className="font-semibold text-[13px] text-ink">Toplam</span>
              <span className="font-bold text-[15px] text-bank-700">
                85/100
              </span>
            </div>
          </Card>

          <Card className="px-5 py-4">
            <div className="flex items-center gap-2">
              <FileText className="text-ink-muted" size={15} />
              <h3 className="font-semibold text-[13.5px] text-ink">Notlar</h3>
            </div>
            <p className="mt-2 text-[12.5px] text-ink-soft leading-5">
              Müşteri SUV segmentine geçiş istiyor. Bütçe esnek, peşinat
              hazırlığı mevcut. Öncelikli aranacaklar listesinde.
            </p>
          </Card>

          <Card className="pb-5">
            <CardHeader title="Müşteri Zaman Çizelgesi" />
            <ol className="mt-4 px-5">
              {TIMELINE.map((ev, i) => (
                <li className="relative flex gap-3 pb-5 last:pb-0" key={ev.id}>
                  {i < TIMELINE.length - 1 && (
                    <span className="absolute top-9 left-[15px] h-[calc(100%-18px)] w-px bg-line" />
                  )}
                  <span
                    className={`z-10 flex size-8 shrink-0 items-center justify-center rounded-full ${ev.tone}`}
                  >
                    <ev.icon size={15} strokeWidth={2} />
                  </span>
                  <div className="pt-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[13px] text-ink">
                        {ev.title}
                      </span>
                      <span className="text-[11px] text-ink-muted tabular-nums">
                        {ev.date}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[12px] text-ink-muted leading-4">
                      {ev.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </BankShell>
  );
}
