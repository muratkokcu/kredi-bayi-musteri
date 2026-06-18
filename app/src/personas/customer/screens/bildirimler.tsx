import type {
  NotifGroup,
  Notification,
  NotifTone,
} from "@/data/customer-notifications";
import { useCustomerNotifications } from "@/queries/customer-notifications";
import { EmptyState, ErrorState, LoadingState } from "@/ui/async-states";
import { MobileShell } from "../mobile-shell";

// Notification type + seed live in src/data/customer-notifications.ts;
// rows arrive via useCustomerNotifications().

const TONE_DISC: Record<NotifTone, string> = {
  cust: "bg-cust-tint text-cust",
  success: "bg-success-tint text-success",
  warn: "bg-warn-tint text-warn",
};

const GROUP_ORDER: NotifGroup[] = ["Bugün", "Bu Hafta", "Daha Önce"];

function NotificationCard({ notif }: { notif: Notification }) {
  const Icon = notif.icon;
  return (
    <div
      className={`relative flex gap-3 rounded-2xl p-3.5 ${
        notif.unread
          ? "bg-cust-tint/40"
          : "bg-surface shadow-[var(--shadow-card)]"
      }`}
    >
      {notif.unread && (
        <span className="absolute top-3 right-3 size-2 rounded-full bg-cust" />
      )}
      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
          TONE_DISC[notif.tone]
        }`}
      >
        <Icon size={18} strokeWidth={1.9} />
      </span>
      <div className="min-w-0 flex-1 pr-4">
        <div className="font-bold text-[13.5px] text-ink leading-5">
          {notif.title}
        </div>
        <div className="mt-0.5 text-[11.5px] text-ink-muted leading-4">
          {notif.body}
        </div>
        <div className="mt-1.5 text-[11px] text-ink-muted">{notif.time}</div>
      </div>
    </div>
  );
}

export function CustomerBildirimler() {
  const { data, isPending, isError, refetch } = useCustomerNotifications();

  if (isPending) {
    return (
      <MobileShell tab="Bildirimler">
        <LoadingState label="Bildirimler yükleniyor…" />
      </MobileShell>
    );
  }

  if (isError) {
    return (
      <MobileShell tab="Bildirimler">
        <ErrorState
          label="Bildirimler yüklenemedi."
          onRetry={() => refetch()}
        />
      </MobileShell>
    );
  }

  const notifications = data;

  return (
    <MobileShell tab="Bildirimler">
      <div className="flex flex-col gap-5 px-5 pt-2 pb-6">
        {/* header */}
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-bold text-[20px] text-ink">Bildirimler</h1>
          <button
            className="font-semibold text-[11.5px] text-cust"
            type="button"
          >
            Tümünü okundu işaretle
          </button>
        </div>

        {notifications.length === 0 ? (
          <EmptyState label="Henüz bildirimin yok." />
        ) : (
          // grouped sections
          GROUP_ORDER.map((group) => {
            const items = notifications.filter((n) => n.group === group);
            if (items.length === 0) {
              return null;
            }
            return (
              <div className="flex flex-col gap-2.5" key={group}>
                <div className="font-semibold text-[11px] text-ink-muted uppercase tracking-wide">
                  {group}
                </div>
                {items.map((notif) => (
                  <NotificationCard key={notif.id} notif={notif} />
                ))}
              </div>
            );
          })
        )}
      </div>
    </MobileShell>
  );
}
