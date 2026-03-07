"use client"
import "@/lib/gsap-init"

import { DoubleArrowRightIcon } from "@radix-ui/react-icons"
import type { SyntheticEvent } from "react"
import MessageItem from "@/app/component/MessageItem"
import useChat from "@/app/hook/useChat"

export default function Home() {
  const { messages, sendMessage } = useChat()

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const rawMessage = formData.get("message")

    if (!rawMessage) {
      if (process.env.NODE_ENV === "development") {
        console.error("Message is required")
      }
      return
    }

    sendMessage(rawMessage as string)
    form.reset()
  }

  return (
    <section>
      <h1>Moko</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type something.."
            name="message"
            className="border rounded-full px-4 py-1 active:outline-red-700 focus-visible:outline-red-700"
          />
          <button
            type="submit"
            className="cursor-pointer w-8 h-8 rounded-full border hover:bg-red-200 flex items-center justify-center text-orange-8 hover:text-orange-11"
          >
            <DoubleArrowRightIcon />
          </button>
        </div>
      </form>
      {messages.map((item) => (
        <MessageItem key={item.id} item={item} />
      ))}
    </section>
  )
}
