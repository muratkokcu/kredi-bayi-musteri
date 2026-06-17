import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import type { FC } from "react";
import { PersonaSwitcher } from "./persona-switcher";
import { BANK_NAV } from "./personas/bank/bank-shell";
import { BankBayiYonetimi } from "./personas/bank/screens/bayi-yonetimi";
import { BankBildirimAyarlari } from "./personas/bank/screens/bildirim-ayarlari";
import { BankDashboard } from "./personas/bank/screens/dashboard";
import { BankMusteriDetay } from "./personas/bank/screens/musteri-detay";
import { BankMusteriPortfoyu } from "./personas/bank/screens/musteri-portfoyu";
import { BankPlaceholder } from "./personas/bank/screens/placeholder";
import { BankPortfoyImport } from "./personas/bank/screens/portfoy-import";
import { BankRaporlar } from "./personas/bank/screens/raporlar";
import { BankYenilemeSkoru } from "./personas/bank/screens/yenileme-skoru";
import { CUSTOMER_TABS } from "./personas/customer/mobile-shell";
import { CustomerAnaSayfa } from "./personas/customer/screens/ana-sayfa";
import { CustomerAracTercihlerim } from "./personas/customer/screens/arac-tercihlerim";
import { CustomerBasvuruDurumu } from "./personas/customer/screens/basvuru-durumu";
import { CustomerOdemePlani } from "./personas/customer/screens/odeme-plani";
import { CustomerPlaceholder } from "./personas/customer/screens/placeholder";
import { CustomerSimulator } from "./personas/customer/screens/simulator";
import { CustomerTeklifDetayi } from "./personas/customer/screens/teklif-detayi";
import { CustomerTekliflerim } from "./personas/customer/screens/tekliflerim";
import { DEALER_NAV } from "./personas/dealer/dealer-shell";
import { DealerDashboard } from "./personas/dealer/screens/ana-sayfa";
import { DealerAracDetay } from "./personas/dealer/screens/arac-detay";
import { DealerFirsatHavuzu } from "./personas/dealer/screens/firsat-havuzu";
import { DealerMusteriDetay } from "./personas/dealer/screens/musteri-detay";
import { DealerPerformans } from "./personas/dealer/screens/performans";
import { DealerPlaceholder } from "./personas/dealer/screens/placeholder";
import { DealerStok } from "./personas/dealer/screens/stok";
import { DealerTeklifOlustur } from "./personas/dealer/screens/teklif-olustur";
import { DealerTeklifler } from "./personas/dealer/screens/teklifler";

function RootLayout() {
  return (
    <>
      <Outlet />
      <PersonaSwitcher />
    </>
  );
}

/** Implemented bank screens keyed by route path. */
const BANK_SCREENS: Record<string, FC> = {
  "/banka/dashboard": BankDashboard,
  "/banka/musteri-portfoyu": BankMusteriPortfoyu,
  "/banka/yenileme-skoru": BankYenilemeSkoru,
  "/banka/bayi-yonetimi": BankBayiYonetimi,
  "/banka/portfoy-import": BankPortfoyImport,
  "/banka/bildirim-ayarlari": BankBildirimAyarlari,
  "/banka/raporlar": BankRaporlar,
};

/** Implemented dealer screens keyed by route path (filled in as built). */
const DEALER_SCREENS: Record<string, FC> = {
  "/bayi/ana-sayfa": DealerDashboard,
  "/bayi/firsat-havuzu": DealerFirsatHavuzu,
  "/bayi/teklifler": DealerTeklifler,
  "/bayi/stok": DealerStok,
  "/bayi/performans": DealerPerformans,
};

/** Implemented customer (mobile) screens keyed by route path. */
const CUSTOMER_SCREENS: Record<string, FC> = {
  "/musteri/ana-sayfa": CustomerAnaSayfa,
  "/musteri/tekliflerim": CustomerTekliflerim,
  "/musteri/simulator": CustomerSimulator,
};

const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/banka/dashboard" });
  },
});

const bankRoutes = BANK_NAV.map((nav) =>
  createRoute({
    getParentRoute: () => rootRoute,
    path: nav.to,
    component:
      BANK_SCREENS[nav.to] ?? (() => <BankPlaceholder title={nav.label} />),
  })
);

const dealerRoutes = DEALER_NAV.map((nav) =>
  createRoute({
    getParentRoute: () => rootRoute,
    path: nav.to,
    component:
      DEALER_SCREENS[nav.to] ?? (() => <DealerPlaceholder title={nav.label} />),
  })
);

const customerTabRoutes = CUSTOMER_TABS.map((tab) =>
  createRoute({
    getParentRoute: () => rootRoute,
    path: tab.to,
    component:
      CUSTOMER_SCREENS[tab.to] ??
      (() => <CustomerPlaceholder tab={tab.label} title={tab.label} />),
  })
);

// Sub-pages not present in primary nav. Customer sub-pages start as placeholders
// (filled in by the customer screen workflow).
const subPages = [
  { path: "/banka/musteri-detay", component: BankMusteriDetay },
  { path: "/bayi/arac-detay", component: DealerAracDetay },
  { path: "/bayi/teklif-olustur", component: DealerTeklifOlustur },
  { path: "/bayi/musteri-detay", component: DealerMusteriDetay },
  { path: "/musteri/teklif-detayi", component: CustomerTeklifDetayi },
  { path: "/musteri/arac-tercihlerim", component: CustomerAracTercihlerim },
  { path: "/musteri/odeme-plani", component: CustomerOdemePlani },
  { path: "/musteri/basvuru-durumu", component: CustomerBasvuruDurumu },
].map(({ path, component }) =>
  createRoute({ getParentRoute: () => rootRoute, path, component })
);

const routeTree = rootRoute.addChildren([
  indexRoute,
  ...bankRoutes,
  ...dealerRoutes,
  ...customerTabRoutes,
  ...subPages,
]);

export const router = createRouter({ routeTree });
