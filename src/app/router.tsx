import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { RootRouteComponent } from '@/app/routes/__root'
import { HomePage } from '@/app/routes/home'
import { VersionARestaurantDetailPage } from '@/app/routes/version-a/restaurant-detail'
import { VersionARestaurantsPage } from '@/app/routes/version-a/restaurants'
import { VersionBRestaurantDetailPage } from '@/app/routes/version-b/restaurant-detail'
import { VersionBRestaurantsPage } from '@/app/routes/version-b/restaurants'
import { normalizeRestaurantSearch } from '@/features/restaurants/utils/search'

const rootRoute = createRootRoute({
  component: RootRouteComponent,
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const versionARestaurantsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'a/restaurants',
  validateSearch: normalizeRestaurantSearch,
  component: VersionARestaurantsPage,
})

const versionARestaurantDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'a/restaurants/$restaurantSlug',
  validateSearch: normalizeRestaurantSearch,
  component: VersionARestaurantDetailPage,
})

const versionBRestaurantsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'b/restaurants',
  validateSearch: normalizeRestaurantSearch,
  component: VersionBRestaurantsPage,
})

const versionBRestaurantDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'b/restaurants/$restaurantSlug',
  validateSearch: normalizeRestaurantSearch,
  component: VersionBRestaurantDetailPage,
})

const routeTree = rootRoute.addChildren([
  homeRoute,
  versionARestaurantsRoute,
  versionARestaurantDetailRoute,
  versionBRestaurantsRoute,
  versionBRestaurantDetailRoute,
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 30_000,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
