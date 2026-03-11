import { useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { RestaurantDetailScreen } from '@/app/routes/shared/restaurant-detail-screen'
import { useRestaurantManual } from '@/features/restaurants/hooks/useRestaurantManual'

export function VersionARestaurantDetailPage() {
  const { restaurantSlug } = useParams({ from: '/a/restaurants/$restaurantSlug' })
  const search = useSearch({ from: '/a/restaurants/$restaurantSlug' })
  const navigate = useNavigate({ from: '/a/restaurants/$restaurantSlug' })
  const restaurantState = useRestaurantManual(restaurantSlug)

  return (
    <RestaurantDetailScreen
      error={restaurantState.error}
      isLoading={restaurantState.isLoading}
      isRefreshing={restaurantState.isRefreshing}
      onBack={() =>
        navigate({
          search,
          to: '/a/restaurants',
        })
      }
      onRetry={restaurantState.refetch}
      restaurant={restaurantState.restaurant}
    />
  )
}
