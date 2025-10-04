"use client"
import React from 'react';
import { Zap, BookOpen, TrendingUp } from 'lucide-react';

export default function QuickStats() {
  return (
    <div className="bg-white border-2 border-gray-200 p-6 rounded-3xl">
      <h3 className="text-xl font-bold mb-4 text-black">Quick Stats</h3>
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium text-black">Active Streak</span>
          </div>
          <div className="text-3xl font-bold text-black">7 days</div>
          <div className="text-xs text-gray-600 mt-1">Keep it going!</div>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium text-black">Avg. Tutorial Time</span>
          </div>
          <div className="text-3xl font-bold text-black">11 min</div>
          <div className="text-xs text-gray-600 mt-1">Per tutorial generated</div>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium text-black">This Week</span>
          </div>
          <div className="text-3xl font-bold text-black">+32%</div>
          <div className="text-xs text-gray-600 mt-1">Activity vs last week</div>
        </div>
      </div>
    </div>
  );
}