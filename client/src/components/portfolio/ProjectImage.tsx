import { useState } from "react"
import { sanitizeImg } from "@/utils/url"
import { cn } from "@/utils/cn"

interface ProjectImageProps {
  src?: string | null
  alt?: string
  className?: string
  title?: string
  fallback?: boolean
}

export function ProjectImage({
  src,
  alt = "Project preview",
  className = "",
}: ProjectImageProps) {
  const [hasError, setHasError] = useState(false)
  const safeSrc = sanitizeImg(src)

  if (!safeSrc || hasError) {
    return null
  }

  return (
    <img
      src={safeSrc}
      alt={alt}
      className={cn(
        "w-full h-48 sm:h-56 object-cover border-b border-zinc-200 dark:border-zinc-800",
        className
      )}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  )
}
