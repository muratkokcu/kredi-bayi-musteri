import { QueryClient } from "@tanstack/react-query";

/**
 * Shared TanStack Query client (roadmap 0.3). `retry: 1` tolerates the fake
 * service layer's simulated transient failures; raise VITE_API_ERROR_RATE to
 * reliably surface error UX during a demo.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
