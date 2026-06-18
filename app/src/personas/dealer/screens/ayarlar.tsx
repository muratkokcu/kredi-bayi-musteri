import {
  ChevronRight,
  Globe,
  KeyRound,
  type LucideIcon,
  Moon,
  Pencil,
  ShieldCheck,
  Store,
  Wallet,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useDealerProfile } from "@/queries/dealer-profile";
import { ErrorState, LoadingState } from "@/ui/async-states";
import { Card, CardHeader } from "@/ui/card";
import { DealerShell } from "../dealer-shell";

interface NotificationPref {
  defaultOn: boolean;
  description: string;
  id: string;
  label: string;
}

interface PreferenceSelect {
  defaultValue: string;
  icon: LucideIcon;
  id: string;
  label: string;
  options: { label: string; value: string }[];
}

// Dealer profile (server data) lives in src/data/dealer-profile.ts.

const NOTIFICATION_PREFS: NotificationPref[] = [
  {
    id: "yeni-firsat",
    label: "Yeni fırsat bildirimi",
    description: "Fırsat havuzuna uygun müşteri eklendiğinde haber alın.",
    defaultOn: true,
  },
  {
    id: "teklif-yanit",
    label: "Teklif yanıtları",
    description: "Müşteriler teklifinizi görüntülediğinde veya yanıtladığında bildirim alın.",
    defaultOn: true,
  },
  {
    id: "komisyon-odeme",
    label: "Komisyon ödemeleri",
    description: "Komisyon ödemeniz hazırlandığında veya hesabınıza geçtiğinde bilgilendirilirsiniz.",
    defaultOn: true,
  },
  {
    id: "eposta-ozet",
    label: "E-posta özetleri",
    description: "Haftalık performans ve fırsat özetini e-posta ile alın.",
    defaultOn: false,
  },
  {
    id: "sms-bildirim",
    label: "SMS bildirimleri",
    description: "Önemli gelişmeler için SMS yoluyla anlık bildirim alın.",
    defaultOn: false,
  },
];

const PREFERENCE_SELECTS: PreferenceSelect[] = [
  {
    id: "dil",
    label: "Dil",
    icon: Globe,
    defaultValue: "tr",
    options: [
      { value: "tr", label: "Türkçe" },
      { value: "en", label: "English" },
    ],
  },
  {
    id: "para-birimi",
    label: "Para Birimi",
    icon: Wallet,
    defaultValue: "try",
    options: [
      { value: "try", label: "₺ TRY" },
      { value: "usd", label: "$ USD" },
      { value: "eur", label: "€ EUR" },
    ],
  },
  {
    id: "tema",
    label: "Tema",
    icon: Moon,
    defaultValue: "acik",
    options: [
      { value: "acik", label: "Açık" },
      { value: "koyu", label: "Koyu" },
      { value: "sistem", label: "Sistem" },
    ],
  },
];

