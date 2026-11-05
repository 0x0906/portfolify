import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { X, Image as ImageIcon, ImageOff, Link2 } from "lucide-react"

interface ImageUploadFieldProps {
  label: string
  value?: string
  onChange: (url: string) => void
  placeholder?: string
  accept?: string
  description?: string
  isIcon?: boolean
}

export function ImageUploadField({
  label,
  value = "",
  onChange,
  placeholder = "https://example.com/image.jpg",
  description,
  isIcon = false,
}: ImageUploadFieldProps) {
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setImageError(false)
  }, [value])

  const isValidUrl = Boolean(value && /^(https?:\/\/|\/)/i.test(value.trim()))

  const handleClear = () => {
    onChange("")
    setImageError(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">{label}</label>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition"
          >
            <X className="h-3 w-3" /> Clear Link
          </button>
        )}
      </div>

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
          <Link2 className="h-4 w-4" />
        </div>
        <Input
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setImageError(false)
          }}
          placeholder={placeholder}
          className="pl-9 w-full text-sm"
        />
      </div>

      {value && isValidUrl && (
        <div className="flex items-center gap-3 p-2.5 rounded-input border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
          <div className="relative shrink-0 overflow-hidden rounded-input border border-[var(--color-rule-2)] bg-[var(--color-paper)] flex items-center justify-center">
            {imageError ? (
              <div className={isIcon ? "w-8 h-8 flex items-center justify-center text-muted-foreground" : "w-16 h-16 flex flex-col items-center justify-center text-muted-foreground p-1"}>
                <ImageOff className="h-4 w-4" />
              </div>
            ) : (
              <img
                src={value.trim()}
                alt={label}
                className={isIcon ? "w-8 h-8 object-contain" : "w-16 h-16 object-cover"}
                onError={() => setImageError(true)}
              />
            )}
          </div>
          <div className="flex-1 min-w-0 text-xs">
            {imageError ? (
              <span className="text-destructive font-medium">Image preview failed to load. Please verify the URL points directly to an image.</span>
            ) : (
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <ImageIcon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                Image link verified & previewing
              </span>
            )}
            <p className="font-mono text-[11px] text-muted-foreground/80 truncate mt-0.5">{value}</p>
          </div>
        </div>
      )}
    </div>
  )
}
