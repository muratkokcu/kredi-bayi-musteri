import {
  Bell,
  BellRing,
  CalendarClock,
  Car,
  CircleCheck,
  CircleX,
  Eye,
  type LucideIcon,
  Mail,
  MessageSquare,
  MoreVertical,
  Plus,
  Search,
  Send,
  Sparkles,
  TrendingUp,
  Users2,
} from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/ui/badge";
import { Card } from "@/ui/card";
import { StatCard } from "@/ui/stat-card";
import { BankShell } from "../bank-shell";

type Channel = "sms" | "eposta" | "push";
type Hedef = "Müşteri" | "Bayi";

interface Trigger {
  aciklama: string;
  active: boolean;
  ad: string;
  hedef: Hedef;
  icon: LucideIcon;
  id: string;
  kanallar: Channel[];
  kosul: string;
  son: string;
  tone: string;
}

const TRIGGERS: Trigger[] = [
  {
    id: "kredi-bitis",
    ad: "Kredi Bitişine X Gün Kala",
    aciklama:
      "Kredinin bitiş tarihine X gün kaldığında müşteriye bildirim gönderir.",
    icon: CalendarClock,
    tone: "bg-bank-tint text-bank-600",
    hedef: "Müşteri",
    kanallar: ["sms", "eposta", "push"],
    kosul: "Bitişe 90, 60, 30 gün kala",
    active: true,
    son: "22.04.2025 14:30",
  },
  {
    id: "arac-yas",
    ad: "Araç X Yaşına Gelince",
    aciklama:
      "Araç yaşı belirlenen eşiğe ulaştığında müşteriye bildirim gönderir.",
    icon: Car,
    tone: "bg-cust-tint text-cust-600",
    hedef: "Müşteri",
    kanallar: ["sms", "eposta", "push"],
    kosul: "Araç yaşı ≥ 3, 5, 7 yıl",
    active: true,
    son: "21.04.2025 11:15",
  },
  {
    id: "bayi-teklif",
    ad: "Bayi Teklif Gönderince",
    aciklama:
      "Bayi tarafından yeni teklif gönderildiğinde müşteriye bildirim gönderir.",
    icon: Users2,
    tone: "bg-dealer-tint text-dealer-700",
    hedef: "Müşteri",
    kanallar: ["sms", "eposta"],
    kosul: "Teklif oluşturulduğunda",
    active: true,
    son: "20.04.2025 16:45",
  },
  {
    id: "teklif-goruntu",
    ad: "Teklif Görüntülendiğinde",
    aciklama: "Müşteri teklif görüntülediğinde bayiye bildirim gönderir.",
    icon: Eye,
    tone: "bg-warn-tint text-warn",
    hedef: "Bayi",
    kanallar: ["push"],
    kosul: "Müşteri teklif görüntülediğinde",
    active: true,
    son: "19.04.2025 09:20",
  },
  {
    id: "teklif-kabul",
    ad: "Teklif Kabul Edildiğinde",
    aciklama: "Müşteri teklifi kabul ettiğinde bayiye bildirim gönderir.",
    icon: CircleCheck,
    tone: "bg-success-tint text-success",
    hedef: "Bayi",
    kanallar: ["push"],
    kosul: "Teklif kabul edildiğinde",
    active: true,
    son: "18.04.2025 10:10",
  },
  {
    id: "teklif-red",
    ad: "Teklif Reddedildiğinde",
    aciklama: "Müşteri teklifi reddettiğinde bayiye bildirim gönderir.",
    icon: CircleX,
    tone: "bg-danger-tint text-danger",
    hedef: "Bayi",
    kanallar: ["push"],
    kosul: "Teklif reddedildiğinde",
    active: false,
    son: "15.04.2025 13:30",
  },
  {
    id: "tercih-arac",
    ad: "Tercihlere Uygun Araç Eklendiğinde",
    aciklama:
      "Müşterinin tercihlerine uygun yeni araç sisteme eklendiğinde bildirim gönderir.",
    icon: Sparkles,
    tone: "bg-[#e0f5f3] text-[#0e9488]",
    hedef: "Müşteri",
    kanallar: ["sms", "eposta"],
    kosul: "Yeni araç sisteme eklendiğinde",
    active: true,
    son: "12.04.2025 08:45",
  },
  {
    id: "yuksek-skor",
    ad: "Yüksek Skor Değişiminde",
    aciklama:
      "Yenileme skoru belirli eşiğin üzerine çıktığında bayiye bildirim gönderir.",
    icon: TrendingUp,
    tone: "bg-bank-tint text-bank-600",
    hedef: "Bayi",
    kanallar: ["eposta"],
    kosul: "Skor ≥ 70",
    active: false,
    son: "10.04.2025 17:25",
  },
];

const CHANNEL_META: Record<Channel, { icon: LucideIcon; label: string }> = {
  sms: { icon: MessageSquare, label: "SMS" },
  eposta: { icon: Mail, label: "E-posta" },
  push: { icon: Bell, label: "Push" },
};

