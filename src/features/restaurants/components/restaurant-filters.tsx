import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  restaurantPriceRanges,
  type RestaurantRouteSearch,
} from '@/features/restaurants/types/restaurant'
import { hasActiveRestaurantFilters } from '@/features/restaurants/utils/search'
import { cn } from '@/lib/cn'

type RestaurantFiltersProps = {
  search: RestaurantRouteSearch
  categories: string[]
  onApply: (nextSearch: RestaurantRouteSearch) => void
  onReset: () => void
}

const selectClassName =
  'flex h-11 w-full rounded-full border border-input bg-white px-4 text-sm text-foreground shadow-sm transition-all outline-none focus:border-foreground/20 focus:ring-4 focus:ring-primary/10'

export function RestaurantFilters({
  search,
  categories,
  onApply,
  onReset,
}: RestaurantFiltersProps) {
  const [draftSearch, setDraftSearch] = useState<RestaurantRouteSearch>(search)

  useEffect(() => {
    setDraftSearch(search)
  }, [search])

  return (
    <section className="space-y-4">
      <label className="space-y-2">
        <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Busca</span>
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-12 rounded-[1.25rem] border-border bg-white pl-11 text-base shadow-none focus:border-foreground/20 focus:ring-4 focus:ring-primary/10"
            onChange={(event) =>
              setDraftSearch((currentSearch) => ({
                ...currentSearch,
                q: event.target.value,
              }))
            }
            placeholder="Qual restaurante ou prato?"
            value={draftSearch.q}
          />
        </div>
      </label>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Ordenacao</span>
          <select className={selectClassName} defaultValue="alphabetical">
            <option value="alphabetical">Ordem alfabetica</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Categoria</span>
          <select
            className={selectClassName}
            onChange={(event) =>
              setDraftSearch((currentSearch) => ({
                ...currentSearch,
                category: event.target.value,
              }))
            }
            value={draftSearch.category}
          >
            <option value="all">Culinaria</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Preco</span>
          <select
            className={selectClassName}
            onChange={(event) =>
              setDraftSearch((currentSearch) => ({
                ...currentSearch,
                price: event.target.value,
              }))
            }
            value={draftSearch.price}
          >
            <option value="all">Faixa de preco</option>
            {restaurantPriceRanges.map((priceRange) => (
              <option key={priceRange} value={priceRange}>
                {priceRange}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Nota</span>
          <select
            className={selectClassName}
            onChange={(event) =>
              setDraftSearch((currentSearch) => ({
                ...currentSearch,
                rating: event.target.value,
              }))
            }
            value={draftSearch.rating}
          >
            <option value="all">Avaliacao minima</option>
            <option value="4.0">4.0+</option>
            <option value="4.5">4.5+</option>
            <option value="4.8">4.8+</option>
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <span
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium',
              hasActiveRestaurantFilters(search)
                ? 'border-primary/10 bg-red-50 text-primary'
                : 'border-border bg-white text-muted-foreground',
            )}
          >
            {hasActiveRestaurantFilters(search) ? 'Filtros ativos' : 'Sem filtros ativos'}
          </span>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={onReset} variant="outline">
            Limpar
          </Button>
          <Button onClick={() => onApply(draftSearch)}>Aplicar filtros</Button>
        </div>
      </div>
    </section>
  )
}
