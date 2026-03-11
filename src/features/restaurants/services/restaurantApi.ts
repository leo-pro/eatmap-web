import { mapRestaurantRowToRestaurant } from '@/features/restaurants/mappers/restaurantMapper'
import type {
  PaginatedRestaurants,
  Restaurant,
  RestaurantListParams,
  RestaurantRow,
} from '@/features/restaurants/types/restaurant'
import { supabase } from '@/integrations/supabase/client'

const restaurantColumns = `
  id,
  slug,
  name,
  category,
  price_range,
  rating,
  region,
  estimated_time_minutes,
  cover_image_url,
  description,
  address,
  is_featured,
  created_at,
  updated_at
`

function buildRestaurantListQuery(params: RestaurantListParams) {
  let query = supabase
    .from('restaurants')
    .select(restaurantColumns, { count: 'exact' })
    .order('is_featured', { ascending: false })
    .order('rating', { ascending: false })
    .order('name', { ascending: true })

  if (params.searchTerm) {
    query = query.ilike('name', `%${params.searchTerm}%`)
  }

  if (params.category) {
    query = query.eq('category', params.category)
  }

  if (params.priceRange) {
    query = query.eq('price_range', params.priceRange)
  }

  if (params.minRating !== null) {
    query = query.gte('rating', params.minRating)
  }

  const from = (params.page - 1) * params.pageSize
  const to = from + params.pageSize - 1

  return query.range(from, to)
}

function toRestaurantList(data: RestaurantRow[] | null) {
  return (data ?? []).map(mapRestaurantRowToRestaurant)
}

function throwRestaurantError(message: string, error: { message: string }) {
  throw new Error(`${message}: ${error.message}`)
}

export async function getRestaurants(params: RestaurantListParams): Promise<PaginatedRestaurants> {
  const { data, error, count } = await buildRestaurantListQuery(params)

  if (error) {
    throwRestaurantError('Nao foi possivel buscar os restaurantes', error)
  }

  const total = count ?? 0
  const totalPages = total === 0 ? 0 : Math.ceil(total / params.pageSize)

  return {
    items: toRestaurantList(data as RestaurantRow[] | null),
    page: params.page,
    pageSize: params.pageSize,
    total,
    totalPages,
  }
}

export async function getRestaurantById(restaurantId: string): Promise<Restaurant> {
  const { data, error } = await supabase
    .from('restaurants')
    .select(restaurantColumns)
    .eq('id', restaurantId)
    .maybeSingle()

  if (error) {
    throwRestaurantError('Nao foi possivel buscar o restaurante por id', error)
  }

  if (!data) {
    throw new Error('Restaurante nao encontrado.')
  }

  return mapRestaurantRowToRestaurant(data as RestaurantRow)
}

export async function getRestaurantBySlug(restaurantSlug: string): Promise<Restaurant> {
  const { data, error } = await supabase
    .from('restaurants')
    .select(restaurantColumns)
    .eq('slug', restaurantSlug)
    .maybeSingle()

  if (error) {
    throwRestaurantError('Nao foi possivel buscar o restaurante por slug', error)
  }

  if (!data) {
    throw new Error('Restaurante nao encontrado.')
  }

  return mapRestaurantRowToRestaurant(data as RestaurantRow)
}
