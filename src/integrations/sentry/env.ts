const DEFAULT_APP_ENV = import.meta.env.MODE
const DEFAULT_APP_NAME = 'eatmap-web'
const DEFAULT_TRACES_SAMPLE_RATE = 1

function parseOptionalRate(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback
  }

  const parsedValue = Number(value)

  if (Number.isNaN(parsedValue) || parsedValue < 0 || parsedValue > 1) {
    throw new Error(
      'VITE_SENTRY_TRACES_SAMPLE_RATE must be a number between 0 and 1.',
    )
  }

  return parsedValue
}

export type SentryPublicEnv = {
  dsn: string | null
  enabled: boolean
  appEnv: string
  appName: string
  appVersion: string
  tracesSampleRate: number
}

export function getSentryEnv(): SentryPublicEnv {
  const dsn = import.meta.env.VITE_SENTRY_DSN?.trim() || null
  const appEnv = import.meta.env.VITE_APP_ENV?.trim() || DEFAULT_APP_ENV
  const appName = import.meta.env.VITE_APP_NAME?.trim() || DEFAULT_APP_NAME
  const appVersion = import.meta.env.VITE_APP_VERSION?.trim() || __APP_VERSION__
  const tracesSampleRate = parseOptionalRate(
    import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE,
    DEFAULT_TRACES_SAMPLE_RATE,
  )

  return {
    dsn,
    enabled: Boolean(dsn),
    appEnv,
    appName,
    appVersion,
    tracesSampleRate,
  }
}
