import { RouterProvider } from "@tanstack/react-router";
import { QueryProvider } from "@/app/providers/query-provider";
import { router } from "@/app/router";
import { SentryAppBoundary } from "@/integrations/sentry";
import { SpeedInsights } from "@vercel/speed-insights/react";

export function AppProvider() {
  return (
    <SentryAppBoundary>
      <QueryProvider>
        <RouterProvider router={router} />
        <SpeedInsights />
      </QueryProvider>
    </SentryAppBoundary>
  );
}
