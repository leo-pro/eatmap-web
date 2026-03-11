import { Outlet } from '@tanstack/react-router'
import { AppShell } from '@/components/shared/app-shell'
import { SentryRouteInstrumentation } from '@/integrations/sentry'

export function RootRouteComponent() {
  return (
    <AppShell>
      <SentryRouteInstrumentation />
      <Outlet />
    </AppShell>
  )
}
