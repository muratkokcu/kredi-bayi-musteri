import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Heart, Share2, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getModel } from "@/data/arac-taksonomisi";
import type { OfferDetail } from "@/data/offer-detail";
import { useOfferDetail } from "@/queries/offer-detail";
import { ErrorState, LoadingState } from "@/ui/async-states";
import { VehicleImage } from "@/ui/vehicle-image";
import { MobileShell } from "../mobile-shell";

const tiguan = getModel("volkswagen", "tiguan");
const tiguanName = `Volkswagen ${tiguan?.model ?? "Tiguan"}`;
const tiguanVariant = `1.5 TSI ${tiguan?.varyantlar[0] ?? "1.5 TSI"} Life DSG`;

function BackHeader() {
  return (
    <div className="flex items-center justify-between px-5 py-3">
      <Link
        className="flex size-9 items-center justify-center rounded-full bg-surface text-ink-soft shadow-[var(--shadow-card)]"
        to="/musteri/tekliflerim"
      >
        <ChevronLeft size={20} strokeWidth={2.1} />
      </Link>
      <span className="font-bold text-[16px] text-ink">Teklif Detayı</span>
      <div className="flex items-center gap-2">
        <button
          className="flex size-9 items-center justify-center rounded-full bg-surface text-ink-soft shadow-[var(--shadow-card)]"
          type="button"
        >
          <Share2 size={17} strokeWidth={1.9} />
        </button>
        <button
          className="flex size-9 items-center justify-center rounded-full bg-surface text-ink-soft shadow-[var(--shadow-card)]"
          type="button"
        >
          <Heart size={17} strokeWidth={1.9} />
        </button>
      </div>
    </div>
  );
}

function BottomBar() {
  return (
    <div className="flex items-center gap-3 border-line border-t bg-surface px-5 pt-3 pb-5">
      <Link
        className="flex h-12 flex-[1.6] items-center justify-center gap-1.5 rounded-2xl bg-cust font-semibold text-[15px] text-white shadow-[0_8px_20px_rgba(89,101,240,0.35)]"
        to="/musteri/basvuru-durumu"
      >
        Hemen Başvur <ChevronRight size={17} strokeWidth={2.2} />
      </Link>
      <Link
        className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-cust-tint font-semibold text-[13.5px] text-cust-600"
        to="/musteri/tekliflerim"
      >
        Teklif Karşılaştır
      </Link>
    </div>
  );
}

