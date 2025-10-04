/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";
import React, { useMemo } from "react";
import {
  SidebarGroup,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useParams, usePathname } from "next/navigation";
import { useRepo } from "@/hooks/use-repo";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { api } from "@/trpc/react";

export const TutorialSidebarDynamic = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const {tutorialId} = useParams();
  if (!user) return null;
  const { data: chapters, isLoading: chaptersLoading, error: chaptersError } = 
    api.project.getChapters.useQuery(
      { tutorialId: tutorialId?.toString()! }, 
      { 
        staleTime: 1000 * 60 * 30, 
        gcTime: 1000 * 60 * 60,    
      }
    );

  return (
    <SidebarGroup className="mt-[-5px] ml-1">
      {chaptersLoading && ( 
      <div className="container mx-auto p-2 max-w-4xl  animate-pulse">
      <div className="animate-pulse">
        <div className="h-4 w-full !bg-gray-200 rounded mb-4"></div>
        <div className="h-3 w-10 !bg-gray-200 rounded mb-2"></div>
      </div>
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
              const chapterPath = `/tutorial/${tutorialId}/chapter/${chapter.id}`;
              const isActive = pathname === chapterPath;
              
              return (
                <SidebarMenuButton key={chapter.id} asChild className="hover:bg-gray-200" disabled={chaptersLoading}>
                  <Link
                    href={chapterPath}
                    className={`flex items-start gap-3 rounded-lg px-3 py-2 transition-colors min-h-fit hover:bg-gray-200 ${
                      isActive
                        ? "text-black hover:bg-gray-200"
                        : "text-black hover:bg-gray-200"
                    }`}
                  >

                
                    <div className="flex-1 min-w-0">
                      <span className="text-sm leading-relaxed block">
                        {chapter.title}
                      </span>
                    </div>
                
                      </Link>
                      
                </SidebarMenuButton>
              );
            })
          ) : (
            <div className="container mx-auto p-2 max-w-4xl">
            <div className="animate-pulse">
              <div className="h-3 w-full !bg-gray-200 rounded mb-4"></div>
              <div className="h-2 w-10 !bg-gray-200 rounded mb-2"></div>
            </div>
          </div>
          )}
        </>
      )}
    </SidebarGroup>
  );
};