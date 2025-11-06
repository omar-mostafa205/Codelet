/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";
import React, { useState, useEffect } from 'react';
import { ChevronsUpDown, Github } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { api } from '@/trpc/react';
import Image from 'next/image';
import Link from 'next/link';

interface Tutorial {
  id: string;
  title: string;
  duration?: string;
  status?: string;
  chapters?: any[];
  createdAt: Date;
  updatedAt?: Date;
}

interface Repository {
  id: string;
  name: string;
  language?: string;
  chapters?: number;
  lastUpdated?: string;
  progress?: number;
  iconColor?: string;
  githubUrl?: string;
  createdAt: Date;
}

export default function DashboardNav() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const repoId = searchParams.get('repoId');
  const [activeRepo, setActiveRepo] = useState<string>('');
  const [activeTutorial, setActiveTutorial] = useState<Tutorial | null>(null);
  const isDashboard = pathname === '/dashboard';
  const isPastTutorials = pathname?.includes('past-tutorials');
  const isTutorialPage = pathname?.includes('/tutorial/');
  
  const showTutorials = isPastTutorials || isTutorialPage;

  const { data: repos } = api.project.getRepos.useQuery();

  const { data: currentRepo } = api.project.getRepoById.useQuery(
    { repoId: repoId || '' },
    { enabled: showTutorials && !!repoId }
  );

  const { data: tutorials } = api.project.getLatestTutorials.useQuery(
    { repoId: repoId || '' },
    { enabled: showTutorials && !!repoId }
  );

  useEffect(() => {
    if (currentRepo) {
      setActiveRepo(currentRepo.name);
    }
  }, [currentRepo]);

  useEffect(() => {
    if (isTutorialPage && tutorials) {
      const tutorialId = pathname?.split('/tutorial/')[1]?.split('?')[0];
      const tutorial = tutorials.find(t => t.id === tutorialId);
      if (tutorial) {
        setActiveTutorial(tutorial);
      }
    }
  }, [isTutorialPage, tutorials, pathname]);

  function handleRepoClick(repo: Repository) {
    setActiveRepo(repo.name);
    
    if (showTutorials) {
      router.push(`/dashboard/past-tutorials?repoId=${repo.id}`);
    } else {
      router.push(`/dashboard?repoId=${repo.id}`);
    }
  }

  function handleTutorialClick(tutorial: Tutorial) {
    setActiveTutorial(tutorial);
    router.push(`/dashboard/tutorial/${tutorial.id}?repoId=${repoId}`);
  }

  return (
    <nav className="bg-[#f8f8f8] border-b border-[#e5e5e5] h-[56px] flex items-center justify-between px-4 z-50">
      <div className="flex items-center space-x-3">
        <div className="flex items-center gap-2">
          <Link href="/">
          <Image
            src="/final.png"
            alt="Logo"
            width={30}  
            height={30} 
            className="rounded-[10px]"
          />
          </Link>
            <span className="text-gray-400">/</span>
          <Link href="/dashboard" className="text-[15px] font-medium text-gray-800">Personal Workspace</Link>
        </div>

        <span className="text-gray-400">/</span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 hover:bg-gray-100 rounded-md px-2 py-1 transition-colors">
              <span className="text-[15px] font-medium text-gray-800">
                {currentRepo?.name || (isDashboard ? 'Select Repository' : 'Repository')}
              </span>
              <ChevronsUpDown size={14} className="text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-100">
            {repos?.map((repo) => (
              <DropdownMenuItem
                key={repo.id}
                onClick={() => handleRepoClick(repo)}
                className="flex items-center gap-3 p-3 cursor-pointer"
              >
                <Github size={16} className="text-gray-600" />
                <div className="flex-1">
                  <div className="font-medium text-sm">{repo.name}</div>
                  <div className="text-xs text-gray-500">
                    {repo.githubUrl || 'Repository'}
                  </div>
                </div>
                {activeRepo === repo.name && (
                  <div className="w-1.5 h-1.5 rounded-full bg-black" />
                )}
              </DropdownMenuItem>
            ))}
            {(!repos || repos.length === 0) && (
              <div className="p-4 text-sm text-gray-500 text-center">
                No repositories yet
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {showTutorials && currentRepo && (
          <>
            <span className="text-gray-400">/</span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 hover:bg-gray-100 rounded-md px-2 py-1 transition-colors">
                  <Github size={16} className="text-gray-600" />
                  <span className="text-[15px] font-medium text-gray-800">
                    {activeTutorial?.title || 'Select Tutorial'}
                  </span>
                  <ChevronsUpDown size={14} className="text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80">
                {tutorials?.map((tutorial) => (
                  <DropdownMenuItem
                    key={tutorial.id}
                    onClick={() => handleTutorialClick(tutorial)}
                    className="flex items-center gap-3 p-3 cursor-pointer"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">{tutorial.title}</div>
                      <div className="text-xs text-gray-500">
                        {tutorial.chapters?.length || 5} chapters
                      </div>
                    </div>
                    {activeTutorial?.id === tutorial.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-black" />
                    )}
                  </DropdownMenuItem>
                ))}
                {(!tutorials || tutorials.length === 0) && (
                  <div className="p-4 text-sm text-gray-500 text-center">
                    No tutorials yet
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: 'w-8 h-8',
            },
          }}
        />
      </div>
    </nav>
  );
}