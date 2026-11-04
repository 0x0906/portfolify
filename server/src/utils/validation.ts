const TYPO_TLDS = new Set(["cpm", "con", "cm", "cmo", "ocm", "comm", "coom"])
const TYPO_DOMAINS = new Set([
  "gmail.cpm",
  "gmail.con",
  "gmail.cm",
  "yahoo.cpm",
  "yahoo.con",
  "hotmail.cpm",
  "hotmail.con",
  "outlook.cpm",
  "outlook.con",
  "icloud.cpm",
])

export function validateEmail(rawEmail: string): { valid: boolean; error?: string } {
  if (!rawEmail || typeof rawEmail !== "string") {
    return { valid: false, error: "Please enter your email address." }
  }

  const email = rawEmail.trim().toLowerCase()

  if (email.length > 254) {
    return { valid: false, error: "Email address is too long." }
  }

  if (email.includes("+")) {
    return { valid: false, error: "Plus addressing ('+') is not permitted to prevent spoofing and duplicate accounts." }
  }

  const parts = email.split("@")
  if (parts.length !== 2) {
    return { valid: false, error: "Please enter a valid email address with a single '@'." }
  }

  const [local, domain] = parts

  if (!local || local.length === 0 || local.length > 64) {
    return { valid: false, error: "Please enter a valid email username." }
  }

  if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) {
    return { valid: false, error: "Email cannot start, end, or contain consecutive dots." }
  }

  const localRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+$/
  if (!localRegex.test(local)) {
    return { valid: false, error: "Email contains invalid characters." }
  }

  if (!domain || domain.length < 3 || domain.length > 253) {
    return { valid: false, error: "Please enter a valid email domain." }
  }

  if (domain.startsWith(".") || domain.endsWith(".") || domain.includes("..")) {
    return { valid: false, error: "Email domain cannot start, end, or contain consecutive dots." }
  }

  if (TYPO_DOMAINS.has(domain)) {
    return { valid: false, error: `Invalid domain '${domain}'. Did you mean '${domain.replace(/\.cpm|\.con|\.cm$/, ".com")}'?` }
  }

  const domainParts = domain.split(".")
  if (domainParts.length < 2) {
    return { valid: false, error: "Email domain must include a top-level domain (e.g. .com)." }
  }

  const tld = domainParts[domainParts.length - 1]
  if (TYPO_TLDS.has(tld)) {
    return { valid: false, error: `Invalid top-level domain '.${tld}'. Did you mean '.com'?` }
  }

  if (!/^[a-zA-Z]{2,24}$/.test(tld)) {
    return { valid: false, error: "Invalid top-level domain format." }
  }

  for (const label of domainParts) {
    if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(label)) {
      return { valid: false, error: "Email domain contains invalid characters." }
    }
  }

  return { valid: true }
}
