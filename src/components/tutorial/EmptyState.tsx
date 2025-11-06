"use client"

import Image from 'next/image'
import ChatInput from './ChatInput'
import React from 'react'

interface EmptyStateProps {
  inputValue: string
  onInputChange: (value: string) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  isLoading?: boolean
  title?: string
  description?: string
}

function EmptyState({
  inputValue,
  onInputChange,
  onSubmit,
  onKeyDown,
  isLoading = false,
  title = "Ask Codelet AI",
  description = "Your AI assistant is ready to help you explore your codebase, explain concepts, and guide you with clear, detailed answers."
}: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[85vh] relative">
      <div
        className="absolute inset-0 z-0 rounded-xl"
        style={{
          background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #7c3aed 100%)"
        }}
      />

      <div className="flex flex-col items-center text-center">
        <div className="text-5xl font-medium flex items-center justify-center gap-4 z-4">
          <span className="font-semibold z-20">{title}</span>
          <Image src="/stars.png" alt="ai work" width={60} height={50} />
        </div>

        <p className="text-gray-500 mt-5 max-w-xl z-4">
          {description}
        </p>

        <ChatInput
          inputValue={inputValue}
          onInputChange={onInputChange}
          onSubmit={onSubmit}
          onKeyDown={onKeyDown}
          isLoading={isLoading}
          placeholder="Ask anything about your codebase ..."
          variant="empty"
        />
      </div>
    </div>
  )
}

export default EmptyState
