import * as Sentry from '@sentry/react'

export type ExperimentVersion = 'A' | 'B' | 'none'
export type DataStrategy = 'manual' | 'tanstack-query' | 'none'
export type AppArea = 'restaurants' | 'landing' | 'unknown'
export type RouteGroup =
  | 'home'
  | 'restaurants-list'
  | 'restaurant-detail'
  | 'unknown'

type RouteMetadataInput = {
  pathname?: string | null
  routeId?: string | null
  search?: unknown
}

export type SentryRouteMetadata = {
  pathname: string
  routeId: string | null
  transactionName: string
  abVersion: ExperimentVersion
  dataStrategy: DataStrategy
  appArea: AppArea
  routeGroup: RouteGroup
  search?: unknown
}

function normalizePathLike(value: string | null | undefined) {
  if (!value) {
    return '/'
  }

  const withoutQuery = value.split('?')[0]?.trim() || '/'
  const withLeadingSlash = withoutQuery.startsWith('/')
    ? withoutQuery
    : `/${withoutQuery}`
  const normalized = withLeadingSlash.replace(/\/{2,}/g, '/')

  if (normalized.length > 1 && normalized.endsWith('/')) {
    return normalized.slice(0, -1)
  }

  return normalized
}

export function getExperimentVersionFromPathname(pathname: string) {
  const normalizedPathname = normalizePathLike(pathname)

  if (normalizedPathname === '/a' || normalizedPathname.startsWith('/a/')) {
    return 'A' satisfies ExperimentVersion
  }

  if (normalizedPathname === '/b' || normalizedPathname.startsWith('/b/')) {
    return 'B' satisfies ExperimentVersion
  }

  return 'none' satisfies ExperimentVersion
}

export function getStableTransactionName(input: {
  pathname?: string | null
  routeId?: string | null
}) {
  const routeCandidate = normalizePathLike(input.routeId)
  const pathnameCandidate = normalizePathLike(input.pathname)
  const candidate = routeCandidate === '/' ? pathnameCandidate : routeCandidate

  if (candidate === '/__root__') {
    return '/'
  }

  if (
    candidate === '/a/restaurants' ||
    candidate === '/b/restaurants' ||
    candidate === '/a/restaurants/$restaurantSlug' ||
    candidate === '/b/restaurants/$restaurantSlug' ||
    candidate === '/'
  ) {
    return candidate
  }

  if (/^\/[ab]\/restaurants\/[^/]+$/.test(candidate)) {
    return candidate.replace(/\/[^/]+$/, '/$restaurantSlug')
  }

  if (/^\/[ab]\/restaurants$/.test(candidate)) {
    return candidate
  }

  return pathnameCandidate
}

function getDataStrategy(version: ExperimentVersion): DataStrategy {
  if (version === 'A') {
    return 'manual'
  }

  if (version === 'B') {
    return 'tanstack-query'
  }

  return 'none'
}

function getAppArea(transactionName: string): AppArea {
  if (/^\/[ab]\/restaurants(?:\/|$)/.test(transactionName)) {
    return 'restaurants'
  }

  if (transactionName === '/') {
    return 'landing'
  }

  return 'unknown'
}

function getRouteGroup(transactionName: string): RouteGroup {
  if (transactionName === '/') {
    return 'home'
  }

  if (/^\/[ab]\/restaurants$/.test(transactionName)) {
    return 'restaurants-list'
  }

  if (/^\/[ab]\/restaurants\/\$restaurantSlug$/.test(transactionName)) {
    return 'restaurant-detail'
  }

  return 'unknown'
}

function getPaginationContext(search: unknown) {
  if (!search || typeof search !== 'object') {
    return null
  }

  const page = (search as { page?: unknown }).page

  if (typeof page !== 'number') {
    return null
  }

  return { page }
}

export function getSentryRouteMetadata({
  pathname,
  routeId,
  search,
}: RouteMetadataInput): SentryRouteMetadata {
  const normalizedPathname = normalizePathLike(pathname)
  const normalizedRouteId = routeId ? normalizePathLike(routeId) : null
  const transactionName = getStableTransactionName({
    pathname: normalizedPathname,
    routeId: normalizedRouteId,
  })
  const abVersion = getExperimentVersionFromPathname(transactionName)

  return {
    pathname: normalizedPathname,
    routeId: normalizedRouteId,
    transactionName,
    abVersion,
    dataStrategy: getDataStrategy(abVersion),
    appArea: getAppArea(transactionName),
    routeGroup: getRouteGroup(transactionName),
    search,
  }
}

export function getSentryRouteTags(metadata: SentryRouteMetadata) {
  return {
    ab_version: metadata.abVersion,
    app_area: metadata.appArea,
    data_strategy: metadata.dataStrategy,
    route_group: metadata.routeGroup,
  }
}

export function buildSentryContexts(metadata: SentryRouteMetadata) {
  const contexts: Record<string, Record<string, string | number | null>> = {
    experiment: {
      ab_version: metadata.abVersion,
      data_strategy: metadata.dataStrategy,
    },
    routing: {
      pathname: metadata.pathname,
      route_id: metadata.routeId,
      transaction_name: metadata.transactionName,
      route_group: metadata.routeGroup,
    },
  }
  const paginationState = getPaginationContext(metadata.search)

  if (paginationState) {
    contexts.pagination_state = paginationState
  }

  return {
    contexts,
    paginationState,
  }
}

export function applySentryRouteScope(metadata: SentryRouteMetadata) {
  const { contexts, paginationState } = buildSentryContexts(metadata)

  Sentry.setTags(getSentryRouteTags(metadata))
  Sentry.setContext('experiment', contexts.experiment)
  Sentry.setContext('routing', contexts.routing)
  Sentry.setContext('pagination_state', paginationState)
}

export function enrichSentryEvent<
  TEvent extends {
    contexts?: Record<string, unknown>
    tags?: Record<string, unknown>
  },
>(event: TEvent, metadata: SentryRouteMetadata) {
  const { contexts, paginationState } = buildSentryContexts(metadata)

  return {
    ...event,
    tags: {
      ...(event.tags ?? {}),
      ...getSentryRouteTags(metadata),
    },
    contexts: {
      ...(event.contexts ?? {}),
      ...contexts,
      pagination_state: paginationState ?? undefined,
    },
  } as TEvent
}

export function enrichSentrySpan<
  TSpan extends {
    data?: Record<string, unknown>
  },
>(span: TSpan, metadata: SentryRouteMetadata) {
  return {
    ...span,
    data: {
      ...(span.data ?? {}),
      ab_version: metadata.abVersion,
      app_area: metadata.appArea,
      data_strategy: metadata.dataStrategy,
      route_group: metadata.routeGroup,
      transaction_name: metadata.transactionName,
    },
  } as TSpan
}
