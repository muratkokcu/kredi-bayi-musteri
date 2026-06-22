import {
  ArrowRight,
  Banknote,
  Clock,
  Download,
  Pencil,
  Repeat,
  Target,
} from "lucide-react";
import type { DealerDetail, KeyVal } from "@/data/dealer-detail";
import { useDealerDetail } from "@/queries/dealer-detail";
import { Badge, MiniBar } from "@/ui/badge";
import { Card, CardHeader } from "@/ui/card";
import { ScoreRing } from "@/ui/score-ring";
import { StatCard } from "@/ui/stat-card";
import { ErrorState, LoadingState } from "@/ui/async-states";
import { formatNumber, formatPercent, formatTRY } from "@/lib/format";
import { BankShell } from "../bank-shell";

// DealerDetail type + seed live in src/data/dealer-detail.ts; data arrives via useDealerDetail().

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
  bayiAdi,
  bayiSkor,
  ozetAlanlar,
}: {
  bayiAdi: string;
  bayiSkor: number;
  ozetAlanlar: DealerDetail["ozetAlanlar"];
}) {
  return (
    <Card className="flex items-stretch gap-6 p-6">
      <div className="flex flex-1 items-center gap-5">
        <span className="flex size-[68px] shrink-0 items-center justify-center rounded-full bg-bank-tint font-bold text-[22px] text-bank-700">
          KO
        </span>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-[19px] text-ink">{bayiAdi}</h2>
            <span className="inline-flex items-center rounded-full bg-bank-tint px-2.5 py-0.5 font-bold text-[13px] text-bank-700 tabular-nums">
              {bayiSkor}
            </span>
            <span className="font-semibold text-[13px] text-bank-700">
              Yüksek Performans
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
          Çeyrek Hedef Durumu
        </div>
        <p className="text-[12px] text-ink-soft leading-4">
          Bu çeyrek satış hedefinin %92'sine ulaşıldı. Bayi, bölge ortalamasının
          üzerinde performans gösteriyor.
        </p>
        <button
          className="mt-1 inline-flex items-center gap-1 font-semibold text-[12.5px] text-bank-700"
          type="button"
        >
          Hedef raporunu aç <ArrowRight size={13} strokeWidth={2.1} />
        </button>
      </div>
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
        <Pencil size={16} /> Bayiyi Düzenle
      </button>
    </>
  ),
  breadcrumb: ["Bayi Yönetimi", "Bayi Detay"],
  title: "Bayi Detay",
} as const;

export function BankBayiDetay() {
  const { data, isPending, isError, refetch } = useDealerDetail();

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

  const {
    bayiAdi,
    bayiSkor,
    ozetAlanlar,
    iletisimSol,
    iletisimSag,
    skorFaktorler,
    sonTeklifler,
  } = data;

  return (
    <BankShell {...SHELL_PROPS}>
      <SummaryCard
        bayiAdi={bayiAdi}
        bayiSkor={bayiSkor}
        ozetAlanlar={ozetAlanlar}
      />

      {/* stat cards */}
      <div className="mt-5 grid grid-cols-4 gap-4">
        <StatCard
          icon={<Target size={20} strokeWidth={1.9} />}
          label="Gönderilen Teklif"
          sub="Son 12 ayda"
          tone="bank"
          value={formatNumber(1284)}
        />
        <StatCard
          icon={<Repeat size={20} strokeWidth={1.9} />}
          label="Kabul Oranı"
          sub="Bölge ort. %29,8"
          tone="dealer"
          value={formatPercent(34.5, 1)}
        />
        <StatCard
          icon={<Clock size={20} strokeWidth={1.9} />}
          label="Ort. Yanıt Süresi"
          sub="Teklif yanıt süresi"
          tone="warn"
          value="2,4 saat"
        />
        <StatCard
          icon={<Banknote size={20} strokeWidth={1.9} />}
          label="Toplam İşlem Hacmi"
          sub="Son 12 ayda"
          tone="teal"
          value={formatTRY(84_500_000)}
        />
      </div>

      <div className="mt-5 grid grid-cols-5 gap-5">
        {/* left column */}
        <div className="col-span-3 flex flex-col gap-5">
          <Card className="pb-5">
            <CardHeader title="Bayi ve İletişim Bilgileri" />
            <div className="mt-4 grid grid-cols-2 gap-x-8 px-5">
              <KeyVals rows={iletisimSol} />
              <KeyVals rows={iletisimSag} />
            </div>
          </Card>

          <Card className="pb-3">
            <CardHeader title="Son Teklifler" />
            <div className="mt-3 px-5">
              <div className="grid grid-cols-[1.4fr_1.8fr_1.1fr_1fr_auto] gap-4 border-line border-b pb-2 font-medium text-[11.5px] text-ink-muted">
                <span>Müşteri</span>
                <span>Araç</span>
                <span className="text-right">Teklif Tutarı</span>
                <span>Tarih</span>
                <span>Durum</span>
              </div>
              {sonTeklifler.map((t) => (
                <div
                  className="grid grid-cols-[1.4fr_1.8fr_1.1fr_1fr_auto] items-center gap-4 border-line border-b py-3 last:border-0"
                  key={t.id}
                >
                  <span className="font-medium text-[13px] text-ink">
                    {t.musteri}
                  </span>
                  <span className="text-[12.5px] text-ink-soft">{t.arac}</span>
                  <span className="text-right font-semibold text-[13px] text-ink tabular-nums">
                    {formatTRY(t.tutar)}
                  </span>
                  <span className="text-[12.5px] text-ink-soft tabular-nums">
                    {t.tarih}
                  </span>
                  <Badge tone={t.tone}>{t.durum}</Badge>
                </div>
              ))}
            </div>
            <FooterLink label="Tüm teklifleri görüntüle" />
          </Card>
        </div>

        {/* right column */}
        <div className="col-span-2 flex flex-col gap-5">
          <Card className="pb-4">
            <CardHeader title="Performans Skoru Detayı" />
            <div className="mt-4 flex items-center gap-4 px-5">
              <div className="relative inline-flex shrink-0 items-center justify-center">
                <ScoreRing
                  showValue={false}
                  size={104}
                  stroke={9}
                  value={bayiSkor}
                />
                <span className="absolute flex flex-col items-center">
                  <span className="font-bold text-[26px] text-ink tabular-nums leading-none">
                    {bayiSkor}
                  </span>
                  <span className="mt-1 font-semibold text-[11px] text-bank-700">
                    Yüksek
                  </span>
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3">
                {skorFaktorler.map((f) => (
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
                {bayiSkor} / 100
              </span>
            </div>
          </Card>

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
                Bayi yenileme tekliflerinde bölge ortalamasının üzerinde dönüşüm
                sağlıyor. Yanıt süreleri hızlı, müşteri memnuniyeti yüksek.
                Sözleşme yenileme görüşmesi 4. çeyrekte planlandı.
              </p>
              <div className="mt-3 text-[11px] text-ink-muted">
                Son güncelleme: 16.06.2025 11:48 - Ahmet Kaya
              </div>
            </div>
          </Card>
        </div>
      </div>
    </BankShell>
  );
}
