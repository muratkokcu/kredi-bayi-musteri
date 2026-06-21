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
  Menu,
  Settings,
  Sparkles,
  Store,
  User,
  Users2,
} from "lucide-react";
import { type ComponentType, type ReactNode, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

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
          Bayi
        </div>
        <div className="mt-1 font-semibold text-[9px] text-ink-muted tracking-[0.12em]">
          BAYİ PORTALI
        </div>
      </div>
    </div>
  );
}

function Sidebar({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <aside
      className={cn(
        "flex w-[224px] shrink-0 flex-col border-line border-r bg-surface",
        className
      )}
    >
      <Logo />
      <nav className="mt-5 flex flex-col gap-0.5 px-3">
        {DEALER_NAV.map(({ icon: Icon, label, to }) => (
          <Link
            activeProps={{ className: "bg-dealer-tint text-dealer-700" }}
            className="relative flex items-center gap-3 rounded-[10px] px-3 py-2.5 font-medium text-[13.5px] transition-colors"
            inactiveProps={{ className: "text-ink-soft hover:bg-line/60" }}
            key={label}
            onClick={onNavigate}
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
              Bayi
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
        className="flex items-center gap-2.5 rounded-[10px] border border-line-strong bg-surface px-3 py-2 hover:bg-canvas"
        type="button"
      >
        <Store className="text-dealer" size={17} strokeWidth={1.9} />
        <span className="hidden font-semibold text-[13px] text-ink sm:inline">
          Bayi
        </span>
        <ChevronDown
          className="hidden text-ink-muted sm:block"
          size={15}
          strokeWidth={1.9}
        />
      </button>
    </div>
  );
}

export function DealerShell({
  breadcrumb,
  title,
  highlight,
  subtitle,
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
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="theme-dealer flex h-full min-h-screen bg-canvas">
      <Sidebar className="hidden lg:flex" />

      {navOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Menüyü kapat"
            className="absolute inset-0 bg-black/40"
            onClick={() => setNavOpen(false)}
            type="button"
          />
          <Sidebar
            className="absolute inset-y-0 left-0 shadow-[var(--shadow-pop)]"
            onNavigate={() => setNavOpen(false)}
          />
        </div>
      )}

      <main className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        {/* Standard global top bar — utilities always live here, consistent
            across every screen, independent of page content. */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-line border-b bg-surface px-4 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              aria-label="Menüyü aç"
              className="flex size-9 items-center justify-center rounded-[10px] border border-line-strong bg-surface text-ink-soft lg:hidden"
              onClick={() => setNavOpen(true)}
              type="button"
            >
              <Menu size={18} strokeWidth={2} />
            </button>
            <span className="flex items-center gap-1.5 lg:hidden">
              <CarFront className="text-dealer" size={20} strokeWidth={2.1} />
              <span className="font-bold text-[15px] text-ink tracking-tight">
                Bayi
              </span>
            </span>
            {breadcrumb && breadcrumb.length > 0 && (
              <nav className="hidden min-w-0 items-center gap-1.5 text-[12.5px] text-ink-muted lg:flex">
                {breadcrumb.map((crumb, i) => (
                  <span className="flex items-center gap-1.5" key={crumb}>
                    {i > 0 && <ChevronRight size={13} strokeWidth={2} />}
                    <span
                      className={
                        i === breadcrumb.length - 1 ? "text-ink-soft" : ""
                      }
                    >
                      {crumb}
                    </span>
                  </span>
                ))}
              </nav>
            )}
          </div>
          <TopbarUtilities />
        </header>

        {/* Page content with its own page header (title / subtitle / actions) */}
        <div className="px-4 pt-6 pb-10 lg:px-8">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="font-bold text-[20px] text-ink tracking-tight lg:text-[24px]">
                {title}{" "}
                {highlight && <span className="text-dealer">{highlight}</span>}
              </h1>
              {subtitle && (
                <p className="mt-1.5 text-[13.5px] text-ink-soft">{subtitle}</p>
              )}
            </div>
            {actions && (
              <div className="flex flex-wrap items-center gap-2.5">{actions}</div>
            )}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
