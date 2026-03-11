import { RouterProvider } from '@tanstack/react-router'
import { QueryProvider } from '@/app/providers/query-provider'
import { router } from '@/app/router'

export function AppProvider() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  )
}