function OfferDetailBody({ data }: { data: OfferDetail }) {
  const BadgeIcon = data.badgeIcon;
  const InfoCardIcon = data.infoCardIcon;
  const CountdownCardIcon = data.countdownCardIcon;
  const CountdownClockIcon = data.countdownClockIcon;

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* hero */}
      <div className="px-5">
        <div className="flex gap-3.5">
          <div className="relative size-[104px] shrink-0">
            <VehicleImage
              className="size-full rounded-2xl"
              iconSize={44}
              name={tiguanName}
              segment="SUV"
            />
            <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-success px-2 py-0.5 font-semibold text-[9.5px] text-white">
              <BadgeIcon size={11} strokeWidth={2.2} /> {data.badgeLabel}
            </span>
          </div>
          <div className="flex flex-1 flex-col justify-center">
            <div className="font-bold text-[18px] text-ink leading-tight">
              {tiguanName}
            </div>
            <div className="text-[12.5px] text-ink-soft">{tiguanVariant}</div>
            <div className="mt-1 text-[11px] text-ink-muted">
              {data.aracSpec}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="font-semibold text-[12.5px] text-ink">
                {data.bayiAdi}
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-warn-tint px-1.5 py-0.5 font-semibold text-[10.5px] text-warn">
                <Star fill="currentColor" size={10} /> {data.bayiPuan}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* key stats */}
      <div className="px-5">
        <div className="grid grid-cols-4 divide-x divide-line rounded-2xl bg-surface py-3 shadow-[var(--shadow-card)]">
          {data.keyStats.map((s) => (
            <div className="px-1.5 text-center" key={s.label}>
              <div
                className={`font-bold text-[14px] ${s.accent ? "text-success" : "text-ink"}`}
              >
                {s.value}
              </div>
              <div className="mt-0.5 text-[9.5px] text-ink-muted leading-tight">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* purple info card */}
      <div className="px-5">
        <div className="flex items-start gap-3 rounded-2xl bg-cust-tint p-3.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-cust/15 text-cust">
            <InfoCardIcon size={18} strokeWidth={1.9} />
          </span>
          <div className="flex-1">
            <p className="text-[12px] text-ink-soft leading-5">
              {data.infoCardText}
            </p>
            <button
              className="mt-1 inline-flex items-center gap-1 font-semibold text-[12px] text-cust"
              type="button"
            >
              {data.infoCardButton} <ChevronRight size={14} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>

      {/* teklif özeti + ödeme planı (tablı) */}
      <div className="px-5">
        <div className="rounded-2xl bg-surface p-4 shadow-[var(--shadow-card)]">
          <Tabs defaultValue="ozet">
            <TabsList className="mb-3 grid w-full grid-cols-2">
              <TabsTrigger value="ozet">Teklif Özeti</TabsTrigger>
              <TabsTrigger value="odeme">Ödeme Planı</TabsTrigger>
            </TabsList>

            <TabsContent value="ozet">
              <dl className="divide-y divide-line">
                {data.teklifOzeti.map((row) => (
                  <div
                    className="flex items-center justify-between py-2.5"
                    key={row.label}
                  >
                    <dt className="text-[12.5px] text-ink-soft">{row.label}</dt>
                    <dd className="font-semibold text-[13px] text-ink">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </TabsContent>

            <TabsContent value="odeme">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[11.5px] text-ink-muted">
                  {data.odemePlaniHint}
                </span>
                <Link
                  className="font-semibold text-[12px] text-cust"
                  to="/musteri/basvuru-durumu"
                >
                  Tümünü Gör
                </Link>
              </div>
              <div className="divide-y divide-line">
                {data.odemePlani.map((row) => (
                  <div
                    className="flex items-center justify-between py-2.5"
                    key={row.id}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-cust-tint font-semibold text-[10.5px] text-cust-600">
                        {row.ay.replace(". Ay", "")}
                      </span>
                      <div>
                        <div className="font-medium text-[12.5px] text-ink">
                          {row.ay}
                        </div>
                        <div className="text-[10.5px] text-ink-muted">
                          {row.tarih}
                        </div>
                      </div>
                    </div>
                    <span className="font-semibold text-[13px] text-ink">
                      {row.tutar}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* erken başvuru countdown */}
      <div className="px-5">
        <div className="flex items-center gap-3 rounded-2xl bg-success-tint p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-success/15 text-success">
            <CountdownCardIcon size={20} strokeWidth={1.9} />
          </span>
          <div className="flex-1">
            <div className="font-semibold text-[13.5px] text-ink">
              {data.countdownCardTitle}
            </div>
            <div className="text-[11px] text-ink-soft leading-4">
              {data.countdownCardDesc}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 font-bold text-[16px] text-success">
              <CountdownClockIcon size={14} strokeWidth={2.1} />{" "}
              {data.countdownValue}
            </div>
            <div className="text-[9px] text-ink-muted">
              {data.countdownLabel}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CustomerTeklifDetayi() {
  const { data, isPending, isError, refetch } = useOfferDetail();

  if (isPending) {
    return (
      <MobileShell bottomBar={<BottomBar />}>
        <BackHeader />
        <LoadingState />
      </MobileShell>
    );
  }

  if (isError || !data) {
    return (
      <MobileShell bottomBar={<BottomBar />}>
        <BackHeader />
        <ErrorState onRetry={() => refetch()} />
      </MobileShell>
    );
  }

  return (
    <MobileShell bottomBar={<BottomBar />}>
      <BackHeader />
      <OfferDetailBody data={data} />
    </MobileShell>
  );
}
