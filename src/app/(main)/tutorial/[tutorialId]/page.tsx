import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/server/db';
import DashboardClient from '@/components/DashboardClient';
import { transformRepoData } from '@/lib/dashboard-utils';
import { Suspense } from 'react';

interface DashboardPageProps {
  searchParams?: {
    repoId?: string;
  };
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await currentUser();
  
  if (!user) {
    return <div>Please sign in to view your dashboard</div>;
  }

  const reposData = await db.repo.findMany({
    where: {
      userId: user.id
    },
    select: {
      id: true,
      name: true,
      githubUrl: true,
      createdAt: true,
      updatedAt: true,
      tutorials: {
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          chapters: {
            select: {
              id: true,
              title: true,
              chapterNumber: true,
              subChapters: {
                select: {
                  id: true,
                  subChapterTitle: true,
                  diagram: true,
                  codeSnippets: {
                    select: {
                      id: true,
                      language: true
                    }
                  }
                }
              }
            },
            orderBy: {
              chapterNumber: 'asc'
            }
          },
          chatSessions: {
            select: {
              id: true,
              title: true,
              createdAt: true,
              isActive: true,
              messages: {
                select: {
                  id: true,
                  content: true,
                  createdAt: true
                },
                orderBy: {
                  createdAt: 'desc'
                },
                take: 1
              }
            },
            where: {
              isActive: true
            },
            orderBy: {
              updatedAt: 'desc'
            },
            take: 10
          }
        },
        orderBy: {
          id: 'asc'
        }
      }
    },
    orderBy: [
      { createdAt: 'desc' },
      { id: 'asc' }
    ]
  });

  // Sort repos to put the selected one first if specified
  let sortedReposData = reposData;
  if (searchParams?.repoId) {
    const selectedIndex = reposData.findIndex(r => r.id === searchParams.repoId);
    if (selectedIndex > 0) {
      sortedReposData = [
        reposData[selectedIndex],
        ...reposData.slice(0, selectedIndex),
        ...reposData.slice(selectedIndex + 1)
      ];
    }
  }

  const transformedData = transformRepoData(sortedReposData);

  function DashboardSkeleton() {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="animate-pulse">
          {/* Header Breadcrumb */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-4"></div>
            <div className="h-4 bg-gray-200 rounded w-28"></div>
          </div>
  
          {/* Title and Description */}
          <div className="mb-8">
            <div className="h-12 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-96"></div>
          </div>
  
          {/* Your Repositories Section */}
          <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="h-8 bg-gray-200 rounded w-48"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
  
            {/* Repository Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div className="h-6 bg-gray-300 rounded w-24"></div>
                    </div>
                    <div className="w-5 h-5 bg-gray-300 rounded"></div>
                  </div>
                  <div className="h-5 bg-gray-300 rounded w-20 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
                  <div className="w-full h-2 bg-gray-300 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
  
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                  <div className="w-6 h-6 bg-gray-200 rounded"></div>
                </div>
                <div className="h-14 bg-gray-200 rounded w-20 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-28"></div>
              </div>
            ))}
          </div>
  
          {/* Bottom Section Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tutorial Chapters */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="w-16 h-8 bg-gray-200 rounded-full"></div>
              </div>
            </div>
  
            {/* Current Repository */}
            <div className="bg-black rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-5 h-5 bg-gray-700 rounded"></div>
                <div className="h-6 bg-gray-700 rounded w-40"></div>
              </div>
              <div className="h-10 bg-gray-700 rounded w-32 mb-6"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
                <div className="h-5 bg-gray-700 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  


  return <Suspense
   fallback={<DashboardSkeleton />}>
  <DashboardClient initialData={transformedData} />;
  </Suspense>
}