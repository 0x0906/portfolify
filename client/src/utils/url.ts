export function sanitizeLink(url: string | null | undefined): string {
  if (!url) return "#"
  const trimmed = url.trim()
  if (/^(?:https?:\/\/|mailto:|tel:|\/)/i.test(trimmed)) {
    return trimmed
  }
  return "#"
}

export function sanitizeImg(url: string | null | undefined): string {
  if (!url) return ""
  const trimmed = url.trim()
  if (/^(?:https?:\/\/|\/)/i.test(trimmed)) {
    return trimmed
  }
  return ""
}
