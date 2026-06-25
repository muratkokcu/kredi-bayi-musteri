import { Boxes, CalendarClock, Download, Percent, RotateCcw, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { STOK_AYLAR, type StockLoan } from "@/data/stock-financing";
import { downloadCsv } from "@/lib/csv";
import { formatNumber, formatPercent, formatTRY, formatTRYCompact } from "@/lib/format";
import { useStockLoans } from "@/queries/stock-financing";
import { ErrorState, LoadingState } from "@/ui/async-states";
import { Card, CardHeader } from "@/ui/card";
import { ALL, ChartCard, FilterSelect, uniq } from "@/ui/report-kit";
import { StatCard } from "@/ui/stat-card";
import { BankShell } from "../bank-shell";

const SHELL_PROPS = {
  breadcrumb: ["Raporlar", "Stok Finansmanı"],
  subtitle: "Tedarikçi/bayi stok kredileri — açık/kapalı, kapama süresi, tahsilat.",
  title: "Stok Finansmanı",
} as const;

function Body({ rows }: { rows: StockLoan[] }) {
  const [yil, setYil] = useState(ALL);
  const [distributor, setDistributor] = useState(ALL);
  const [bolge, setBolge] = useState(ALL);
  const [bayi, setBayi] = useState(ALL);
  const [tedarikci, setTedarikci] = useState(ALL);
  const [durum, setDurum] = useState(ALL);
  const [altSektor, setAltSektor] = useState(ALL);
  const [sektorMuduru, setSektorMuduru] = useState(ALL);
  const [bolgeYoneticisi, setBolgeYoneticisi] = useState(ALL);
  const [ilce, setIlce] = useState(ALL);

  const opts = useMemo(
    () => ({
      yil: uniq(rows.map((r) => String(r.yil))),
      distributor: uniq(rows.map((r) => r.distributor)),
      bolge: uniq(rows.map((r) => r.bolge)),
      bayi: uniq(rows.map((r) => r.bayi)),
      tedarikci: uniq(rows.map((r) => r.tedarikci)),
      durum: uniq(rows.map((r) => r.durum)),
      altSektor: uniq(rows.map((r) => r.altSektor)),
      sektorMuduru: uniq(rows.map((r) => r.sektorMuduru)),
      bolgeYoneticisi: uniq(rows.map((r) => r.bolgeYoneticisi)),
      ilce: uniq(rows.map((r) => r.ilce)),
    }),
    [rows]
  );

  const f = useMemo(
    () =>
      rows.filter(
        (r) =>
          (yil === ALL || String(r.yil) === yil) &&
          (distributor === ALL || r.distributor === distributor) &&
          (bolge === ALL || r.bolge === bolge) &&
          (bayi === ALL || r.bayi === bayi) &&
          (tedarikci === ALL || r.tedarikci === tedarikci) &&
          (durum === ALL || r.durum === durum) &&
          (altSektor === ALL || r.altSektor === altSektor) &&
          (sektorMuduru === ALL || r.sektorMuduru === sektorMuduru) &&
          (bolgeYoneticisi === ALL || r.bolgeYoneticisi === bolgeYoneticisi) &&
          (ilce === ALL || r.ilce === ilce)
      ),
    [rows, yil, distributor, bolge, bayi, tedarikci, durum, altSektor, sektorMuduru, bolgeYoneticisi, ilce]
  );

  const k = useMemo(() => {
    const acik = f.filter((r) => r.durum === "Açık");
    const kapali = f.filter((r) => r.durum === "Kapalı");
    const toplam = f.reduce((a, r) => a + r.krediTutari, 0);
    return {
      toplam,
      acikTutar: acik.reduce((a, r) => a + r.krediTutari, 0),
      acikAdet: acik.length,
      kapaliTutar: kapali.reduce((a, r) => a + r.krediTutari, 0),
      kapaliAdet: kapali.length,
      ortKredi: f.length ? toplam / f.length : 0,
      ortVade: f.length ? f.reduce((a, r) => a + r.vadeGun, 0) / f.length : 0,
      ortKapama: kapali.length
        ? kapali.reduce((a, r) => a + r.kapamaGun, 0) / kapali.length
        : 0,
      tahsilat: f.reduce((a, r) => a + r.tahsilat, 0),
      ortFaiz: f.length ? f.reduce((a, r) => a + r.faiz, 0) / f.length : 0,
    };
  }, [f]);

  const byTedarikci = useMemo(() => {
    type Acc = {
      tutar: number; acik: number; acikTutar: number; kapali: number;
      kapaliTutar: number; tahsilat: number; kapamaT: number; vadeT: number;
      faizT: number; n: number;
    };
    const m = new Map<string, Acc>();
    for (const r of f) {
      const e =
        m.get(r.tedarikci) ??
        { tutar: 0, acik: 0, acikTutar: 0, kapali: 0, kapaliTutar: 0, tahsilat: 0, kapamaT: 0, vadeT: 0, faizT: 0, n: 0 };
      e.tutar += r.krediTutari;
      e.tahsilat += r.tahsilat;
      e.vadeT += r.vadeGun;
      e.faizT += r.faiz;
      e.n += 1;
      if (r.durum === "Açık") {
        e.acik += 1;
        e.acikTutar += r.krediTutari;
      } else {
        e.kapali += 1;
        e.kapaliTutar += r.krediTutari;
        e.kapamaT += r.kapamaGun;
      }
      m.set(r.tedarikci, e);
    }
    return [...m.entries()]
      .map(([name, e]) => ({
        name,
        tutar: e.tutar,
        acik: e.acik,
        acikTutar: e.acikTutar,
        kapali: e.kapali,
        kapaliTutar: e.kapaliTutar,
        tahsilat: e.tahsilat,
        ortVade: e.n ? e.vadeT / e.n : 0,
        ortFaiz: e.n ? e.faizT / e.n : 0,
        ortKapama: e.kapali ? e.kapamaT / e.kapali : 0,
      }))
      .sort((a, b) => b.tutar - a.tutar);
  }, [f]);

  const durumDag = useMemo(
    () => [
      { name: "Açık", value: k.acikTutar },
      { name: "Kapalı", value: k.toplam - k.acikTutar },
    ],
    [k]
  );

  const aylik = useMemo(() => {
    const g = STOK_AYLAR.map((ay) => ({ ay, tutar: 0 }));
    for (const r of f) {
      g[r.ay - 1].tutar += r.krediTutari;
    }
    return g;
  }, [f]);

  const reset = () => {
    setYil(ALL);
    setDistributor(ALL);
    setBolge(ALL);
    setBayi(ALL);
    setTedarikci(ALL);
    setDurum(ALL);
    setAltSektor(ALL);
    setSektorMuduru(ALL);
    setBolgeYoneticisi(ALL);
    setIlce(ALL);
  };
  const exportCsv = () =>
    downloadCsv(
      "stok-finansmani",
      [
        "Yıl", "Ay", "Distribütör", "Bölge", "İl", "Bayi", "Tedarikçi",
        "Alt Sektör", "Sektör Müdürü", "Bölge Yöneticisi", "İlçe",
        "Marka", "Model", "Model Yıl", "Araç Yaşı", "Plaka", "Satış Bedeli",
        "Kasko Değeri", "Kredi Tutarı", "Vade (Gün)", "Faiz (%)", "Dosya Masrafı",
        "Durum", "Kapama Gün", "Tahsilat",
      ],
      f.map((r) => [
        r.yil, STOK_AYLAR[r.ay - 1], r.distributor, r.bolge, r.il, r.bayi,
        r.tedarikci, r.altSektor, r.sektorMuduru, r.bolgeYoneticisi, r.ilce,
        r.marka, r.model, r.modelYil, r.aracYas, r.plaka,
        r.satisBedeli, r.kaskoDegeri, r.krediTutari, r.vadeGun, r.faiz,
        r.dosyaMasrafi, r.durum, r.kapamaGun || "", r.tahsilat || "",
      ])
    );

  return (
    <>
      <Card className="flex flex-wrap items-end gap-3 p-4">
        <FilterSelect label="Dönem (Yıl)" onChange={setYil} options={opts.yil} value={yil} />
        <FilterSelect label="Distribütör" onChange={setDistributor} options={opts.distributor} value={distributor} />
        <FilterSelect label="Bölge" onChange={setBolge} options={opts.bolge} value={bolge} />
        <FilterSelect label="Bayi" onChange={setBayi} options={opts.bayi} value={bayi} />
        <FilterSelect label="Tedarikçi" onChange={setTedarikci} options={opts.tedarikci} value={tedarikci} />
        <FilterSelect label="Durum" onChange={setDurum} options={opts.durum} value={durum} width={120} />
        <FilterSelect label="Alt Sektör" onChange={setAltSektor} options={opts.altSektor} value={altSektor} />
        <FilterSelect label="Sektör Müdürü" onChange={setSektorMuduru} options={opts.sektorMuduru} value={sektorMuduru} />
        <FilterSelect label="Bölge Yöneticisi" onChange={setBolgeYoneticisi} options={opts.bolgeYoneticisi} value={bolgeYoneticisi} />
        <FilterSelect label="İlçe" onChange={setIlce} options={opts.ilce} value={ilce} />
        <button
          className="flex h-9 items-center gap-1.5 rounded-[10px] border border-line-strong bg-surface px-3 font-medium text-[13px] text-ink-soft hover:bg-canvas"
          onClick={reset}
          type="button"
        >
          <RotateCcw size={15} /> Temizle
        </button>
        <button
          className="ml-auto flex h-9 items-center gap-1.5 rounded-[10px] bg-bank px-3.5 font-semibold text-[13px] text-white hover:bg-bank-600"
          onClick={exportCsv}
          type="button"
        >
          <Download size={15} /> CSV İndir
        </button>
      </Card>

      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<Boxes size={20} strokeWidth={1.9} />} label="Toplam Stok Kredisi" sub={`${formatNumber(f.length)} kayıt`} tone="bank" value={formatTRYCompact(k.toplam)} />
        <StatCard icon={<Wallet size={20} strokeWidth={1.9} />} label="Açık Kredi Tutarı" sub={`${formatNumber(k.acikAdet)} açık`} tone="warn" value={formatTRYCompact(k.acikTutar)} />
        <StatCard icon={<Boxes size={20} strokeWidth={1.9} />} label="Kapalı Kredi Tutarı" sub={`${formatNumber(k.kapaliAdet)} kapalı`} tone="dealer" value={formatTRYCompact(k.kapaliTutar)} />
        <StatCard icon={<Wallet size={20} strokeWidth={1.9} />} label="Ort. Kredi Tutarı" sub="Kayıt başına" tone="teal" value={formatTRYCompact(k.ortKredi)} />
        <StatCard icon={<CalendarClock size={20} strokeWidth={1.9} />} label="Ort. Vade" sub="Gün" tone="bank" value={`${k.ortVade.toFixed(0)} gün`} />
        <StatCard icon={<CalendarClock size={20} strokeWidth={1.9} />} label="Ort. Kapama Gün" sub="Kapalı krediler" tone="dealer" value={`${k.ortKapama.toFixed(0)} gün`} />
        <StatCard icon={<Wallet size={20} strokeWidth={1.9} />} label="Toplam Tahsilat" sub="Kapanan" tone="cust" value={formatTRYCompact(k.tahsilat)} />
        <StatCard icon={<Percent size={20} strokeWidth={1.9} />} label="Ort. Faiz" sub="Aylık" tone="warn" value={formatPercent(k.ortFaiz, 2)} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <ChartCard title="Tedarikçi Bazında Hacim">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={byTedarikci} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
              <XAxis hide type="number" />
              <YAxis axisLine={false} dataKey="name" tick={{ fill: "var(--color-ink-soft)", fontSize: 11 }} tickLine={false} type="category" width={108} />
              <Tooltip formatter={(v) => formatTRY(Number(v) || 0)} />
              <Bar dataKey="tutar" fill="var(--color-bank)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Açık / Kapalı Dağılımı (Tutar)">
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie data={durumDag} dataKey="value" innerRadius={56} nameKey="name" outerRadius={92} paddingAngle={2} stroke="none">
                <Cell fill="var(--color-warn)" />
                <Cell fill="var(--color-bank)" />
              </Pie>
              <Tooltip formatter={(v) => formatTRY(Number(v) || 0)} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard className="mt-5" title="Aylık Açılan Stok Kredisi">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart data={aylik} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
            <CartesianGrid stroke="var(--color-line)" vertical={false} />
            <XAxis axisLine={false} dataKey="ay" tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }} tickLine={false} />
            <YAxis axisLine={false} tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }} tickFormatter={formatTRYCompact} tickLine={false} width={60} />
            <Tooltip formatter={(v) => formatTRY(Number(v) || 0)} />
            <Bar dataKey="tutar" fill="var(--color-bank-700)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <Card className="mt-5 pb-3">
        <CardHeader title="Tedarikçi Bazında Özet" />
        <div className="mt-3 overflow-x-auto px-5">
          <table className="[&_td]:px-2.5 [&_th]:px-2.5 w-full min-w-[900px]">
            <thead>
              <tr className="border-line border-b text-[11.5px] text-ink-muted">
                <th className="py-2 text-left font-medium">Tedarikçi</th>
                <th className="py-2 text-right font-medium">Hacim</th>
                <th className="py-2 text-right font-medium">Açık (Adet / Tutar)</th>
                <th className="py-2 text-right font-medium">Kapalı (Adet / Tutar)</th>
                <th className="py-2 text-right font-medium">Ort. Vade</th>
                <th className="py-2 text-right font-medium">Ort. Faiz</th>
                <th className="py-2 text-right font-medium">Ort. Kapama</th>
                <th className="py-2 pr-1 text-right font-medium">Tahsilat</th>
              </tr>
            </thead>
            <tbody>
              {byTedarikci.map((t) => (
                <tr className="border-line border-b last:border-0" key={t.name}>
                  <td className="py-2.5 font-medium text-[13px] text-ink">{t.name}</td>
                  <td className="py-2.5 text-right text-[12.5px] tabular-nums">{formatTRYCompact(t.tutar)}</td>
                  <td className="py-2.5 text-right text-[12.5px] tabular-nums">
                    {formatNumber(t.acik)} / {formatTRYCompact(t.acikTutar)}
                  </td>
                  <td className="py-2.5 text-right text-[12.5px] tabular-nums">
                    {formatNumber(t.kapali)} / {formatTRYCompact(t.kapaliTutar)}
                  </td>
                  <td className="py-2.5 text-right text-[12.5px] tabular-nums">{t.ortVade.toFixed(0)} gün</td>
                  <td className="py-2.5 text-right text-[12.5px] tabular-nums">{formatPercent(t.ortFaiz, 2)}</td>
                  <td className="py-2.5 text-right text-[12.5px] tabular-nums">{t.ortKapama.toFixed(0)} gün</td>
                  <td className="py-2.5 pr-1 text-right font-semibold text-[12.5px] text-bank-700 tabular-nums">{formatTRYCompact(t.tahsilat)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* DETAY — Stok Finansmanı (kayıt-bazlı) */}
      <Card className="mt-5 pb-3">
        <CardHeader
          action={
            <span className="text-[12px] text-ink-muted">
              {formatNumber(f.length)} kayıt
              {f.length > 100 ? " · ilk 100 gösteriliyor, tümü CSV'de" : ""}
            </span>
          }
          title="Stok Finansmanı — Detay"
        />
        <div className="mt-3 overflow-x-auto px-5">
          <table className="[&_td]:px-2.5 [&_th]:px-2.5 w-full min-w-[1040px]">
            <thead>
              <tr className="border-line border-b text-[11.5px] text-ink-muted">
                <th className="py-2 text-left font-medium">Tedarikçi</th>
                <th className="py-2 text-left font-medium">Bayi</th>
                <th className="py-2 text-left font-medium">Araç</th>
                <th className="py-2 text-left font-medium">Plaka</th>
                <th className="py-2 text-right font-medium">Satış Bedeli</th>
                <th className="py-2 text-right font-medium">Kredi Tutarı</th>
                <th className="py-2 text-right font-medium">Vade</th>
                <th className="py-2 text-right font-medium">Faiz</th>
                <th className="py-2 text-left font-medium">Durum</th>
                <th className="py-2 pr-1 text-right font-medium">Tahsilat</th>
              </tr>
            </thead>
            <tbody>
              {f.slice(0, 100).map((r, i) => (
                <tr className="border-line border-b last:border-0" key={`${r.tedarikci}-${i}`}>
                  <td className="py-2 text-[12.5px] text-ink-soft">{r.tedarikci}</td>
                  <td className="py-2 text-[12.5px] text-ink-soft">{r.bayi}</td>
                  <td className="py-2 text-[12.5px] text-ink">
                    {r.marka} {r.model} <span className="text-ink-muted">· {r.modelYil}</span>
                  </td>
                  <td className="py-2 text-[12.5px] text-ink-soft tabular-nums">{r.plaka}</td>
                  <td className="py-2 text-right text-[12.5px] tabular-nums">{formatTRYCompact(r.satisBedeli)}</td>
                  <td className="py-2 text-right font-semibold text-[12.5px] text-ink tabular-nums">{formatTRYCompact(r.krediTutari)}</td>
                  <td className="py-2 text-right text-[12.5px] tabular-nums">{r.vadeGun} gün</td>
                  <td className="py-2 text-right text-[12.5px] tabular-nums">{formatPercent(r.faiz, 2)}</td>
                  <td className="py-2">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 font-semibold text-[11px] ${r.durum === "Açık" ? "bg-warn-tint text-warn" : "bg-success-tint text-success"}`}>
                      {r.durum}
                    </span>
                  </td>
                  <td className="py-2 pr-1 text-right text-[12.5px] tabular-nums">{r.tahsilat ? formatTRYCompact(r.tahsilat) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

export function BankStokFinansmani() {
  const { data, isPending, isError, refetch } = useStockLoans();
  if (isPending) {
    return (
      <BankShell {...SHELL_PROPS}>
        <LoadingState />
      </BankShell>
    );
  }
  if (isError || !data) {
    return (
      <BankShell {...SHELL_PROPS}>
        <ErrorState onRetry={() => refetch()} />
      </BankShell>
    );
  }
  return (
    <BankShell {...SHELL_PROPS}>
      <Body rows={data} />
    </BankShell>
  );
}
