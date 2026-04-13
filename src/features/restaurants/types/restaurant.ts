export type RestaurantPriceRange = '$' | '$$' | '$$$'

export type RestaurantRow = {
  id: string
  slug: string
  name: string
  category: string
  price_range: string | null
  rating: number | string | null
  region: string
  estimated_time_minutes: number
  cover_image_url: string | null
  description: string | null
  address: string | null
  is_featured: boolean | null
  created_at: string
  updated_at: string
}

export type Restaurant = {
  id: string
  slug: string
  name: string
  category: string
  priceRange: RestaurantPriceRange
  rating: number
  region: string
  imageUrl: string
  description: string
  address: string
  etaMinutes: number
  isFeatured: boolean
}

export type RestaurantFilters = {
  searchTerm: string
  category: string | null
  priceRange: RestaurantPriceRange | null
  minRating: number | null
}

export type RestaurantListParams = RestaurantFilters & {
  page: number
  pageSize: number
}

export type PaginationMeta = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export type PaginatedRestaurants = PaginationMeta & {
  items: Restaurant[]
}

export type RestaurantRouteSearch = {
  q: string
  category: string
  price: string
  rating: string
  page: number
}

export const restaurantPriceRanges: RestaurantPriceRange[] = ['$', '$$', '$$$']
export const defaultRestaurantPage = 1
export const defaultRestaurantPageSize = 20
