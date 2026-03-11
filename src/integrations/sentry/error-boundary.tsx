import type { PropsWithChildren } from 'react'
import * as Sentry from '@sentry/react'

export function SentryAppBoundary({ children }: PropsWithChildren) {
  return (
    <Sentry.ErrorBoundary
      beforeCapture={(scope) => {
        scope.setContext('boundary', {
          level: 'app',
        })
      }}
      fallback={({ resetError }) => (
        <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center gap-4 px-4">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
              application error
            </p>
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-foreground">
              Algo deu errado.
            </h1>
            <p className="text-sm leading-7 text-muted-foreground">
              O erro foi enviado ao Sentry. Voce pode tentar renderizar a tela novamente ou
              recarregar a aplicacao.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
              onClick={resetError}
              type="button"
            >
              Tentar novamente
            </button>

            <button
              className="rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              onClick={() => window.location.reload()}
              type="button"
            >
              Recarregar pagina
            </button>
          </div>
        </div>
      )}
    >
      {children}
    </Sentry.ErrorBoundary>
  )
}
