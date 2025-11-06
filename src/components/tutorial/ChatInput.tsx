"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowUp } from 'lucide-react'
import React from 'react'

interface ChatInputProps {
  inputValue: string
  onInputChange: (value: string) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  isLoading?: boolean
  placeholder?: string
  variant?: 'default' | 'empty'
}

function ChatInput({
  inputValue,
  onInputChange,
  onSubmit,
  onKeyDown,
  isLoading = false,
  placeholder = "Ask anything...",
  variant = 'default',
}: ChatInputProps) {
  const isEmptyVariant = variant === 'empty'

  return (
    <div className={isEmptyVariant ? "mt-8 w-[50vw]" : "p-1 mb-[-70px]"}>
      <form
        onSubmit={onSubmit}
        className={`relative flex items-center gap-3 px-4 py-3 bg-white ${
          isEmptyVariant ? "border border-gray-200 rounded-4xl" : "rounded-full"
        } shadow-lg h-13 ${!isEmptyVariant && "max-w-4xl mx-auto justify-start"}`}
      >
        <Input
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 !border-none !shadow-none bg-white text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 !h-13"
          onKeyDown={onKeyDown}
          disabled={isLoading}
        />

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            type="submit"
            size="sm"
            className="w-8 h-8 p-0 rounded-full hover:bg-purple-500 bg-purple-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:!ring-purple-500 focus:!ring-offset-2"
            disabled={isLoading || !inputValue.trim()}
          >
            <ArrowUp className="w-5 h-5 text-white" />
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ChatInput
