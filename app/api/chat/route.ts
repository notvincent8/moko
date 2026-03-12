import { NextResponse } from "next/server"
import client from "@/lib/anthropic"
import { getEntitySystemPrompt } from "@/lib/mokoPrompt"

export const runtime = "nodejs"

export const dynamic = "force-dynamic"

// Max message length (prevent huge payloads)
const MAX_MESSAGE_LENGTH = 2000

// Average young adult reading speed: ~250 WPM (~1250 chars/min ≈ 50ms/char)
// Average young adult typing speed: ~45 WPM (~225 chars/min ≈ 265ms/char)

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const clamp = (min: number, value: number, max: number) => Math.min(Math.max(value, min), max)
// Reading: ~50ms per character, clamped 500ms - 3000ms
const readingDelay = (text: string) => wait(clamp(500, text.length * 50, 3000))

// Typing simulation: based on response length, ~265ms per char is too slow for UX
// Compromise: ~30ms/char (feels like typing but doesn't frustrate user)
// Clamped 300ms - 2000ms
const typingDelay = (text: string) => wait(clamp(300, text.length * 30, 2000))

export const POST = async (req: Request) => {
  const { message: userMessage, history = [] } = await req.json()

  if (!userMessage || typeof userMessage !== "string") {
    return NextResponse.json({ error: "Message is required" }, { status: 400 })
  }

  if (userMessage.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: `Message too long. Max ${MAX_MESSAGE_LENGTH} characters.` }, { status: 400 })
  }
  try {
    const stream = client.messages.stream({
      max_tokens: 256,
      system: getEntitySystemPrompt(),
      messages: [...history, { role: "user", content: userMessage }],
      model: "claude-opus-4-6",
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        controller.enqueue(encoder.encode(`${JSON.stringify({ type: "start" })}\n`))

        // Entity "reads" the user's message
        await readingDelay(userMessage)

        // Show typing indicator
        controller.enqueue(encoder.encode(`${JSON.stringify({ type: "typing" })}\n`))

        // Get the response (user sees "Typing..." during this)
        const response = await stream.finalMessage()
        const textBlock = response.content.find((block) => block.type === "text")

        if (textBlock && textBlock.type === "text") {
          // Moko "finishes typing" the response
          await typingDelay(textBlock.text)
          controller.enqueue(encoder.encode(`${JSON.stringify({ type: "final", text: textBlock.text })}\n`))
        }
        controller.enqueue(encoder.encode(`${JSON.stringify({ type: "end" })}\n`))
        controller.close()
      },
    })
    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch {
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
