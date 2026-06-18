import { Car } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type VehicleType = "suv" | "sedan" | "hatchback" | "elektrikli" | "ticari";

const TICARI_HINTS = [
  "ticari",
  "panelvan",
  "van",
  "transit",
  "caddy",
  "courier",
  "doblo",
  "combi",
];
const ELEKTRIKLI_HINTS = ["elektrikli", "elektrik"];
const SUV_HINTS = [
  "suv",
  "tiguan",
  "kuga",
  "qashqai",
  "3008",
  "tucson",
  "sportage",
  "rav4",
];
const HATCH_HINTS = [
  "hatchback",
  "i20",
  "clio",
  "focus",
  "civic",
  "astra",
  "308",
  "megane",
  "egea",
];

/** Resolve a segment label and/or vehicle name to one of the available images. */
function resolveType(segment?: string, name?: string): VehicleType {
  const hay = `${segment ?? ""} ${name ?? ""}`.toLocaleLowerCase("tr");
  if (TICARI_HINTS.some((k) => hay.includes(k))) {
    return "ticari";
  }
  if (ELEKTRIKLI_HINTS.some((k) => hay.includes(k))) {
    return "elektrikli";
  }
  if (SUV_HINTS.some((k) => hay.includes(k))) {
    return "suv";
  }
  if (HATCH_HINTS.some((k) => hay.includes(k))) {
    return "hatchback";
  }
  return "sedan";
}

interface VehicleImageProps {
  /** classes for the framing box (size + radius) */
  className?: string;
  iconSize?: number;
  /** vehicle display name, used to infer the type when segment is absent */
  name?: string;
  /** segment label (SUV / Sedan / Hatchback) when available */
  segment?: string;
}

/**
 * Transparent vehicle visual chosen by segment, rendered inside a neutral box.
 * Falls back to a car icon if the image fails to load.
 */
export function VehicleImage({
  segment,
  name,
  className,
  iconSize = 22,
}: VehicleImageProps) {
  const [failed, setFailed] = useState(false);
  const type = resolveType(segment, name);

  return (
    <span
      className={cn(
        "flex items-center justify-center overflow-hidden bg-canvas text-ink-muted",
        className
      )}
    >
      {failed ? (
        <Car size={iconSize} strokeWidth={1.7} />
      ) : (
        // biome-ignore lint/a11y/noNoninteractiveElementInteractions: onError swaps to the car-icon fallback when art is missing
        <img
          alt={name ?? "Araç"}
          className="h-full w-full object-contain"
          height={120}
          loading="lazy"
          onError={() => setFailed(true)}
          src={`/cars/${type}.png`}
          width={240}
        />
      )}
    </span>
  );
}
