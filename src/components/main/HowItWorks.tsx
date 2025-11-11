import Image from "next/image";
import Link from "next/link";

export default function ThreeStepProcess() {
  return (
    <div className="bg-[#f8fafc] min-h-screen w-ful py-30">
    <div className="max-w-[85rem] mx-auto min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 ">
      <div className="w-[97%] rounded-3xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-6 bg-white rounded-2xl">
          <div className="p-12 lg:p-16">
            <div className="inline-block bg-white border-1 border-purple-500 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 text-gray-700 shadow-2xl">
              HOW IT WORKS
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              A Simple 3-Step Process
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 p-4 rounded-lg">
              Master any codebase in minutes with Codelet's intelligent 3-step process that transforms complex code into clear, understandable insights.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
              href='/repo-upload'
               className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
          
          <div className="relative min-h-[400px] lg:min-h-0 rounded-2xl">
            <Image 
              src="/bgcolored.png" 
              alt="Background" 
              width={700}
              height={700}
              className="absolute inset-0 w-[100%] h-[90%] rounded-2xl"
            />
            <Image 
              src="/rocket.png" 
              alt="Team collaboration"
              width={700}
              height={700}
              className="relative w-[40%] h-[92%] ml-45 "
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          <div className="p-5 bg-white rounded-2xl">
            <div className="bg-gradient-to-br from-purple-100 to-purple-300 rounded-2xl p-8 mb-6 h-64 flex items-center justify-center relative overflow-hidden">
              <Image 
                src="/copyData.png" 
                alt="Connect"
                width={700}
                height={700}
                className="w-full h-full object-contain"
              />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Upload Your Codebase
            </h3>
            <p className="text-gray-600">
              Simply upload your repository or paste code snippets to get started instantly.
            </p>
          </div>
          
          <div className="p-5 bg-white rounded-2xl">
            <div className="bg-gradient-to-br from-purple-100 to-purple-300 rounded-2xl p-8 mb-6 h-64 flex items-center justify-center relative overflow-hidden">
              <Image 
                src="/analyize.png" 
                alt="Analyze"
                width={700}
                height={700}
                className="w-full h-full object-contain"
              />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              AI Analyzes & Visualizes
            </h3>
            <p className="text-gray-600">
              Our AI generates detailed explanations, diagrams, and code snippets automatically.
            </p>
          </div>
          
          <div className="p-5 bg-white rounded-2xl">
            <div className="bg-gradient-to-br from-purple-100 to-purple-300 rounded-2xl p-8 mb-6 h-64 flex items-center justify-center relative overflow-hidden">
              <Image 
                src="/aiWork.png" 
                alt="AI Work"
                width={700}
                height={700}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Understand Everything
            </h3>
            <p className="text-gray-600">
              Navigate your codebase with confidence using interactive guides and explanations.
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}