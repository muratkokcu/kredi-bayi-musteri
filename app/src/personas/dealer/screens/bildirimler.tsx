import { Bell, CheckCircle2 } from "lucide-react";
import type {
  Group,
  NotificationDef,
  Tone,
} from "@/data/dealer-notifications";
import { useDealerNotifications } from "@/queries/dealer-notifications";
import { EmptyState, ErrorState, LoadingState } from "@/ui/async-states";
import { Card } from "@/ui/card";
import { DealerShell } from "../dealer-shell";

// NotificationDef type + seed live in src/data/dealer-notifications.ts;
// rows arrive via useDealerNotifications().

const TONE_DISC: Record<Tone, string> = {
  dealer: "bg-dealer-tint text-dealer-700",
  success: "bg-success-tint text-success",
  warn: "bg-warn-tint text-warn",
};

const FILTERS = ["Tümü", "Okunmamış", "Fırsat", "Teklif", "Komisyon"] as const;

const GROUP_ORDER: Group[] = ["Bugün", "Bu Hafta", "Daha Önce"];

function FilterChips() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {FILTERS.map((label, i) => (
        <button
          className={
            i === 0
              ? "rounded-[10px] bg-dealer px-3.5 py-2 font-semibold text-[12.5px] text-white"
              : "rounded-[10px] border border-line-strong bg-surface px-3.5 py-2 font-medium text-[12.5px] text-ink-soft hover:bg-canvas"
          }
          key={label}
          type="button"
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function NotificationRow({ item }: { item: NotificationDef }) {
  const Icon = item.icon;
  return (
    <div
      className={`flex items-start gap-3.5 border-line border-b px-5 py-3.5 last:border-0 ${
        item.unread ? "bg-dealer-tint/30" : ""
      }`}
    >
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-full ${TONE_DISC[item.tone]}`}
      >
        <Icon size={17} strokeWidth={1.9} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-bold text-[13.5px] text-ink leading-4">
            {item.title}
          </p>
          {item.unread && (
            <span className="size-2 shrink-0 rounded-full bg-dealer" />
          )}
        </div>
        <p className="mt-1 text-[12.5px] text-ink-soft leading-4">
          {item.description}
        </p>
      </div>
      <span className="shrink-0 text-[11.5px] text-ink-muted tabular-nums">
        {item.time}
      </span>
    </div>
  );
}

function NotificationGroup({
  group,
  notifications,
}: {
  group: Group;
  notifications: NotificationDef[];
}) {
  const items = notifications.filter((n) => n.group === group);
  if (items.length === 0) {
    return null;
  }
  return (
    <section>
      <h2 className="mb-2.5 font-semibold text-[11px] text-ink-muted uppercase tracking-[0.08em]">
        {group}
      </h2>
      <Card>
        {items.map((item) => (
          <NotificationRow item={item} key={item.id} />
        ))}
      </Card>
    </section>
  );
}

function MarkAllReadButton() {
  return (
    <button
      className="flex items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-3.5 py-2 font-semibold text-[13px] text-dealer-700 hover:bg-dealer-tint"
      type="button"
    >
      <CheckCircle2 size={16} strokeWidth={2} />
      Tümünü okundu işaretle
    </button>
  );
}

export function DealerBildirimler() {
  const { data, isPending, isError, refetch } = useDealerNotifications();
  const notifications = data ?? [];
  const unreadCount = notifications.filter((n) => n.unread).length;
  return (
    <DealerShell
      actions={<MarkAllReadButton />}
      subtitle="Fırsat, teklif ve komisyon hareketleriniz."
      title="Bildirimler"
    >
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <FilterChips />
          <span className="flex shrink-0 items-center gap-1.5 text-[12.5px] text-ink-muted">
            <Bell size={15} strokeWidth={1.9} />
            <span className="font-semibold text-dealer-700 tabular-nums">
              {unreadCount}
            </span>
            okunmamış
          </span>
        </div>

        {isPending && <LoadingState label="Bildirimler yükleniyor…" />}
        {!isPending && isError && (
          <ErrorState
            label="Bildirimler yüklenemedi."
            onRetry={() => refetch()}
          />
        )}
        {!(isPending || isError) && notifications.length === 0 && (
          <EmptyState label="Henüz bildiriminiz yok." />
        )}
        {!(isPending || isError) && notifications.length > 0 && (
          <div className="mt-6 space-y-6">
            {GROUP_ORDER.map((group) => (
              <NotificationGroup
                group={group}
                key={group}
                notifications={notifications}
              />
            ))}
          </div>
        )}
      </div>
    </DealerShell>
  );
}
