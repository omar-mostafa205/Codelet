import ChatClient from '@/components/tutorial/ChatClient'
import React, { Suspense } from 'react'

const ChatPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ChatClient />
      </Suspense>
    </div>
  )
}

export default ChatPage