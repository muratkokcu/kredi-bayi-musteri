/**
 * Raporlama veri setlerini JSON payload'larına döker (public/data/*.json).
 *
 * Uygulamanın GERÇEK üreticilerini (src/data/*.ts, deterministik mulberry32)
 * Vite'ın SSR modül yükleyicisiyle import eder — kopya mantık yok, tek kaynak.
 * Servisler bu JSON'ları üretim ortamı gibi `fetch` ile çeker (services/client.ts).
 *
 * Çalıştır:  npm run payloads   (app/ dizininden)
 * Üretici değişince yeniden çalıştır + üretilen JSON'ları commit et.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const APP_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = resolve(APP_ROOT, "public/data");

// [dosya adı (modül + çıktı), export edilen sembol]
// Not: dealer-performance verisi JSX ikon içerdiğinden JSON'a alınmadı (bkz.
// services/dealer-performance.ts); yalnız düz kayıt seti olan raporlar burada.
const PAYLOADS = [
  ["production-loans", "PRODUCTION_LOANS"],
  ["applications", "APPLICATIONS"],
  ["stock-financing", "STOCK_LOANS"],
  ["risk-watch", "RISK_CONTRACTS"],
  ["missing-docs", "MISSING_DOCS"],
  ["limits", "LIMITS"],
];

const server = await createServer({
  root: APP_ROOT,
  configFile: resolve(APP_ROOT, "vite.config.ts"),
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "warn",
});

await mkdir(OUT_DIR, { recursive: true });

for (const [name, symbol] of PAYLOADS) {
  const mod = await server.ssrLoadModule(`/src/data/${name}`);
  const data = mod[symbol];
  if (data === undefined) {
    throw new Error(`${name}: "${symbol}" export bulunamadı.`);
  }
  await writeFile(resolve(OUT_DIR, `${name}.json`), JSON.stringify(data));
  const count = Array.isArray(data) ? `${data.length} kayıt` : "obje";
  // biome-ignore lint/suspicious/noConsole: build script çıktısı.
  console.log(`✓ public/data/${name}.json (${count})`);
}

await server.close();
