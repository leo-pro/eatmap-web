import { ArrowLeft, Clock3, MapPin, Star } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Restaurant } from "@/features/restaurants/types/restaurant";
import { formatEta, formatRating } from "@/utils/format";

type RestaurantDetailProps = {
  restaurant: Restaurant | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  onBack: () => void;
  onRetry: () => void;
};

function RestaurantDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-11 w-28" />
      <div className="overflow-hidden rounded-[1.75rem] border border-border bg-card">
        <Skeleton className="aspect-[5/4] rounded-none md:aspect-[16/9]" />
        <div className="space-y-5 p-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    </div>
  );
}

export function RestaurantDetail({
  restaurant,
  isLoading,
  isRefreshing,
  error,
  onBack,
  onRetry,
}: RestaurantDetailProps) {
  if (isLoading) {
    return <RestaurantDetailSkeleton />;
  }

  if (!restaurant) {
    return (
      <EmptyState
        actionLabel="Voltar para a listagem"
        description="Nao foi possivel localizar o restaurante selecionado."
        onAction={onBack}
        title="Restaurante indisponivel"
      />
    );
  }

  return (
    <div className="mx-auto space-y-6">
      <Button onClick={onBack} variant="ghost">
        <ArrowLeft className="h-4 w-4" />
        Voltar para a listagem
      </Button>

      <Card className="overflow-hidden">
        <div className="aspect-[5/4] overflow-hidden md:aspect-[16/9]">
          <img
            alt={restaurant.name}
            className="h-full w-full object-cover"
            loading="lazy"
            src={restaurant.imageUrl}
          />
        </div>

        <div className="grid gap-8 p-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{restaurant.category}</Badge>
              <Badge>{restaurant.priceRange}</Badge>
              {isRefreshing ? (
                <Badge variant="secondary">Atualizando</Badge>
              ) : null}
            </div>

            <div>
              <h1 className="font-serif text-5xl leading-none tracking-[-0.04em] text-foreground">
                {restaurant.name}
              </h1>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  {formatRating(restaurant.rating)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  {formatEta(restaurant.etaMinutes)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {restaurant.region}
                </span>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-3xl tracking-[-0.03em] text-foreground">
                Sobre o restaurante
              </h2>
              <p className="mt-4 text-base leading-8 text-muted-foreground">
                {restaurant.description}
              </p>
            </div>
          </div>

          <div className="space-y-5 rounded-[1.5rem] border border-border/70 bg-background/80 p-5">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Endereco
              </p>
              <p className="mt-3 inline-flex items-start gap-3 text-sm leading-7 text-foreground">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" />
                {restaurant.address}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Faixa de preco
              </p>
              <p className="mt-3 text-sm leading-7 text-foreground">
                {restaurant.priceRange} · Ticket medio coerente com a categoria
              </p>
            </div>

            {error ? (
              <div className="rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-primary">
                Houve uma falha ao atualizar este detalhe. O conteudo atual foi
                mantido em tela.
              </div>
            ) : null}

            <Button className="w-full" onClick={onRetry} variant="outline">
              Recarregar detalhes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
