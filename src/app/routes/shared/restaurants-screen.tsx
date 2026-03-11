import { RestaurantFilters } from "@/features/restaurants/components/restaurant-filters";
import { RestaurantList } from "@/features/restaurants/components/restaurant-list";
import { RestaurantPagination } from "@/features/restaurants/components/restaurant-pagination";
import type {
  Restaurant,
  RestaurantRouteSearch,
} from "@/features/restaurants/types/restaurant";

type RestaurantsScreenProps = {
  version: "a" | "b";
  search: RestaurantRouteSearch;
  restaurants: Restaurant[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  onApplySearch: (search: RestaurantRouteSearch) => void;
  onResetSearch: () => void;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  onSelectRestaurant: (restaurantSlug: string) => void;
};

export function RestaurantsScreen({
  version,
  search,
  restaurants,
  page,
  pageSize,
  total,
  totalPages,
  isLoading,
  isRefreshing,
  error,
  onApplySearch,
  onResetSearch,
  onPageChange,
  onRetry,
  onSelectRestaurant,
}: RestaurantsScreenProps) {
  const categories = Array.from(
    new Set(
      restaurants.map((restaurant) => restaurant.category).filter((category) => category.length > 0),
    ),
  ).sort()

  if (search.category !== "all" && !categories.includes(search.category)) {
    categories.unshift(search.category)
  }

  return (
    <div className="mx-auto space-y-8">
      <RestaurantFilters
        categories={categories}
        onApply={onApplySearch}
        onReset={onResetSearch}
        search={search}
      />

      <RestaurantList
        error={error}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        onClearFilters={onResetSearch}
        totalRestaurants={total}
        onRetry={onRetry}
        onSelectRestaurant={onSelectRestaurant}
        restaurants={restaurants}
      />

      <RestaurantPagination
        isDisabled={isLoading || isRefreshing}
        onPageChange={onPageChange}
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
      />
    </div>
  );
}
