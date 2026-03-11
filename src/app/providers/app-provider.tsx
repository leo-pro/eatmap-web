import { RouterProvider } from "@tanstack/react-router";
import { QueryProvider } from "@/app/providers/query-provider";
import { router } from "@/app/router";
import { SpeedInsights } from "@vercel/speed-insights/react";

export function AppProvider() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
      <SpeedInsights />
    </QueryProvider>
  );
}
