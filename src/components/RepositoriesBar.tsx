"use client"
import React, { type ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
type Repository = {
  iconColor: string | undefined;
  progress: ReactNode;
  id : string
  name: string;
  url: string;
}
interface RepositoriesBarProps {
  repositories: Repository[];
  activeRepo: string;
  onRepoClick: (repoName: string) => void;
}

export default function RepositoriesBar({ repositories, activeRepo, onRepoClick }: RepositoriesBarProps) {
  if (repositories.length === 0) {
    return (
      <div className="bg-white border-2 border-gray-200 p-8 rounded-3xl mb-8 text-center">
        <p className="text-gray-500">No repositories yet. Add your first repository to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-gray-200 p-6 rounded-3xl mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-black">Your Repositories</h3>
        <span className="text-sm text-gray-500">{repositories.length} total</span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {repositories.map((repo : Repository, i) => (
          <div 
            key={repo.id} 
            onClick={() => onRepoClick(repo.name)}
            className={`p-4 rounded-xl cursor-pointer transition-all ${
              activeRepo === repo.name 
                ? 'bg-black text-white shadow-xl scale-105' 
                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div 
                className={`w-4 h-4 rounded-full ${activeRepo === repo.name ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''}`}
                style={{ backgroundColor: repo.iconColor }}
              ></div>
              <div className={`font-bold text-sm flex-1 truncate ${activeRepo === repo.name ? 'text-white' : 'text-black'}`}>
                {repo.name}
              </div>
              <ArrowUpRight size={16} className={activeRepo === repo.name ? 'text-gray-300' : 'text-gray-400'} />
            </div>
            <div className={`flex items-center justify-between text-xs mb-3 ${activeRepo === repo.name ? 'text-gray-300' : 'text-gray-600'}`}>

              <span>{repo.tutorials?.length || 0} tutorials</span>
            </div>
            <div className="mt-3">
              <div className={`flex justify-between text-xs mb-1 ${activeRepo === repo.name ? 'text-gray-300' : 'text-gray-600'}`}>
                <span>Progress</span>
                <span className="font-bold">{repo.progress}%</span>
              </div>
              <div className={`w-full rounded-full h-1.5 ${activeRepo === repo.name ? 'bg-white/20' : 'bg-gray-200'}`}>
                <div 
                  className="rounded-full h-1.5 transition-all"
                  style={{ 
                    width: `${repo.progress}%`,
                    backgroundColor: activeRepo === repo.name ? '#ffffff' : repo.iconColor
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}