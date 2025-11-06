"use client";
import React from "react";
import {
  SidebarGroup,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { api } from "@/trpc/react";

export const TutorialSidebarDynamic = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const { tutorialId } : { tutorialId : string}= useParams();
  const repoId = useSearchParams().get("repoId");  
 const router  = useRouter();

 const { data: chapters, isLoading: chaptersLoading, error: chaptersError } = 
 api.project.getChapters.useQuery(
   { tutorialId: tutorialId.toString() }, 
   { 
     staleTime: 1000 * 60 * 30, 
     gcTime: 1000 * 60 * 60,    
   }
 );

 
   if (!user) return null;

  if (!tutorialId) {
    return (
      <SidebarGroup className="mt-[-5px] ml-1">
        <div className="px-3 py-4 text-center">
          <p className="text-sm text-gray-500">Select a repository to view chapters</p>
        </div>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup className="mt-[-5px] ml-1">
      {chaptersLoading && ( 
        <div className="container mx-auto p-2 max-w-4xl animate-pulse">
          <div className="h-4 w-full !bg-gray-200 rounded mb-4"></div>
          <div className="h-3 w-10 !bg-gray-200 rounded mb-2"></div>
        </div>
      )}
      
      {chaptersError && (
        <div className="px-3 py-4 text-center">
          <p className="text-sm text-red-500">Error: {chaptersError.message}</p>
        </div>
      )}
      
      {!chaptersLoading && !chaptersError && (
        <> 
          {chapters && chapters.length > 0 ? (
            chapters.map((chapter) => {
              const chapterPath = `/dashboard/tutorial/${tutorialId}/chapter/${chapter.id}?repoId=${repoId}`;
              const isActive = pathname === chapterPath;
              
              return (
                <SidebarMenuButton key={chapter.id} asChild className="hover:bg-gray-200" disabled={chaptersLoading}>
                  <button
                    onClick={() => {router.push(chapterPath);}}
                    className={`flex 
                      items-start gap-3 rounded-lg px-3 py-2 transition-colors cursor-pointer min-h-fit hover:bg-gray-200 ${
                      isActive
                        ? "text-black !bg-gray-200"
                        : "text-black hover:bg-gray-200"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-sm leading-relaxed block">
                        {chapter.title}
                      </span>
                    </div>
                  </button>
                </SidebarMenuButton>
              );
            })
          ) : (
            <div className="px-3 py-4 text-center">
              <p className="text-sm text-gray-500">Select a Repository</p>
            </div>
          )}
        </>
      )}
    </SidebarGroup>
  );
};