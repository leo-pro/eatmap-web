import { useQuery } from '@tanstack/react-query'
import { restaurantQueryKeys } from '@/features/restaurants/services/queryKeys'
import { getRestaurantBySlug } from '@/features/restaurants/services/restaurantApi'

export function useRestaurantQuery(restaurantSlug: string) {
  const query = useQuery({
    queryKey: restaurantQueryKeys.detailBySlug(restaurantSlug),
    queryFn: () => getRestaurantBySlug(restaurantSlug),
    staleTime: 60_000,
    gcTime: 10 * 60_000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  })

  return {
    restaurant: query.data ?? null,
    error: query.error ?? null,
    isLoading: query.isPending && !query.data,
    isRefreshing: query.isFetching && !!query.data,
    refetch: () => {
      void query.refetch()
    },
  }
}
