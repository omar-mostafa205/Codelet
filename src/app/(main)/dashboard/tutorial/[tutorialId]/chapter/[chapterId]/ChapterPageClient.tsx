"use client";

import { ChapterContent } from "@/components/tutorial/ChapterContent";
import { api } from "@/trpc/react";
import { Suspense } from "react";

interface ChapterPageClientProps {
  chapterId: string;
  userId: string;
}

export function ChapterPageClient({ chapterId }: ChapterPageClientProps) {
  const { data: chapter, isLoading, error } = api.project.getChapter.useQuery(
    { chapterId },
    {
      enabled: Boolean(chapterId),
      staleTime: 1000 * 60 * 30, 
      gcTime: 1000 * 60 * 60,   
    }
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-12 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-red-500 text-center py-8">
          Error loading chapter: {error.message}
        </div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-gray-500 text-center py-8">
          Chapter not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <div className="text-sm text-gray-500 mb-2">
          {chapter.tutorial.repository} / {chapter.tutorial.title}
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Chapter {chapter.chapterNumber}: {chapter.title}
        </h1>
      </div>
      
      <Suspense fallback={
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
        </div>
      }>
        <ChapterContent subChapters={chapter.subChapters} />
      </Suspense>
    </div>
  );
}
