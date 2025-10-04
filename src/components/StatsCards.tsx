/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client"
import React from 'react';
import { TrendingUp, GitBranch, BookOpen, MessageSquare, FileCode, Zap } from 'lucide-react';

interface StatsCardsProps {
  repositories: any[];
}

export default function StatsCards({ repositories }: StatsCardsProps) {
  const totalRepos = repositories.length;
  const totalTutorials = repositories.reduce((sum, repo) => sum + (repo.tutorials?.length || 0), 0);
  const totalDiagrams = repositories.reduce((sum, repo) => 
    sum + (repo.tutorials?.reduce((tSum: number, t: any) => tSum + (t.diagrams || 0), 0) || 0), 0
  );

  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
      <div className="bg-black text-white p-6 rounded-3xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium">Total Repositories</span>
            <div className="">
              <GitBranch size={20} style={{ color: '#FF6FD8' }} />
            </div>
          </div>
          <div className="text-6xl font-bold mb-2">{totalRepos}</div>
          <div className="flex items-center gap-2 text-xs">
            <TrendingUp size={14} />
            <span>Active repositories</span>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 p-6 rounded-3xl">
        <div className="flex justify-between items-start mb-4">
          <span className="text-sm font-medium text-black">Tutorials Created</span>
          <div className="">
            <BookOpen size={20} style={{ color: '#3813C2' }} />
          </div>
        </div>
        <div className="text-6xl font-bold text-black mb-2">{totalTutorials}</div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Zap size={14} />
          <span>AI-generated tutorials</span>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 p-6 rounded-3xl">
        <div className="flex justify-between items-start mb-4">
          <span className="text-sm font-medium text-black">AI Chat Sessions</span>
          <div className="">
            <MessageSquare size={20} style={{ color: '#FF6B35' }} />
          </div>
        </div>
        <div className="text-6xl font-bold text-black mb-2">
          {repositories.reduce((sum, repo) => 
            sum + (repo.tutorials?.reduce((tSum: number, t: any) => 
              tSum + (t.chatSessions?.length || 0), 0) || 0), 0
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <TrendingUp size={14} />
          <span>Active conversations</span>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 p-6 rounded-3xl">
        <div className="flex justify-between items-start mb-4">
          <span className="text-sm font-medium text-black">Code Diagrams</span>
          <div className="">
            <FileCode size={20} style={{ color: '#FFB800' }} />
          </div>
        </div>
        <div className="text-6xl font-bold text-black mb-2">{totalDiagrams}</div>
        <div className="text-xs text-gray-600">Generated visualizations</div>
      </div>
    </div>
  );
}