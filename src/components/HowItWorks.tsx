import Image from "next/image";

export default function ThreeStepProcess() {
  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-gray-100 flex items-center justify-center p-6 py-40">
      <div className="w-[97%] bg-white rounded-3xl overflow-hidden">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-6">
          {/* Left Content */}
          <div className="p-12 lg:p-16">
            <div className="inline-block bg-white border-2 border-dashed border-gray-400 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 text-gray-700">
              How It Works
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              A Simple 3-Step Process
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 p-4 rounded-lg">
              Get started quickly and effortlessly with Fluence AI's streamlined 3-step process designed to optimize your data workflow.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                Get Started
              </button>
              <button className="bg-white border-2 border-dashed border-gray-900 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Book a Demo
              </button>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative bg-gray-200 min-h-[400px] lg:min-h-0 rounded-2xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop" 
              alt="Team collaboration"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl px-6 py-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"></div>
              <span className="font-semibold text-gray-900">AI Analysis Complete</span>
            </div>
          </div>
        </div>
        
        {/* Bottom Three Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 ">
          {/* Card 1 */}
          <div className="p-10">
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
              Connect Your Data
            </h3>
            <p className="text-gray-600">
              Effortlessly integrate data from various sources into a unified system.
            </p>
          </div>
          
          {/* Card 2 */}
          <div className="p-8">
            <div className="bg-gradient-to-br from-purple-100 to-purple-300 rounded-2xl p-8 mb-6 h-64 flex items-center justify-center relative overflow-hidden">
              <img 
                src="/analyize.png" 
                alt="Analyze"
                className="w-full h-full object-contain"
              />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Analyze and Optimize
            </h3>
            <p className="text-gray-600">
              Use AI to uncover valuable insights and improve performance.
            </p>
          </div>
          
          {/* Card 3 */}
          <div className="p-8">
            <div className="bg-gradient-to-br from-purple-100 to-purple-300 rounded-2xl p-8 mb-6 h-64 flex items-center justify-center relative overflow-hidden">
              <img 
                src="/aiWork.png" 
                alt="AI Work"
                className="w-full h-full object-contain"
              />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Let AI Work
            </h3>
            <p className="text-gray-600">
              Streamline tasks and enhance productivity with AI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}