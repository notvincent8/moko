import { startTransition, useCallback, useMemo, useOptimistic, useState } from "react"
import type { AssistantMessage } from "@/app/component/bubbles/AssistantBubble"
import type { UserMessage } from "@/app/component/bubbles/UserBubble"

type BaseItem<TRole extends string, TStatus extends string> = {
  id: string
  content: string
  role: TRole
  error?: boolean
} & Record<TStatus, boolean>

type UserItem = BaseItem<"user", "pending">
type AssistantItem = BaseItem<"assistant", "streaming">
export type Item = UserItem | AssistantItem

type AssistantUpdates = Partial<Pick<AssistantItem, "content" | "streaming" | "error">>

const useChat = () => {
  const [items, setItems] = useState<Item[]>([])
  const [isPending, setIsPending] = useState<boolean>(false)
  const [optimisticItems, addOptimisticItem] = useOptimistic<Item[], Item>(items, (current, newItem) => {
    if (current.some((item) => item.id === newItem.id)) {
      return current
    }
    return [...current, newItem]
  })

  const userMessages = useMemo<UserMessage[]>(
    () =>
      optimisticItems
        .filter((m): m is UserItem => m.role === "user")
        .map(({ id, content, pending, error }) => ({ id, content, pending, error })),
    [optimisticItems],
  )

  const assistantMessages = useMemo<AssistantMessage[]>(
    () =>
      optimisticItems
        .filter((m): m is AssistantItem => m.role === "assistant")
        .map(({ id, content, streaming, error }) => ({ id, content, streaming, error })),
    [optimisticItems],
  )

  const getCurrentHistory = useCallback(() => {
    return items.filter(
      (item) =>
        !item.error && !(item.role === "user" && item.pending) && !(item.role === "assistant" && item.streaming),
    )
  }, [items])

  const updateAssistant = useCallback((id: string, updates: AssistantUpdates) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id && item.role === "assistant" ? { ...item, ...updates } : item)),
    )
  }, [])

  const sendMessage = useCallback(
    (message: string) => {
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

        let history: { content: string; role: "user" | "assistant" }[] = []
        setItems((prev) => {
          history = prev
            .filter((item) => !item.error && !(item.role === "user" && item.pending))
            .map(({ content, role }) => ({ content, role }))
          return prev
        })

        try {
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
            throw new Error("Network response was not ok")
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
                  setItems((prev) => [...prev, { ...userItem, pending: false }])
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
                  updateAssistant(assistantId, { streaming: false })
                  break
              }
            }
          }
        } catch {
          setItems((prev) => [
            ...prev.filter((i) => i.id !== userItem.id),
            { ...userItem, pending: false, error: true },
          ])
        } finally {
          setIsPending(false)
        }
      })
    },
    [addOptimisticItem, updateAssistant],
  )

  return {
    userMessages: userMessages,
    assistantMessages: assistantMessages,
    history: getCurrentHistory(),
    sendMessage,
    isPending,
  }
}

export default useChat

// Option A: Vercel Edge Config + Rate Limit (if on Vercel)
// Use @vercel/edge rate limiting - simple, managed.
//
// Option B: In-memory rate limiting (simple, works anywhere)
// Good for dev/small scale. Resets on redeploy.
//
// Option C: Redis/Upstash rate limiting (production)
// Persistent, distributed, handles scale.
