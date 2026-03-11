import { useEffect, useState } from 'react'
import { getRestaurants } from '@/features/restaurants/services/restaurantApi'
import type { PaginatedRestaurants, RestaurantListParams } from '@/features/restaurants/types/restaurant'

type RestaurantsManualState = {
  data: PaginatedRestaurants | null
  error: Error | null
  isLoading: boolean
  isRefreshing: boolean
}

function toError(error: unknown) {
  return error instanceof Error ? error : new Error('Erro inesperado ao buscar restaurantes.')
}

export function useRestaurantsManual(params: RestaurantListParams) {
  const [state, setState] = useState<RestaurantsManualState>({
    data: null,
    error: null,
    isLoading: true,
    isRefreshing: false,
  })
  const [requestIndex, setRequestIndex] = useState(0)

  useEffect(() => {
    let isMounted = true

    setState((currentState) => ({
      data: currentState.data,
      error: null,
      isLoading: currentState.data === null,
      isRefreshing: currentState.data !== null,
    }))

    getRestaurants(params)
      .then((paginatedRestaurants) => {
        if (!isMounted) {
          return
        }

        setState({
          data: paginatedRestaurants,
          error: null,
          isLoading: false,
          isRefreshing: false,
        })
      })
      .catch((error) => {
        if (!isMounted) {
          return
        }

        setState((currentState) => ({
          data: currentState.data,
          error: toError(error),
          isLoading: false,
          isRefreshing: false,
        }))
      })

    return () => {
      isMounted = false
    }
  }, [params.category, params.minRating, params.page, params.pageSize, params.priceRange, params.searchTerm, requestIndex])

  return {
    restaurants: state.data?.items ?? [],
    page: state.data?.page ?? params.page,
    pageSize: state.data?.pageSize ?? params.pageSize,
    total: state.data?.total ?? 0,
    totalPages: state.data?.totalPages ?? 0,
    error: state.error,
    isLoading: state.isLoading,
    isRefreshing: state.isRefreshing,
    refetch: () => setRequestIndex((current) => current + 1),
  }
}
