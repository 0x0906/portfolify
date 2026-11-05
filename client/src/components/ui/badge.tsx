import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils/cn"

const badgeVariants = cva(
  "inline-flex items-center rounded-input border px-2 py-0.5 text-[11px] font-medium transition-[background-color,border-color,color] duration-100 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] select-none motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--color-ink)] text-[var(--color-paper)]",
        secondary: "border-[var(--color-rule)] bg-[var(--color-paper-3)] text-[var(--color-ink-2)]",
        accent: "border-transparent bg-[var(--color-accent)] text-[var(--color-accent-ink)]",
        outline: "border-[var(--color-rule-2)] text-[var(--color-ink)] bg-transparent",
        success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        destructive: "border-transparent bg-[var(--color-error)] text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}
