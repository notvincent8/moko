"use client"

import { type ReactNode, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const CONSENT_KEY = "moko_consent"
const CONSENT_VERSION = 1

type ConsentData = {
  version: number
  timestamp: number
}

type ConsentGateProps = {
  children: ReactNode
}

const ConsentGate = ({ children }: ConsentGateProps) => {
  const [hasConsented, setHasConsented] = useState<boolean | null>(null)
  const [isExiting, setIsExiting] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY)
      if (stored) {
        const data: ConsentData = JSON.parse(stored)
        if (data.version >= CONSENT_VERSION) {
          setHasConsented(true)
          return
        }
      }
      setHasConsented(false)
      // Trigger entrance animation
      requestAnimationFrame(() => setIsVisible(true))
    } catch {
      setHasConsented(false)
      requestAnimationFrame(() => setIsVisible(true))
    }
  }, [])

  const handleConsent = () => {
    const data: ConsentData = {
      version: CONSENT_VERSION,
      timestamp: Date.now(),
    }
    localStorage.setItem(CONSENT_KEY, JSON.stringify(data))
    setIsExiting(true)
    setTimeout(() => setHasConsented(true), 500)
  }

  // Loading state - show nothing to prevent flash
  if (hasConsented === null) {
    return null
  }

  // Already consented - show app
  if (hasConsented) {
    return <>{children}</>
  }

  // Show consent gate
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-6 transition-opacity duration-500",
        isExiting ? "opacity-0" : "opacity-100",
      )}
    >
      {/* Moko entity - the mysterious black box */}
      <div
        className={cn(
          "mb-8 transition-all duration-500 ease-out",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90",
        )}
        style={{ transitionDelay: "100ms" }}
      >
        <div className="w-6 h-12 bg-ink dark:bg-cream rounded-sm" aria-hidden="true" />
      </div>

      {/* Title */}
      <h1
        className={cn(
          "font-display text-3xl sm:text-4xl font-bold text-foreground mb-2 tracking-tight transition-all duration-500 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        )}
        style={{ transitionDelay: "200ms" }}
      >
        Moko
      </h1>

      <p
        className={cn(
          "text-muted-foreground text-sm mb-10 italic transition-all duration-500 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        )}
        style={{ transitionDelay: "300ms" }}
      >
        La mystérieuse boîte noire
      </p>

      {/* Consent card */}
      <div
        className={cn(
          "w-full max-w-md bg-surface-elevated border border-border rounded-lg p-6 shadow-lg transition-all duration-500 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        )}
        style={{ transitionDelay: "400ms" }}
      >
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">Avant de commencer</h2>

        <ul className="space-y-3 text-sm text-foreground/90 mb-6">
          <li className="flex gap-3">
            <span className="text-flame shrink-0" aria-hidden="true">
              ~
            </span>
            <span>
              <strong>Moko est une IA</strong>, pas un humain. Les réponses sont générées automatiquement.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-flame shrink-0" aria-hidden="true">
              ~
            </span>
            <span>
              <strong>Ce n'est pas un professionnel.</strong> Moko ne remplace pas un médecin, psychologue ou tout autre
              expert.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-flame shrink-0" aria-hidden="true">
              ~
            </span>
            <span>
              <strong>Tes messages sont envoyés à Anthropic</strong> (Claude) pour générer les réponses. Moko ne stocke
              rien, mais Anthropic peut traiter les données selon sa{" "}
              <a
                href="https://www.anthropic.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-flame hover:underline"
              >
                politique de confidentialité
              </a>
              .
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-flame shrink-0" aria-hidden="true">
              ~
            </span>
            <span>
              <strong>Ne partage pas d'informations personnelles</strong> (nom complet, adresse, téléphone, etc.).
            </span>
          </li>
        </ul>

        <button
          type="button"
          onClick={handleConsent}
          className="w-full py-3 px-4 bg-flame text-white font-semibold rounded-md transition-all duration-200 hover:bg-flame-hover active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-flame focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          J'ai compris, entrer
        </button>
      </div>

      {/* Footer links */}
      <div
        className={cn(
          "mt-8 flex gap-4 text-xs text-muted-foreground transition-opacity duration-500",
          isVisible ? "opacity-100" : "opacity-0",
        )}
        style={{ transitionDelay: "600ms" }}
      >
        <a href="/about" className="hover:text-foreground transition-colors">
          À propos
        </a>
        <span aria-hidden="true">·</span>
        <a href="/resources" className="hover:text-foreground transition-colors">
          Ressources
        </a>
      </div>
    </div>
  )
}

export default ConsentGate
