import { startTransition, useCallback, useOptimistic, useState } from "react"
export type Item = {
  id: string
  message: string
  role: "user" | "assistant"
  pending?: boolean // User message waiting for API acknowledgment
  streaming?: boolean // AI response still receiving chunks
  error?: boolean // Failed to send
}
const useChat = () => {
  const [items, setItems] = useState<Item[]>([])
  const [optimisticItems, addOptimisticItem] = useOptimistic<Item[], Item>(items, (current, newItem) => {
    if (current.some((item) => item.id === newItem.id)) {
      return current
    }
    return [...current, newItem]
  })
  const updateItem = useCallback((id: string, updates: Partial<Item>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }, [])

  const sendMessage = useCallback(
    (message: string) => {
      const userItem: Item = {
        id: crypto.randomUUID(),
        message,
        role: "user",
        pending: true,
      }

      const assistantId = crypto.randomUUID()

      startTransition(async () => {
        addOptimisticItem(userItem)

        const history = items
          .filter((item) => !item.error && !item.pending)
          .map(({ message, role }) => ({ content: message, role }))

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
                  setItems((prev) => [...prev, { id: assistantId, message: "", role: "assistant", streaming: true }])
                  break
                case "final":
                  setItems((prev) =>
                    prev.map((item) => (item.id === assistantId ? { ...item, message: event.text } : item)),
                  )
                  break
                case "end":
                  updateItem(assistantId, { streaming: false })
                  break
              }
            }
          }
        } catch {
          setItems((prev) => [
            ...prev.filter((i) => i.id !== userItem.id),
            { ...userItem, pending: false, error: true },
          ])
        }
      })
    },
    [addOptimisticItem, updateItem, items],
  )

  return {
    messages: optimisticItems,
    sendMessage,
  }
}

export default useChat
