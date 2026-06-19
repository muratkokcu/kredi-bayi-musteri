import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Car,
  CarFront,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Coins,
  FileText,
  Handshake,
  Headphones,
  Home,
  Info,
  Settings,
  Sparkles,
  Store,
  User,
  Users2,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DealerNotification {
  icon: ComponentType<{ className?: string; size?: number }>;
  id: string;
  time: string;
  title: string;
}

const DEALER_NOTIFICATIONS: DealerNotification[] = [
  {
    id: "new-lead",
    icon: Sparkles,
    title: "Fırsat havuzuna 5 yeni müşteri eklendi.",
    time: "3 dk önce",
  },
  {
    id: "offer-accepted",
    icon: CheckCircle2,
    title: "Teklifiniz kabul edildi: Yıldız Holding.",
    time: "42 dk önce",
  },
  {
    id: "commission-ready",
    icon: Handshake,
    title: "Mayıs komisyon ödemeniz hazır.",
    time: "Bugün 08:30",
  },
];

export const DEALER_NAV = [
  { icon: Home, label: "Ana Sayfa", to: "/bayi/ana-sayfa" },
  { icon: Users2, label: "Fırsat Havuzu", to: "/bayi/firsat-havuzu" },
  { icon: FileText, label: "Tekliflerim", to: "/bayi/teklifler" },
  { icon: Car, label: "Stok Yönetimi", to: "/bayi/stok" },
  { icon: User, label: "Müşterilerim", to: "/bayi/musteriler" },
  { icon: BarChart3, label: "Performans", to: "/bayi/performans" },
  { icon: Coins, label: "Komisyonlar", to: "/bayi/komisyonlar" },
  { icon: Bell, label: "Bildirimler", to: "/bayi/bildirimler" },
  { icon: Settings, label: "Ayarlar", to: "/bayi/ayarlar" },
];

function Logo() {
  return (
    <div className="flex items-center gap-2 px-5 pt-5">
      <CarFront
        aria-hidden="true"
        className="text-dealer"
        size={28}
        strokeWidth={2.1}
      />
      <div className="leading-none">
        <div className="font-bold text-[17px] text-ink tracking-tight">
          Kaya<span className="text-dealer">Oto</span>
        </div>
        <div className="mt-1 font-semibold text-[9px] text-ink-muted tracking-[0.12em]">
          BAYİ PORTALI
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="flex w-[224px] shrink-0 flex-col border-line border-r bg-surface">
      <Logo />
      <nav className="mt-5 flex flex-col gap-0.5 px-3">
        {DEALER_NAV.map(({ icon: Icon, label, to }) => (
          <Link
            activeProps={{ className: "bg-dealer-tint text-dealer-700" }}
            className="relative flex items-center gap-3 rounded-[10px] px-3 py-2.5 font-medium text-[13.5px] transition-colors"
            inactiveProps={{ className: "text-ink-soft hover:bg-line/60" }}
            key={label}
            to={to}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 h-5 w-1 rounded-r bg-dealer" />
                )}
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.9} />
                {label}
              </>
            )}
          </Link>
        ))}
      </nav>

      <div className="mt-auto px-4 pb-4">
        <button
          className="flex w-full items-center gap-3 rounded-[12px] border border-line bg-canvas px-3 py-2.5"
          type="button"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-dealer-tint font-bold text-[12px] text-dealer-700">
            MK
          </span>
          <span className="text-left leading-tight">
            <span className="block font-semibold text-[13px] text-ink">
              Mehmet Kaya
            </span>
            <span className="block text-[11.5px] text-ink-muted">
              Kaya Otomotiv
            </span>
          </span>
          <ChevronDown
            className="ml-auto text-ink-muted"
            size={15}
            strokeWidth={1.9}
          />
        </button>
        <button
          className="mt-2 flex w-full items-center gap-3 rounded-[12px] border border-line px-3 py-2.5 font-medium text-[13px] text-ink-soft hover:bg-canvas"
          type="button"
        >
          <Headphones size={17} strokeWidth={1.9} /> Yardım & Destek
          <ChevronRight className="ml-auto" size={15} strokeWidth={1.9} />
        </button>
      </div>
    </aside>
  );
}

