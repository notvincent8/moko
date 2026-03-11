"use client"

import { Cross2Icon, DragHandleDots2Icon, GearIcon } from "@radix-ui/react-icons"
import type { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useDebug } from "./DebugContext"

type Position = { x: number; y: number }

const BUTTON_STORAGE_KEY = "moko-debug-button-pos"
const PANEL_STORAGE_KEY = "moko-debug-panel-pos"
const BOUNDARY_PADDING = 8

const clampPosition = (x: number, y: number, width: number, height: number): Position => {
  const maxX = window.innerWidth - width - BOUNDARY_PADDING
  const maxY = window.innerHeight - height - BOUNDARY_PADDING
  return {
    x: Math.max(BOUNDARY_PADDING, Math.min(x, maxX)),
    y: Math.max(BOUNDARY_PADDING, Math.min(y, maxY)),
  }
}

const loadPosition = (key: string, fallback: Position): Position => {
  if (typeof window === "undefined") return fallback
  const saved = localStorage.getItem(key)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      return fallback
    }
  }
  return fallback
}

const savePosition = (key: string, pos: Position) => {
  localStorage.setItem(key, JSON.stringify(pos))
}

type DebugPanelProps = {
  onPopulate: () => void
  onClear: () => void
}

const DebugPanel = ({ onPopulate, onClear }: DebugPanelProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { config, setEnabled, setLatency, setError, setPopulate, resetConfig } = useDebug()

  const [buttonPos, setButtonPos] = useState<Position>(() =>
    loadPosition(BUTTON_STORAGE_KEY, { x: window.innerWidth - 56, y: 80 }),
  )
  const [isDraggingButton, setIsDraggingButton] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const buttonDragStart = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null)
  const buttonClickIntent = useRef(true)

  const [panelPos, setPanelPos] = useState<Position>(() =>
    loadPosition(PANEL_STORAGE_KEY, { x: window.innerWidth - 336, y: 140 }),
  )
  const [isDraggingPanel, setIsDraggingPanel] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const panelDragStart = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null)

  useEffect(() => {
    const handleResize = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        setButtonPos((pos) => clampPosition(pos.x, pos.y, rect.width, rect.height))
      }
      if (panelRef.current && isOpen) {
        const rect = panelRef.current.getBoundingClientRect()
        setPanelPos((pos) => clampPosition(pos.x, pos.y, rect.width, rect.height))
      }
    }

    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isOpen])

  const handleButtonMouseDown = useCallback(
    (e: ReactMouseEvent) => {
      if (e.button !== 0) return
      e.preventDefault()
      buttonClickIntent.current = true
      setIsDraggingButton(true)
      buttonDragStart.current = {
        x: e.clientX,
        y: e.clientY,
        posX: buttonPos.x,
        posY: buttonPos.y,
      }
    },
    [buttonPos],
  )

  const handleButtonTouchStart = useCallback(
    (e: ReactTouchEvent) => {
      if (e.touches.length !== 1) return
      const touch = e.touches[0]
      buttonClickIntent.current = true
      setIsDraggingButton(true)
      buttonDragStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        posX: buttonPos.x,
        posY: buttonPos.y,
      }
    },
    [buttonPos],
  )

  const handlePanelMouseDown = useCallback(
    (e: ReactMouseEvent) => {
      if (e.button !== 0) return
      e.preventDefault()
      setIsDraggingPanel(true)
      panelDragStart.current = {
        x: e.clientX,
        y: e.clientY,
        posX: panelPos.x,
        posY: panelPos.y,
      }
    },
    [panelPos],
  )

  const handlePanelTouchStart = useCallback(
    (e: ReactTouchEvent) => {
      if (e.touches.length !== 1) return
      const touch = e.touches[0]
      setIsDraggingPanel(true)
      panelDragStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        posX: panelPos.x,
        posY: panelPos.y,
      }
    },
    [panelPos],
  )

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingButton && buttonDragStart.current && buttonRef.current) {
        const deltaX = e.clientX - buttonDragStart.current.x
        const deltaY = e.clientY - buttonDragStart.current.y

        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
          buttonClickIntent.current = false
        }

        const newX = buttonDragStart.current.posX + deltaX
        const newY = buttonDragStart.current.posY + deltaY
        const rect = buttonRef.current.getBoundingClientRect()
        setButtonPos(clampPosition(newX, newY, rect.width, rect.height))
      }

      if (isDraggingPanel && panelDragStart.current && panelRef.current) {
        const deltaX = e.clientX - panelDragStart.current.x
        const deltaY = e.clientY - panelDragStart.current.y
        const newX = panelDragStart.current.posX + deltaX
        const newY = panelDragStart.current.posY + deltaY
        const rect = panelRef.current.getBoundingClientRect()
        setPanelPos(clampPosition(newX, newY, rect.width, rect.height))
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      const touch = e.touches[0]

      if (isDraggingButton && buttonDragStart.current && buttonRef.current) {
        const deltaX = touch.clientX - buttonDragStart.current.x
        const deltaY = touch.clientY - buttonDragStart.current.y

        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
          buttonClickIntent.current = false
        }

        const newX = buttonDragStart.current.posX + deltaX
        const newY = buttonDragStart.current.posY + deltaY
        const rect = buttonRef.current.getBoundingClientRect()
        setButtonPos(clampPosition(newX, newY, rect.width, rect.height))
      }

      if (isDraggingPanel && panelDragStart.current && panelRef.current) {
        const deltaX = touch.clientX - panelDragStart.current.x
        const deltaY = touch.clientY - panelDragStart.current.y
        const newX = panelDragStart.current.posX + deltaX
        const newY = panelDragStart.current.posY + deltaY
        const rect = panelRef.current.getBoundingClientRect()
        setPanelPos(clampPosition(newX, newY, rect.width, rect.height))
      }
    }

    const handleEnd = () => {
      if (isDraggingButton) {
        setIsDraggingButton(false)
        if (buttonClickIntent.current) {
          setIsOpen((prev) => !prev)
        }
        savePosition(BUTTON_STORAGE_KEY, buttonPos)
        buttonDragStart.current = null
      }

      if (isDraggingPanel) {
        setIsDraggingPanel(false)
        savePosition(PANEL_STORAGE_KEY, panelPos)
        panelDragStart.current = null
      }
    }

    if (isDraggingButton || isDraggingPanel) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleEnd)
      document.addEventListener("touchmove", handleTouchMove, { passive: true })
      document.addEventListener("touchend", handleEnd)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleEnd)
        document.removeEventListener("touchmove", handleTouchMove)
        document.removeEventListener("touchend", handleEnd)
      }
    }
  }, [isDraggingButton, isDraggingPanel, buttonPos, panelPos])

  if (process.env.NODE_ENV === "production") {
    return null
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onMouseDown={handleButtonMouseDown}
        onTouchStart={handleButtonTouchStart}
        className={`fixed z-50 p-2 rounded-full shadow-lg transition-colors select-none ${
          config.enabled
            ? "bg-amber-500 text-white hover:bg-amber-600"
            : "bg-surface-elevated text-muted-foreground hover:bg-surface hover:text-foreground"
        }`}
        style={{
          left: buttonPos.x,
          top: buttonPos.y,
          cursor: isDraggingButton ? "grabbing" : "grab",
        }}
        aria-label="Toggle debug panel"
      >
        <GearIcon className="w-5 h-5 pointer-events-none" />
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          className="fixed z-50 w-80 max-h-[70vh] overflow-hidden bg-surface-elevated border border-border rounded-lg shadow-xl flex flex-col"
          style={{
            left: panelPos.x,
            top: panelPos.y,
          }}
        >
          <div
            role="toolbar"
            aria-label="Drag to move panel"
            onMouseDown={handlePanelMouseDown}
            onTouchStart={handlePanelTouchStart}
            className="shrink-0 bg-surface-elevated border-b border-border p-3 flex items-center justify-between select-none"
            style={{ cursor: isDraggingPanel ? "grabbing" : "grab" }}
          >
            <div className="flex items-center gap-2">
              <DragHandleDots2Icon className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Debug Panel</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              onMouseDown={(e) => e.stopPropagation()}
              className="p-1 hover:bg-surface rounded"
            >
              <Cross2Icon className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div className="flex items-center justify-between">
              <label htmlFor="debug-enabled" className="text-sm font-medium">
                Debug Mode
              </label>
              <button
                id="debug-enabled"
                type="button"
                onClick={() => setEnabled(!config.enabled)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  config.enabled ? "bg-amber-500" : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    config.enabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {config.enabled && (
              <>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Quick Actions</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={onPopulate}
                      className="flex-1 px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Populate
                    </button>
                    <button
                      type="button"
                      onClick={onClear}
                      className="flex-1 px-3 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Populate Count</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="user-count" className="text-xs text-muted-foreground">
                        User
                      </label>
                      <input
                        id="user-count"
                        type="number"
                        min={0}
                        max={20}
                        value={config.populate.userCount}
                        onChange={(e) => setPopulate("userCount", parseInt(e.target.value, 10) || 0)}
                        className="w-full mt-1 px-2 py-1 text-sm border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="assistant-count" className="text-xs text-muted-foreground">
                        Assistant
                      </label>
                      <input
                        id="assistant-count"
                        type="number"
                        min={0}
                        max={20}
                        value={config.populate.assistantCount}
                        onChange={(e) => setPopulate("assistantCount", parseInt(e.target.value, 10) || 0)}
                        className="w-full mt-1 px-2 py-1 text-sm border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Latency (ms)</p>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">User send</span>
                        <span>{config.latency.user}ms</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={3000}
                        step={100}
                        value={config.latency.user}
                        onChange={(e) => setLatency("user", parseInt(e.target.value, 10))}
                        className="w-full h-1.5 mt-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Assistant start</span>
                        <span>{config.latency.assistant}ms</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={5000}
                        step={100}
                        value={config.latency.assistant}
                        onChange={(e) => setLatency("assistant", parseInt(e.target.value, 10))}
                        className="w-full h-1.5 mt-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Typing speed</span>
                        <span>{config.latency.typing}ms/char</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={config.latency.typing}
                        onChange={(e) => setLatency("typing", parseInt(e.target.value, 10))}
                        className="w-full h-1.5 mt-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Error Triggers</p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.errors.userSendFails}
                        onChange={(e) => setError("userSendFails", e.target.checked)}
                        className="w-4 h-4 rounded border-border"
                      />
                      <span className="text-sm">User send fails</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.errors.assistantFails}
                        onChange={(e) => setError("assistantFails", e.target.checked)}
                        className="w-4 h-4 rounded border-border"
                      />
                      <span className="text-sm">Assistant response fails</span>
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={resetConfig}
                  className="w-full px-3 py-2 text-sm text-muted-foreground border border-border rounded hover:bg-surface transition-colors"
                >
                  Reset to Defaults
                </button>
              </>
            )}
          </div>

          <div className="shrink-0 bg-surface border-t border-border px-3 py-2">
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${config.enabled ? "bg-amber-500 animate-pulse" : "bg-gray-400"}`}
              />
              <span className="text-muted-foreground">{config.enabled ? "Debug mode active" : "Production mode"}</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DebugPanel
