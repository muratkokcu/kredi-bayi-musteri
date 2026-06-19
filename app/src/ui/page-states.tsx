import { Link } from "@tanstack/react-router";
import { Compass, RotateCcw, TriangleAlert } from "lucide-react";

/** Full-page 404 (router defaultNotFoundComponent). */
export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas px-6 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-line text-ink-muted">
        <Compass size={30} strokeWidth={1.7} />
      </span>
      <div>
        <div className="font-bold text-[40px] text-ink leading-none tracking-tight">
          404
        </div>
        <h1 className="mt-2 font-semibold text-[16px] text-ink">
          Sayfa bulunamadı
        </h1>
        <p className="mt-1 text-[13px] text-ink-soft">
          Aradığın sayfa taşınmış ya da hiç var olmamış olabilir.
        </p>
      </div>
      <Link
        className="rounded-[10px] bg-bank px-4 py-2.5 font-semibold text-[13.5px] text-white hover:bg-bank-600"
        to="/"
      >
        Ana sayfaya dön
      </Link>
    </div>
  );
}

/** Full-page route error (router defaultErrorComponent). */
export function RouteError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas px-6 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-warn-tint text-warn">
        <TriangleAlert size={30} strokeWidth={1.8} />
      </span>
      <div>
        <h1 className="font-semibold text-[17px] text-ink">
          Bir şeyler ters gitti
        </h1>
        <p className="mt-1 max-w-sm text-[13px] text-ink-soft">
          {error?.message ?? "Beklenmeyen bir hata oluştu."}
        </p>
      </div>
      <div className="flex gap-2.5">
        <button
          className="flex items-center gap-2 rounded-[10px] bg-bank px-4 py-2.5 font-semibold text-[13.5px] text-white hover:bg-bank-600"
          onClick={reset}
          type="button"
        >
          <RotateCcw size={15} /> Tekrar dene
        </button>
        <Link
          className="rounded-[10px] border border-line-strong bg-surface px-4 py-2.5 font-semibold text-[13.5px] text-ink-soft hover:bg-canvas"
          to="/"
        >
          Ana sayfa
        </Link>
      </div>
    </div>
  );
}
