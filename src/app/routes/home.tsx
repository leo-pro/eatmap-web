import { Link } from '@tanstack/react-router'
import { ArrowRight, DatabaseZap, FlaskConical, Gauge } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { defaultRestaurantSearch } from '@/features/restaurants/utils/search'

export function HomePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section className="rounded-[2rem] border border-border/70 bg-card px-6 py-10 text-center sm:px-10">
        <Badge variant="outline">Projeto academico de TCC</Badge>
        <h1 className="mt-6 font-serif text-5xl leading-none tracking-[-0.04em] text-foreground sm:text-6xl">
          Compare duas estrategias de data-fetching na mesma SPA.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
          O projeto usa um guia de restaurantes para comparar fetch manual com cache estruturado,
          mantendo a mesma interface, as mesmas rotas e os mesmos dados.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <Card className="bg-card">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-foreground">
              <FlaskConical className="h-5 w-5" />
            </div>
            <CardTitle>Escopo do experimento</CardTitle>
            <CardDescription>
              Listagem, filtros, detalhes e navegacao entre restaurantes com experiencia visual
              consistente.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-foreground">
              <DatabaseZap className="h-5 w-5" />
            </div>
            <CardTitle>Versao A vs B</CardTitle>
            <CardDescription>
              A usa fetch manual sem cache estruturado. B usa TanStack Query com cache e
              revalidacao.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-foreground">
              <Gauge className="h-5 w-5" />
            </div>
            <CardTitle>Preparado para metricas</CardTitle>
            <CardDescription>
              A arquitetura ja reserva integracoes para Sentry e Supabase, mas segue com dados
              locais nesta fase.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <Card className="bg-card">
          <CardHeader>
            <Badge variant="outline">Versao A</Badge>
            <CardTitle>Data-fetching manual</CardTitle>
            <CardDescription>
              Loading, erro e sucesso controlados localmente em hooks sem cache compartilhado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link search={defaultRestaurantSearch} to="/a/restaurants">
              <Button className="w-full sm:w-auto">
                Abrir versao A
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <Badge variant="outline">Versao B</Badge>
            <CardTitle>TanStack Query com cache</CardTitle>
            <CardDescription>
              Cache configurado, revalidacao automatica e reaproveitamento de dados entre
              navegacoes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link search={defaultRestaurantSearch} to="/b/restaurants">
              <Button className="w-full sm:w-auto">
                Abrir versao B
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
