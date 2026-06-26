/**
 * Executive dashboard — hesaplama + küçük görsel parçalar.
 * Tüm metrikler mevcut veri setlerinden (production-loans, applications,
 * risk-watch, limits) türetilir; ekran (dashboard.tsx) bunları yerleştirir.
 */
import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Funnel,
  FunnelChart,
  LabelList,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ReferenceLine,
  ResponsiveContainer,
  Treemap,
  XAxis,
  YAxis,
} from "recharts";
import type { Application } from "@/data/applications";
import type { LimitRow } from "@/data/limits";
import type { ProductionLoan } from "@/data/production-loans";
import type { RiskContract } from "@/data/risk-watch";
import type { Bolge } from "@/data/turkiye-bolge";
import { BOLGELER } from "@/data/turkiye-bolge";

// ---------------------------------------------------------------- formatlama
const trNum = (x: number, d = 0) =>
  new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(x);

export const fmtAdet = (x: number) => trNum(Math.round(x));
export const fmtPct = (x: number, d = 1) => `%${trNum(x, d)}`;
export const fmtMn = (x: number, d = 1) => trNum(x / 1_000_000, d); // milyon
export const fmtTL = (x: number) => `${trNum(Math.round(x))} TL`;

/** Para başlığı: ≥1 Mr → "X,XX Milyar TL", değilse "X Milyon TL". */
export function fmtBig(x: number): { value: string; unit: string } {
  if (Math.abs(x) >= 1_000_000_000) {
    return { value: trNum(x / 1_000_000_000, 2), unit: "Milyar TL" };
  }
  return { value: trNum(x / 1_000_000, 0), unit: "Milyon TL" };
}

const sum = <T,>(xs: T[], f: (x: T) => number) => xs.reduce((a, x) => a + f(x), 0);
const avg = <T,>(xs: T[], f: (x: T) => number) => (xs.length ? sum(xs, f) / xs.length : 0);
const pct = (a: number, b: number) => (b ? (a / b) * 100 : 0);
const groupSum = <T,>(xs: T[], key: (x: T) => string, val: (x: T) => number) => {
  const m = new Map<string, number>();
  for (const x of xs) {
    m.set(key(x), (m.get(key(x)) ?? 0) + val(x));
  }
  return [...m.entries()].map(([name, value]) => ({ name, value }));
};

// ------------------------------------------------------------------- tipler
export interface WaterfallStep {
  label: string;
  value: number;
  type: "total" | "up" | "down";
}

export interface ExecData {
  kpis: ExecKpi[];
  topBayi: { name: string; hacim: number; adet: number }[];
  hacimMaxBayi: number;
  dagilim: { title: string; rows: { name: string; pct: number }[] }[];
  funnel: { label: string; value: number; pct: number }[];
  waterfall: WaterfallStep[];
  trend: { ay: string; onay: number; kullandirim: number; aktif: number; tahsilat: number }[];
  kayiplar: { bayi: string; onay: number; kullandirim: number }[];
  karlilik: { label: string; value: number; net?: boolean }[];
  scatter: { name: string; faiz: number; net: number; hacim: number; tier: string }[];
  etkinlik: { label: string; value: string; delta: string; up: boolean }[];
  riskKpi: { label: string; hedef: number; gercek: number; unit: string; bad: boolean }[];
  nplByRegion: Record<Bolge, number>;
  krediPenet: number;
  sigortaPenet: number;
  krediPenetDelta: number;
  sigortaPenetDelta: number;
  penetTrend: { ay: string; kredi: number; sigorta: number }[];
  limitBars: { name: string; kullanilan: number; toplam: number; oran: number }[];
  limitAsiri: { name: string; limit: number; oran: number; up: boolean }[];
  alerts: { sev: "danger" | "warn" | "ok"; title: string; body: string }[];
  healthScores: { name: string; score: number }[];
  oppScores: { name: string; score: number }[];
}

export interface ExecKpi {
  label: string;
  value: string;
  unit: string;
  delta: string;
  up: boolean;
  accent: string;
  spark: number[];
  flat?: boolean; // delta nötr
}

