/**
 * İstemci tarafı CSV indirme. Türkçe Excel uyumu için ayraç ";" ve UTF-8 BOM
 * (Türkçe karakterler bozulmasın). Sayılar yerel ayraçsız ham yazılır.
 */
type Cell = string | number | boolean | null | undefined;

function escapeCell(value: Cell): string {
  const s = value == null ? "" : String(value);
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function downloadCsv(
  filename: string,
  headers: string[],
  rows: Cell[][]
): void {
  const body = [headers, ...rows]
    .map((r) => r.map(escapeCell).join(";"))
    .join("\r\n");
  const blob = new Blob([`﻿${body}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
