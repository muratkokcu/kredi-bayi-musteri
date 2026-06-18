import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpDown,
  Bell,
  Heart,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";
import { getModel } from "@/data/arac-taksonomisi";
import type { Offer } from "@/data/my-offers";
import { useMyOffers } from "@/queries/my-offers";
import { EmptyState, ErrorState, LoadingState } from "@/ui/async-states";
import { VehicleImage } from "@/ui/vehicle-image";
import { MobileShell } from "../mobile-shell";

type FilterId = "tumu" | "yeni" | "goruntulenen" | "favoriler" | "reddedilen";

interface FilterDef {
  id: FilterId;
  label: string;
}

const FILTERS: FilterDef[] = [
  { id: "tumu", label: "Tümü" },
  { id: "yeni", label: "Yeni" },
  { id: "goruntulenen", label: "Görüntülenen" },
  { id: "favoriler", label: "Favoriler" },
  { id: "reddedilen", label: "Reddedilen" },
];

const SEED_FAVORITES: string[] = ["corolla-zirve"];

function filterMatches(
  offer: Offer,
  filter: FilterId,
  favorites: Set<string>
): boolean {
  if (filter === "yeni") {
    return offer.durum === "yeni";
  }
  if (filter === "goruntulenen") {
    return offer.durum === "goruntulenen";
  }
  if (filter === "favoriler") {
    return favorites.has(offer.id);
  }
  if (filter === "reddedilen") {
    return false;
  }
  return true;
}

function filterCount(
  offers: Offer[],
  filter: FilterId,
  favorites: Set<string>
): number {
  return offers.filter((offer) => filterMatches(offer, filter, favorites))
    .length;
}

function offerVehicle(offer: Offer) {
  const model = getModel(offer.markaSlug, offer.modelSlug);
  const markaAd =
    offer.markaSlug.charAt(0).toUpperCase() + offer.markaSlug.slice(1);
  const ad = `${markaAd} ${model?.model ?? offer.modelSlug}`;
  const varyant = model?.varyantlar[offer.varyantIndex] ?? "";
  return { ad, varyant };
}

function StatusBadge({ durum }: { durum?: Offer["durum"] }) {
  if (durum === "yeni") {
    return (
      <span className="rounded-full bg-cust-tint px-2 py-0.5 font-semibold text-[10px] text-cust-600">
        Yeni
      </span>
    );
  }
  if (durum === "goruntulenen") {
    return (
      <span className="rounded-full bg-line px-2 py-0.5 font-semibold text-[10px] text-ink-soft">
        Görüntülenen
      </span>
    );
  }
  return null;
}

interface OfferCardProps {
  isFavorite: boolean;
  offer: Offer;
  onToggleFavorite: (id: string) => void;
}

