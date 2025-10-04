/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

"use client"
import MessagesList from '@/components/MessagesList'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowUp, ChevronDown, Plus, Sparkles } from 'lucide-react'
import React from 'react'
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, type UIMessage } from 'ai'
import { useParams } from 'next/navigation'
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@radix-ui/react-dropdown-menu"
import { api } from '@/trpc/react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import SparkIcon from '@/components/SparkIcon'

const Aichat = () => {
    const router = useRouter()
    const { tutorialId } = useParams<{ tutorialId: string }>()
    const { chatId } = useParams<{ chatId: string }>()
    const [inputValue, setInputValue] = React.useState('')

        const { data: sessionData } = api.project.getChatSessions.useQuery({ tutorialId }, {
        gcTime: 1000 * 60 * 45,
        staleTime: 1000 * 60 * 45
    })
    
    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/chat/ai',
            body: { chatId, tutorialId },
        }),
    })
    const {data: prevMessages } = api.project.getChatMessages.useQuery({ sessionId: chatId }, {
        gcTime: 1000 * 60 * 45,
        staleTime: 1000 * 60 * 45
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
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!inputValue.trim() || status !== 'ready') return
        
        await sendMessage({ text: inputValue.trim() })
        console.log(messages)
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
            <div className='min-h-[85vh] relative '>
                <div className='absolute top-0 left-0'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="!hover:bg-gray-50 bg-transparent border-none shadow-none">
                            <Button size="lg" className="hover:bg-gray-200 cursor-pointer">
                                Chat History <ChevronDown className="w-5 h-5 text-gray-400" />
                            </Button>
                        </DropdownMenuTrigger>
                        
                        <DropdownMenuContent className="w-56 ml-25 shadow rounded-lg">
                        <DropdownMenuItem
  onClick={handleCreateChat}
  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 focus:bg-gray-50 hover:bg-gray-50 rounded-md mx-1 cursor-pointer outline-none z-50"
>
  <Plus className="w-4 h-4" />
  New Chat
</DropdownMenuItem>


<DropdownMenuSeparator className="my-1 h-px !bg-gray-200" />
                            
  {sessionData && sessionData.length  >0 &&
    sessionData?.map((session) => (
      <DropdownMenuItem 
        key={session.id}
        onClick={() =>
          router.push(`/tutorial/${tutorialId}/chat/${session.id}`)
        }
        className="w-full justify-start text-sm p-2 hover:bg-gray-100 cursor-pointer z-30  border-none outline-none"
      >
    {session.title}
      </DropdownMenuItem>
    ))}


                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                
                <div className="flex items-center justify-center min-h-[85vh]">
                    <div className="flex flex-col items-center text-center">
                        <div className="text-5xl font-medium flex items-center justify-center gap-4">
                           <span>  Ask Codelet AI </span> <Sparkles className='w-10 h-10 text-black' />
                        </div>
                        
                        <p className="text-gray-500 mt-5 max-w-xl">
                            Your AI assistant is ready to help you explore your codebase,
                            explain concepts, and guide you with clear, detailed answers.
                        </p>
                        
                        <div className="mt-8 w-[50vw]">
                            <form
                                onSubmit={handleSubmit}
                                className="relative flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-4xl shadow-lg h-13"
                            >
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask anything about your codebase ..." 
                                    className="flex-1 !border-none !shadow-none bg-white text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                                    onKeyDown={handleKeyDown}
                                    disabled={status !== 'ready'}
                                />
                                
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <Button
                                        type="submit"
                                        variant="ghost"
                                        size="sm"
                                        className="w-8 h-8 p-0 rounded-full hover:bg-gray-700 bg-black disabled:opacity-50"
                                        disabled={status !== 'ready' || !inputValue.trim()}
                                    >
                                        <ArrowUp className='w-5 h-5 text-white' />
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    
    return (
        <div className="flex flex-col h-[85vh] relative">
                <div className='absolute top-0 left-0'>
                <DropdownMenu>
                        <DropdownMenuTrigger asChild className="!hover:bg-gray-50 bg-transparent border-none shadow-none !z-30">
                            <Button size="lg" className="hover:bg-gray-200 cursor-pointer">
                                Chat History <ChevronDown className="w-5 h-5 text-gray-400" />
                            </Button>
                        </DropdownMenuTrigger>
                        
                        <DropdownMenuContent className="w-56 ml-25 shadow rounded-lg !z-50 bg-white">
                        <DropdownMenuItem
  onClick={handleCreateChat}
  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 focus:bg-gray-50 hover:bg-gray-50 rounded-md mx-1 cursor-pointer outline-none z-40"
>
  <Plus className="w-4 h-4" />
  New Chat
</DropdownMenuItem>


                            <DropdownMenuSeparator className="my-1 h-px !bg-gray-200" />
                            
  {sessionData && sessionData.length  > 0 &&
    sessionData?.map((session) => (
      <DropdownMenuItem 
        key={session.id}
        onClick={() =>
          router.push(`/tutorial/${tutorialId}/chat/${session.id}`)
        }
        className="w-full justify-start text-sm p-2 hover:bg-gray-100 cursor-pointer z-30  border-none"
      >
    {session.title}
      </DropdownMenuItem>
    ))}


                        </DropdownMenuContent>
                    </DropdownMenu>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex items-start max-w-6xl mx-auto">
                <MessagesList messages={allMessages} status={status} />
            </div>
            
            <div className="p-1 mb-[-70px]">
                <form
                    onSubmit={handleSubmit}
                    className="relative flex items-center gap-3 px-4 py-3 bg-white rounded-full shadow-lg max-w-4xl mx-auto justify-start h-13"
                >
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask anything..."
                        className="flex-1 !border-none !shadow-none bg-white text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 !h-13"
                        onKeyDown={handleKeyDown}
                        disabled={status !== 'ready'}
                    />
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                            type="submit"
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 p-0 rounded-full hover:bg-gray-700 bg-black disabled:opacity-50"
                            disabled={status !== 'ready'}
                        >
                            <ArrowUp className='w-5 h-5 text-white' />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Aichat