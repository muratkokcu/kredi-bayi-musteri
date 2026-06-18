import { type ExtendedFeatureCollection, geoMercator, geoPath } from "d3-geo";
import { useMemo, useRef, useState } from "react";
import iller from "@/data/turkiye-iller.geo.json";
import { type Bolge, BOLGELER, IL_BOLGE } from "@/data/turkiye-bolge";

interface IlProps {
  name: string;
  number: number;
}

const W = 760;
const H = 340;

// Light → dark green ramp (bank theme), low → high renewal rate.
const SHADES = ["#e8f7f0", "#a7e0c4", "#5cc795", "#1ba86c", "#057048"];

function shadeFor(rate: number, min: number, max: number): string {
  const span = max - min || 1;
  const t = (rate - min) / span;
  const idx = Math.min(
    SHADES.length - 1,
    Math.max(0, Math.floor(t * SHADES.length))
  );
  return SHADES[idx];
}

/**
 * Region-based renewal choropleth of Turkey. Each of the 81 provinces is
 * colored by its geographic region's renewal rate (d3-geo Mercator + geoPath).
 */
export function TurkeyChoropleth({
  ratesByRegion,
}: {
  ratesByRegion: Record<Bolge, number>;
}) {
  const { paths, min, max } = useMemo(() => {
    const fc = iller as unknown as ExtendedFeatureCollection;
    const projection = geoMercator().fitExtent(
      [
        [10, 10],
        [W - 10, H - 10],
      ],
      fc
    );
    const path = geoPath(projection);
    const values = BOLGELER.map((b) => ratesByRegion[b] ?? 0);
    const built = fc.features.map((f) => {
      const name = (f.properties as IlProps).name;
      const region = IL_BOLGE[name];
      const rate = region ? (ratesByRegion[region] ?? 0) : 0;
      return { name, region, rate, d: path(f) ?? "" };
    });
    return { paths: built, min: Math.min(...values), max: Math.max(...values) };
  }, [ratesByRegion]);

  const wrapRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [info, setInfo] = useState<{
    name: string;
    rate: number;
    region?: Bolge;
  } | null>(null);

  return (
    <div
      className="relative"
      onMouseLeave={() => setInfo(null)}
      onMouseMove={(e) => {
        const r = wrapRef.current?.getBoundingClientRect();
        if (r) {
          setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
        }
      }}
      ref={wrapRef}
    >
      <svg
        aria-label="Bölge bazlı yenileme oranı Türkiye haritası"
        className="h-auto w-full"
        role="img"
        viewBox={`0 0 ${W} ${H}`}
      >
        {paths.map((p) => (
          <path
            d={p.d}
            fill={shadeFor(p.rate, min, max)}
            key={p.name}
            onMouseEnter={() =>
              setInfo({ name: p.name, region: p.region, rate: p.rate })
            }
            stroke="#ffffff"
            strokeWidth={0.5}
          />
        ))}
      </svg>

      {info ? (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-ink px-2.5 py-1.5 shadow-[var(--shadow-pop)]"
          style={{ left: pos.x, top: pos.y - 8 }}
        >
          <div className="font-semibold text-[12px] text-white">
            {info.name}
          </div>
          <div className="text-[10.5px] text-white/70 tabular-nums">
            {info.region ?? "—"} · %{info.rate.toLocaleString("tr-TR")}
          </div>
        </div>
      ) : null}

      <div className="mt-3 flex items-center justify-center gap-2 text-[10.5px] text-ink-muted">
        <span>Düşük</span>
        {SHADES.map((c) => (
          <span
            className="size-3.5 rounded-[3px]"
            key={c}
            style={{ background: c }}
          />
        ))}
        <span>Yüksek</span>
      </div>
    </div>
  );
}
