/**
 * Lightweight client-side PII detection for sensitive data only.
 * Detects: credit cards, French SSN (NIR), phone numbers, emails.
 * Does NOT detect names (too many false positives).
 */

export type PIIMatch = {
  type: "email" | "phone" | "credit_card" | "ssn_fr"
  value: string
  start: number
  end: number
}

// Patterns
const PATTERNS = {
  // Email: standard format
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,

  // Phone numbers: French formats + international
  // 06 12 34 56 78, 0612345678, +33 6 12 34 56 78, etc.
  phone: /(?:\+33|0033|0)\s*[1-9](?:[\s.-]*\d{2}){4}/g,

  // Credit card: 13-19 digits with optional spaces/dashes
  // Covers Visa, Mastercard, Amex, etc.
  credit_card: /\b(?:\d[\s-]*){13,19}\b/g,

  // French SSN (NIR): 15 digits, starts with 1 or 2
  // Format: 1 85 12 75 108 123 45
  ssn_fr: /\b[12]\s*\d{2}\s*(?:0[1-9]|1[0-2]|[2-9]\d)\s*(?:\d{2}|2[AB])\s*\d{3}\s*\d{3}\s*\d{2}\b/gi,
} as const

/**
 * Detects sensitive PII in a message.
 * Returns array of matches with positions for highlighting.
 */
export const detectSensitivePII = (message: string): PIIMatch[] => {
  const matches: PIIMatch[] = []

  for (const [type, pattern] of Object.entries(PATTERNS)) {
    // Reset regex state
    pattern.lastIndex = 0

    let match: RegExpExecArray | null
    // biome-ignore lint/suspicious/noAssignInExpressions: Intentional use of assignment in while condition
    while ((match = pattern.exec(message)) !== null) {
      matches.push({
        type: type as PIIMatch["type"],
        value: match[0],
        start: match.index,
        end: match.index + match[0].length,
      })
    }
  }

  // Sort by position
  matches.sort((a, b) => a.start - b.start)

  return matches
}

/**
 * Returns true if the message contains any sensitive PII.
 */
export const hasSensitivePII = (message: string): boolean => {
  for (const pattern of Object.values(PATTERNS)) {
    pattern.lastIndex = 0
    if (pattern.test(message)) return true
  }
  return false
}
