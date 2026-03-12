import { startTransition, useCallback, useMemo, useOptimistic, useRef, useState } from "react"
import type { AssistantMessage } from "@/app/component/bubbles/AssistantBubble"
import type { UserMessage } from "@/app/component/bubbles/UserBubble"
import type { DebugConfig } from "@/app/debug/config"
import { generateMockResponse, generatePopulatedMessages, sleep } from "@/app/debug/mockGenerator"

type BaseItem<TRole extends string, TStatus extends string> = {
  id: string
  content: string
  sentAt?: Date
  role: TRole
  error?: boolean
  debug?: boolean
} & Record<TStatus, boolean>

type UserItem = BaseItem<"user", "pending">
type AssistantItem = BaseItem<"assistant", "streaming">
export type Item = UserItem | AssistantItem

type AssistantUpdates = Partial<Pick<AssistantItem, "content" | "streaming" | "error" | "sentAt">>

type UseChatOptions = {
  debugConfig?: DebugConfig
}

type FailedUserMessage = {
  id: string
  content: string
}

const useChat = (options?: UseChatOptions) => {
  const debugConfig = options?.debugConfig
  const isDebugMode = debugConfig?.enabled ?? false

  const [items, setItems] = useState<Item[]>([])
  const [isPending, setIsPending] = useState<boolean>(false)
  const [failedUserMessage, setFailedUserMessage] = useState<FailedUserMessage | null>(null)
  const [failedAssistantId, setFailedAssistantId] = useState<string | null>(null)
  const [optimisticItems, addOptimisticItem] = useOptimistic<Item[], Item>(items, (current, newItem) => {
    if (current.some((item) => item.id === newItem.id)) {
      return current
    }
    return [...current, newItem]
  })

  const sendMessageRef = useRef<(message: string) => void>(() => {})

  const userMessages = useMemo<UserMessage[]>(
    () =>
      optimisticItems
        .filter((m): m is UserItem => m.role === "user")
        .map(({ id, content, pending, error, debug }) => ({ id, content, pending, error, debug })),
    [optimisticItems],
  )

  const assistantMessages = useMemo<AssistantMessage[]>(
    () =>
      optimisticItems
        .filter((m): m is AssistantItem => m.role === "assistant")
        .map(({ id, content, streaming, error, debug }) => ({ id, content, streaming, error, debug })),
    [optimisticItems],
  )

  const getCurrentHistory = useCallback(
    () =>
      items.filter(
        (item) =>
          !item.error && !(item.role === "user" && item.pending) && !(item.role === "assistant" && item.streaming),
      ),
    [items],
  )

  const updateAssistant = useCallback((id: string, updates: AssistantUpdates) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id && item.role === "assistant" ? { ...item, ...updates } : item)),
    )
  }, [])

  const populateMessages = useCallback(() => {
    if (!debugConfig) return
    const populated = generatePopulatedMessages(debugConfig.populate.userCount, debugConfig.populate.assistantCount)
    setItems(populated.map((p) => ({ ...p, debug: true })))
  }, [debugConfig])

  const clearMessages = useCallback(() => {
    setItems([])
    setFailedUserMessage(null)
    setFailedAssistantId(null)
  }, [])

  const retryUserMessage = useCallback(() => {
    if (!failedUserMessage) return

    const messageContent = failedUserMessage.content
    const messageId = failedUserMessage.id

    setItems((prev) => prev.filter((i) => i.id !== messageId))
    setFailedUserMessage(null)

    sendMessageRef.current(messageContent)
  }, [failedUserMessage])

  const cancelUserMessage = useCallback(() => {
    if (!failedUserMessage) return

    setItems((prev) => prev.filter((i) => i.id !== failedUserMessage.id))
    setFailedUserMessage(null)
  }, [failedUserMessage])

  const dismissAssistantError = useCallback(() => {
    if (!failedAssistantId) return

    setItems((prev) => prev.filter((i) => i.id !== failedAssistantId))
    setFailedAssistantId(null)
  }, [failedAssistantId])

  const sendDebugMessage = useCallback(
    async (message: string) => {
      if (!debugConfig) return

      if (failedAssistantId) {
        setItems((prev) => prev.filter((i) => i.id !== failedAssistantId))
        setFailedAssistantId(null)
      }

      setIsPending(true)

      const userItem: UserItem = {
        id: crypto.randomUUID(),
        content: message,
        role: "user",
        pending: true,
        debug: true,
      }

      const assistantId = crypto.randomUUID()

      startTransition(async () => {
        addOptimisticItem(userItem)

        await sleep(debugConfig.latency.user)

        if (debugConfig.errors.userSendFails) {
          setItems((prev) => [
            ...prev.filter((i) => i.id !== userItem.id),
            { ...userItem, pending: false, error: true },
          ])
          setFailedUserMessage({ id: userItem.id, content: message })
          setIsPending(false)
          return
        }

        setItems((prev) => [...prev, { ...userItem, pending: false, sentAt: new Date() }])

        await sleep(debugConfig.latency.assistant)

        setItems((prev) => [...prev, { id: assistantId, content: "", role: "assistant", streaming: true, debug: true }])

        if (debugConfig.errors.assistantFails) {
          await sleep(500)
          setItems((prev) =>
            prev.map((item) =>
              item.id === assistantId ? { ...item, content: "", streaming: false, error: true } : item,
            ),
          )
          setFailedAssistantId(assistantId)
          setIsPending(false)
          return
        }

        const mockResponse = generateMockResponse()
        const typingDelay = debugConfig.latency.typing

        for (let i = 0; i <= mockResponse.length; i++) {
          const partial = mockResponse.slice(0, i)
          setItems((prev) => prev.map((item) => (item.id === assistantId ? { ...item, content: partial } : item)))
          if (i < mockResponse.length) {
            await sleep(typingDelay)
          }
        }

        updateAssistant(assistantId, { streaming: false, sentAt: new Date() })
        setIsPending(false)
      })
    },
    [debugConfig, addOptimisticItem, updateAssistant, failedAssistantId],
  )

  const sendRealMessage = useCallback(
    (message: string) => {
      if (failedAssistantId) {
        setItems((prev) => prev.filter((i) => i.id !== failedAssistantId))
        setFailedAssistantId(null)
      }

      setIsPending(true)

      const userItem: UserItem = {
        id: crypto.randomUUID(),
        content: message,
        role: "user",
        pending: true,
      }

      const assistantId = crypto.randomUUID()

      startTransition(async () => {
        addOptimisticItem(userItem)

        const history: { content: string; role: "user" | "assistant" }[] = getCurrentHistory()
          .filter((i) => !i.debug)
          .map((item) => ({
            content: item.content,
            role: item.role,
          }))

        try {
          console.log(history)
          const response = await fetch("/api/chat", {
            method: "POST",
            body: JSON.stringify({
              message,
              history,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          })

          if (!response.ok || !response.body) {
            throw new Error("Request failed")
          }

          const reader = response.body.getReader()
          const decoder = new TextDecoder()
          let buffer = ""

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split("\n")
            buffer = lines.pop() || ""
            for (const line of lines) {
              if (!line.trim()) continue
              const event = JSON.parse(line)
              switch (event.type) {
                case "start":
                  setItems((prev) => [...prev, { ...userItem, pending: false, sentAt: new Date() }])
                  break
                case "typing":
                  setItems((prev) => [...prev, { id: assistantId, content: "", role: "assistant", streaming: true }])
                  break
                case "final":
                  setItems((prev) =>
                    prev.map((item) => (item.id === assistantId ? { ...item, content: event.text } : item)),
                  )
                  break
                case "end":
                  updateAssistant(assistantId, { streaming: false, sentAt: new Date() })
                  break
              }
            }
          }
        } catch {
          setItems((prev) => [
            ...prev.filter((i) => i.id !== userItem.id),
            { ...userItem, pending: false, error: true },
          ])
          setFailedUserMessage({ id: userItem.id, content: message })
        } finally {
          setIsPending(false)
        }
      })
    },
    [addOptimisticItem, updateAssistant, failedAssistantId, getCurrentHistory],
  )

  const sendMessage = useCallback(
    (message: string) => {
      if (isDebugMode) {
        sendDebugMessage(message).catch()
      } else {
        sendRealMessage(message)
      }
    },
    [isDebugMode, sendDebugMessage, sendRealMessage],
  )

  sendMessageRef.current = sendMessage

  const hasUserError = failedUserMessage !== null
  const hasAssistantError = failedAssistantId !== null

  return {
    userMessages,
    assistantMessages,
    history: getCurrentHistory(),
    sendMessage,
    isPending,
    hasUserError,
    hasAssistantError,
    failedUserMessage,
    retryUserMessage,
    cancelUserMessage,
    dismissAssistantError,
    populateMessages,
    clearMessages,
    isDebugMode,
  }
}

export default useChat
