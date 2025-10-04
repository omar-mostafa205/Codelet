"use client";
import { api } from "@/trpc/react";

export const useRepo = (userId: string) => {
  const { data: repos, isLoading, error } = api.project.getRepos.useQuery(
    undefined, 
    {
      enabled: Boolean(userId), 
      staleTime: 1000 * 60 * 20, 
      gcTime: 1000 * 60 * 45,   
    }
  );
  const repo = repos?.[0];
  
  return {
    repo,
    repos,
    isLoading,   
    error,      
  };
};