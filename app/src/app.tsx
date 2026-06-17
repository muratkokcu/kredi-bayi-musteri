import { RouterProvider } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { router } from "./router";

export default function App() {
  return (
    <TooltipProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </TooltipProvider>
  );
}
