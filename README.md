# EatMap

## Table of Contents

- [Sobre o projeto](#sobre-o-projeto)
- [Objetivo do experimento](#objetivo-do-experimento)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Arquitetura do projeto](#arquitetura-do-projeto)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Rotas da aplicação](#rotas-da-aplicação)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Scripts disponíveis](#scripts-disponíveis)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Fluxo de dados](#fluxo-de-dados)
- [Observabilidade com Sentry](#observabilidade-com-sentry)
- [Observações](#observações)

## Sobre o projeto

O **EatMap** é uma aplicação frontend para descoberta de restaurantes, desenvolvida como um projeto acadêmico de **TCC**. A proposta da aplicação é comparar duas estratégias de busca e gerenciamento de dados dentro da mesma SPA, mantendo a mesma interface, as mesmas rotas de navegação e a mesma fonte de dados.

O app possui:

- listagem paginada de restaurantes;
- filtros por nome, categoria, faixa de preço e nota mínima;
- tela de detalhes do restaurante;
- duas versões da experiência para comparação de data fetching.

## Objetivo do experimento

O foco principal do projeto é comparar duas abordagens:

- **Versão A**: busca manual de dados com controle de `loading`, `refresh`, `erro` e `refetch` feito localmente nos hooks.
- **Versão B**: uso de **TanStack Query** para cache, revalidação automática e reaproveitamento de dados entre navegações.

Essa estrutura permite analisar diferenças de comportamento, organização de código e experiência de uso sem mudar o layout da aplicação.

## Tecnologias utilizadas

- **React 18** para construção da interface
- **TypeScript** para tipagem estática
- **Vite** como bundler e ambiente de desenvolvimento
- **TanStack Router** para roteamento da SPA
- **TanStack Query** para gerenciamento de cache e sincronização de dados
- **Supabase** como camada de acesso aos dados
- **Tailwind CSS v4** para estilização
- **shadcn/ui** como base de componentes reutilizáveis
- **Lucide React** para ícones
- **Vercel Speed Insights** para observabilidade de performance no frontend
- **Sentry** para monitoramento de erros, traces SPA e Web Vitals

## Arquitetura do projeto

O projeto está organizado por responsabilidades para facilitar manutenção e evolução:

- `src/app`: composição principal da aplicação, router, providers e páginas de rota.
- `src/features`: regras de negócio organizadas por domínio. Atualmente o domínio principal é `restaurants`.
- `src/components`: componentes compartilhados e componentes de UI.
- `src/integrations`: integrações externas, como Supabase e espaço reservado para Sentry.
- `src/lib`: utilitários de infraestrutura, como `queryClient` e função `cn`.
- `src/styles`: estilos globais e tokens visuais do tema.
- `src/utils`: helpers genéricos.

### Decisões de arquitetura

- A aplicação usa **SPA com rotas explícitas** definidas manualmente com `TanStack Router`.
- O domínio de restaurantes fica isolado em `features/restaurants`, com separação entre:
  - `services`: acesso a dados e chaves de query;
  - `hooks`: orquestração de estado e consumo da API;
  - `components`: interface específica do domínio;
  - `types`, `utils` e `mappers`: modelagem, transformação e normalização.
- As duas versões do experimento compartilham a mesma camada visual (`shared screens`) e mudam apenas a estratégia de busca de dados.
- O provider global reúne o `QueryClientProvider`, o `RouterProvider` e a instrumentação de performance.

## Estrutura de pastas

```text
src/
  app/
    providers/
    routes/
  components/
    shared/
    ui/
  features/
    restaurants/
      components/
      hooks/
      mappers/
      services/
      types/
      utils/
  integrations/
    sentry/
    supabase/
  lib/
  styles/
  utils/
```

## Rotas da aplicação

- `/`: página inicial com a apresentação do experimento
- `/a/restaurants`: listagem da versão A
- `/a/restaurants/:restaurantSlug`: detalhe de restaurante na versão A
- `/b/restaurants`: listagem da versão B
- `/b/restaurants/:restaurantSlug`: detalhe de restaurante na versão B

## Como rodar o projeto

### Pré-requisitos

- **Node.js** 20 ou superior
- **pnpm** 10 ou superior

### Passo a passo

1. Instale as dependências:

```bash
pnpm install
```

2. Crie o arquivo de ambiente com base no exemplo:

```bash
cp .env.example .env
```

3. Preencha as variáveis com as credenciais públicas do Supabase.

4. Inicie o servidor de desenvolvimento:

```bash
pnpm dev
```

5. Acesse a aplicação no endereço exibido pelo Vite, normalmente:

```text
http://localhost:5173
```

## Scripts disponíveis

- `pnpm dev`: inicia o ambiente de desenvolvimento
- `pnpm build`: gera a build de produção
- `pnpm preview`: serve localmente a build gerada
- `pnpm typecheck`: executa a checagem de tipos com TypeScript

## Variáveis de ambiente

O projeto exige as seguintes variaveis publicas:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_KEY=your-public-anon-or-publishable-key
VITE_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
VITE_SENTRY_TRACES_SAMPLE_RATE=1
VITE_APP_ENV=development
VITE_APP_NAME=eatmap
VITE_APP_VERSION=0.1.0
```

### Descrição

- `VITE_SUPABASE_URL`: URL do projeto no Supabase
- `VITE_SUPABASE_KEY`: chave pública (`anon` ou `publishable`) usada pelo frontend
- `VITE_SENTRY_DSN`: DSN publico do projeto no Sentry. Se estiver ausente, a instrumentacao do Sentry fica desabilitada sem impedir a aplicacao de rodar.
- `VITE_SENTRY_TRACES_SAMPLE_RATE`: taxa de amostragem das transacoes de performance. O valor sugerido nesta fase do experimento e `1`.
- `VITE_APP_ENV`: ambiente enviado ao Sentry como `environment`.
- `VITE_APP_NAME`: nome publico da aplicacao usado na `release`.
- `VITE_APP_VERSION`: versao publica usada para compor a `release`.

Se as variaveis do Supabase nao estiverem definidas, a aplicacao lanca erro na inicializacao da integracao com Supabase. As variaveis do Sentry sao publicas e opcionais nesta fase, com validacao da `traces sample rate` quando informada.

## Fluxo de dados

De forma resumida, o fluxo acontece assim:

1. A rota lê e normaliza os parâmetros de busca da URL.
2. Os parâmetros são convertidos para filtros de listagem.
3. A tela escolhe o hook da versão correspondente:
   - `useRestaurantsManual` / `useRestaurantManual`
   - `useRestaurantsQuery` / `useRestaurantQuery`
4. Os hooks consomem `restaurantApi.ts`, responsável por consultar a tabela `restaurants` no Supabase.
5. Os dados retornados são mapeados para o modelo interno da aplicação antes de serem renderizados.

## Observabilidade com Sentry

A Fase 3 centraliza a instrumentacao do Sentry em `src/integrations/sentry`, com foco em erros, traces SPA e Web Vitals.

- O SDK usa a integracao oficial `tanstackRouterBrowserTracingIntegration`.
- Page loads e client-side navigations sao rastreados em uma SPA com TanStack Router.
- Os nomes de transacao sao estabilizados para agrupamento:
  - `/a/restaurants`
  - `/a/restaurants/$restaurantSlug`
  - `/b/restaurants`
  - `/b/restaurants/$restaurantSlug`
- As tags indexaveis enviadas pelo frontend ficam consistentes para filtragem:
  - `ab_version`
  - `app_area`
  - `data_strategy`
  - `route_group`
- A versao do experimento e derivada centralmente da rota:
  - rotas `/a/...` enviam `ab_version:A` e `data_strategy:manual`
  - rotas `/b/...` enviam `ab_version:B` e `data_strategy:tanstack-query`
- Contextos complementares ficam disponiveis para analise:
  - `experiment`
  - `routing`
  - `pagination_state` quando existir pagina atual na URL

### Filtros recomendados no Sentry

- `ab_version:A`
- `ab_version:B`
- `transaction:/a/restaurants`
- `transaction:/b/restaurants/$restaurantSlug`

## Observações

- A integracao com **Sentry** agora esta centralizada em `src/integrations/sentry`.
- Source maps para producao podem ser adicionados depois com o plugin oficial do Sentry para Vite, mas isso ficou fora do foco desta fase.
- O projeto usa **aliases** com `@` apontando para `src`, o que simplifica os imports.
- O tema visual está centralizado em `src/styles/globals.css`, com uso de variáveis CSS e tokens aplicados ao Tailwind.
- Em deploys SPA, rotas profundas como `/a/restaurants` e `/b/restaurants` exigem rewrite para `index.html`. O projeto inclui `vercel.json` para evitar `404 Not Found` ao atualizar a pagina preservando os `query params`.