const CHANNEL_ORDER: Channel[] = ["sms", "eposta", "push"];

const FILTERS: { label: string; options: string[] }[] = [
  { label: "Hedef", options: ["Müşteri", "Bayi"] },
  { label: "Kanal", options: ["SMS", "E-posta", "Push"] },
  { label: "Durum", options: ["Aktif", "Pasif"] },
];

const ALL = "__all__";

const CHANNEL_LABEL_TO_KEY: Record<string, Channel> = {
  SMS: "sms",
  "E-posta": "eposta",
  Push: "push",
};

function matchesFilters(
  t: Trigger,
  search: string,
  values: Record<string, string>
): boolean {
  const q = search.trim().toLocaleLowerCase("tr");
  if (q && !t.ad.toLocaleLowerCase("tr").includes(q)) {
    return false;
  }
  const hedef = values.Hedef;
  if (hedef && hedef !== ALL && t.hedef !== hedef) {
    return false;
  }
  const kanal = values.Kanal;
  if (kanal && kanal !== ALL) {
    const key = CHANNEL_LABEL_TO_KEY[kanal];
    if (!(key && t.kanallar.includes(key))) {
      return false;
    }
  }
  const durum = values.Durum;
  if (durum && durum !== ALL && (durum === "Aktif") !== t.active) {
    return false;
  }
  return true;
}

function ChannelIcons({ active }: { active: Channel[] }) {
  return (
    <div className="flex items-center gap-1.5">
      {CHANNEL_ORDER.map((ch) => {
        const { icon: Icon, label } = CHANNEL_META[ch];
        const on = active.includes(ch);
        return (
          <span
            className={`flex size-7 items-center justify-center rounded-lg border ${
              on
                ? "border-bank-tint bg-bank-tint text-bank-600"
                : "border-line bg-canvas text-ink-muted/50"
            }`}
            key={ch}
            title={label}
          >
            <Icon size={14} strokeWidth={1.9} />
          </span>
        );
      })}
    </div>
  );
}

function statusBadge(active: boolean) {
  return active ? (
    <Badge tone="success">Aktif</Badge>
  ) : (
    <Badge tone="neutral">Pasif</Badge>
  );
}

interface ToolbarProps {
  onClear: () => void;
  onFilter: (label: string, v: string) => void;
  onSearch: (v: string) => void;
  search: string;
  values: Record<string, string>;
}

