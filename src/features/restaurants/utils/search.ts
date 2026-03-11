import type {
  RestaurantFilters,
  RestaurantListParams,
  RestaurantPriceRange,
  RestaurantRouteSearch,
} from '@/features/restaurants/types/restaurant'
import { defaultRestaurantPage, defaultRestaurantPageSize } from '@/features/restaurants/types/restaurant'

export const defaultRestaurantSearch: RestaurantRouteSearch = {
  q: '',
  category: 'all',
  price: 'all',
  rating: 'all',
  page: defaultRestaurantPage,
}

const validPrices = new Set<RestaurantPriceRange>(['$', '$$', '$$$'])

export function normalizeRestaurantSearch(rawSearch: Record<string, unknown>): RestaurantRouteSearch {
  const q = typeof rawSearch.q === 'string' ? rawSearch.q : ''
  const category = typeof rawSearch.category === 'string' && rawSearch.category.length > 0
    ? rawSearch.category
    : 'all'
  const price =
    typeof rawSearch.price === 'string' && (rawSearch.price === 'all' || validPrices.has(rawSearch.price as RestaurantPriceRange))
      ? rawSearch.price
      : 'all'
  const rating = typeof rawSearch.rating === 'string' ? rawSearch.rating : 'all'
  const rawPage =
    typeof rawSearch.page === 'number'
      ? rawSearch.page
      : typeof rawSearch.page === 'string'
        ? Number.parseInt(rawSearch.page, 10)
        : defaultRestaurantPage
  const page = Number.isNaN(rawPage) || rawPage < 1 ? defaultRestaurantPage : rawPage

  return {
    q,
    category,
    price,
    rating,
    page,
  }
}

export function restaurantSearchToFilters(search: RestaurantRouteSearch): RestaurantFilters {
  const minRating = search.rating === 'all' ? null : Number.parseFloat(search.rating)

  return {
    searchTerm: search.q.trim(),
    category: search.category === 'all' ? null : search.category,
    priceRange: search.price === 'all' ? null : (search.price as RestaurantPriceRange),
    minRating: Number.isNaN(minRating) ? null : minRating,
  }
}

export function restaurantSearchToListParams(
  search: RestaurantRouteSearch,
  pageSize = defaultRestaurantPageSize,
): RestaurantListParams {
  return {
    ...restaurantSearchToFilters(search),
    page: search.page,
    pageSize,
  }
}

export function hasActiveRestaurantFilters(search: RestaurantRouteSearch) {
  return (
    search.q !== defaultRestaurantSearch.q ||
    search.category !== defaultRestaurantSearch.category ||
    search.price !== defaultRestaurantSearch.price ||
    search.rating !== defaultRestaurantSearch.rating
  )
}
