import { useEffect } from 'react'
import { useRouterState } from '@tanstack/react-router'
import {
  applySentryRouteScope,
  getSentryRouteMetadata,
} from '@/integrations/sentry/tags'

export function SentryRouteInstrumentation() {
  const routeState = useRouterState({
    select: (state) => {
      const lastMatch = state.matches[state.matches.length - 1]

      return {
        pathname: state.location.pathname,
        routeId: lastMatch?.routeId ?? null,
        search: state.location.search,
        searchStr: state.location.searchStr,
      }
    },
  })

  useEffect(() => {
    applySentryRouteScope(
      getSentryRouteMetadata({
        pathname: routeState.pathname,
        routeId: routeState.routeId,
        search: routeState.search,
      }),
    )
  }, [routeState.pathname, routeState.routeId, routeState.searchStr])

  return null
}
