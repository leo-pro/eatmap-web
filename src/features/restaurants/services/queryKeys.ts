import type { RestaurantListParams } from '@/features/restaurants/types/restaurant'

export const restaurantQueryKeys = {
  all: ['restaurants'] as const,
  lists: () => [...restaurantQueryKeys.all, 'list'] as const,
  list: (params: RestaurantListParams) => [...restaurantQueryKeys.lists(), params] as const,
  details: () => [...restaurantQueryKeys.all, 'detail'] as const,
  detailById: (restaurantId: string) => [...restaurantQueryKeys.details(), 'id', restaurantId] as const,
  detailBySlug: (restaurantSlug: string) =>
    [...restaurantQueryKeys.details(), 'slug', restaurantSlug] as const,
}
