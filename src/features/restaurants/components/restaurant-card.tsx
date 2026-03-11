import { Clock3, MapPin, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Restaurant } from '@/features/restaurants/types/restaurant'
import { formatEta, formatRating } from '@/utils/format'

type RestaurantCardProps = {
  restaurant: Restaurant
  onSelect: (restaurantSlug: string) => void
}

export function RestaurantCard({ restaurant, onSelect }: RestaurantCardProps) {
  return (
    <button className="w-full text-left" onClick={() => onSelect(restaurant.slug)} type="button">
      <Card className="group overflow-hidden border-transparent bg-transparent shadow-none transition-transform duration-300 hover:-translate-y-1">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[1.75rem]">
          <img
            alt={restaurant.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            loading="lazy"
            src={restaurant.imageUrl}
          />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
            <Badge>{restaurant.category}</Badge>
            <Badge>{restaurant.priceRange}</Badge>
          </div>
        </div>
        <div className="space-y-3 px-1 pb-2 pt-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-serif text-[2rem] leading-none tracking-[-0.03em] text-foreground">
                {restaurant.name}
              </h3>
              <p className="mt-3 line-clamp-2 text-sm leading-7 text-muted-foreground">
                {restaurant.description}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-foreground shadow-sm">
              <Star className="h-4 w-4 fill-current text-primary" />
              {formatRating(restaurant.rating)}
            </div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {restaurant.region}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4" />
              {formatEta(restaurant.etaMinutes)}
            </span>
            <span>{restaurant.priceRange}</span>
          </div>
        </div>
      </Card>
    </button>
  )
}

export function RestaurantCardSkeleton() {
  return (
    <div className="w-full">
      <Card className="overflow-hidden border-transparent bg-transparent shadow-none">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[1.75rem]">
          <Skeleton className="h-full w-full rounded-[1.75rem]" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
            <Skeleton className="h-7 w-24 rounded-full bg-white/70" />
            <Skeleton className="h-7 w-14 rounded-full bg-white/70" />
          </div>
        </div>

        <div className="space-y-4 px-1 pb-2 pt-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className="h-10 w-2/3 rounded-2xl" />
              <Skeleton className="h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-5/6 rounded-full" />
            </div>
            <Skeleton className="h-10 w-20 shrink-0 rounded-full" />
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-10 rounded-full" />
          </div>
        </div>
      </Card>
    </div>
  )
}
