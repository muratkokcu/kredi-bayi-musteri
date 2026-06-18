import { Link } from "@tanstack/react-router";
import { ChevronRight, LogOut, Pencil, Sparkles } from "lucide-react";
import type {
  CustomerProfile,
  IletisimSatiri,
  KrediStat,
  MenuSatiri,
} from "@/data/customer-profile";
import { getModel } from "@/data/arac-taksonomisi";
import { useCustomerProfile } from "@/queries/customer-profile";
import { ErrorState, LoadingState } from "@/ui/async-states";
import { VehicleImage } from "@/ui/vehicle-image";
import { MobileShell } from "../mobile-shell";

const tiguan = getModel("volkswagen", "tiguan");
const tiguanName = `Volkswagen ${tiguan?.model ?? "Tiguan"}`;
const tiguanVariant = `1.5 TSI · ${tiguan?.varyantlar[0] ?? "1.5 TSI"} DSG`;

function ProfileHeader({
  initials,
  isim,
  uyelik,
  rozet,
}: {
  initials: string;
  isim: string;
  rozet: string;
  uyelik: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-cust-tint font-bold text-[22px] text-cust">
        {initials}
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-bold text-[18px] text-ink">{isim}</div>
        <div className="text-[12px] text-ink-muted">{uyelik}</div>
        <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-cust-tint px-2.5 py-1 font-semibold text-[10.5px] text-cust-600">
          <Sparkles size={12} strokeWidth={2.1} />
          {rozet}
        </span>
      </div>
    </div>
  );
}

function IletisimCard({ rows }: { rows: IletisimSatiri[] }) {
  return (
    <div className="rounded-2xl bg-surface p-4 shadow-[var(--shadow-card)]">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-semibold text-[14px] text-ink">
          İletişim Bilgileri
        </span>
        <button
          className="flex items-center gap-1 font-semibold text-[12px] text-cust"
          type="button"
        >
          Düzenle <Pencil size={12} strokeWidth={2.1} />
        </button>
      </div>
      <div className="flex flex-col">
        {rows.map((satir, i) => (
          <div
            className={`flex items-center justify-between py-2.5 ${
              i > 0 ? "border-line border-t" : ""
            }`}
            key={satir.etiket}
          >
            <span className="text-[12.5px] text-ink-muted">{satir.etiket}</span>
            <span className="font-semibold text-[13px] text-ink">
              {satir.deger}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AracimCard() {
  return (
    <div className="rounded-2xl bg-surface p-4 shadow-[var(--shadow-card)]">
      <div className="mb-3 font-semibold text-[14px] text-ink">Aracım</div>
      <div className="flex items-center gap-3">
        <VehicleImage
          className="h-14 w-24 rounded-xl"
          iconSize={26}
          name={tiguanName}
          segment="SUV"
        />
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold text-[14px] text-ink">
            {tiguanName}
          </div>
          <div className="truncate text-[11.5px] text-ink-muted">
            {tiguanVariant}
          </div>
          <div className="text-[11.5px] text-ink-muted">2021 · SUV</div>
        </div>
        <span className="shrink-0 rounded-lg bg-cust-tint px-2.5 py-1 font-bold text-[12px] text-cust-600">
          34 EY 2021
        </span>
      </div>
    </div>
  );
}

function KrediOzetimCard({ stats }: { stats: KrediStat[] }) {
  return (
    <div className="rounded-2xl bg-surface p-4 shadow-[var(--shadow-card)]">
      <div className="mb-3 font-semibold text-[14px] text-ink">
        Kredi Özetim
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {stats.map((stat) => (
          <div key={stat.etiket}>
            <div className="text-[10.5px] text-ink-muted">{stat.etiket}</div>
            <div className="mt-1 font-bold text-[13px] text-ink">
              {stat.deger}
            </div>
          </div>
        ))}
      </div>
      <Link
        className="mt-3 flex items-center justify-between border-line border-t pt-3 font-semibold text-[13px] text-cust"
        to="/musteri/odeme-plani"
      >
        Ödeme planını gör
        <ChevronRight size={18} strokeWidth={2} />
      </Link>
    </div>
  );
}

function MenuList({ rows }: { rows: MenuSatiri[] }) {
  return (
    <div className="flex flex-col gap-2">
      {rows.map(({ icon: Icon, label }) => (
        <button
          className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3.5 shadow-[var(--shadow-card)]"
          key={label}
          type="button"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-cust-tint text-cust">
            <Icon size={18} strokeWidth={1.9} />
          </span>
          <span className="flex-1 text-left font-semibold text-[13.5px] text-ink">
            {label}
          </span>
          <ChevronRight
            className="shrink-0 text-ink-muted"
            size={18}
            strokeWidth={2}
          />
        </button>
      ))}

      <button
        className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3.5 shadow-[var(--shadow-card)]"
        type="button"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger">
          <LogOut size={18} strokeWidth={1.9} />
        </span>
        <span className="flex-1 text-left font-semibold text-[13.5px] text-danger">
          Çıkış Yap
        </span>
      </button>
    </div>
  );
}

function ProfilBody({ data }: { data: CustomerProfile }) {
  return (
    <div className="flex flex-col gap-4 px-5 pt-2 pb-6">
      <ProfileHeader
        initials={data.initials}
        isim={data.isim}
        rozet={data.rozet}
        uyelik={data.uyelik}
      />
      <IletisimCard rows={data.iletisimBilgileri} />
      <AracimCard />
      <KrediOzetimCard stats={data.krediOzetim} />
      <MenuList rows={data.menuSatirlari} />
    </div>
  );
}

export function CustomerProfil() {
  const { data, isPending, isError, refetch } = useCustomerProfile();

  if (isPending) {
    return (
      <MobileShell tab="Profilim">
        <LoadingState />
      </MobileShell>
    );
  }

  if (isError || !data) {
    return (
      <MobileShell tab="Profilim">
        <ErrorState onRetry={() => refetch()} />
      </MobileShell>
    );
  }

  return (
    <MobileShell tab="Profilim">
      <ProfilBody data={data} />
    </MobileShell>
  );
}
