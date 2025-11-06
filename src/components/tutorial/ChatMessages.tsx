"use client"
import MessagesList from '@/components/ui/MessagesList'
import { type UIMessage } from 'ai'

type ChatMessagesProps = {
  messages: UIMessage[]
  status: string
}

export default function ChatMessages({ messages, status }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 flex items-start max-w-6xl mx-auto">
      <MessagesList messages={messages} status={status} />
    </div>
  )
}
