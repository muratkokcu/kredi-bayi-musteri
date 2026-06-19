import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Top-level React error boundary — catches render errors anywhere in the tree
 * (including provider-level), beyond the router's per-route error component.
 * The componentDidCatch hook is where a real reporter (Sentry) would plug in.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // biome-ignore lint/suspicious/noConsole: surface unexpected render errors
    console.error("Uncaught error:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas px-6 text-center">
          <h1 className="font-semibold text-[17px] text-ink">
            Uygulama beklenmedik bir hatayla karşılaştı
          </h1>
          <p className="max-w-sm text-[13px] text-ink-soft">
            {this.state.error.message}
          </p>
          <button
            className="rounded-[10px] bg-bank px-4 py-2.5 font-semibold text-[13.5px] text-white hover:bg-bank-600"
            onClick={() => window.location.reload()}
            type="button"
          >
            Sayfayı yenile
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
