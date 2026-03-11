import { useEffect, useState } from 'react'
import { getRestaurantBySlug } from '@/features/restaurants/services/restaurantApi'
import type { Restaurant } from '@/features/restaurants/types/restaurant'

type RestaurantManualState = {
  data: Restaurant | null
  error: Error | null
  isLoading: boolean
  isRefreshing: boolean
}

function toError(error: unknown) {
  return error instanceof Error ? error : new Error('Erro inesperado ao buscar restaurante.')
}

export function useRestaurantManual(restaurantSlug: string) {
  const [state, setState] = useState<RestaurantManualState>({
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

    getRestaurantBySlug(restaurantSlug)
      .then((restaurant) => {
        if (!isMounted) {
          return
        }

        setState({
          data: restaurant,
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
  }, [restaurantSlug, requestIndex])

  return {
    restaurant: state.data,
    error: state.error,
    isLoading: state.isLoading,
    isRefreshing: state.isRefreshing,
    refetch: () => setRequestIndex((current) => current + 1),
  }
}
