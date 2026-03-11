import { useQuery } from '@tanstack/react-query'
import { restaurantQueryKeys } from '@/features/restaurants/services/queryKeys'
import { getRestaurants } from '@/features/restaurants/services/restaurantApi'
import type { RestaurantListParams } from '@/features/restaurants/types/restaurant'

export function useRestaurantsQuery(params: RestaurantListParams) {
  const query = useQuery({
    queryKey: restaurantQueryKeys.list(params),
    queryFn: () => getRestaurants(params),
    staleTime: 45_000,
    gcTime: 5 * 60_000,
    placeholderData: (previousData) => previousData,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  })

  return {
    restaurants: query.data?.items ?? [],
    page: query.data?.page ?? params.page,
    pageSize: query.data?.pageSize ?? params.pageSize,
    total: query.data?.total ?? 0,
    totalPages: query.data?.totalPages ?? 0,
    error: query.error ?? null,
    isLoading: query.isPending && !query.data,
    isRefreshing: query.isFetching && !!query.data,
    refetch: () => {
      void query.refetch()
    },
  }
}
