import { startTransition, useCallback, useMemo, useOptimistic, useState } from "react"
import type { AssistantMessage } from "@/app/component/bubbles/AssistantBubble"
import type { UserMessage } from "@/app/component/bubbles/UserBubble"

const mockUserMessages: UserMessage[] = [
  { id: crypto.randomUUID(), content: "Hello, how are you?", pending: false },
  { id: crypto.randomUUID(), content: "What's the weather like today?", pending: false },
  { id: crypto.randomUUID(), content: "Can you tell me a joke?", pending: false },
  { id: crypto.randomUUID(), content: "Ok!", pending: false },
  { id: crypto.randomUUID(), content: "What's your favorite color?", pending: false },
  { id: crypto.randomUUID(), content: "Tell me something interesting", pending: false },
  { id: crypto.randomUUID(), content: "How does gravity work?", pending: false },
  { id: crypto.randomUUID(), content: "That's cool, thanks!", pending: false },
  { id: crypto.randomUUID(), content: "Can you help me with a recipe?", pending: false },
  { id: crypto.randomUUID(), content: "I'm thinking pasta tonight", pending: false, error: true },
  { id: crypto.randomUUID(), content: "Do you like music?", pending: false },
  { id: crypto.randomUUID(), content: "What about anime?", pending: false },
  { id: crypto.randomUUID(), content: "Haha nice one", pending: false },
  { id: crypto.randomUUID(), content: "Goodnight!", pending: false },
  { id: crypto.randomUUID(), content: "This is the more recent message", pending: true },
]

const mockAssistantMessages: AssistantMessage[] = [
  { id: crypto.randomUUID(), content: "Hey! I'm doing great, thanks for asking. How about you?", streaming: false },
  {
    id: crypto.randomUUID(),
    content: "I don't have access to real-time weather, but I hope it's sunny where you are!",
    streaming: false,
  },
  {
    id: crypto.randomUUID(),
    content: "Why do programmers prefer dark mode? Because light attracts bugs.",
    streaming: false,
  },
  { id: crypto.randomUUID(), content: "Glad you liked it!", streaming: false },
  {
    id: crypto.randomUUID(),
    content: "I'd say somewhere between deep violet and midnight blue. Very dramatic, I know.",
    streaming: false,
  },
  {
    id: crypto.randomUUID(),
    content: "Octopuses have three hearts and blue blood. Two pump blood to the gills, one to the rest of the body.",
    streaming: false,
  },
  {
    id: crypto.randomUUID(),
    content:
      "Gravity is the curvature of spacetime caused by mass. The more massive an object, the more it warps the fabric around it.",
    streaming: false,
  },
  { id: crypto.randomUUID(), content: "Anytime!", streaming: false },
  { id: crypto.randomUUID(), content: "Of course! What kind of cuisine are you in the mood for?", streaming: false },
  {
    id: crypto.randomUUID(),
    content:
      "Great choice. A simple aglio e olio is hard to beat — garlic, olive oil, chili flakes, done in 15 minutes.",
    streaming: false,
  },
  {
    id: crypto.randomUUID(),
    content: "I find music fascinating. There's something beautiful about how sound waves can carry so much emotion.",
    streaming: false,
  },
  {
    id: crypto.randomUUID(),
    content: "Big fan. If you haven't seen Steins;Gate, I highly recommend it — time travel done right.",
    streaming: false,
  },
  { id: crypto.randomUUID(), content: "I try my best 😄", streaming: false },
  { id: crypto.randomUUID(), content: "Goodnight! Sleep well, talk soon.", streaming: false },
  { id: crypto.randomUUID(), content: "Sure, go ahead! I'm all ears…", streaming: true },
]

type BaseItem<TRole extends string, TStatus extends string> = {
  id: string
  content: string
  role: TRole
  error?: boolean
} & Record<TStatus, boolean>

type UserItem = BaseItem<"user", "pending">
type AssistantItem = BaseItem<"assistant", "streaming">
type Item = UserItem | AssistantItem

type AssistantUpdates = Partial<Pick<AssistantItem, "content" | "streaming" | "error">>

const useChat = (isMockData: boolean = false) => {
  const [items, setItems] = useState<Item[]>([])
  const [isPending, setIsPending] = useState<boolean>(false)
  const [optimisticItems, addOptimisticItem] = useOptimistic<Item[], Item>(items, (current, newItem) => {
    if (current.some((item) => item.id === newItem.id)) {
      return current
    }
    return [...current, newItem]
  })

  // Memoized + typed for bubble components
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
    userMessages: isMockData ? mockUserMessages : userMessages,
    assistantMessages: isMockData ? mockAssistantMessages : assistantMessages,
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
