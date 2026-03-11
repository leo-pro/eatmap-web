import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type RestaurantPaginationProps = {
  page: number
  pageSize: number
  total: number
  totalPages: number
  isDisabled?: boolean
  onPageChange: (page: number) => void
}

export function RestaurantPagination({
  page,
  pageSize,
  total,
  totalPages,
  isDisabled = false,
  onPageChange,
}: RestaurantPaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const firstItem = total === 0 ? 0 : (page - 1) * pageSize + 1
  const lastItem = Math.min(page * pageSize, total)

  return (
    <div className="flex flex-col gap-4 rounded-[1.5rem] border border-border/70 bg-card/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-muted-foreground">
        Mostrando {firstItem}-{lastItem} de {total} restaurantes
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <Button
          disabled={isDisabled || page <= 1}
          onClick={() => onPageChange(page - 1)}
          size="sm"
          variant="outline"
        >
          <ArrowLeft className="h-4 w-4" />
          Anterior
        </Button>

        <div className="min-w-28 text-center text-sm font-medium text-foreground">
          Pagina {page} de {totalPages}
        </div>

        <Button
          disabled={isDisabled || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          size="sm"
          variant="outline"
        >
          Proxima
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
