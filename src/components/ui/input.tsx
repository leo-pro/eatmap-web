import * as React from 'react'
import { cn } from '@/lib/cn'

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'flex h-11 w-full rounded-2xl border border-input bg-white/90 px-4 py-2 text-sm text-foreground shadow-sm transition-all outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15',
          className,
        )}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'

export { Input }

