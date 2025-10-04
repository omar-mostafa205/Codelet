// "use client"
// import React from 'react';
// import { ArrowLeft, GitBranch, Clock, FileCode, ArrowUpRight } from 'lucide-react';

// interface RepositoryDetailViewProps {
//   currentRepo: any;
//   onBack: () => void;
//   onTutorialClick: (tutorial: any) => void;
// }

// export default function RepositoryDetailView({ currentRepo, onBack, onTutorialClick }: RepositoryDetailViewProps) {
//   if (!currentRepo) return null;

//   return (
//     <div className="p-8">
//       <div className="max-w-7xl mx-auto">
//         <button 
//           onClick={onBack}
//           className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors"
//         >
//           <ArrowLeft size={20} />
//           Back to Dashboard
//         </button>

//         <div className="bg-gradient-to-br from-black to-gray-800 text-white p-8 rounded-3xl mb-8">
//           <div className="flex items-start justify-between">
//             <div>
//               <div className="flex items-center gap-3 mb-4">
//                 <GitBranch size={32} style={{ color: currentRepo.iconColor }} />
//                 <h1 className="text-4xl font-bold">{currentRepo.name}</h1>
//               </div>
//               <p className="text-gray-300 mb-4 max-w-2xl">{currentRepo.description}</p>
//               <div className="flex items-center gap-6 text-sm">
//                 <span className="bg-white/20 px-4 py-2 rounded-full">{currentRepo.language}</span>
//                 <span>{currentRepo.tutorials?.length || 0} tutorials</span>
//                 <span>Updated {currentRepo.lastUpdated}</span>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="text-5xl font-bold mb-2">{currentRepo.progress}%</div>
//               <div className="text-sm text-gray-300">Complete</div>
//             </div>
//           </div>
//           <div className="mt-6">
//             <div className="w-full bg-white/20 rounded-full h-3">
//               <div 
//                 className="bg-white rounded-full h-3 transition-all duration-500"
//                 style={{ width: `${currentRepo.progress}%` }}
//               ></div>
//             </div>
//           </div>
//         </div>

//         <div className="mb-6">
//           <h2 className="text-2xl font-bold mb-4">All Tutorials ({currentRepo.tutorials?.length || 0})</h2>
//         </div>

//         <div className="grid grid-cols-3 gap-6">
//           {currentRepo.tutorials?.map((tutorial: any) => (
//             <div 
//               key={tutorial.id}
//               onClick={() => onTutorialClick(tutorial)}
//               className="bg-white border-2 border-gray-200 p-6 rounded-3xl hover:border-black hover:shadow-xl transition-all cursor-pointer"
//             >
//               <div className="flex items-start justify-between mb-4">
//                 <div 
//                   className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl ${
//                     tutorial.status === 'completed' ? 'bg-black' :
//                     tutorial.status === 'in-progress' ? 'bg-gray-700' :
//                     'bg-gray-300'
//                   }`}
//                 >
//                   {tutorial.status === 'completed' ? (
//                     <span style={{ color: currentRepo.iconColor }}>✓</span>
//                   ) : tutorial.status === 'in-progress' ? (
//                     <span style={{ color: '#FFB800' }}>⚡</span>
//                   ) : (
//                     <span className="text-gray-600">•</span>
//                   )}
//                 </div>
//                 <span className={`text-xs px-3 py-1 rounded-full font-medium ${
//                   tutorial.status === 'completed' ? 'bg-black text-white' :
//                   tutorial.status === 'in-progress' ? 'bg-gray-100 text-gray-700' :
//                   'bg-gray-100 text-gray-600'
//                 }`}>
//                   {tutorial.status === 'completed' ? 'Done' :
//                    tutorial.status === 'in-progress' ? 'Active' :
//                    'Pending'}
//                 </span>
//               </div>
//               <h3 className="font-bold text-lg mb-3 text-black">{tutorial.title}</h3>
//               <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
//                 <span className="flex items-center gap-1">
//                   <Clock size={14} />
//                   {tutorial.duration}
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <FileCode size={14} />
//                   {tutorial.diagrams} diagrams
//                 </span>
//               </div>
//               <div className="flex items-center justify-between pt-3 border-t border-gray-200">
//                 <span className="text-xs text-gray-500">{tutorial.views || 0} views</span>
//                 <ArrowUpRight size={16} className="text-gray-400" />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }