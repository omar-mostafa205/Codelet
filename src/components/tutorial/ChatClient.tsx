"use client"
import React from 'react'
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, type UIMessage } from 'ai'
import { useParams, useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { api } from '@/trpc/react'
import ChatHistory from '@/components/tutorial/ChatHistory'
import ChatInput from '@/components/tutorial/ChatInput'
import EmptyState from '@/components/tutorial/EmptyState'
import ChatMessages from '@/components/tutorial/ChatMessages'

const ChatClient = () => {
  const router = useRouter()
  const { tutorialId } = useParams<{ tutorialId: string }>()
  const { chatId } = useParams<{ chatId: string }>()
  const [inputValue, setInputValue] = React.useState('')

  const { data: sessionData } = api.project.getChatSessions.useQuery(
    { tutorialId },
    {
      gcTime: 1000 * 60 * 45,
      staleTime: 1000 * 60 * 45
    }
  )

  const { data: prevMessages } = api.project.getChatMessages.useQuery(
    { sessionId: chatId },
    {
      gcTime: 1000 * 60 * 45,
      staleTime: 1000 * 60 * 45
    }
  )

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat/ai',
      body: { chatId, tutorialId },
    }),
  })

  const mutation = useMutation({
    mutationKey: ["create-chat", tutorialId],
    mutationFn: async () => {
      const response = await axios.post("/api/chat/new-chat", { tutorialId })
      return response.data
    },
    onSuccess: (data) => {
      router.push(`/tutorial/${tutorialId}/chat/${data.id}`)
    }
  })

  const handleCreateChat = () => {
    if (tutorialId && !mutation.isPending) {
      mutation.mutate()
    }
  }

  const handleSelectChat = (id: string) => {
    router.push(`/tutorial/${tutorialId}/chat/${id}`)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!inputValue.trim() || status !== 'ready') return

    await sendMessage({ text: inputValue.trim() })
    setInputValue('')
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!inputValue.trim() || status !== 'ready') return

      await sendMessage({ text: inputValue.trim() })
      setInputValue('')
    }
  }
  const allMessages = React.useMemo<UIMessage[]>(() => {
    const transformed: UIMessage[] = prevMessages?.map((msg, index) => ({
      id: `${chatId}-${index}`,
      role: msg.role.toLowerCase() as 'user' | 'assistant' | 'system',
      parts: [
        {
          type: 'text' as const,
          text: msg.content
        }
      ]
    })) ?? []

    return [...transformed, ...messages]
  }, [prevMessages, messages, chatId])

  if (allMessages.length === 0) {
    return (
      <div className="min-h-[85vh] relative">
        <ChatHistory
          sessions={sessionData}
          onCreateChat={handleCreateChat}
          onSelectChat={handleSelectChat}
          isCreating={mutation.isPending}
        />
        <EmptyState
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          isLoading={status !== 'ready'}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[85vh] relative">
      <ChatHistory
        sessions={sessionData}
        onCreateChat={handleCreateChat}
        onSelectChat={handleSelectChat}
        isCreating={mutation.isPending}
      />

      <ChatMessages messages={allMessages} status={status} />

      <ChatInput
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        isLoading={status !== 'ready'}
        placeholder="Ask anything..."
      />
    </div>
  )
}

export default ChatClient