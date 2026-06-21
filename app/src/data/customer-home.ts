/**
 * Customer home (ana sayfa) — server data extracted from the customer
 * ana-sayfa screen (data rollout). Served through the fake service layer
 * (src/services/customer-home) so the screen consumes it via a hook rather
 * than importing this file directly.
 *
 * The greeting, countdown, stat cards, current-loan figures, personalized
 * offer summary and market-value figures are data; pure UI config (quick-action
 * nav links, the countdown ring geometry) and the taxonomy-derived vehicle
 * name stay inline in the screen.
 */

export interface CustomerMiniStat {
  label: string;
  value: string;
  sub: string;
}

export interface CustomerHomeHeader {
  initials: string;
  name: string;
  subtitle: string;
}

export interface CustomerHomeCountdown {
  monthsLeft: string;
  blurb: string;
  ringFrac: number;
}

export interface CustomerCurrentLoan {
  kalanBorc: string;
  faizOrani: string;
  aylikTaksit: string;
}

export interface CustomerBestOffer {
  bayi: string;
  faiz: string;
  aylik: string;
}

export interface CustomerOffersSummary {
  count: string;
  best: CustomerBestOffer;
}

export interface CustomerMarketValue {
  value: string;
  change: string;
}

export interface CustomerHome {
  header: CustomerHomeHeader;
  countdown: CustomerHomeCountdown;
  miniStats: CustomerMiniStat[];
  currentLoan: CustomerCurrentLoan;
  offers: CustomerOffersSummary;
  marketValue: CustomerMarketValue;
}

export const CUSTOMER_HOME: CustomerHome = {
  header: {
    initials: "MK",
    name: "Mehmet Kaya",
    subtitle: "Kredi yenileme fırsatınız hazırlandı.",
  },
  countdown: {
    monthsLeft: "4",
    blurb:
      "Yenileme fırsatları seni bekliyor. Şimdi inceleyip avantajlı faizlerden faydalanabilirsin.",
    ringFrac: 0.62,
  },
  miniStats: [
    { label: "Tekliflerim", value: "6", sub: "yeni teklif" },
    { label: "Araç Değerim", value: "₺1.125.000", sub: "Tahmini" },
    { label: "Aylık Ödemem", value: "₺18.750", sub: "Taksit" },
    { label: "Kredi Bitiş Tarihi", value: "15.08.2025", sub: "" },
  ],
  currentLoan: {
    kalanBorc: "₺425.000",
    faizOrani: "%1,89",
    aylikTaksit: "₺18.750",
  },
  offers: {
    count: "6",
    best: {
      bayi: "Bayi Otomotiv",
      faiz: "%1,89",
      aylik: "₺16.250",
    },
  },
  marketValue: {
    value: "₺1.125.000",
    change: "%3,2",
  },
};
