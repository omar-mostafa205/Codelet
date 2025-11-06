"use client"
import React from 'react';
import { Plus, BookOpen, Clock } from 'lucide-react';
import { api } from '@/trpc/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function formatTimeAgo(date: Date) {
  const now = new Date();
  const diffInMs = now.getTime() - new Date(date).getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays < 1) return 'today';
  if (diffInDays === 1) return '1d ago';
  if (diffInDays < 7) return `${diffInDays}d ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
  if (diffInDays < 60) return 'about 1mo ago';
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}mo ago`;
  return `${Math.floor(diffInDays / 365)}y ago`;
}

export default function TutorialsDashboard() {
  const searchParams = useSearchParams();
  const repoId = searchParams.get('repoId');
  const router = useRouter();
  
  const { data: repo, isLoading: repoLoading } = api.project.getRepoById.useQuery(
    { repoId: repoId || '' },
    { enabled: !!repoId }
  );
    const { data: tutorials, isLoading: tutorialsLoading } = api.project.getLatestTutorials.useQuery(
    { repoId: repoId || '' },
    { enabled: !!repoId }
  );

  const handleTutorialClick = (tutorialId: string) => {
    router.push(`tutorial/${tutorialId}?repoId=${repoId}`);
  };

  const isLoading = repoLoading || tutorialsLoading;

  if (!repoId) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="border border-red-200 bg-red-50 rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-red-900 mb-2">No Repository Selected</h2>
            <p className="text-red-700 mb-4">Please select a repository from the dashboard.</p>
            <Link 
              href="/dashboard"
              className="inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading ? (
        <div className="min-h-screen bg-white p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-semibold mb-8">Past Tutorials</h1>
            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-6 min-h-[320px] animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-white p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-semibold">Past Tutorials</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {tutorials?.length || 0} {tutorials?.length === 1 ? 'tutorial' : 'tutorials'} in {repo?.name}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <Link 
                href="/repo-upload" 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center hover:border-gray-400 transition-colors min-h-[320px] bg-gray-50"
              >
                <Plus className="w-6 h-6 mb-2 text-gray-600" />
                <span className="text-gray-600 font-medium">Create tutorial</span>
              </Link>

              {tutorials?.map((tutorial) => (
                <button
                  onClick={() => handleTutorialClick(tutorial.id)}
                  key={tutorial.id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors cursor-pointer min-h-[320px] flex flex-col bg-white text-left"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-xs text-gray-500 truncate">{repo?.name}</span>
                  </div>

                  <div className="flex-1">
                    <div className="text-xs text-white mb-2 bg-purple-500 py-1 px-2 rounded-xl w-fit">
                      Tutorial
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {tutorial.title || 'Untitled Tutorial'}
                    </h3>
                    
                    {tutorial.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {tutorial.description}
                      </p>
                    )}

                    {/* Chapters List */}
                    {tutorial.chapters && tutorial.chapters.length > 0 && (
                      <div className="space-y-2 mb-4">
                        <div className="text-xs font-medium text-gray-700 mb-2">
                          Chapters ({tutorial.chapters.length})
                        </div>
                        <div className="space-y-1.5 max-h-[120px] overflow-y-auto">
                          {tutorial.chapters.map((chapter: any, index: number) => (
                            <div 
                              key={chapter.id || index}
                              className="flex items-start gap-2 text-xs text-gray-600 bg-gray-50 rounded p-2"
                            >
                              <span className="font-medium text-gray-400 min-w-[20px]">
                                {index + 1}.
                              </span>
                              <span className="flex-1 line-clamp-1">
                                {chapter.title || chapter.name || `Chapter ${index + 1}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{tutorial.duration || 'N/A'}</span>
                    </div>
                    {tutorial.status && (
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${
                          tutorial.status === 'completed' ? 'bg-green-500' :
                          tutorial.status === 'in-progress' ? 'bg-yellow-500' :
                          'bg-gray-400'
                        }`} />
                        <span className="capitalize">{tutorial.status}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-400 mt-2">
                    Updated {formatTimeAgo(tutorial.updatedAt || tutorial.createdAt)}
                  </div>
                </button>
              ))}

              {tutorials?.length === 0 && !isLoading && (
                <div className="col-span-2 border border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center text-center">
                  <BookOpen className="w-12 h-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No tutorials yet
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Create your first tutorial to get started
                  </p>
                  <Link 
                    href="/repo-upload"
                    className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
                  >
                    Create Tutorial
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}