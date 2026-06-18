/**
 * Bank reports screen — the server-derived analytics behind Raporlar
 * (KPIs, renewal trend series, segment mix, funnel, dealer tables, regional
 * rates and period comparison). Pure presentation (icons, tones, chart colors,
 * tab labels) stays inline in the screen; only the figures live here.
 *
 * `regions` feeds both the side list and the Türkiye choropleth on the screen.
 */
export interface ReportKpi {
  delta: string;
  label: string;
  value: string;
}

export interface ReportSegment {
  label: string;
  value: string;
}

export interface ReportFunnelStage {
  frac: number;
  label: string;
  pct: string;
  value: string;
}

export interface ReportBayi {
  ad: string;
  hacim: string;
  oran: string;
  teklif: string;
}

export interface ReportRegion {
  bolge: string;
  oran: number;
}

export interface ReportDonem {
  degisim: string;
  gosterge: string;
  oncki: string;
  secili: string;
}

export interface ReportBayiOran {
  ad: string;
  oran: string;
  pct: number;
}

export interface ReportTrend {
  data: number[];
  labels: string[];
  ticks: string[];
}

export interface Reports {
  bayiOran: ReportBayiOran[];
  bayiler: ReportBayi[];
  donem: ReportDonem[];
  funnel: ReportFunnelStage[];
  kpis: ReportKpi[];
  regions: ReportRegion[];
  segments: ReportSegment[];
  trend: ReportTrend;
}

export const REPORTS: Reports = {
  kpis: [
    { label: "Yenileme Oranı", value: "%32,6", delta: "%4,3" },
    { label: "Toplam Uygun Müşteri", value: "18.492", delta: "%12,4" },
    { label: "Teklif Gönderilen", value: "6.842", delta: "%8,7" },
    { label: "Kabul Edilen", value: "2.231", delta: "%9,1" },
    { label: "Toplam Hacim", value: "₺1,28 Milyar", delta: "%15,6" },
  ],
  trend: {
    labels: [
      "May 2024",
      "Haz 2024",
      "Tem 2024",
      "Ağu 2024",
      "Eyl 2024",
      "Eki 2024",
      "Kas 2024",
      "Ara 2024",
      "Oca 2025",
      "Şub 2025",
      "Mar 2025",
      "Nis 2025",
    ],
    data: [24, 25, 23, 27, 26, 28, 29, 27, 30, 31, 32, 32.6],
    ticks: ["%40", "%30", "%20", "%10", "%0"],
  },
  segments: [
    { label: "SUV", value: "%38,2" },
    { label: "Sedan", value: "%31,4" },
    { label: "Hatchback", value: "%27,1" },
    { label: "MPV", value: "%24,8" },
    { label: "Diğer", value: "%18,3" },
  ],
  funnel: [
    { label: "Uygun Müşteri", value: "18.492", pct: "%100", frac: 1 },
    { label: "İletişime Geçilen", value: "9.842", pct: "%53,2", frac: 0.78 },
    { label: "Teklif Gönderilen", value: "6.842", pct: "%36,9", frac: 0.58 },
    { label: "Teklif Görüntülenen", value: "3.192", pct: "%17,3", frac: 0.4 },
    { label: "Kabul Edilen", value: "2.231", pct: "%12,1", frac: 0.26 },
  ],
  bayiler: [
    { ad: "Doğuş Oto", teklif: "1.248", oran: "%18,7", hacim: "₺285.4 M" },
    { ad: "Borusan Otomotiv", teklif: "1.102", oran: "%17,3", hacim: "₺238.7 M" },
    { ad: "Otokoç", teklif: "987", oran: "%16,2", hacim: "₺212.3 M" },
    { ad: "Groupe PSA", teklif: "765", oran: "%15,8", hacim: "₺162.6 M" },
    { ad: "Kaya Otomotiv", teklif: "612", oran: "%14,9", hacim: "₺128.9 M" },
  ],
  regions: [
    { bolge: "Marmara", oran: 48 },
    { bolge: "Ege", oran: 41 },
    { bolge: "İç Anadolu", oran: 36 },
    { bolge: "Akdeniz", oran: 33 },
    { bolge: "Karadeniz", oran: 24 },
    { bolge: "Doğu Anadolu", oran: 18 },
    { bolge: "Güneydoğu Anadolu", oran: 15 },
  ],
  donem: [
    {
      gosterge: "Yenileme Oranı",
      secili: "%32,6",
      oncki: "%28,3",
      degisim: "%4,3",
    },
    {
      gosterge: "Uygun Müşteri",
      secili: "18.492",
      oncki: "16.446",
      degisim: "%12,4",
    },
    {
      gosterge: "Teklif Gönderilen",
      secili: "6.842",
      oncki: "6.301",
      degisim: "%8,7",
    },
    {
      gosterge: "Kabul Edilen",
      secili: "2.231",
      oncki: "2.045",
      degisim: "%9,1",
    },
    {
      gosterge: "Toplam Hacim",
      secili: "₺1,28 Milyar",
      oncki: "₺1,11 Milyar",
      degisim: "%15,6",
    },
  ],
  bayiOran: [
    { ad: "Doğuş Oto", oran: "%38,7", pct: 100 },
    { ad: "Borusan Otomotiv", oran: "%36,1", pct: 93 },
    { ad: "Otokoç", oran: "%33,4", pct: 86 },
    { ad: "Groupe PSA", oran: "%31,2", pct: 81 },
    { ad: "Kaya Otomotiv", oran: "%28,9", pct: 75 },
  ],
};
