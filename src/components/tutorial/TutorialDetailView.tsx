"use client"
import React from 'react';
import { ArrowLeft, Clock, FileCode, ExternalLink } from 'lucide-react';

interface TutorialDetailViewProps {
  tutorial: any;
  currentRepo: any;
  onBack: () => void;
  onTutorialClick: (tutorial: any) => void;
}

export default function TutorialDetailView({ tutorial, currentRepo, onBack, onTutorialClick }: TutorialDetailViewProps) {
  if (!tutorial || !currentRepo) return null;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to {currentRepo.name}
        </button>

        <div className="bg-gradient-to-br from-black to-gray-800 text-white p-8 rounded-3xl mb-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold"
                  style={{ backgroundColor: currentRepo.iconColor }}
                >
                  {tutorial.status === 'completed' ? '✓' : '•'}
                </span>
                <div>
                  <div className="text-sm text-gray-400">{currentRepo.name}</div>
                  <h1 className="text-3xl font-bold">{tutorial.title}</h1>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <span className="flex items-center gap-2">
                  <Clock size={16} />
                  {tutorial.duration}
                </span>
                <span className="flex items-center gap-2">
                  <FileCode size={16} />
                  {tutorial.diagrams} diagrams
                </span>
                <span className="flex items-center gap-2">
                  <ExternalLink size={16} />
                  {tutorial.views || 0} views
                </span>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              tutorial.status === 'completed' ? 'bg-white text-black' :
              tutorial.status === 'in-progress' ? 'bg-yellow-400 text-black' :
              'bg-gray-700 text-white'
            }`}>
              {tutorial.status === 'completed' ? 'Completed' :
               tutorial.status === 'in-progress' ? 'In Progress' :
               'Not Started'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="bg-white border-2 border-gray-200 p-6 rounded-3xl">
              <h2 className="text-xl font-bold mb-4">Tutorial Content</h2>
              <p className="text-gray-600 mb-4">
                {tutorial.description || `This tutorial provides a comprehensive overview of ${tutorial.title.toLowerCase()}. You'll learn the key concepts, implementation details, and best practices.`}
              </p>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-semibold mb-2">What you'll learn:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Core concepts and fundamentals</li>
                  <li>• Implementation patterns and code examples</li>
                  <li>• Common pitfalls and how to avoid them</li>
                  <li>• Integration with other components</li>
                </ul>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}