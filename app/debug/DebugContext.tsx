"use client"

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react"
import { DEFAULT_DEBUG_CONFIG, type DebugConfig } from "./config"

type DebugContextValue = {
  config: DebugConfig
  setEnabled: (enabled: boolean) => void
  setLatency: (key: keyof DebugConfig["latency"], value: number) => void
  setError: (key: keyof DebugConfig["errors"], value: boolean) => void
  setPopulate: (key: keyof DebugConfig["populate"], value: number) => void
  resetConfig: () => void
}

const DebugContext = createContext<DebugContextValue | null>(null)

export const DebugProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<DebugConfig>(() => {
    if (typeof window === "undefined") return DEFAULT_DEBUG_CONFIG
    const saved = localStorage.getItem("moko-debug-config")
    if (saved) {
      try {
        return { ...DEFAULT_DEBUG_CONFIG, ...JSON.parse(saved) }
      } catch {
        return DEFAULT_DEBUG_CONFIG
      }
    }
    return DEFAULT_DEBUG_CONFIG
  })

  const persistConfig = useCallback((newConfig: DebugConfig) => {
    setConfig(newConfig)
    localStorage.setItem("moko-debug-config", JSON.stringify(newConfig))
  }, [])

  const setEnabled = useCallback(
    (enabled: boolean) => {
      persistConfig({ ...config, enabled })
    },
    [config, persistConfig],
  )

  const setLatency = useCallback(
    (key: keyof DebugConfig["latency"], value: number) => {
      persistConfig({ ...config, latency: { ...config.latency, [key]: value } })
    },
    [config, persistConfig],
  )

  const setError = useCallback(
    (key: keyof DebugConfig["errors"], value: boolean) => {
      persistConfig({ ...config, errors: { ...config.errors, [key]: value } })
    },
    [config, persistConfig],
  )

  const setPopulate = useCallback(
    (key: keyof DebugConfig["populate"], value: number) => {
      persistConfig({ ...config, populate: { ...config.populate, [key]: value } })
    },
    [config, persistConfig],
  )

  const resetConfig = useCallback(() => {
    persistConfig(DEFAULT_DEBUG_CONFIG)
  }, [persistConfig])

  const value = useMemo(
    () => ({
      config,
      setEnabled,
      setLatency,
      setError,
      setPopulate,
      resetConfig,
    }),
    [config, setEnabled, setLatency, setError, setPopulate, resetConfig],
  )

  return <DebugContext.Provider value={value}>{children}</DebugContext.Provider>
}

export const useDebug = () => {
  const context = useContext(DebugContext)
  if (!context) {
    throw new Error("useDebug must be used within a DebugProvider")
  }
  return context
}

export const useDebugConfig = () => {
  const context = useContext(DebugContext)
  return context?.config ?? DEFAULT_DEBUG_CONFIG
}
