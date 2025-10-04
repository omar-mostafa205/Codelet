/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"
import React from 'react';
import { TrendingUp, ArrowUpRight, Plus, BookOpen, MessageSquare, GitBranch, FileCode, Zap, Clock } from 'lucide-react';
import StatsCards from './StatsCards';
import RepositoriesBar from './RepositoriesBar';
import TutorialChapters from './TutorialChapters';
import CurrentRepoCard from './CurrentRepoCard';
import RecentChats from './RecentChats';
import QuickStats from './QuickStats';

interface DashboardMainViewProps {
  repositories: any[];
  activeRepo: string;
  currentRepo: any;
  recentChats: any[];
  onRepoClick: (repoName: string) => void;
  onTutorialClick: (tutorial: any) => void;
}

export default function DashboardMainView({
  repositories,
  activeRepo,
  currentRepo,
  recentChats,
  onRepoClick,
  onTutorialClick
}: DashboardMainViewProps) {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">Dashboard</h1>
            <p className="text-gray-500">AI-powered code documentation and tutorials for your repositories.</p>
          </div>
        </div>

        <RepositoriesBar
          repositories={repositories}
          activeRepo={activeRepo}
          onRepoClick={onRepoClick}
        />

        <StatsCards repositories={repositories} />

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="col-span-2">
            <TutorialChapters
              currentRepo={currentRepo}
              onTutorialClick={onTutorialClick}
            />
          </div>
          
          <CurrentRepoCard
            currentRepo={currentRepo}
            onViewAll={() => onRepoClick(currentRepo.name)}
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <RecentChats recentChats={recentChats} />
          </div>
          
          <QuickStats />
        </div>
      </div>
    </div>
  );
}