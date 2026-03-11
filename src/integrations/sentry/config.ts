import * as Sentry from '@sentry/react'
import { getSentryEnv } from '@/integrations/sentry/env'
import {
  applySentryRouteScope,
  enrichSentryEvent,
  enrichSentrySpan,
  getSentryRouteMetadata,
  getSentryRouteTags,
} from '@/integrations/sentry/tags'

let sentryInitialized = false

function getCurrentPathname() {
  if (typeof window === 'undefined') {
    return '/'
  }

  return window.location.pathname
}

function getInitialRouteMetadata() {
  return getSentryRouteMetadata({
    pathname: getCurrentPathname(),
  })
}

export function initializeSentry(router: unknown) {
  const sentryEnv = getSentryEnv()

  if (sentryInitialized || !sentryEnv.enabled || !sentryEnv.dsn) {
    return sentryEnv.enabled
  }

  const initialRouteMetadata = getInitialRouteMetadata()

  Sentry.init({
    dsn: sentryEnv.dsn,
    enabled: sentryEnv.enabled,
    environment: sentryEnv.appEnv,
    release: `${sentryEnv.appName}@${sentryEnv.appVersion}`,
    tracesSampleRate: sentryEnv.tracesSampleRate,
    integrations: [
      Sentry.tanstackRouterBrowserTracingIntegration(router, {
        instrumentNavigation: true,
        instrumentPageLoad: true,
        beforeStartSpan: (options) => {
          const routeMetadata = getSentryRouteMetadata({
            pathname: getCurrentPathname(),
            routeId: options.name,
          })

          return {
            ...options,
            name: routeMetadata.transactionName,
            attributes: {
              ...options.attributes,
              ab_version: routeMetadata.abVersion,
              app_area: routeMetadata.appArea,
              data_strategy: routeMetadata.dataStrategy,
              route_group: routeMetadata.routeGroup,
            },
          }
        },
      }),
    ],
    initialScope: (scope) => {
      scope.setTags(getSentryRouteTags(initialRouteMetadata))
      scope.setContext('experiment', {
        ab_version: initialRouteMetadata.abVersion,
        data_strategy: initialRouteMetadata.dataStrategy,
      })
      scope.setContext('routing', {
        pathname: initialRouteMetadata.pathname,
        route_id: initialRouteMetadata.routeId,
        transaction_name: initialRouteMetadata.transactionName,
        route_group: initialRouteMetadata.routeGroup,
      })

      return scope
    },
    beforeSend: (event) => {
      const routeMetadata = getSentryRouteMetadata({
        pathname: getCurrentPathname(),
      })

      return enrichSentryEvent(event, routeMetadata)
    },
    beforeSendTransaction: (event) => {
      const routeMetadata = getSentryRouteMetadata({
        pathname: getCurrentPathname(),
        routeId: event.transaction,
      })
      const enrichedEvent = enrichSentryEvent(event, routeMetadata)

      return {
        ...enrichedEvent,
        transaction: routeMetadata.transactionName,
      }
    },
    beforeSendSpan: (span) => {
      const routeMetadata = getSentryRouteMetadata({
        pathname: getCurrentPathname(),
      })

      return enrichSentrySpan(span, routeMetadata)
    },
  })

  applySentryRouteScope(initialRouteMetadata)
  sentryInitialized = true

  return true
}
