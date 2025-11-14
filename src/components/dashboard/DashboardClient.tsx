"use client";
import { Github, BookOpen, MessageSquare, Calendar, TrendingUp, Clock, Sparkles, ChevronRight } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/trpc/react';
import { DashboardSkeleton } from './DashboardSkeleton';

export default function DashboardClient() {
  const router = useRouter();
  const params = useParams();
  const tutorialId = params?.tutorialId as string;
  const repoId = params?.repoId as string;

  const { data: tutorial, isLoading } = api.project.getTutorialById.useQuery(
    { tutorialId },
    { enabled: !!tutorialId }
  );

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!tutorial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Tutorial not found</p>
        </div>
      </div>
    );
  }

  const totalChapters = tutorial.chapters?.length || 0;
  const totalChatSessions = tutorial.chatSessions?.length || 0;
  const totalSubChapters = tutorial.chapters?.reduce((acc, ch) => acc + (ch.subChapters?.length || 0), 0) || 0;

  const recentChats = tutorial.chatSessions
    ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5) || [];

  return (
    <div className="!min-h-[40vh] bg-white p-5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {tutorial.title}
          </h1>
          <p className="text-gray-600">
            {tutorial.description || 'Your tutorial dashboard and progress'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Chapters</span>
              <BookOpen className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{totalChapters}</div>
            <p className="text-xs text-gray-500">Total chapters</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Sub-chapters</span>
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{totalSubChapters}</div>
            <p className="text-xs text-gray-500">Content sections</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">AI Sessions</span>
              <MessageSquare className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{totalChatSessions}</div>
            <p className="text-xs text-gray-500">Active chats</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Last Updated</span>
              <Calendar className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-lg font-bold text-gray-900 mb-1">
              {new Date(tutorial.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <p className="text-xs text-gray-500">
              {new Date(tutorial.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-[400px] overflow-scroll">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Tutorial Chapters</h2>
              <BookOpen className="w-5 h-5 text-purple-500" />
            </div>

            {!tutorial.chapters || tutorial.chapters.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No chapters yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] ">
                {tutorial.chapters
                  .sort((a, b) => a.chapterNumber - b.chapterNumber)
                  .map((chapter) => (
                    <div
                      key={chapter.id}
                      onClick={() => router.push(`/dashboard/tutorial/${tutorialId}/chapter/${chapter.id}?repoId=${repoId}`)}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 cursor-pointer group transition-colors border border-gray-100 hover:border-purple-200"
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors">
                        <span className="text-sm font-bold text-purple-600">
                          {chapter.chapterNumber}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate group-hover:text-purple-600 transition-colors">
                          {chapter.title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          {chapter.subChapters?.length || 0} sub-chapters
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 shadow-lg h-[400px] overflow-scroll">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold text-white">AI Chat Sessions</h2>
            </div>

            {recentChats.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No chat sessions yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {recentChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => router.push(`/dashboard/tutorial/${tutorialId}/chat/${chat.id}?repoId=${repoId}`)}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 cursor-pointer group transition-all border border-white/10"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-white text-sm group-hover:text-purple-300 transition-colors flex-1">
                        {chat.title || 'Untitled Chat'}
                      </h3>
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                    </div>
                    
                    {chat.messages && chat.messages[0] && (
                      <p className="text-xs text-gray-300 line-clamp-2 mb-3">
                        {chat.messages[0].content}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(chat.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-1">
                        {chat.isActive && (
                          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        )}
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-300 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

