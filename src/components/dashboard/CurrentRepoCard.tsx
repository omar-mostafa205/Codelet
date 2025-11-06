"use client"
import React from 'react';
import { GitBranch, ArrowUpRight } from 'lucide-react';

interface CurrentRepoCardProps {
  currentRepo: any;
  onViewAll: () => void;
}

export default function CurrentRepoCard({ currentRepo, onViewAll }: CurrentRepoCardProps) {
  if (!currentRepo) return null;

  return (
    <div className="bg-black text-white p-6 rounded-3xl relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <GitBranch size={20} style={{ color: currentRepo.iconColor }} />
          <span className="text-sm font-medium">Current Repository</span>
        </div>
        <h3 className="text-2xl font-bold mb-2">{currentRepo.name}</h3>
        <div className="flex items-center gap-4 text-sm mb-6">
          <span className="bg-white/20 px-3 py-1 rounded-full">{currentRepo.language}  JS </span>
          <span>{currentRepo.tutorials?.length || 0} tutorials</span>
        </div>
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-2">
            <span>Documentation Progress</span>
            <span className="font-bold">{currentRepo.progress}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ width: `${currentRepo.progress}%` }}
            ></div>
          </div>
        </div>
        <p className="text-xs opacity-80 mt-4">Last updated {currentRepo.lastUpdated}</p>
        <button 
          onClick={onViewAll}
          className="w-full mt-4 bg-white text-black py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
        >
          View All Tutorials
          <ArrowUpRight size={16} />
        </button>
      </div>
    </div>
  );
}