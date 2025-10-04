/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unsafe-return */
"use client"
import { useRepo } from '@/hooks/use-repo'
import { useUser } from '@clerk/nextjs'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Sparkles } from 'lucide-react'

import { useRouter } from 'next/navigation'
import React from 'react'

const NewChat = ({tutorialId}) => {
    const { user } = useUser()
    const router = useRouter()
    
    if(!user) return null


    const mutation = useMutation({
        mutationKey: ["create-chat", tutorialId],
        mutationFn: async () => { 
            const response = await axios.post("/api/chat/new-chat", {tutorialId})
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

    return (
        <div>
            <button
                onClick={handleCreateChat}
                disabled={mutation.isPending}
                className="w-full cursor-pointer flex items-center gap-2 rounded-lg px-3 py-2 transition-colors !text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed "
            >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium text-gray-600">
                  Codelet AI
                </span>
            </button>
            
        </div>
    )
}

export default NewChat

