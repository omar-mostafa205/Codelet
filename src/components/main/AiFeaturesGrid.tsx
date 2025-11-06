import React from 'react';
import { BentoGridD } from './BentoGridD';

export default function AIFeaturesGrid() {
  return (
    <div className="min-h-[200vh] bg-[#f8fafc] py-30 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-sm font-medium text-gray-600 border border-purple-700 rounded-full px-4 py-1 shadow-xl">
              FEATURES
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          The AI-powered developer <br />
           learning platform
                    </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Codelet helps you explore, understand, and optimize any codebase effortlessly. Generate instant diagrams, walkthroughs, and explanations that accelerate learning and make complex systems easy to grasp.
          </p>
        </div>
    <BentoGridD />
      </div>
    </div>
  );
}
