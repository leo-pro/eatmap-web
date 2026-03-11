import type {
  Restaurant,
  RestaurantPriceRange,
  RestaurantRow,
} from '@/features/restaurants/types/restaurant'

const validPriceRanges = new Set<RestaurantPriceRange>(['$', '$$', '$$$'])

function normalizePriceRange(priceRange: string | null): RestaurantPriceRange {
  if (priceRange && validPriceRanges.has(priceRange as RestaurantPriceRange)) {
    return priceRange as RestaurantPriceRange
  }

  return '$$'
}

export function mapRestaurantRowToRestaurant(row: RestaurantRow): Restaurant {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    priceRange: normalizePriceRange(row.price_range),
    rating: Number(row.rating ?? 0),
    region: row.region,
    imageUrl: row.cover_image_url ?? '',
    description: row.description ?? '',
    address: row.address ?? '',
    etaMinutes: row.estimated_time_minutes,
    isFeatured: row.is_featured ?? false,
  }
}
