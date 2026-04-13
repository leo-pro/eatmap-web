import type { PropsWithChildren } from 'react'
import { Link } from '@tanstack/react-router'
import { Compass, MapPin } from 'lucide-react'

const shellContainerClassName = 'mx-auto w-full max-w-5xl px-4 sm:px-6'

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <header className="sticky top-0 z-30 border-b border-white/50 bg-background/80 backdrop-blur-2xl">
        <div className={`${shellContainerClassName} flex items-center justify-between py-4`}>
          <div
            className="group inline-flex min-w-0 items-center gap-3 rounded-[1.5rem] border border-white/60 bg-white/60 px-3 py-2 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.45)] backdrop-blur-xl transition-transform duration-200 hover:-translate-y-0.5"
          >
            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-[1.2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(52,127,226,0.18),rgba(255,255,255,0.95),rgba(108,181,255,0.2))] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_10px_24px_-16px_rgba(37,99,235,0.55)]">
              <div className="absolute inset-x-2 top-1.5 h-3 rounded-full bg-white/60 blur-md" />
              <MapPin className="h-5 w-5 text-primary" strokeWidth={2.2} />
            </div>

            <div className="min-w-0">
              <p className="text-[1.7rem] font-semibold leading-none tracking-[-0.05em] text-foreground">
                Eatmap
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-white/60 bg-white/50 px-3 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground shadow-[0_12px_30px_-24px_rgba(15,23,42,0.4)] backdrop-blur-xl sm:flex">
            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_0_4px_rgba(52,127,226,0.12)]" />
            Descubra novos restaurantes todos os dias
          </div>
        </div>
      </header>

      <main className={`${shellContainerClassName} relative py-8 sm:py-10`}>{children}</main>
    </div>
  )
}