function TopbarUtilities() {
  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="relative flex size-10 items-center justify-center rounded-[10px] border border-line-strong bg-surface text-ink-soft hover:bg-canvas"
            type="button"
          >
            <Bell size={18} strokeWidth={1.9} />
            <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-danger font-bold text-[9px] text-white">
              3
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 p-0">
          <div className="flex items-center justify-between border-line border-b px-4 py-2.5">
            <span className="font-semibold text-[13px] text-ink">
              Bildirimler
            </span>
            <span className="font-semibold text-[11px] text-dealer">
              {DEALER_NOTIFICATIONS.length} yeni
            </span>
          </div>
          <ul className="flex flex-col py-1">
            {DEALER_NOTIFICATIONS.map(({ id, icon: Icon, title, time }) => (
              <li
                className="flex items-start gap-3 px-4 py-2.5 hover:bg-canvas"
                key={id}
              >
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-dealer-tint text-dealer-700">
                  <Icon className="text-dealer-700" size={15} />
                </span>
                <span className="leading-snug">
                  <span className="block text-[12.5px] text-ink">{title}</span>
                  <span className="mt-0.5 block text-[11px] text-ink-muted">
                    {time}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <div className="border-line border-t px-4 py-2.5 text-center">
            <Link
              className="font-semibold text-[12.5px] text-dealer hover:underline"
              to="/bayi/bildirimler"
            >
              Tümünü gör
            </Link>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <button
        className="flex size-10 items-center justify-center rounded-[10px] border border-line-strong bg-surface text-ink-soft hover:bg-canvas"
        type="button"
      >
        <Info size={18} strokeWidth={1.9} />
      </button>
      <button
        className="flex items-center gap-2.5 rounded-[10px] border border-line-strong bg-surface px-3 py-2 hover:bg-canvas"
        type="button"
      >
        <Store className="text-dealer" size={17} strokeWidth={1.9} />
        <span className="font-semibold text-[13px] text-ink">
          Kaya Otomotiv
        </span>
        <ChevronDown className="text-ink-muted" size={15} strokeWidth={1.9} />
      </button>
    </div>
  );
}

function Topbar({
  breadcrumb,
  title,
  highlight,
  subtitle,
  info,
  actions,
}: {
  breadcrumb?: readonly string[];
  title: string;
  highlight?: ReactNode;
  subtitle?: string;
  info?: boolean;
  actions?: ReactNode;
}) {
  return (
    <header className="flex items-start justify-between gap-4 px-8 pt-7">
      <div>
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="mb-1.5 flex items-center gap-1.5 text-[12.5px] text-ink-muted">
            {breadcrumb.map((crumb, i) => (
              <span className="flex items-center gap-1.5" key={crumb}>
                {i > 0 && <ChevronRight size={13} strokeWidth={2} />}
                <span
                  className={i === breadcrumb.length - 1 ? "text-ink-soft" : ""}
                >
                  {crumb}
                </span>
              </span>
            ))}
          </nav>
        )}
        <h1 className="flex items-center gap-2 font-bold text-[24px] text-ink tracking-tight">
          <span>
            {title}{" "}
            {highlight && <span className="text-dealer">{highlight}</span>}
          </span>
          {info && (
            <Info className="text-ink-muted" size={17} strokeWidth={1.9} />
          )}
        </h1>
        {subtitle && (
          <p className="mt-1.5 text-[13.5px] text-ink-soft">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <TopbarUtilities />
      </div>
    </header>
  );
}

export function DealerShell({
  breadcrumb,
  title,
  highlight,
  subtitle,
  info,
  actions,
  children,
}: {
  breadcrumb?: readonly string[];
  title: string;
  highlight?: ReactNode;
  subtitle?: string;
  info?: boolean;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="theme-dealer flex h-full min-h-screen bg-canvas">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        <Topbar
          actions={actions}
          breadcrumb={breadcrumb}
          highlight={highlight}
          info={info}
          subtitle={subtitle}
          title={title}
        />
        <div className="px-8 pt-6 pb-10">{children}</div>
      </main>
    </div>
  );
}
