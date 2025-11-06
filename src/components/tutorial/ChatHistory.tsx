"use client"

import { Button } from '@/components/ui/button'
import { ChevronDown, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@radix-ui/react-dropdown-menu"

interface ChatHistoryProps {
  sessions?: Array<{ id: string; title: string }>
  onCreateChat: () => void
  onSelectChat: (id: string) => void
  isCreating?: boolean
}

function ChatHistory({
  sessions,
  onCreateChat,
  onSelectChat,
  isCreating = false,
}: ChatHistoryProps) {
  return (
    <div className="absolute top-0 left-0">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="!hover:bg-gray-50 bg-transparent border-none shadow-none !z-30">
          <Button size="lg" className="hover:bg-gray-200 cursor-pointer">
            Chat History <ChevronDown className="w-5 h-5 text-gray-400" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56 ml-25 shadow rounded-lg !z-50 bg-white">
          <DropdownMenuItem
            onClick={onCreateChat}
            disabled={isCreating}
            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 focus:bg-gray-50 hover:bg-gray-50 rounded-md mx-1 cursor-pointer outline-none z-40 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </DropdownMenuItem>

          {sessions && sessions.length > 0 && (
            <>
              <DropdownMenuSeparator className="my-1 h-px !bg-gray-200" />
              {sessions.map((session) => (
                <DropdownMenuItem
                  key={session.id}
                  onClick={() => onSelectChat(session.id)}
                  className="w-full justify-start text-sm p-2 hover:bg-gray-100 cursor-pointer z-30 border-none"
                >
                  {session.title}
                </DropdownMenuItem>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default ChatHistory
