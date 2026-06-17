import { Link } from "@tanstack/react-router";
import {
  BatteryFull,
  Bell,
  Calculator,
  FileText,
  House,
  SignalHigh,
  User,
  Wifi,
} from "lucide-react";
import type { ReactNode } from "react";

export const CUSTOMER_TABS = [
  { icon: House, label: "Ana Sayfa", to: "/musteri/ana-sayfa" },
  { icon: FileText, label: "Tekliflerim", to: "/musteri/tekliflerim" },
  { icon: Calculator, label: "Simülatör", to: "/musteri/simulator" },
  { icon: Bell, label: "Bildirimler", to: "/musteri/bildirimler", badge: 3 },
  { icon: User, label: "Profilim", to: "/musteri/profil" },
];

function StatusBar() {
  return (
    <div className="flex shrink-0 items-center justify-between px-7 pt-3 pb-1.5">
      <span className="font-semibold text-[15px] text-ink">9:41</span>
      <div className="flex items-center gap-1.5 text-ink">
        <SignalHigh size={17} strokeWidth={2.2} />
        <Wifi size={16} strokeWidth={2.2} />
        <BatteryFull size={20} strokeWidth={2} />
      </div>
    </div>
  );
}

function TabBar({ active }: { active?: string }) {
  return (
    <nav className="sticky bottom-0 flex items-stretch justify-between border-line border-t bg-surface px-3 pt-2 pb-3">
      {CUSTOMER_TABS.map(({ icon: Icon, label, to, badge }) => {
        const on = label === active;
        return (
          <Link
            className="relative flex flex-1 flex-col items-center gap-1 py-1"
            key={label}
            to={to}
          >
            <span
              className={`relative flex h-7 w-12 items-center justify-center rounded-full ${
                on ? "bg-cust-tint text-cust" : "text-ink-muted"
              }`}
            >
              <Icon size={20} strokeWidth={on ? 2.4 : 1.9} />
              {badge ? (
                <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-danger font-bold text-[9px] text-white">
                  {badge}
                </span>
              ) : null}
            </span>
            <span
              className={`text-[10.5px] ${on ? "font-semibold text-cust" : "text-ink-muted"}`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * Mobile device frame for the customer persona (purple/indigo theme).
 * Tab roots pass `tab`; sub-pages pass a custom `bottomBar` (e.g. action buttons).
 */
export function MobileShell({
  tab,
  bottomBar,
  children,
}: {
  tab?: string;
  bottomBar?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="theme-cust flex min-h-screen justify-center bg-[#e7e9f0] py-6">
      <div className="flex w-[432px] flex-col overflow-hidden rounded-[44px] bg-canvas shadow-[0_24px_70px_rgba(15,23,42,0.18)] ring-1 ring-black/5">
        <StatusBar />
        <div className="flex flex-1 flex-col">{children}</div>
        {tab ? <TabBar active={tab} /> : bottomBar}
      </div>
    </div>
  );
}
