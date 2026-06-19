import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/auth/auth-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "@/lib/query-client";
import { router } from "./router";

/** Feeds the live session into the router context so guards can read it. */
function RouterWithAuth() {
  const { user } = useAuth();
  return <RouterProvider context={{ user }} router={router} />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <RouterWithAuth />
          <Toaster position="top-center" richColors />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
