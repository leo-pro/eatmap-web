import { AlertCircle } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { RestaurantCard } from '@/features/restaurants/components/restaurant-card'
import type { Restaurant } from '@/features/restaurants/types/restaurant'

type RestaurantListProps = {
  restaurants: Restaurant[]
  totalRestaurants: number
  isLoading: boolean
  isRefreshing: boolean
  error: Error | null
  onRetry: () => void
  onClearFilters: () => void
  onSelectRestaurant: (restaurantSlug: string) => void
}

function RestaurantListSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="overflow-hidden rounded-[1.75rem]" key={index}>
          <Skeleton className="aspect-[16/10] rounded-[1.75rem]" />
          <div className="space-y-4 px-2 pb-2 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function RestaurantList({
  restaurants,
  totalRestaurants,
  isLoading,
  isRefreshing,
  error,
  onRetry,
  onClearFilters,
  onSelectRestaurant,
}: RestaurantListProps) {
  if (isLoading) {
    return <RestaurantListSkeleton />
  }

  if (error && restaurants.length === 0) {
    return (
      <EmptyState
        actionLabel="Tentar novamente"
        description="A listagem nao foi carregada. Refaça a consulta para continuar o experimento."
        icon={<AlertCircle className="h-6 w-6 text-primary" />}
        onAction={onRetry}
        title="Erro ao buscar restaurantes"
      />
    )
  }

  if (restaurants.length === 0) {
    return (
      <EmptyState
        actionLabel="Limpar filtros"
        description="Nenhum restaurante corresponde aos filtros aplicados nesta versao."
        onAction={onClearFilters}
        title="Nenhum resultado encontrado"
      />
    )
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl tracking-[-0.03em] text-foreground">Restaurantes</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalRestaurants} resultado(s) encontrados
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isRefreshing ? (
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              Atualizando
            </span>
          ) : null}
          <Button onClick={onRetry} size="sm" variant="outline">
            Recarregar
          </Button>
        </div>
      </div>
      {error ? (
        <div className="rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-primary">
          Houve uma falha na ultima consulta. Os dados exibidos podem estar defasados.
        </div>
      ) : null}
      <div className="grid gap-8 lg:grid-cols-2">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            onSelect={onSelectRestaurant}
            restaurant={restaurant}
          />
        ))}
      </div>
    </section>
  )
}
