import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  Banknote,
  Bell,
  Boxes,
  ChevronDown,
  ChevronRight,
  FileBarChart,
  FileWarning,
  Filter,
  Gauge,
  HelpCircle,
  Menu,
  PieChart,
  ShieldAlert,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { type ComponentType, type ReactNode, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ReportingNotification {
  icon: ComponentType<{ className?: string; size?: number }>;
  id: string;
  time: string;
  title: string;
}

const REPORTING_NOTIFICATIONS: ReportingNotification[] = [
  {
    id: "npl",
    icon: AlertTriangle,
    title: "Marmara bölgesinde NPL oranı %2,1 arttı.",
    time: "15 dk önce",
  },
  {
    id: "uretim",
    icon: TrendingUp,
    title: "Eylül üretimi hedefin %4 üzerinde kapandı.",
    time: "1 saat önce",
  },
  {
    id: "evrak",
    icon: FileWarning,
    title: "Doğuş Otomotiv'de 12 eksik evrak bekliyor.",
    time: "Bugün 09:10",
  },
];

export const REPORTING_NAV = [
  { icon: FileBarChart, label: "Raporlar", to: "/raporlama/raporlar" },
  { icon: Banknote, label: "Üretim & Karlılık", to: "/raporlama/uretim-karlilik" },
  { icon: Filter, label: "Başvuru Hunisi", to: "/raporlama/basvuru-hunisi" },
  { icon: Gauge, label: "Satış & Penetrasyon", to: "/raporlama/satis-penetrasyon" },
  { icon: Boxes, label: "Stok Finansmanı", to: "/raporlama/stok-finansmani" },
  { icon: ShieldAlert, label: "Risk & İzleme", to: "/raporlama/risk-izleme" },
  { icon: Wallet, label: "Limit Takip", to: "/raporlama/limit-takip" },
  { icon: FileWarning, label: "Eksik Evrak", to: "/raporlama/eksik-evrak" },
  { icon: Activity, label: "Bayi Karlılık", to: "/raporlama/bayi-karlilik" },
];

function Logo() {
  return (
    <div className="flex items-center gap-2 px-5 pt-5">
      <PieChart className="text-bank" size={26} strokeWidth={2.1} />
      <div className="leading-none">
        <div className="font-bold text-[17px] text-ink tracking-tight">
          Raporlama
        </div>
        <div className="mt-1 font-semibold text-[9px] text-ink-muted tracking-[0.12em]">
          İŞ ZEKÂSI MERKEZİ
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
        {REPORTING_NAV.map(({ icon: Icon, label, to }) => (
          <Link
            activeProps={{ className: "bg-bank-tint text-bank-700" }}
            className="relative flex items-center gap-3 rounded-[10px] px-3 py-2.5 font-medium text-[13.5px] transition-colors"
            inactiveProps={{ className: "text-ink-soft hover:bg-line/60" }}
            key={label}
            onClick={onNavigate}
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
          <FileBarChart size={17} strokeWidth={1.9} /> Rapor Tasarla
        </button>
        <button
          className="flex w-full items-center gap-3 py-2 font-medium text-[13px] text-ink-soft hover:text-ink"
          type="button"
        >
          <HelpCircle size={17} strokeWidth={1.9} /> Destek Merkezi
        </button>

        <div className="mt-3 flex items-center gap-3 rounded-[12px] border border-line bg-canvas px-3 py-2.5">
          <div className="flex size-9 items-center justify-center rounded-full bg-bank-tint font-bold text-[12px] text-bank-700">
            SD
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-[13px] text-ink">Selin Demir</div>
            <div className="text-[11.5px] text-ink-muted">Raporlama Uzmanı</div>
          </div>
        </div>
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
            <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-bank ring-2 ring-white" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 p-0">
          <div className="flex items-center justify-between border-line border-b px-4 py-2.5">
            <span className="font-semibold text-[13px] text-ink">
              Bildirimler
            </span>
            <span className="font-semibold text-[11px] text-bank">
              {REPORTING_NOTIFICATIONS.length} yeni
            </span>
          </div>
          <ul className="flex flex-col py-1">
            {REPORTING_NOTIFICATIONS.map(({ id, icon: Icon, title, time }) => (
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
        className="flex items-center gap-2.5 rounded-[10px] border border-line-strong bg-surface py-1.5 pr-2.5 pl-1.5 hover:bg-canvas"
        type="button"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-bank-tint font-bold text-[12px] text-bank-700">
          SD
        </span>
        <span className="hidden text-left leading-tight sm:block">
          <span className="block font-semibold text-[13px] text-ink">
            Selin Demir
          </span>
          <span className="block text-[11px] text-ink-muted">Raporlama</span>
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

export function ReportingShell({
  breadcrumb,
  title,
  highlight,
  subtitle,
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
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="theme-bank flex h-full min-h-screen bg-canvas">
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
              <PieChart className="text-bank" size={20} strokeWidth={2.1} />
              <span className="font-bold text-[15px] text-ink tracking-tight">
                Raporlama
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

        <div className="px-4 pt-6 pb-10 lg:px-8">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="font-bold text-[20px] text-ink tracking-tight lg:text-[24px]">
                {title}{" "}
                {highlight && <span className="text-bank">{highlight}</span>}
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
