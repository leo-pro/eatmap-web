import type { PropsWithChildren } from 'react'
import { Link } from '@tanstack/react-router'

const shellContainerClassName = 'mx-auto w-full max-w-5xl px-4 sm:px-6'

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className={`${shellContainerClassName} flex items-center justify-between py-4`}>
          <Link to="/" className="min-w-0">
            <div>
              <p className="font-serif text-4xl leading-none tracking-[-0.04em] text-slate-600">
                eatmap
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                restaurant discovery lab
              </p>
            </div>
          </Link>
          <p className="hidden text-xs uppercase tracking-[0.24em] text-muted-foreground sm:block">
            TCC frontend experiment
          </p>
        </div>
      </header>
      <main className={`${shellContainerClassName} py-8 sm:py-10`}>{children}</main>
    </div>
  )
}
