import * as React from "react"
import { User } from "lucide-react"
import { cn } from "@/utils/cn"

export interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null
  name?: string | null
  size?: "sm" | "md" | "lg"
}

export function UserAvatar({
  src,
  name,
  size = "md",
  className,
  ...props
}: UserAvatarProps) {
  const [imageError, setImageError] = React.useState(false)

  React.useEffect(() => {
    setImageError(false)
  }, [src])

  const sizeClasses = {
    sm: "h-7 w-7 text-xs",
    md: "h-8 w-8 text-xs",
    lg: "h-14 w-14 text-base",
  }

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-7 w-7",
  }

  const trimmedSrc = src?.trim()
  const showImage = Boolean(trimmedSrc && !imageError)

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden border border-[var(--color-rule-2)] bg-[var(--color-paper-3)] text-[var(--color-ink)] select-none",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {showImage ? (
        <img
          src={trimmedSrc}
          alt={name ? `${name}'s avatar` : "Profile picture"}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <User className={cn("text-[var(--color-muted)]", iconSizes[size])} aria-hidden="true" />
      )}
    </div>
  )
}