function Toolbar({
  search,
  onSearch,
  values,
  onFilter,
  onClear,
}: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-line border-b px-5 py-4">
      <div className="flex min-w-[260px] flex-1 items-center gap-2 rounded-[10px] border border-line-strong px-3 py-2">
        <Search className="text-ink-muted" size={16} />
        <input
          className="w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-muted"
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Tetikleyici adı ile ara..."
          value={search}
        />
      </div>
      {FILTERS.map((f) => (
        <div className="w-[150px]" key={f.label}>
          <Select
            onValueChange={(v) => onFilter(f.label, v)}
            value={values[f.label] ?? ALL}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{`${f.label}: Tümü`}</SelectItem>
              {f.options.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
      <button
        className="ml-auto font-medium text-[13px] text-bank-700 hover:underline"
        onClick={onClear}
        type="button"
      >
        Filtreleri Temizle
      </button>
    </div>
  );
}

export function BankBildirimAyarlari() {
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);

  const filtered = TRIGGERS.filter((t) =>
    matchesFilters(t, search, filterValues)
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(pageIndex, pageCount - 1);
  const pageRows = filtered.slice(
    safePage * pageSize,
    safePage * pageSize + pageSize
  );

  return (
    <BankShell
      actions={
        <button
          className="flex items-center gap-2 rounded-[10px] bg-bank px-3.5 py-2 font-semibold text-[13px] text-white hover:bg-bank-600"
          type="button"
        >
          <Plus size={16} /> Yeni Tetikleyici Ekle
        </button>
      }
      breadcrumb={["Bildirim Ayarları"]}
      highlight="Tetikleyici"
      subtitle="Müşteri ve bayiler için bildirim tetikleyicilerini yönetin."
      title="Bildirim &"
    >
      {/* stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          icon={<BellRing size={20} strokeWidth={1.9} />}
          label="Toplam Tetikleyici"
          sub={
            <span>
              Aktif <span className="font-semibold text-bank-600">9</span> ·
              Pasif <span className="font-semibold text-ink-soft">3</span>
            </span>
          }
          tone="bank"
          value="12"
        />
        <StatCard
          icon={<Send size={20} strokeWidth={1.9} />}
          label="Bu Ay Gönderilen Bildirim"
          sub={
            <span>
              Müşteriye{" "}
              <span className="font-semibold text-ink-soft">38.412</span> ·
              Bayiye <span className="font-semibold text-ink-soft">9.838</span>
            </span>
          }
          tone="dealer"
          value="48.250"
        />
        <StatCard
          icon={<TrendingUp size={20} strokeWidth={1.9} />}
          label="Açılma Oranı"
          sub={
            <span>
              Önceki aya göre{" "}
              <span className="font-semibold text-success">↑ %6,3</span>
            </span>
          }
          tone="cust"
          value="%42,7"
        />
        <StatCard
          icon={<MessageSquare size={20} strokeWidth={1.9} />}
          label="Tıklanma Oranı"
          sub={
            <span>
              Önceki aya göre{" "}
              <span className="font-semibold text-success">↑ %1,7</span>
            </span>
          }
          tone="teal"
          value="%9,8"
        />
      </div>

      {/* tabs */}
      <div className="mt-5">
        <Tabs defaultValue="tetikleyiciler">
          <TabsList>
            <TabsTrigger value="tetikleyiciler">Tetikleyiciler</TabsTrigger>
            <TabsTrigger value="kanallar">Bildirim Kanalları</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* table */}
      <Card className="mt-4 overflow-hidden">
        <Toolbar
          onClear={() => {
            setSearch("");
            setFilterValues({});
            setPageIndex(0);
          }}
          onFilter={(label, v) => {
            setFilterValues((prev) => ({ ...prev, [label]: v }));
            setPageIndex(0);
          }}
          onSearch={(v) => {
            setSearch(v);
            setPageIndex(0);
          }}
          search={search}
          values={filterValues}
        />

        <table className="w-full">
          <thead>
            <tr className="bg-canvas/60">
              {[
                "Tetikleyici Adı",
                "Açıklama",
                "Hedef",
                "Kanal",
                "Koşul",
                "Durum",
                "Son Güncelleme",
                "İşlemler",
              ].map((h) => (
                <th
                  className="px-4 py-2.5 text-left font-semibold text-[11px] text-ink-muted uppercase tracking-wide first:pl-5"
                  key={h}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr className="border-line border-t">
                <td
                  className="px-5 py-12 text-center text-[13px] text-ink-muted"
                  colSpan={8}
                >
                  Bu filtrelerle eşleşen tetikleyici bulunamadı.
                </td>
              </tr>
            )}
            {pageRows.map((t) => (
              <tr
                className="border-line border-t hover:bg-canvas/40"
                key={t.id}
              >
                <td className="px-4 py-3.5 first:pl-5">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full ${t.tone}`}
                    >
                      <t.icon size={17} strokeWidth={1.9} />
                    </span>
                    <span className="font-semibold text-[13.5px] text-ink leading-tight">
                      {t.ad}
                    </span>
                  </div>
                </td>
                <td className="max-w-[260px] px-4 py-3.5">
                  <span className="text-[12px] text-ink-muted leading-4">
                    {t.aciklama}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <Badge tone={t.hedef === "Müşteri" ? "cust" : "dealer"}>
                    {t.hedef}
                  </Badge>
                </td>
                <td className="px-4 py-3.5">
                  <ChannelIcons active={t.kanallar} />
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-[12.5px] text-ink-soft">{t.kosul}</span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <Switch defaultChecked={t.active} />
                    {statusBadge(t.active)}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-[12.5px] text-ink-muted tabular-nums">
                    {t.son}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <button
                    className="flex size-8 items-center justify-center rounded-lg text-ink-muted hover:bg-canvas hover:text-ink"
                    type="button"
                  >
                    <MoreVertical size={17} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* footer */}
        <div className="flex items-center justify-between border-line border-t px-5 py-3.5 text-[12.5px] text-ink-muted">
          <div className="flex items-center gap-2.5">
            <span>Satır per sayfa</span>
            <div className="w-[72px]">
              <Select
                onValueChange={(v) => {
                  setPageSize(Number(v));
                  setPageIndex(0);
                }}
                value={String(pageSize)}
              >
                <SelectTrigger className="h-8 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["5", "10", "25", "50"].map((n) => (
                    <SelectItem key={n} value={n}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <span className="ml-1 tabular-nums">
              {filtered.length} tetikleyici
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              className="flex size-8 items-center justify-center rounded-lg border border-line-strong text-ink-soft disabled:opacity-40"
              disabled={safePage === 0}
              onClick={() => setPageIndex(safePage - 1)}
              type="button"
            >
              ‹
            </button>
            {Array.from({ length: pageCount }, (_, i) => i).map((i) => (
              <button
                className={`flex size-8 items-center justify-center rounded-lg font-medium ${
                  i === safePage
                    ? "bg-bank text-white"
                    : "border border-line-strong text-ink-soft"
                }`}
                key={i}
                onClick={() => setPageIndex(i)}
                type="button"
              >
                {i + 1}
              </button>
            ))}
            <button
              className="flex size-8 items-center justify-center rounded-lg border border-line-strong text-ink-soft disabled:opacity-40"
              disabled={safePage >= pageCount - 1}
              onClick={() => setPageIndex(safePage + 1)}
              type="button"
            >
              ›
            </button>
          </div>
        </div>
      </Card>
    </BankShell>
  );
}