function ProfileCard() {
  const { data, isPending, isError, refetch } = useDealerProfile();

  return (
    <Card className="pb-2">
      <CardHeader
        action={
          <button
            className="flex items-center gap-1.5 rounded-[8px] border border-dealer px-3 py-1.5 font-semibold text-[12px] text-dealer-700 hover:bg-dealer-tint"
            type="button"
          >
            <Pencil size={14} strokeWidth={1.9} /> Düzenle
          </button>
        }
        subtitle="Mağazanıza ait iletişim ve hesap bilgileri."
        title="Bayi Profili"
      />
      {isPending && <LoadingState label="Profil yükleniyor…" />}
      {!isPending && (isError || !data) && (
        <ErrorState label="Profil yüklenemedi." onRetry={() => refetch()} />
      )}
      {!isPending && !isError && data && (
        <div className="mt-4 px-5">
          {data.map((row, i) => (
            <div
              className={`flex items-center gap-3 py-3 ${
                i > 0 ? "border-line border-t" : ""
              }`}
              key={row.label}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-dealer-tint text-dealer-700">
                <row.icon size={15} strokeWidth={1.9} />
              </span>
              <span className="w-28 shrink-0 text-[12.5px] text-ink-muted">
                {row.label}
              </span>
              <span className="font-medium text-[13px] text-ink">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export function DealerAyarlar() {
  return (
    <DealerShell
      subtitle="Hesap, mağaza ve bildirim tercihlerinizi yönetin."
      title="Ayarlar"
    >
      <div className="mx-auto flex max-w-[720px] flex-col gap-5">
        {/* 1) Bayi Profili */}
        <ProfileCard />

        {/* 2) Bildirim Tercihleri */}
        <Card className="pb-2">
          <CardHeader
            subtitle="Hangi durumlarda bilgilendirilmek istediğinizi seçin."
            title="Bildirim Tercihleri"
          />
          <div className="mt-3 px-5">
            {NOTIFICATION_PREFS.map((pref, i) => (
              <div
                className={`flex items-center justify-between gap-4 py-3.5 ${
                  i > 0 ? "border-line border-t" : ""
                }`}
                key={pref.id}
              >
                <div className="leading-snug">
                  <div className="font-medium text-[13.5px] text-ink">
                    {pref.label}
                  </div>
                  <div className="mt-0.5 text-[12px] text-ink-muted leading-4">
                    {pref.description}
                  </div>
                </div>
                <Switch defaultChecked={pref.defaultOn} />
              </div>
            ))}
          </div>
        </Card>

        {/* 3) Güvenlik */}
        <Card className="pb-2">
          <CardHeader
            subtitle="Hesabınızın erişim ve oturum güvenliğini yönetin."
            title="Güvenlik"
          />
          <div className="mt-3 px-5">
            <button
              className="flex w-full items-center gap-3 py-3.5 text-left"
              type="button"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-dealer-tint text-dealer-700">
                <KeyRound size={15} strokeWidth={1.9} />
              </span>
              <span className="leading-snug">
                <span className="block font-medium text-[13.5px] text-ink">
                  Şifre Değiştir
                </span>
                <span className="block text-[12px] text-ink-muted">
                  En son 3 ay önce güncellendi.
                </span>
              </span>
              <ChevronRight
                className="ml-auto text-ink-muted"
                size={16}
                strokeWidth={1.9}
              />
            </button>

            <div className="flex items-center justify-between gap-4 border-line border-t py-3.5">
              <div className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-dealer-tint text-dealer-700">
                  <ShieldCheck size={15} strokeWidth={1.9} />
                </span>
                <span className="leading-snug">
                  <span className="block font-medium text-[13.5px] text-ink">
                    İki Adımlı Doğrulama
                  </span>
                  <span className="block text-[12px] text-ink-muted">
                    Girişlerde ek SMS doğrulaması isteyin.
                  </span>
                </span>
              </div>
              <Switch defaultChecked={false} />
            </div>

            <button
              className="flex w-full items-center gap-3 border-line border-t py-3.5 text-left"
              type="button"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-dealer-tint text-dealer-700">
                <Store size={15} strokeWidth={1.9} />
              </span>
              <span className="leading-snug">
                <span className="block font-medium text-[13.5px] text-ink">
                  Oturum Geçmişi
                </span>
                <span className="block text-[12px] text-ink-muted">
                  Aktif cihazları ve son girişleri görüntüleyin.
                </span>
              </span>
              <ChevronRight
                className="ml-auto text-ink-muted"
                size={16}
                strokeWidth={1.9}
              />
            </button>
          </div>
        </Card>

        {/* 4) Tercihler */}
        <Card className="pb-2">
          <CardHeader
            subtitle="Görünüm ve bölgesel ayarlarınızı düzenleyin."
            title="Tercihler"
          />
          <div className="mt-3 px-5">
            {PREFERENCE_SELECTS.map((pref, i) => (
              <div
                className={`flex items-center justify-between gap-4 py-3.5 ${
                  i > 0 ? "border-line border-t" : ""
                }`}
                key={pref.id}
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-dealer-tint text-dealer-700">
                    <pref.icon size={15} strokeWidth={1.9} />
                  </span>
                  <span className="font-medium text-[13.5px] text-ink">
                    {pref.label}
                  </span>
                </div>
                <div className="w-[160px]">
                  <Select defaultValue={pref.defaultValue}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {pref.options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DealerShell>
  );
}
