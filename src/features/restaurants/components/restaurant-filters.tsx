import type { ComponentType, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import {
  ArrowUpDown,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tags,
  Wallet,
} from 'lucide-react'
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
  'h-12 w-full appearance-none rounded-[1.2rem] border border-white/70 bg-white/82 px-4 pr-10 text-sm font-medium text-foreground shadow-[0_18px_32px_-28px_rgba(15,23,42,0.45)] outline-none transition-all backdrop-blur-xl focus:border-primary/45 focus:ring-4 focus:ring-primary/12'

function hasDraftChanges(draftSearch: RestaurantRouteSearch, search: RestaurantRouteSearch) {
  return (
    draftSearch.q !== search.q ||
    draftSearch.category !== search.category ||
    draftSearch.price !== search.price ||
    draftSearch.rating !== search.rating
  )
}

type FilterFieldProps = {
  label: string
  icon: ComponentType<{ className?: string }>
  children: ReactNode
}

function FilterField({ label, icon: Icon, children }: FilterFieldProps) {
  return (
    <label className="space-y-2">
      <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      {children}
    </label>
  )
}

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

  const hasActiveFilters = hasActiveRestaurantFilters(search)
  const isDirty = hasDraftChanges(draftSearch, search)

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/60 p-4 shadow-[0_28px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-2xl sm:p-5">
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault()
          onApply(draftSearch)
        }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">

            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-foreground sm:text-[2rem]">
                Refine sua busca
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Filtre por nome, categoria, preço e avaliacao para encontrar o restaurante ideal.
              </p>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              <span
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-medium shadow-sm',
                  hasActiveFilters
                    ? 'border-primary/12 bg-primary/10 text-primary'
                    : 'border-white/70 bg-white/72 text-muted-foreground',
                )}
              >
                {hasActiveFilters ? 'Filtros ativos' : 'Exploracao sem filtros'}
              </span>
            </div>
          )}
        </div>

        <FilterField label="Busca" icon={Search}>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-14 rounded-[1.35rem] border-white/70 bg-white/80 pl-11 text-base shadow-[0_20px_38px_-30px_rgba(15,23,42,0.38)] focus:border-primary/45 focus:ring-4 focus:ring-primary/12"
              onChange={(event) =>
                setDraftSearch((currentSearch) => ({
                  ...currentSearch,
                  q: event.target.value,
                }))
              }
              placeholder="Qual restaurante, prato ou experiencia voce procura?"
              value={draftSearch.q}
            />
          </div>
        </FilterField>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">

          <FilterField label="Categoria" icon={Tags}>
            <div className="relative">
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
                <option value="all">Todas as culinarias</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                ▾
              </span>
            </div>
          </FilterField>

          <FilterField label="Preço" icon={Wallet}>
            <div className="relative">
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
                <option value="all">Qualquer faixa</option>
                {restaurantPriceRanges.map((priceRange) => (
                  <option key={priceRange} value={priceRange}>
                    {priceRange}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                ▾
              </span>
            </div>
          </FilterField>

          <FilterField label="Avaliação" icon={Star}>
            <div className="relative">
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
                <option value="all">Qualquer avaliacao</option>
                <option value="4.0">4.0+</option>
                <option value="4.5">4.5+</option>
                <option value="4.8">4.8+</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                ▾
              </span>
            </div>
          </FilterField>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/55 pt-4 items-end">

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <Button
              className="border-white/70 bg-white/72 shadow-[0_18px_32px_-28px_rgba(15,23,42,0.4)] hover:bg-white"
              onClick={onReset}
              variant="outline"
            >
              <RotateCcw className="h-4 w-4" />
              Limpar
            </Button>
            <Button className="shadow-[0_22px_38px_-22px_rgba(52,127,226,0.5)]" type="submit">
              <Sparkles className="h-4 w-4" />
              Aplicar filtros
            </Button>
          </div>
        </div>
      </form>
    </section>
  )
}