// ------------------------------------------------------- ana hesaplama
export function computeExec(
  loans: ProductionLoan[],
  apps: Application[],
  risks: RiskContract[],
  limits: LimitRow[]
): ExecData {
  const cur = loans.filter((l) => l.yil === 2025);
  const prev = loans.filter((l) => l.yil === 2024);
  const appCur = apps.filter((a) => a.yil === 2025);
  const appPrev = apps.filter((a) => a.yil === 2024);

  // --- temel toplamlar (tüm veri)
  const hacim = sum(loans, (l) => l.krediTutari);
  const adet = loans.length;
  const ticket = hacim / adet;
  const ortFaiz = avg(loans, (l) => l.faiz);
  const ortVade = avg(loans, (l) => l.vade);

  // --- karlılık kırılımı (yaklaşık, Mn)
  const faizGeliri = sum(loans, (l) => (l.krediTutari * (l.faiz / 100) * l.vade) / 12 * 0.45);
  const dosyaGeliri = sum(loans, (l) => l.dosyaMasrafi);
  const komisyon = hacim * 0.006;
  const tesvik = sum(loans, (l) => l.tesvik);
  const sigortaMaliyet = sum(loans.filter((l) => l.sigorta), (l) => l.krediTutari * 0.0025);
  const ekspertizMaliyet = loans.filter((l) => l.ekspertiz).length * 1800;
  const diger = hacim * 0.0009;
  const net = faizGeliri + dosyaGeliri + komisyon - tesvik - sigortaMaliyet - ekspertizMaliyet - diger;

  // --- başvuru / onay / penetrasyon
  const basvuru = apps.length;
  const onaylanan = apps.filter((a) => a.durum !== "Ret").length;
  const kullandirim = apps.filter((a) => a.durum === "Kullandırım").length;
  const onayOran = pct(onaylanan, basvuru);
  const krediPenet = pct(kullandirim, basvuru);
  const sigortaPenet = pct(loans.filter((l) => l.sigorta).length, adet);

  // --- YoY delta yardımcıları
  const yoy = (c: number, p: number) => (p ? ((c - p) / p) * 100 : 0);
  const hacimYoY = yoy(sum(cur, (l) => l.krediTutari), sum(prev, (l) => l.krediTutari));
  const adetYoY = yoy(cur.length, prev.length);
  const ticketYoY = yoy(
    sum(cur, (l) => l.krediTutari) / (cur.length || 1),
    sum(prev, (l) => l.krediTutari) / (prev.length || 1)
  );
  const faizYoY = avg(cur, (l) => l.faiz) - avg(prev, (l) => l.faiz);
  const vadeYoY = avg(cur, (l) => l.vade) - avg(prev, (l) => l.vade);
  const onayYoY =
    pct(appCur.filter((a) => a.durum !== "Ret").length, appCur.length) -
    pct(appPrev.filter((a) => a.durum !== "Ret").length, appPrev.length);
  const penetYoY =
    pct(appCur.filter((a) => a.durum === "Kullandırım").length, appCur.length) -
    pct(appPrev.filter((a) => a.durum === "Kullandırım").length, appPrev.length);
  const sigortaYoY =
    pct(cur.filter((l) => l.sigorta).length, cur.length) -
    pct(prev.filter((l) => l.sigorta).length, prev.length);
  const penetTrend = [7, 8, 9, 10, 11, 12].map((m) => {
    const aa = apps.filter((a) => a.ay === m);
    const ll = loans.filter((l) => l.ay === m);
    return {
      ay: ["Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"][m - 7],
      kredi: Math.round(pct(aa.filter((a) => a.durum === "Kullandırım").length, aa.length)),
      sigorta: Math.round(pct(ll.filter((l) => l.sigorta).length, ll.length)),
    };
  });
  const netCur = sum(cur, (l) => (l.krediTutari * (l.faiz / 100) * l.vade) / 12 * 0.45) - sum(cur, (l) => l.tesvik);
  const netPrev = sum(prev, (l) => (l.krediTutari * (l.faiz / 100) * l.vade) / 12 * 0.45) - sum(prev, (l) => l.tesvik);
  const netYoY = yoy(netCur, netPrev);

  // --- aylık sparkline serileri
  const byMonth = (rows: ProductionLoan[], f: (l: ProductionLoan) => number, agg: "sum" | "avg") => {
    const g: number[][] = Array.from({ length: 12 }, () => []);
    for (const l of rows) {
      g[l.ay - 1].push(f(l));
    }
    return g.map((arr) =>
      arr.length ? (agg === "sum" ? arr.reduce((a, b) => a + b, 0) : arr.reduce((a, b) => a + b, 0) / arr.length) : 0
    );
  };
  const sparkHacim = byMonth(loans, (l) => l.krediTutari, "sum");
  const sparkAdet = Array.from({ length: 12 }, (_, i) => loans.filter((l) => l.ay === i + 1).length);
  const sparkFaiz = byMonth(loans, (l) => l.faiz, "avg");
  const sparkVade = byMonth(loans, (l) => l.vade, "avg");
  const sparkTicket = sparkHacim.map((h, i) => (sparkAdet[i] ? h / sparkAdet[i] : 0));
  const sparkOnay = Array.from({ length: 12 }, (_, i) => {
    const mm = apps.filter((a) => a.ay === i + 1);
    return pct(mm.filter((a) => a.durum !== "Ret").length, mm.length);
  });
  const sparkPenet = Array.from({ length: 12 }, (_, i) => {
    const mm = apps.filter((a) => a.ay === i + 1);
    return pct(mm.filter((a) => a.durum === "Kullandırım").length, mm.length);
  });

  const kpis: ExecKpi[] = [
    { label: "AÇILAN KREDİ TUTARI", ...fmtBig(hacim), delta: `${trNum(Math.abs(hacimYoY), 1)}%`, up: hacimYoY >= 0, accent: "#2563eb", spark: sparkHacim },
    { label: "KREDİ ADEDİ", value: fmtAdet(adet), unit: "Adet", delta: `${trNum(Math.abs(adetYoY), 1)}%`, up: adetYoY >= 0, accent: "#1d4ed8", spark: sparkAdet },
    { label: "ORTALAMA TICKET", value: trNum(ticket), unit: "TL", delta: `${trNum(Math.abs(ticketYoY), 1)}%`, up: ticketYoY >= 0, accent: "#0d9488", spark: sparkTicket },
    { label: "ORTALAMA FAİZ", value: fmtPct(ortFaiz, 2), unit: "", delta: `${trNum(faizYoY, 2)} yp`, up: faizYoY <= 0, accent: "#7c3aed", spark: sparkFaiz },
    { label: "ORTALAMA VADE", value: trNum(ortVade, 0), unit: "Ay", delta: `${trNum(vadeYoY, 0)} Ay`, up: vadeYoY >= 0, accent: "#4f46e5", spark: sparkVade },
    { label: "PENETRASYON", value: fmtPct(krediPenet, 1), unit: "", delta: `${trNum(penetYoY, 1)} yp`, up: penetYoY >= 0, accent: "#16a34a", spark: sparkPenet },
    { label: "ONAY ORANI", value: fmtPct(onayOran, 1), unit: "", delta: `${trNum(onayYoY, 1)} yp`, up: onayYoY >= 0, accent: "#ea580c", spark: sparkOnay },
    { label: "NET KARLILIK", value: fmtMn(net, 1), unit: "Milyon TL", delta: `${trNum(Math.abs(netYoY), 1)}%`, up: netYoY >= 0, accent: "#15803d", spark: sparkHacim.map((h) => h * 0.04) },
  ];

  // --- Top bayi
  const topBayi = groupSum(loans, (l) => l.bayi, (l) => l.krediTutari)
    .map((b) => ({ name: b.name, hacim: b.value, adet: loans.filter((l) => l.bayi === b.name).length }))
    .sort((a, b) => b.hacim - a.hacim);
  const hacimMaxBayi = Math.max(...topBayi.map((b) => b.hacim), 1);

  // --- hacim dağılımı
  const dist = (key: (l: ProductionLoan) => string, top: number) => {
    const g = groupSum(loans, key, (l) => l.krediTutari).sort((a, b) => b.value - a.value);
    const head = g.slice(0, top);
    const rest = g.slice(top).reduce((a, x) => a + x.value, 0);
    const rows = head.map((x) => ({ name: x.name, pct: pct(x.value, hacim) }));
    if (rest > 0) {
      rows.push({ name: "Diğer", pct: pct(rest, hacim) });
    }
    return rows;
  };
  const dagilim = [
    { title: "MARKA", rows: dist((l) => l.marka, 3) },
    { title: "DİSTRİBÜTÖR", rows: dist((l) => l.distributor, 3) },
    { title: "BAYİ", rows: dist((l) => l.bayi, 4) },
  ];

  // --- funnel
  const nplRate = pct(
    sum(risks.filter((r) => r.gecikmeGun >= 90), (r) => r.kalanBakiye),
    sum(risks, (r) => r.kalanBakiye)
  );
  const tahsilatRate = avg(risks, (r) => r.tahsilatOrani) * 100;
  const aktif = Math.round(kullandirim * (1 - nplRate / 100));
  const tahsilEdilen = Math.round(aktif * (tahsilatRate / 100));
  const funnel = [
    { label: "BAŞVURU", value: basvuru, pct: 100 },
    { label: "ONAY", value: onaylanan, pct: pct(onaylanan, basvuru) },
    { label: "KULLANDIRIM", value: kullandirim, pct: pct(kullandirim, basvuru) },
    { label: "AKTİF KREDİ", value: aktif, pct: pct(aktif, basvuru) },
    { label: "TAHSİLAT", value: tahsilEdilen, pct: pct(tahsilEdilen, basvuru) },
  ];

  // --- waterfall (hacim kaybı, Mn)
  const tutarBy = (d: Application["durum"]) => sum(apps.filter((a) => a.durum === d), (a) => a.tutar);
  const basvuruHacim = sum(apps, (a) => a.tutar);
  const wRet = tutarBy("Ret");
  const wIptal = tutarBy("İptal");
  const wIade = tutarBy("İade");
  const kullandirilanHacim = basvuruHacim - wRet - wIptal - wIade;
  const waterfall: ExecData["waterfall"] = [
    { label: "Başvuru\nHacmi", value: basvuruHacim, type: "total" },
    { label: "Ret", value: -wRet, type: "down" },
    { label: "İptal", value: -wIptal, type: "down" },
    { label: "İade", value: -wIade, type: "down" },
    { label: "Kullandırılan\nHacim", value: kullandirilanHacim, type: "total" },
  ];

  // --- dönüşüm trendi (son 6 ay)
  const trend = [7, 8, 9, 10, 11, 12].map((m) => {
    const mm = apps.filter((a) => a.ay === m);
    const o = pct(mm.filter((a) => a.durum !== "Ret").length, mm.length);
    const ku = pct(mm.filter((a) => a.durum === "Kullandırım").length, mm.length);
    return {
      ay: ["Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"][m - 7],
      onay: Math.round(o),
      kullandirim: Math.round(ku),
      aktif: Math.round(ku * (1 - nplRate / 100)),
      tahsilat: Math.round(ku * 0.9),
    };
  });

  // --- en büyük kayıplar (en düşük kullandırım oranlı bayi)
  const kayiplar = [...new Set(apps.map((a) => a.bayi))]
    .map((bayi) => {
      const mm = apps.filter((a) => a.bayi === bayi);
      return {
        bayi,
        onay: pct(mm.filter((a) => a.durum !== "Ret").length, mm.length),
        kullandirim: pct(mm.filter((a) => a.durum === "Kullandırım").length, mm.length),
      };
    })
    .sort((a, b) => a.kullandirim - b.kullandirim)
    .slice(0, 3);

  // --- karlılık kırılım bars (Mn)
  const karlilik: ExecData["karlilik"] = [
    { label: "Faiz Geliri", value: faizGeliri },
    { label: "Dosya Masrafı", value: dosyaGeliri },
    { label: "Komisyon Geliri", value: komisyon },
    { label: "Teşvik / İskonto", value: -tesvik },
    { label: "Sigorta Maliyeti", value: -sigortaMaliyet },
    { label: "Ekspertiz Maliyeti", value: -ekspertizMaliyet },
    { label: "Diğer Maliyetler", value: -diger },
    { label: "NET KARLILIK", value: net, net: true },
  ];

  // --- scatter (bayi: faiz vs net karlılık) — tier göreli sıralamayla (renk çeşitliliği)
  const scatterRaw = topBayi.map((b) => {
    const ls = loans.filter((l) => l.bayi === b.name);
    const f = avg(ls, (l) => l.faiz);
    const n =
      (sum(ls, (l) => (l.krediTutari * (l.faiz / 100) * l.vade) / 12 * 0.45) -
        sum(ls, (l) => l.tesvik)) /
      1_000_000;
    return { name: b.name, faiz: f, net: n, hacim: b.hacim, ratio: pct(n * 1_000_000, b.hacim) };
  });
  const ranked = [...scatterRaw].sort((a, b) => b.ratio - a.ratio).map((r) => r.name);
  const third = Math.ceil(ranked.length / 3);
  const scatter = scatterRaw.map((s) => {
    const rank = ranked.indexOf(s.name);
    const tier = rank < third ? "high" : rank < third * 2 ? "mid" : "low";
    return { name: s.name, faiz: s.faiz, net: s.net, hacim: s.hacim, tier };
  });

  // --- etkinlik göstergeleri
  const etkinlik = [
    { label: "Net Karlılık / Kredi Tutarı", value: fmtPct(pct(net, hacim), 2), delta: "0,32 yp", up: true },
    { label: "Net Karlılık / Adet", value: fmtTL(net / adet), delta: "1,1%", up: true },
    { label: "Maliyet / Kredi Tutarı", value: fmtPct(pct(tesvik + sigortaMaliyet + ekspertizMaliyet + diger, hacim), 2), delta: "0,18 yp", up: false },
    { label: "Teşvik / Kredi Tutarı", value: fmtPct(pct(tesvik, hacim), 2), delta: "0,21 yp", up: false },
  ];

  // --- risk kpi (hedef vs gerçekleşen)
  const ktRate = pct(
    sum(risks.filter((r) => r.durum === "Kanuni Takip"), (r) => r.kalanBakiye),
    sum(risks, (r) => r.kalanBakiye)
  );
  const fpdRate = pct(risks.filter((r) => r.fpd).length, risks.length);
  const riskKpi: ExecData["riskKpi"] = [
    { label: "NPL Oranı", hedef: 2.5, gercek: nplRate, unit: "%", bad: nplRate > 2.5 },
    { label: "KT Oranı", hedef: 15, gercek: ktRate, unit: "%", bad: ktRate > 15 },
    { label: "FPD 30+", hedef: 2, gercek: fpdRate, unit: "%", bad: fpdRate > 2 },
    { label: "Tahsilat Oranı", hedef: 97, gercek: tahsilatRate, unit: "%", bad: tahsilatRate < 97 },
  ];

  // --- NPL bölge haritası
  const nplByRegion = Object.fromEntries(
    BOLGELER.map((b) => {
      const rr = risks.filter((r) => r.bolge === b);
      const v = pct(
        sum(rr.filter((r) => r.gecikmeGun >= 90), (r) => r.kalanBakiye),
        sum(rr, (r) => r.kalanBakiye)
      );
      return [b, Math.round(v * 10) / 10];
    })
  ) as Record<Bolge, number>;

  // --- limit kullanımı
  const limitByGrup = groupSum(limits, (l) => l.grupAdi, (l) => l.toplamLimit)
    .map((g) => {
      const kullanilan = sum(limits.filter((l) => l.grupAdi === g.name), (l) => l.kullanilanLimit);
      return { name: g.name, toplam: g.value, kullanilan, oran: pct(kullanilan, g.value) };
    })
    .sort((a, b) => b.toplam - a.toplam);
  const limitBars = limitByGrup.slice(0, 5);
  // %85+ tablo: her grubun en yüksek kullanımlı tekil limit satırı (gerçekten dolan limitler)
  const grupMaxRow = new Map<string, { limit: number; oran: number }>();
  for (const l of limits) {
    const o = pct(l.kullanilanLimit, l.toplamLimit);
    const prevRow = grupMaxRow.get(l.grupAdi);
    if (!prevRow || o > prevRow.oran) {
      grupMaxRow.set(l.grupAdi, { limit: l.kullanilanLimit, oran: o });
    }
  }
  const limitAsiri = [...grupMaxRow.entries()]
    .map(([name, v]) => ({ name, limit: v.limit, oran: v.oran, up: v.oran >= 90 }))
    .filter((g) => g.oran >= 85)
    .sort((a, b) => b.oran - a.oran)
    .slice(0, 5);

  // --- bayi skorları
  const healthScores = topBayi
    .map((b) => {
      const rr = risks.filter((r) => r.bayi === b.name);
      const npl = pct(rr.filter((r) => r.gecikmeGun >= 90).length, rr.length);
      const tah = avg(rr, (r) => r.tahsilatOrani) * 100;
      const score = Math.max(0, Math.min(100, Math.round(60 + (tah - 60) * 0.9 - npl * 4)));
      return { name: b.name, score };
    })
    .sort((a, b) => b.score - a.score);
  const oppScores = topBayi
    .map((b) => {
      const ls = appCur.filter((a) => a.bayi === b.name);
      const penet = pct(ls.filter((a) => a.durum === "Kullandırım").length, ls.length);
      const share = pct(b.hacim, hacim);
      const score = Math.max(0, Math.min(100, Math.round(40 + penet * 0.6 + share * 1.6)));
      return { name: b.name, score };
    })
    .sort((a, b) => b.score - a.score);

  // --- executive alerts
  const worstNplRegion = [...BOLGELER].sort((a, b) => nplByRegion[b] - nplByRegion[a])[0];
  const lowOnayBayi = kayiplar[0];
  const topGrup = limitAsiri[0];
  const alerts: ExecData["alerts"] = [
    { sev: "danger", title: `Bölge ${worstNplRegion} NPL oranı %${trNum(nplByRegion[worstNplRegion], 2)} ile hedefin (%2,5) üzerinde.`, body: "Tahsilat ve izleme aksiyonları önceliklendirilmeli." },
    { sev: "warn", title: `${lowOnayBayi?.bayi} kullandırım oranı %${trNum(lowOnayBayi?.kullandirim ?? 0, 1)} ile düşük.`, body: "Başvuru kalitesi ve süreç darboğazları incelenmeli." },
    { sev: "ok", title: `Penetrasyon %${trNum(krediPenet, 1)} — geçen yıla göre ${penetYoY >= 0 ? "artışta" : "gerilemede"}.`, body: "Sigorta penetrasyonu %" + trNum(sigortaPenet, 1) + " seviyesinde." },
    { sev: topGrup ? "danger" : "ok", title: topGrup ? `${topGrup.name} limit kullanım oranı %${trNum(topGrup.oran, 0)}.` : "Limit kullanımları normal seviyede.", body: topGrup ? "Limit revizyonu değerlendirilmeli." : "Kritik limit aşımı yok." },
    { sev: "warn", title: `FPD 30+ oranı %${trNum(fpdRate, 2)}.`, body: fpdRate > 2 ? "İlk taksit gecikmeleri yakın takip edilmeli." : "Hedef bandında." },
  ];

  return {
    kpis, topBayi, hacimMaxBayi, dagilim, funnel, waterfall, trend, kayiplar,
    karlilik, scatter, etkinlik, riskKpi, nplByRegion, krediPenet, sigortaPenet,
    krediPenetDelta: penetYoY, sigortaPenetDelta: sigortaYoY, penetTrend,
    limitBars, limitAsiri, alerts, healthScores, oppScores,
  };
}

