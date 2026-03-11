import { RestaurantDetail } from '@/features/restaurants/components/restaurant-detail'
import type { Restaurant } from '@/features/restaurants/types/restaurant'

type RestaurantDetailScreenProps = {
  restaurant: Restaurant | null
  isLoading: boolean
  isRefreshing: boolean
  error: Error | null
  onBack: () => void
  onRetry: () => void
}

export function RestaurantDetailScreen(props: RestaurantDetailScreenProps) {
  return <RestaurantDetail {...props} />
}
