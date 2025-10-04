/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import { ChevronsUpDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShineBorder } from './ShineBorder';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Tutorial {
  id: number;
  title: string;
  duration: string;
  status: string;
  diagrams: number;
}

interface Repository {
  id: string;
  name: string;
  language: string;
  chapters: number;
  lastUpdated: string;
  progress: number;
  iconColor: string;
  tutorials?: Tutorial[];
}

interface DashboardNavProps {
  repositories: Repository[];
  activeRepo: string;
  setActiveRepo: (repo: string) => void;
  activeTutorial: Tutorial | null;
  setActiveTutorial: (tutorial: Tutorial) => void;
  currentRepo: Repository | undefined;
  currentTutorials: Tutorial[];
}

export default function DashboardNav({
  repositories,
  activeRepo,
  setActiveRepo,
  activeTutorial,
  setActiveTutorial,
  currentRepo,
  currentTutorials
}: DashboardNavProps) {
  const router = useRouter();
  
  function handleRepoClick(repoName: string) { 
    const selectedRepo = repositories.find(repo => repo.name === repoName);
    const firstTutorial = selectedRepo?.tutorials?.[0];
    
    if (firstTutorial) {
      setActiveTutorial(firstTutorial);
      router.push(`/tutorial/${firstTutorial.id}?repoId=${selectedRepo?.id}`);
      setActiveRepo(repoName);

    } else if (selectedRepo) {
      router.push(`/dashboard?repoId=${selectedRepo.id}`);
      setActiveRepo(repoName);

    }
  }

  function handleTutorialClick(tutorial: Tutorial) {
    router.push(`/tutorial/${tutorial.id}?repoId=${currentRepo?.id}`);
    setActiveTutorial(tutorial);

  }
  
  return (
    <nav className="border-b border-gray-200 bg-white -mt-3">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">

        <div className="flex items-center gap-4">

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: currentRepo?.iconColor }}
                />
                <span className="font-medium">{currentRepo?.name}</span>
                <ChevronsUpDown size={16} className="text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {repositories.map((repo) => (
                <DropdownMenuItem
                  key={repo.id}
                  onClick={() => handleRepoClick(repo.name)}
                  className="flex items-center gap-3 p-3 cursor-pointer"
                >
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: repo.iconColor }}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{repo.name}</div>
                    <div className="text-xs text-gray-500">{repo.language} • {repo.chapters} chapters</div>
                  </div>
                  {activeRepo === repo.name && (
                    <div className="w-1.5 h-1.5 rounded-full bg-black" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-2 text-gray-400">
            <span>/</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: currentRepo?.iconColor }}
                />
                <span className="font-medium">{activeTutorial?.title || 'Select Tutorial'}</span>
                <ChevronsUpDown size={16} className="text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80">
              {currentTutorials?.map((tutorial) => (
                <DropdownMenuItem
                  key={tutorial.id}
                  onClick={() => handleTutorialClick(tutorial)}
                  className="flex items-center gap-3 p-3 cursor-pointer"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    tutorial.status === 'completed' ? 'bg-black text-white' :
                    tutorial.status === 'in-progress' ? 'bg-gray-700 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {tutorial.status === 'completed' ? '✓' : tutorial.id}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{tutorial.title}</div>
                    <div className="text-xs text-gray-500">{tutorial.duration} • {tutorial.diagrams} diagrams</div>
                  </div>
                  {activeTutorial?.id === tutorial.id && (
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentRepo?.iconColor }} />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="relative rounded-full">
          <Link href="/repo-upload" className="relative z-10 bg-black text-white rounded-full px-7 py-3">
            Create Tutorial
          </Link>
          <ShineBorder
            shineColor={["#FF6FD8", "#3813C2", "#FF6FD8"]}
            borderWidth={18}
            duration={8}
            className="rounded-full"
          />
        </div>
      </div>
    </nav>
  );
}