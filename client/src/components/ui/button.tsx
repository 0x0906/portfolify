import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-input text-sm font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-100 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-paper)] disabled:pointer-events-none disabled:opacity-50 select-none motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-accent)] text-[var(--color-accent-ink)] border border-[var(--color-accent-edge)] shadow-[var(--shadow-key-accent)] hover:-translate-y-px active:translate-y-0.5 active:shadow-[var(--shadow-key-press)]",
        destructive:
          "bg-[var(--color-error)] text-[var(--color-accent-ink)] border border-transparent shadow-sm hover:opacity-90 active:translate-y-0.5",
        outline:
          "bg-[var(--color-key-face)] text-[var(--color-ink)] border border-[var(--color-rule-2)] shadow-[var(--shadow-key)] hover:-translate-y-px active:translate-y-0.5 active:shadow-[var(--shadow-key-press)]",
        secondary:
          "bg-[var(--color-paper-3)] text-[var(--color-ink-2)] border border-[var(--color-rule)] hover:bg-[var(--color-paper-2)] active:translate-y-0.5",
        ghost:
          "text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-2)] active:bg-[var(--color-paper-3)]",
        link:
          "text-[var(--color-accent)] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-input px-3 text-xs",
        lg: "h-11 rounded-input px-6 text-sm font-semibold",
        icon: "h-8 w-8 rounded-input p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"
