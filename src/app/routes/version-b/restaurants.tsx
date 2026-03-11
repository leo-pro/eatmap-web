import { useEffect } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { RestaurantsScreen } from '@/app/routes/shared/restaurants-screen'
import { useRestaurantsQuery } from '@/features/restaurants/hooks/useRestaurantsQuery'
import {
  defaultRestaurantPage,
  type RestaurantRouteSearch,
} from '@/features/restaurants/types/restaurant'
import {
  defaultRestaurantSearch,
  restaurantSearchToListParams,
} from '@/features/restaurants/utils/search'

export function VersionBRestaurantsPage() {
  const search = useSearch({ from: '/b/restaurants' })
  const navigate = useNavigate({ from: '/b/restaurants' })
  const listParams = restaurantSearchToListParams(search)
  const restaurantsState = useRestaurantsQuery(listParams)

  useEffect(() => {
    if (
      restaurantsState.totalPages > 0 &&
      search.page > restaurantsState.totalPages
    ) {
      navigate({
        replace: true,
        search: {
          ...search,
          page: restaurantsState.totalPages,
        } satisfies RestaurantRouteSearch,
      })
    }
  }, [navigate, restaurantsState.totalPages, search])

  return (
    <RestaurantsScreen
      error={restaurantsState.error}
      isLoading={restaurantsState.isLoading}
      isRefreshing={restaurantsState.isRefreshing}
      onApplySearch={(nextSearch) =>
        navigate({
          replace: true,
          search: {
            ...nextSearch,
            page: defaultRestaurantPage,
          },
        })
      }
      onPageChange={(page) =>
        navigate({
          search: {
            ...search,
            page,
          },
        })
      }
      onResetSearch={() =>
        navigate({
          replace: true,
          search: defaultRestaurantSearch,
        })
      }
      onRetry={restaurantsState.refetch}
      onSelectRestaurant={(restaurantSlug) =>
        navigate({
          params: { restaurantSlug },
          search,
          to: '/b/restaurants/$restaurantSlug',
        })
      }
      page={restaurantsState.page}
      pageSize={restaurantsState.pageSize}
      restaurants={restaurantsState.restaurants}
      search={search}
      total={restaurantsState.total}
      totalPages={restaurantsState.totalPages}
      version="b"
    />
  )
}
