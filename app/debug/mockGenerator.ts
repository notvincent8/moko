import type { Item } from "@/app/hook/useChat"
import { MOCK_RESPONSES, MOCK_USER_MESSAGES, type MockResponseType } from "./config"

const pickRandom = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]

const getRandomResponseType = (): MockResponseType => {
  const types: MockResponseType[] = ["short", "medium", "long", "withEmoji", "questions", "supportive"]
  return pickRandom(types)
}

export const generateMockResponse = (type?: MockResponseType): string => {
  const responseType = type ?? getRandomResponseType()
  return pickRandom(MOCK_RESPONSES[responseType])
}

export const generateMockUserMessage = (): string => pickRandom(MOCK_USER_MESSAGES)

export const generatePopulatedMessages = (userCount: number, assistantCount: number): Item[] => {
  const items: Item[] = []
  const pairCount = Math.max(userCount, assistantCount)

  for (let i = 0; i < pairCount; i++) {
    if (i < userCount) {
      items.push({
        id: `mock-user-${i}-${Date.now()}`,
        content: generateMockUserMessage(),
        role: "user",
        pending: false,
        sentAt: new Date(),
      })
    }

    if (i < assistantCount) {
      items.push({
        id: `mock-assistant-${i}-${Date.now()}`,
        content: generateMockResponse(),
        role: "assistant",
        streaming: false,
        sentAt: new Date(),
      })
    }
  }

  return items
}

export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

export async function* simulateTyping(text: string, msPerChar: number): AsyncGenerator<string, void, unknown> {
  let current = ""
  for (const char of text) {
    current += char
    yield current
    await sleep(msPerChar)
  }
}
