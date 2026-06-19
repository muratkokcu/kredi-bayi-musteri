import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileBarChart,
  HelpCircle,
  Info,
  LayoutDashboard,
  LineChart,
  PlusCircle,
  ScrollText,
  ShieldCheck,
  TrendingUp,
  Upload,
  Users,
  Users2,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import quickFinansLogo from "@/assets/quick-finans-logo.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BankNotification {
  icon: ComponentType<{ className?: string; size?: number }>;
  id: string;
  time: string;
  title: string;
}

const BANK_NOTIFICATIONS: BankNotification[] = [
  {
    id: "renewal-spike",
    icon: TrendingUp,
    title: "Yenileme skoru 90+ olan 24 müşteri tespit edildi.",
    time: "5 dk önce",
  },
  {
    id: "import-done",
    icon: CheckCircle2,
    title: "Portföy import tamamlandı (1.248 kayıt).",
    time: "1 saat önce",
  },
  {
    id: "dealer-pending",
    icon: AlertTriangle,
    title: "3 bayi başvurusu onay bekliyor.",
    time: "Bugün 09:14",
  },
];

export const BANK_NAV = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/banka/dashboard" },
  { icon: Users, label: "Müşteri Portföyü", to: "/banka/musteri-portfoyu" },
  { icon: LineChart, label: "Yenileme Skoru", to: "/banka/yenileme-skoru" },
  { icon: Users2, label: "Bayi Yönetimi", to: "/banka/bayi-yonetimi" },
  { icon: Upload, label: "Portföy Import", to: "/banka/portfoy-import" },
  { icon: Bell, label: "Bildirim Ayarları", to: "/banka/bildirim-ayarlari" },
  { icon: FileBarChart, label: "Raporlar", to: "/banka/raporlar" },
  { icon: ScrollText, label: "Denetim Kaydı", to: "/banka/denetim-kaydi" },
  { icon: ShieldCheck, label: "Rıza Yönetimi", to: "/banka/riza-yonetimi" },
];

function Logo() {
  return (
    <div className="px-5 pt-5">
      <img
        alt="QuickFinans"
        className="h-7 w-auto"
        height={28}
        src={quickFinansLogo}
        width={132}
      />
      <div className="mt-1.5 font-semibold text-[9px] text-ink-muted tracking-[0.12em]">
        YENİLEME PLATFORMU
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="flex w-[224px] shrink-0 flex-col border-line border-r bg-surface">
      <Logo />
      <nav className="mt-5 flex flex-col gap-0.5 px-3">
        {BANK_NAV.map(({ icon: Icon, label, to }) => (
          <Link
            activeProps={{ className: "bg-bank-tint text-bank-700" }}
            className="relative flex items-center gap-3 rounded-[10px] px-3 py-2.5 font-medium text-[13.5px] transition-colors"
            inactiveProps={{ className: "text-ink-soft hover:bg-line/60" }}
            key={label}
            to={to}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 h-5 w-1 rounded-r bg-bank" />
                )}
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.9} />
                {label}
              </>
            )}
          </Link>
        ))}
      </nav>

      <div className="mt-auto px-5 pb-4">
        <div className="mb-2 font-semibold text-[11px] text-ink-muted uppercase tracking-wide">
          Kısayollar
        </div>
        <button
          className="flex w-full items-center gap-3 py-2 font-medium text-[13px] text-ink-soft hover:text-ink"
          type="button"
        >
          <PlusCircle size={17} strokeWidth={1.9} /> Yeni Bildirim
        </button>
        <button
          className="flex w-full items-center gap-3 py-2 font-medium text-[13px] text-ink-soft hover:text-ink"
          type="button"
        >
          <HelpCircle size={17} strokeWidth={1.9} /> Destek Merkezi
        </button>

        <div className="mt-3 flex items-center gap-3 rounded-[12px] border border-line bg-canvas px-3 py-2.5">
          <div className="flex size-9 items-center justify-center rounded-full bg-bank-tint font-bold text-[12px] text-bank-700">
            AK
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-[13px] text-ink">Ahmet Kaya</div>
            <div className="text-[11.5px] text-ink-muted">Yönetici</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/** Standard right-side utility cluster shared by every bank screen. */
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
            <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-bank ring-2 ring-white" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 p-0">
          <div className="flex items-center justify-between border-line border-b px-4 py-2.5">
            <span className="font-semibold text-[13px] text-ink">
              Bildirimler
            </span>
            <span className="font-semibold text-[11px] text-bank">
              {BANK_NOTIFICATIONS.length} yeni
            </span>
          </div>
          <ul className="flex flex-col py-1">
            {BANK_NOTIFICATIONS.map(({ id, icon: Icon, title, time }) => (
              <li
                className="flex items-start gap-3 px-4 py-2.5 hover:bg-canvas"
                key={id}
              >
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-bank-tint text-bank-700">
                  <Icon className="text-bank-700" size={15} />
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
            <button
              className="font-semibold text-[12.5px] text-bank hover:underline"
              type="button"
            >
              Tümünü gör
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <button
        className="flex size-10 items-center justify-center rounded-[10px] border border-line-strong bg-surface text-ink-soft hover:bg-canvas"
        type="button"
      >
        <HelpCircle size={18} strokeWidth={1.9} />
      </button>
      <button
        className="flex items-center gap-2.5 rounded-[10px] border border-line-strong bg-surface py-1.5 pr-2.5 pl-1.5 hover:bg-canvas"
        type="button"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-bank-tint font-bold text-[12px] text-bank-700">
          AK
        </span>
        <span className="text-left leading-tight">
          <span className="block font-semibold text-[13px] text-ink">
            Ahmet Kaya
          </span>
          <span className="block text-[11px] text-ink-muted">Yönetici</span>
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
  highlight?: string;
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
            {highlight && <span className="text-bank">{highlight}</span>}
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

export function BankShell({
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
  highlight?: string;
  subtitle?: string;
  info?: boolean;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="theme-bank flex h-full min-h-screen bg-canvas">
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
