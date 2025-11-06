"use client"
import React from 'react';
import { Plus } from 'lucide-react';
import { api } from '@/trpc/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

export default function DashboardPageClient() {
  const { data: repos, isLoading } = api.project.getRepos.useQuery();
  const utils = api.useUtils();
  const router = useRouter(); 

  const handleClick = async (repoId: string) => {
    try {
      const tutorial = await utils.project.getLatestTutorials.fetch({ repoId });
      
      if (tutorial) {
       router.push(`dashboard/past-tutorials/?repoId=${repoId}`)
      } else {
        console.log('No tutorial found for this repository');
      }
    } catch (error) {
      console.error('Error fetching tutorial:', error);
    }
  };

  return (
    <>

      {isLoading ? (
        <div className="min-h-screen bg-white p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-semibold mb-8">Your Repositories</h1>
            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-6 min-h-[280px] animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-white p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-semibold mb-8">Your Repositories</h1>
            
            <div className="grid grid-cols-3 gap-6">
              <Link href="/repo-upload" className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center hover:border-gray-400 transition-colors min-h-[280px] bg-gray-50">
                <Plus className="w-6 h-6 mb-2 text-gray-600" />
                <span className="text-gray-600 font-medium">Add Repository</span>
              </Link>

              {repos?.map((repo) => (
                <button
                  onClick={() => handleClick(repo.id)}
                  key={repo.id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors cursor-pointer min-h-[280px] flex flex-col bg-white text-left"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-500 truncate">{repo.githubUrl}</span>
                  </div>

                  <div className="flex-1">
                    <div className="text-xs text-white mb-1 bg-purple-500 py-1 px-2 rounded-xl w-fit">Free Plan</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{repo.name}</h3>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-auto pt-4 border-t border-gray-100">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Active</span>
                  </div>

                  <div className="text-xs text-gray-400 mt-2">
                    Created {formatTimeAgo(repo.createdAt)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}