import { Outlet } from '@tanstack/react-router'
import { AppShell } from '@/components/shared/app-shell'

export function RootRouteComponent() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}