function OfferCard({ isFavorite, offer, onToggleFavorite }: OfferCardProps) {
  const { ad, varyant } = offerVehicle(offer);
  const specChips = [
    offer.specs.yil,
    offer.specs.km,
    offer.specs.yakit,
    offer.specs.vites,
  ];
  const arrowClasses = offer.vurgu
    ? "bg-warn text-white"
    : "bg-cust text-white";
  const tutarClasses = offer.vurgu ? "text-warn" : "text-cust-600";

  return (
    <Link
      className="relative block rounded-2xl bg-surface p-3.5 shadow-[var(--shadow-card)]"
      to="/musteri/teklif-detayi"
    >
      {offer.enUygun && (
        <span className="absolute top-3 left-3 z-10 rounded-full bg-success px-2.5 py-1 font-semibold text-[10px] text-white">
          En Uygun
        </span>
      )}
      <button
        className="absolute top-3 right-3 z-10 flex size-7 items-center justify-center rounded-full bg-surface text-ink-muted shadow-[var(--shadow-card)]"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onToggleFavorite(offer.id);
        }}
        type="button"
      >
        <Heart
          className={isFavorite ? "fill-cust text-cust" : ""}
          fill={isFavorite ? "var(--color-cust)" : "none"}
          size={15}
          strokeWidth={1.9}
        />
      </button>

      <div className="flex gap-3">
        <span className="relative flex h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-canvas">
          <VehicleImage
            className="size-full bg-transparent"
            iconSize={26}
            name={ad}
          />
          <span className="absolute inset-x-0 bottom-0.5 text-center font-semibold text-[8px] text-ink-muted tracking-wide">
            {offer.bayiKisa}
          </span>
        </span>

        <div className="min-w-0 flex-1 pr-8">
          <div className="truncate font-bold text-[14px] text-ink leading-5">
            {ad}
          </div>
          <div className="truncate text-[11px] text-ink-muted">{varyant}</div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {specChips.map((chip) => (
              <span
                className="rounded-md bg-canvas px-1.5 py-0.5 font-medium text-[9.5px] text-ink-soft"
                key={chip}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 items-end gap-2 border-line border-t pt-3">
        <div>
          <div className="text-[9.5px] text-ink-muted">Faiz Oranı</div>
          <div className="font-bold text-[14px] text-ink">{offer.faiz}</div>
        </div>
        <div>
          <div className="text-[9.5px] text-ink-muted">Aylık Taksit</div>
          <div className="font-bold text-[14px] text-ink">{offer.aylik}</div>
        </div>
        <div className="text-right">
          <div className="text-[9.5px] text-ink-muted">
            Toplam Teklif Tutarı
          </div>
          <div className={`font-bold text-[14px] ${tutarClasses}`}>
            {offer.toplam}
          </div>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-ink-soft">{offer.bayi}</span>
          <StatusBadge durum={offer.durum} />
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[9px] text-ink-muted">Toplam Geri Ödeme</div>
            <div className="font-semibold text-[11px] text-ink">
              {offer.geriOdeme}
            </div>
          </div>
          <span
            className={`flex size-8 items-center justify-center rounded-xl ${arrowClasses}`}
          >
            <ArrowRight size={16} strokeWidth={2.2} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function CustomerTekliflerim() {
  const { data, isPending, isError, refetch } = useMyOffers();
  const [favorites, setFavorites] = useState<Set<string>>(
    () => new Set(SEED_FAVORITES)
  );
  const [activeFilter, setActiveFilter] = useState<FilterId>("tumu");

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (isPending) {
    return (
      <MobileShell tab="Tekliflerim">
        <LoadingState />
      </MobileShell>
    );
  }

  if (isError) {
    return (
      <MobileShell tab="Tekliflerim">
        <ErrorState
          label="Teklifler yüklenemedi."
          onRetry={() => refetch()}
        />
      </MobileShell>
    );
  }

  const offers = data;
  const filteredOffers = offers.filter((offer) =>
    filterMatches(offer, activeFilter, favorites)
  );

  return (
    <MobileShell tab="Tekliflerim">
      <div className="flex flex-col gap-4 px-5 pt-2 pb-6">
        {/* header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-bold text-[22px] text-ink">Tekliflerim</h1>
            <p className="text-[12px] text-ink-muted">
              Sana özel teklifleri incele
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="flex flex-col items-center gap-0.5 text-ink-soft"
              type="button"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-surface shadow-[var(--shadow-card)]">
                <SlidersHorizontal size={17} strokeWidth={1.9} />
              </span>
              <span className="text-[9px] text-ink-muted">Filtre</span>
            </button>
            <button
              className="flex flex-col items-center gap-0.5 text-ink-soft"
              type="button"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-surface shadow-[var(--shadow-card)]">
                <ArrowUpDown size={17} strokeWidth={1.9} />
              </span>
              <span className="text-[9px] text-ink-muted">Sırala</span>
            </button>
          </div>
        </div>

        {/* filter chips */}
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5">
          {FILTERS.map((f) => {
            const isActive = f.id === activeFilter;
            const count = filterCount(offers, f.id, favorites);
            return (
              <button
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 font-semibold text-[12px] ${
                  isActive
                    ? "bg-cust text-white"
                    : "bg-surface text-ink-soft shadow-[var(--shadow-card)]"
                }`}
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                type="button"
              >
                {f.label}
                {count > 0 && (
                  <span
                    className={`rounded-full px-1.5 text-[10px] ${
                      isActive
                        ? "bg-white/25 text-white"
                        : "bg-canvas text-ink-muted"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* offer list */}
        <div className="flex flex-col gap-3">
          {offers.length === 0 ? (
            <EmptyState label="Henüz teklif yok." />
          ) : filteredOffers.length === 0 ? (
            <p className="py-10 text-center text-[12px] text-ink-muted">
              Bu filtrede teklif yok
            </p>
          ) : (
            filteredOffers.map((offer) => (
              <OfferCard
                isFavorite={favorites.has(offer.id)}
                key={offer.id}
                offer={offer}
                onToggleFavorite={toggleFavorite}
              />
            ))
          )}
        </div>

        {/* notify promo */}
        <div className="flex items-center gap-3 rounded-2xl bg-cust-tint p-4">
          <div className="flex-1">
            <div className="font-semibold text-[13px] text-ink">
              Yeni tekliflerde haberdar ol
            </div>
            <div className="text-[11px] text-ink-soft leading-4">
              Bildirimleri aç, sana en uygun teklifleri kaçırma.
            </div>
            <Link
              className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-cust px-3.5 py-1.5 font-semibold text-[11.5px] text-white"
              to="/musteri/bildirimler"
            >
              <Bell size={13} strokeWidth={2.1} /> Bildirimleri Aç
            </Link>
          </div>
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-cust/15 text-cust">
            <Bell size={24} strokeWidth={1.8} />
          </span>
        </div>
      </div>
    </MobileShell>
  );
}
