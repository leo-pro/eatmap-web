import { useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { RestaurantDetailScreen } from '@/app/routes/shared/restaurant-detail-screen'
import { useRestaurantQuery } from '@/features/restaurants/hooks/useRestaurantQuery'

export function VersionBRestaurantDetailPage() {
  const { restaurantSlug } = useParams({ from: '/b/restaurants/$restaurantSlug' })
  const search = useSearch({ from: '/b/restaurants/$restaurantSlug' })
  const navigate = useNavigate({ from: '/b/restaurants/$restaurantSlug' })
  const restaurantState = useRestaurantQuery(restaurantSlug)

  return (
    <RestaurantDetailScreen
      error={restaurantState.error}
      isLoading={restaurantState.isLoading}
      isRefreshing={restaurantState.isRefreshing}
      onBack={() =>
        navigate({
          search,
          to: '/b/restaurants',
        })
      }
      onRetry={restaurantState.refetch}
      restaurant={restaurantState.restaurant}
    />
  )
}
