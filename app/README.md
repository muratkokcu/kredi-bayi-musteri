# Kredi · Bayi · Müşteri

Taşıt kredisi **yenileme** ekosistemi için üç personalı bir ürün prototipi:

| Persona | Açıklama | Düzen |
| --- | --- | --- |
| **Banka** | Portföy, yenileme skoru, bayi yönetimi, raporlar | Masaüstü |
| **Bayi** | Fırsat havuzu, stok, teklif oluşturma, performans | Masaüstü |
| **Müşteri** | Teklifler, kredi simülatörü, ödeme planı, başvuru | Mobil |

> Durum: arayüz prototipi. Veriler şu an gömülü seed olup gerçek bir backend yoktur.
> Üretime geçiş yol haritası: [`../docs/production-readiness.md`](../docs/production-readiness.md).

## Teknolojiler

React 19 · Vite 8 · TypeScript 6 · TanStack Router & Table · Tailwind CSS v4 ·
shadcn/ui (radix-ui) · react-hook-form + zod · sonner · lucide-react ·
recharts (planlı) · Vitest.

## Başlangıç

```bash
npm install
cp .env.example .env   # ortam değişkenleri (opsiyonel; varsayılanlar çalışır)
npm run dev            # http://localhost:5173
```

## Komutlar

| Komut | Açıklama |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu (HMR) |
| `npm run build` | `tsc -b` (tip kontrolü) + üretim derlemesi |
| `npm run test` | Vitest birim testleri (tek sefer) |
| `npm run test:watch` | Vitest izleme modu |
| `npm run lint` | ESLint |
| `npm run check` / `npm run fix` | Ultracite (Biome) denetim / otomatik düzeltme |

> **Tip kontrolü:** `tsc --noEmit` bu projede etkili değildir; tipler için
> `tsc -b` ya da `npm run build` kullanın.

## Dizin yapısı

```
src/
  app.tsx, main.tsx, router.tsx   # uygulama girişi ve rotalar
  personas/{bank,dealer,customer} # persona shell'leri + ekranlar
  components/ui/                  # shadcn/ui primitifleri
  ui/                             # uygulamaya özel sunum bileşenleri (kart, kpi, grafik…)
  data/                           # seed veri (arac-taksonomisi tek doğruluk kaynağı)
  lib/                            # format, finance, env, utils
```

## Sözleşmeler (conventions)

- **Araç verisi tek kaynak:** marka/model/varyant/segment yalnızca
  [`src/data/arac-taksonomisi.ts`](src/data/arac-taksonomisi.ts)'ten türetilir, elle uydurulmaz.
- **Biçimlendirme:** para/yüzde/tarih için her zaman
  [`src/lib/format.ts`](src/lib/format.ts) kullanın; ekran içinde `Intl.NumberFormat` veya
  manuel `₺` öneki yazmayın.
- **Finansal hesap:** taksit/faiz/vergi için
  [`src/lib/finance.ts`](src/lib/finance.ts). Taşıt kredisi taksiti, KKDF + BSMV'yi
  içeren *efektif* oran üzerinden hesaplanır. ⚠️ Varsayılan KKDF/BSMV oranları
  güncel GİB/BDDK cetveline göre **doğrulanmalıdır** (kod içinde `VERIFY` notu).
- **Ortam değişkenleri:** [`src/lib/env.ts`](src/lib/env.ts) ile zod doğrulamalı;
  yeni değişkeni hem oraya hem `.env.example`'a ekleyin.
