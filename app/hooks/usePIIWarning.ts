"use client"

import { useCallback, useState } from "react"
import { detectSensitivePII, type PIIMatch } from "@/lib/piiDetect"

const PII_DISMISS_KEY = "moko_pii_dismiss"

export type PIIWarningState = {
  message: string
  matches: PIIMatch[]
} | null

const isPIIDismissed = () => {
  if (typeof window === "undefined") return false
  try {
    return localStorage.getItem(PII_DISMISS_KEY) === "true"
  } catch {
    return false
  }
}

const dismissPIIForever = () => {
  try {
    localStorage.setItem(PII_DISMISS_KEY, "true")
  } catch {
    // Ignore storage errors
  }
}

export const usePIIWarning = (onSend: (message: string) => void) => {
  const [piiWarning, setPiiWarning] = useState<PIIWarningState>(null)

  const checkAndSend = useCallback(
    (message: string) => {
      if (!isPIIDismissed()) {
        const matches = detectSensitivePII(message)
        if (matches.length > 0) {
          setPiiWarning({ message, matches })
          return
        }
      }
      onSend(message)
    },
    [onSend],
  )

  const sendAnyway = useCallback(() => {
    if (piiWarning) {
      onSend(piiWarning.message)
      setPiiWarning(null)
    }
  }, [piiWarning, onSend])

  const sendAndDismissForever = useCallback(() => {
    dismissPIIForever()
    if (piiWarning) {
      onSend(piiWarning.message)
      setPiiWarning(null)
    }
  }, [piiWarning, onSend])

  const cancelWarning = useCallback(() => {
    setPiiWarning(null)
  }, [])

  return {
    piiWarning,
    checkAndSend,
    sendAnyway,
    sendAndDismissForever,
    cancelWarning,
  }
}
