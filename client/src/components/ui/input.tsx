import * as React from "react"
import { cn } from "@/utils/cn"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-input border border-[var(--color-rule-2)] bg-[var(--color-paper)] px-3 py-1.5 text-sm text-[var(--color-ink)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] duration-100 ease-out placeholder:text-[var(--color-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
