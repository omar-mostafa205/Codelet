"use client"
import React from 'react';
import { Plus, Clock } from 'lucide-react';

interface TutorialChaptersProps {
  currentRepo: any;
  onTutorialClick: (tutorial: any) => void;
}

export default function TutorialChapters({ currentRepo, onTutorialClick }: TutorialChaptersProps) {
  if (!currentRepo) return null;

  const tutorials = currentRepo.tutorials?.slice(0, 6) || [];

  return (
    <div className="bg-white border-2 border-gray-200 p-6 rounded-3xl !h-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-black">Tutorial Chapters - {currentRepo.name}</h3>

      </div>
      
      {tutorials.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No tutorials yet. Create your first tutorial to get started!
        </div>
      ) : (
        <div className="space-y-3">
          {tutorials.map((tutorial: any, i: number) => (
            <div 
              key={tutorial.id} 
              onClick={() => onTutorialClick(tutorial)}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
                tutorial.status === 'completed' ? 'bg-black' :
                tutorial.status === 'in-progress' ? 'bg-gray-700' :
                'bg-gray-300'
              }`}>
                {tutorial.status === 'completed' ? (
                  <span style={{ color: '#FF6FD8' }}>✓</span>
                ) : tutorial.status === 'in-progress' ? (
                  <span style={{ color: '#FFB800' }}>⚡</span>
                ) : (
                  <span className="text-gray-600">{i + 1}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-black text-sm">{tutorial.title}</div>
                <div className="text-xs text-gray-500 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {tutorial.duration}
                  </span>
                  <span>{tutorial.diagrams} diagrams</span>
                </div>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                tutorial.status === 'completed' ? 'bg-black text-white' :
                tutorial.status === 'in-progress' ? 'bg-gray-100 text-gray-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {tutorial.status === 'completed' ? 'Done' :
                 tutorial.status === 'in-progress' ? 'Active' :
                 'Pending'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}