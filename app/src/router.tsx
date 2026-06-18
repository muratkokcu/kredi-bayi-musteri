import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { type FC, lazy, Suspense } from "react";
import { PersonaSwitcher } from "./persona-switcher";
import { BANK_NAV } from "./personas/bank/bank-shell";
import { BankPlaceholder } from "./personas/bank/screens/placeholder";
import { CUSTOMER_TABS } from "./personas/customer/mobile-shell";
import { CustomerPlaceholder } from "./personas/customer/screens/placeholder";
import { DEALER_NAV } from "./personas/dealer/dealer-shell";
import { DealerPlaceholder } from "./personas/dealer/screens/placeholder";
import { LoadingState } from "./ui/async-states";

/**
 * Screens are lazy-loaded so each persona's screens land in their own chunks,
 * fetched on navigation. This keeps the initial bundle small (route-based code
 * splitting). Placeholders + nav metadata stay static (tiny, always needed).
 */
const BankDashboard = lazy(() =>
  import("./personas/bank/screens/dashboard").then((m) => ({
    default: m.BankDashboard,
  }))
);
const BankMusteriPortfoyu = lazy(() =>
  import("./personas/bank/screens/musteri-portfoyu").then((m) => ({
    default: m.BankMusteriPortfoyu,
  }))
);
const BankYenilemeSkoru = lazy(() =>
  import("./personas/bank/screens/yenileme-skoru").then((m) => ({
    default: m.BankYenilemeSkoru,
  }))
);
const BankBayiYonetimi = lazy(() =>
  import("./personas/bank/screens/bayi-yonetimi").then((m) => ({
    default: m.BankBayiYonetimi,
  }))
);
const BankPortfoyImport = lazy(() =>
  import("./personas/bank/screens/portfoy-import").then((m) => ({
    default: m.BankPortfoyImport,
  }))
);
const BankBildirimAyarlari = lazy(() =>
  import("./personas/bank/screens/bildirim-ayarlari").then((m) => ({
    default: m.BankBildirimAyarlari,
  }))
);
const BankRaporlar = lazy(() =>
  import("./personas/bank/screens/raporlar").then((m) => ({
    default: m.BankRaporlar,
  }))
);
const BankMusteriDetay = lazy(() =>
  import("./personas/bank/screens/musteri-detay").then((m) => ({
    default: m.BankMusteriDetay,
  }))
);
const BankBayiDetay = lazy(() =>
  import("./personas/bank/screens/bayi-detay").then((m) => ({
    default: m.BankBayiDetay,
  }))
);

const DealerDashboard = lazy(() =>
  import("./personas/dealer/screens/ana-sayfa").then((m) => ({
    default: m.DealerDashboard,
  }))
);
const DealerFirsatHavuzu = lazy(() =>
  import("./personas/dealer/screens/firsat-havuzu").then((m) => ({
    default: m.DealerFirsatHavuzu,
  }))
);
const DealerTeklifler = lazy(() =>
  import("./personas/dealer/screens/teklifler").then((m) => ({
    default: m.DealerTeklifler,
  }))
);
const DealerStok = lazy(() =>
  import("./personas/dealer/screens/stok").then((m) => ({
    default: m.DealerStok,
  }))
);
const DealerMusteriler = lazy(() =>
  import("./personas/dealer/screens/musterilerim").then((m) => ({
    default: m.DealerMusteriler,
  }))
);
const DealerPerformans = lazy(() =>
  import("./personas/dealer/screens/performans").then((m) => ({
    default: m.DealerPerformans,
  }))
);
const DealerKomisyonlar = lazy(() =>
  import("./personas/dealer/screens/komisyonlar").then((m) => ({
    default: m.DealerKomisyonlar,
  }))
);
const DealerBildirimler = lazy(() =>
  import("./personas/dealer/screens/bildirimler").then((m) => ({
    default: m.DealerBildirimler,
  }))
);
const DealerAyarlar = lazy(() =>
  import("./personas/dealer/screens/ayarlar").then((m) => ({
    default: m.DealerAyarlar,
  }))
);
const DealerAracDetay = lazy(() =>
  import("./personas/dealer/screens/arac-detay").then((m) => ({
    default: m.DealerAracDetay,
  }))
);
const DealerTeklifOlustur = lazy(() =>
  import("./personas/dealer/screens/teklif-olustur").then((m) => ({
    default: m.DealerTeklifOlustur,
  }))
);
const DealerMusteriDetay = lazy(() =>
  import("./personas/dealer/screens/musteri-detay").then((m) => ({
    default: m.DealerMusteriDetay,
  }))
);

const CustomerAnaSayfa = lazy(() =>
  import("./personas/customer/screens/ana-sayfa").then((m) => ({
    default: m.CustomerAnaSayfa,
  }))
);
const CustomerTekliflerim = lazy(() =>
  import("./personas/customer/screens/tekliflerim").then((m) => ({
    default: m.CustomerTekliflerim,
  }))
);
const CustomerSimulator = lazy(() =>
  import("./personas/customer/screens/simulator").then((m) => ({
    default: m.CustomerSimulator,
  }))
);
const CustomerBildirimler = lazy(() =>
  import("./personas/customer/screens/bildirimler").then((m) => ({
    default: m.CustomerBildirimler,
  }))
);
const CustomerProfil = lazy(() =>
  import("./personas/customer/screens/profil").then((m) => ({
    default: m.CustomerProfil,
  }))
);
const CustomerTeklifDetayi = lazy(() =>
  import("./personas/customer/screens/teklif-detayi").then((m) => ({
    default: m.CustomerTeklifDetayi,
  }))
);
const CustomerAracTercihlerim = lazy(() =>
  import("./personas/customer/screens/arac-tercihlerim").then((m) => ({
    default: m.CustomerAracTercihlerim,
  }))
);
const CustomerOdemePlani = lazy(() =>
  import("./personas/customer/screens/odeme-plani").then((m) => ({
    default: m.CustomerOdemePlani,
  }))
);
const CustomerBasvuruDurumu = lazy(() =>
  import("./personas/customer/screens/basvuru-durumu").then((m) => ({
    default: m.CustomerBasvuruDurumu,
  }))
);

function RootLayout() {
  return (
    <>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-canvas">
            <LoadingState />
          </div>
        }
      >
        <Outlet />
      </Suspense>
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

/** Implemented dealer screens keyed by route path. */
const DEALER_SCREENS: Record<string, FC> = {
  "/bayi/ana-sayfa": DealerDashboard,
  "/bayi/firsat-havuzu": DealerFirsatHavuzu,
  "/bayi/teklifler": DealerTeklifler,
  "/bayi/stok": DealerStok,
  "/bayi/musteriler": DealerMusteriler,
  "/bayi/performans": DealerPerformans,
  "/bayi/komisyonlar": DealerKomisyonlar,
  "/bayi/bildirimler": DealerBildirimler,
  "/bayi/ayarlar": DealerAyarlar,
};

/** Implemented customer (mobile) screens keyed by route path. */
const CUSTOMER_SCREENS: Record<string, FC> = {
  "/musteri/ana-sayfa": CustomerAnaSayfa,
  "/musteri/tekliflerim": CustomerTekliflerim,
  "/musteri/simulator": CustomerSimulator,
  "/musteri/bildirimler": CustomerBildirimler,
  "/musteri/profil": CustomerProfil,
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

// Sub-pages not present in primary nav.
const subPages = [
  { path: "/banka/musteri-detay", component: BankMusteriDetay },
  { path: "/banka/bayi-detay", component: BankBayiDetay },
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