// ============================================================ görsel parçalar

/** Numaralı bölüm kartı. */
export function Section({
  no,
  title,
  accent,
  children,
  className,
}: {
  no: number;
  title: string;
  accent: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col rounded-lg border border-slate-200 bg-white ${className ?? ""}`}>
      <div className="flex items-center gap-2 border-slate-100 border-b px-3 py-1.5">
        <span
          className="flex size-4 items-center justify-center rounded font-bold text-[10px] text-white"
          style={{ background: accent }}
        >
          {no}
        </span>
        <span className="font-bold text-[11.5px] text-slate-700 tracking-wide">{title}</span>
      </div>
      <div className="min-h-0 flex-1 p-2.5">{children}</div>
    </div>
  );
}

/** Mini sparkline (KPI kartı altı) — Recharts AreaChart. */
export function Sparkline({ data, color }: { data: number[]; color: string }) {
  const rows = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer height={22} width="100%">
      <AreaChart data={rows} margin={{ top: 1, right: 0, bottom: 0, left: 0 }}>
        <Area
          dataKey="v"
          dot={false}
          fill={color}
          fillOpacity={0.14}
          isAnimationActive={false}
          stroke={color}
          strokeWidth={1.4}
          type="monotone"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** Yarım daire gösterge (penetrasyon) — Recharts RadialBarChart. */
export function Gauge({
  value,
  label,
  delta,
  up,
  color,
}: {
  value: number;
  label: string;
  delta: string;
  up: boolean;
  color: string;
}) {
  const data = [{ value: Math.min(value, 100) }];
  return (
    <div className="flex flex-1 flex-col items-center">
      <span className="mb-0.5 text-center font-semibold text-[8.5px] uppercase leading-tight" style={{ color }}>
        {label}
      </span>
      <div className="relative h-[46px] w-[92px]">
        <ResponsiveContainer height={46} width="100%">
          <RadialBarChart barSize={8} data={data} endAngle={0} innerRadius="72%" outerRadius="100%" startAngle={180}>
            <PolarAngleAxis angleAxisId={0} domain={[0, 100]} tick={false} type="number" />
            <RadialBar
              angleAxisId={0}
              background={{ fill: "#e2e8f0" }}
              cornerRadius={4}
              dataKey="value"
              fill={color}
              isAnimationActive={false}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <span className="absolute inset-x-0 bottom-0 text-center font-bold text-[14px] text-slate-800">
          {fmtPct(value, 1)}
        </span>
      </div>
      <span className={`mt-0.5 font-bold text-[9px] ${up ? "text-emerald-600" : "text-red-500"}`}>
        {up ? "▲" : "▼"} {delta}
      </span>
      <span className="text-[7.5px] text-slate-400">(Geçen yıla göre)</span>
    </div>
  );
}

/** Dikey waterfall (yüzen efekt — Bar değeri [low, high] tuple). */
export function WaterfallChart({
  steps,
  height = 110,
  divisor = 1_000_000,
  decimals = 0,
}: {
  steps: WaterfallStep[];
  height?: number;
  divisor?: number;
  decimals?: number;
}) {
  let cum = 0;
  const rows = steps.map((s) => {
    let lo: number;
    let hi: number;
    let fill: string;
    if (s.type === "total") {
      lo = 0;
      hi = s.value;
      cum = s.value;
      fill = "#1e3a8a";
    } else {
      const start = cum;
      cum += s.value;
      lo = Math.min(start, cum);
      hi = Math.max(start, cum);
      fill = s.value >= 0 ? "#22c55e" : "#ef4444";
    }
    return { name: s.label, range: [lo, hi] as [number, number], disp: s.value, fill };
  });
  return (
    <ResponsiveContainer height={height} width="100%">
      <BarChart data={rows} margin={{ top: 14, right: 4, left: 4, bottom: 0 }}>
        <XAxis axisLine={false} dataKey="name" interval={0} tick={{ fill: "#64748b", fontSize: 7.5 }} tickLine={false} />
        <YAxis hide />
        <Bar dataKey="range" isAnimationActive={false} radius={[2, 2, 0, 0]}>
          {rows.map((r) => (
            <Cell fill={r.fill} key={r.name} />
          ))}
          <LabelList
            dataKey="disp"
            formatter={(v) => trNum(Number(v) / divisor, decimals)}
            position="top"
            style={{ fill: "#475569", fontSize: 8, fontWeight: 700 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Genel yatay bar grafiği (Recharts). */
export function HBars({
  data,
  height,
  labelWidth = 78,
  format,
  barColor = "#1d4ed8",
}: {
  data: { name: string; value: number; fill?: string }[];
  height: number;
  labelWidth?: number;
  format: (v: number) => string;
  barColor?: string;
}) {
  return (
    <ResponsiveContainer height={height} width="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 2, right: 34, left: 2, bottom: 2 }}>
        <XAxis hide type="number" />
        <YAxis axisLine={false} dataKey="name" tick={{ fill: "#475569", fontSize: 8.5 }} tickLine={false} type="category" width={labelWidth} />
        <Bar dataKey="value" fill={barColor} isAnimationActive={false} radius={[0, 3, 3, 0]}>
          {data.map((r) => (
            <Cell fill={r.fill ?? barColor} key={r.name} />
          ))}
          <LabelList
            dataKey="value"
            formatter={(v) => format(Number(v))}
            position="right"
            style={{ fill: "#334155", fontSize: 8, fontWeight: 700 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Net karlılık kırılımı — sıfırdan iki yöne yatay bar (Recharts). */
export function KarlilikBars({
  rows,
  height = 150,
}: {
  rows: { label: string; value: number; net?: boolean }[];
  height?: number;
}) {
  const data = rows.map((r) => ({
    label: r.label,
    value: r.value / 1_000_000,
    fill: r.net ? "#1e3a8a" : r.value >= 0 ? "#22c55e" : "#ef4444",
  }));
  return (
    <ResponsiveContainer height={height} width="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 2, right: 30, left: 2, bottom: 2 }}>
        <XAxis hide type="number" />
        <YAxis axisLine={false} dataKey="label" tick={{ fill: "#475569", fontSize: 8 }} tickLine={false} type="category" width={86} />
        <ReferenceLine stroke="#cbd5e1" x={0} />
        <Bar dataKey="value" isAnimationActive={false} radius={2}>
          {data.map((r) => (
            <Cell fill={r.fill} key={r.label} />
          ))}
          <LabelList
            dataKey="value"
            formatter={(v) => trNum(Number(v), 1)}
            position="right"
            style={{ fill: "#334155", fontSize: 8, fontWeight: 700 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Dikey trapez funnel (Recharts FunnelChart) + HTML ad/oran sütunları. */
export function FunnelViz({
  data,
  height = 150,
}: {
  data: { name: string; value: number; pct: string; fill: string }[];
  height?: number;
}) {
  return (
    <div className="flex items-stretch" style={{ height }}>
      <div className="flex w-[66px] flex-col justify-around py-1 pr-1 text-right">
        {data.map((s) => (
          <span className="font-semibold text-[8.5px] text-slate-500" key={s.name}>
            {s.name}
          </span>
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <ResponsiveContainer height={height} width="100%">
          <FunnelChart>
            <Funnel data={data} dataKey="value" isAnimationActive={false} lastShapeType="rectangle">
              <LabelList
                dataKey="value"
                fill="#fff"
                formatter={(v) => Number(v).toLocaleString("tr-TR")}
                position="center"
                stroke="none"
                style={{ fontSize: 9, fontWeight: 700 }}
              />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
      <div className="flex w-9 flex-col justify-around py-1 pl-1">
        {data.map((s) => (
          <span className="font-bold text-[8.5px] text-slate-600" key={s.name}>
            {s.pct}
          </span>
        ))}
      </div>
    </div>
  );
}

// --------------------------------------------------------------- TreemapMini
const TM_PALETTE = ["#1d4ed8", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#cbd5e1"];

interface TreeCellProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  pct?: number;
  index?: number;
}

function TreeCell({ x = 0, y = 0, width = 0, height = 0, name = "", pct = 0, index = 0 }: TreeCellProps) {
  if (width <= 0 || height <= 0) {
    return null;
  }
  const color = TM_PALETTE[index % TM_PALETTE.length];
  const show = width > 26 && height > 12;
  return (
    <g>
      <rect fill={color} height={height} stroke="#fff" strokeWidth={1} width={width} x={x} y={y} />
      {show ? (
        <text fill="#fff" fontSize={7.5} fontWeight={600} x={x + 3} y={y + 11}>
          {name} %{trNum(pct, 1)}
        </text>
      ) : null}
    </g>
  );
}

/** Ağaç haritası (kredi tutarı payı). data: {name, value, pct}. */
export function TreemapMini({
  data,
  height = 80,
}: {
  data: { name: string; value: number; pct: number }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer height={height} width="100%">
      <Treemap content={<TreeCell />} data={data} dataKey="value" isAnimationActive={false} stroke="#fff" />
    </ResponsiveContainer>
  );
}

/** Skor barları (0-100, tier renkli) — Recharts yatay BarChart. */
export function ScoreBars({ data, height }: { data: { name: string; score: number }[]; height: number }) {
  const rows = data.map((d) => ({
    name: d.name,
    score: d.score,
    fill: d.score >= 70 ? "#16a34a" : d.score >= 55 ? "#84cc16" : d.score >= 40 ? "#f59e0b" : "#ef4444",
  }));
  return (
    <ResponsiveContainer height={height} width="100%">
      <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 20, left: 2, bottom: 0 }}>
        <XAxis domain={[0, 100]} hide type="number" />
        <YAxis axisLine={false} dataKey="name" tick={{ fill: "#64748b", fontSize: 8 }} tickLine={false} type="category" width={58} />
        <Bar dataKey="score" isAnimationActive={false} radius={[0, 3, 3, 0]}>
          {rows.map((r) => (
            <Cell fill={r.fill} key={r.name} />
          ))}
          <LabelList dataKey="score" position="right" style={{ fill: "#334155", fontSize: 8, fontWeight: 700 }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
