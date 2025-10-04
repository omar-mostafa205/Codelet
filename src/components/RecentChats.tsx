/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client"
import React from 'react';
import { MessageSquare, Clock, ArrowUpRight, Sparkles } from 'lucide-react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

interface RecentChatsProps {
  recentChats: any[];
}

export default function RecentChats({ recentChats }: RecentChatsProps) {
  const { tutorialId } = useParams();
  const [isCreating, setIsCreating] = React.useState(false);

  async function handleNewChat() {
    setIsCreating(true);
    try {
      const chatId = await axios.post("/api/chat/new-chat", { tutorialId: tutorialId });
      window.location.href = `/tutorial/${tutorialId}/chat/${chatId.data.id}`;
    } catch (error) {
      setIsCreating(false);
    }
  }

  return (
    <div className="bg-gradient-to-br from-purple-100 via-orange-50 to-white text-gray-800 p-8 rounded-3xl shadow-2xl border border-purple-200/50 h-130">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 backdrop-blur-sm rounded-xl flex items-center justify-center border border-purple-200">
            <Sparkles size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">AI Chat Sessions</h3>
            <p className="text-sm text-gray-600">Continue where you left off</p>
          </div>
        </div>

        <button 
          onClick={handleNewChat}
          disabled={isCreating}
          className="group flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-purple-300/50 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MessageSquare size={16} className="group-hover:rotate-12 transition-transform cursor-pointer" />
          {isCreating ? 'Creating...' : 'New Chat'}
        </button>
      </div>
      
      {/* Chat List */}
      {recentChats.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-purple-50 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-200">
            <MessageSquare size={28} className="text-purple-400" />
          </div>
          <p className="text-gray-700 mb-2">No chat sessions yet</p>
          <p className="text-sm text-gray-500">Start a conversation with AI to get help!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentChats.map((chat, i) => (
            <Link
              href={`${tutorialId}/chat/${chat.id}`}
              key={i} 
              className="group block bg-white/60 backdrop-blur-sm p-4 rounded-2xl hover:bg-white/80 transition-all duration-300 cursor-pointer border border-purple-200/50 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100/50 hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-11 h-11 bg-purple-100 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 border border-purple-200 group-hover:border-purple-300 transition-colors">
                  <MessageSquare size={20} className="text-purple-600" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-gray-900 transition-colors">
                    {chat.question}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} />
                      {chat.time}
                    </span>
                    {chat.repo && (
                      <span className="bg-purple-100 px-2.5 py-1 rounded-full border border-purple-200">
                        {chat.repo}
                      </span>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <ArrowUpRight 
                  size={20} 
                  className="text-gray-400 flex-shrink-0 group-hover:text-purple-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" 
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}