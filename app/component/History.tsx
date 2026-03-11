import { Close, Content, Description, Overlay, Portal, Title } from "@radix-ui/react-dialog"
import { Cross2Icon } from "@radix-ui/react-icons"
import type { Item } from "@/app/hook/useChat"

type HistoryProps = {
  isOpen: boolean
  historyMessages: Item[]
}
const History = ({ isOpen, historyMessages }: HistoryProps) => {
  return (
    <Portal>
      <Overlay
        data-state={isOpen ? "open" : undefined}
        className="fixed inset-0 bg-ink-soft/80 data-[state=open]:animate-dialog-overlay-show"
      />
      <Content
        data-state={isOpen ? "open" : undefined}
        className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-125 -translate-x-1/2 -translate-y-1/2 rounded-md bg-surface-elevated p-6.25 shadow-(--shadow-6) focus:outline-none data-[state=open]:animate-dialog-content-show"
      >
        <Title className="m-0 text-[17px] font-medium text-mauve12">History</Title>
        <Description hidden>History</Description>
        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          {historyMessages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No history yet.</p>
          ) : (
            <ul className="space-y-3">
              {historyMessages.map((entry) => (
                <li key={entry.id} className="rounded bg-gray3 p-3">
                  <p className="text-sm text-foreground">{entry.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-6.25 flex justify-end">
          <button
            type="button"
            className="inline-flex h-8.75 items-center justify-center rounded bg-green4 px-3.75 font-medium leading-none text-green11 outline-none outline-offset-1 hover:bg-green5 focus-visible:outline-2 focus-visible:outline-green6 select-none"
          >
            Save changes
          </button>
        </div>
        <Close asChild>
          <button
            type="button"
            className="absolute right-2.5 top-2.5 inline-flex size-6 appearance-none items-center justify-center rounded-full text-violet11 bg-gray3 hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
            aria-label="Close"
          >
            <Cross2Icon />
          </button>
        </Close>
      </Content>
    </Portal>
  )
}

export default History
