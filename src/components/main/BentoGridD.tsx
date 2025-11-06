import Image from "next/image";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

const features = [
  {
    name: "AI Copilot",
    description: "Your intelligent coding companion that understands your codebase, answers questions",
    className: "col-span-3 lg:col-span-1",
    background: (
<div className="absolute inset-0 overflow-hidden rounded-xl">
  <div className="absolute inset-0 bg-white" />
  <div className="absolute top-0 left-0 right-0 bottom-[35%] p-4">
    <div className="relative w-full rounded-t-2xl overflow-hidden h-[120%]">
      <Image 
        src="/bg90.jpg" 
        alt="Adaptive Learning"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 z-10">
        <Image 
          src="/dddd.png" 
          alt="Overlay"
          width={500}
          height={500}
          className=" transform translate-y-[120%]  object-contain"
        />
      </div>
    </div>
  </div>
</div>
    ),
  },
  {
    name: "Diagrams & Visualizes",
    description: "AI-generated diagrams and visualizations to help you quickly understand and navigate any codebase",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute inset-0 flex items-center justify-center p-4">
    <div className="relative w-full h-full bg-white rounded-2xl  overflow-hidden">
    <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 60% 20%, rgba(175, 109, 255, 0.50), transparent 65%),
              radial-gradient(ellipse 70% 60% at 20% 80%, rgba(255, 100, 180, 0.45), transparent 65%),
              radial-gradient(ellipse 60% 50% at 60% 65%, rgba(255, 235, 170, 0.43), transparent 62%),
              radial-gradient(ellipse 65% 40% at 50% 60%, rgba(120, 190, 255, 0.48), transparent 68%),
              linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
            `,
          }}
        />
        <div className="absolute top-0 left-0 right-0 bottom-[35%] p-4">
          <div className="relative w-full  rounded-2xl overflow-hidden  h-[120%] bg-white p-6">
            <div className="relative w-full h-full">
              <Image 
                src="/diagrams.png" 
                alt="Diagrams"
                fill
                className="object-cover h-[]"
              />
            </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "Code Snippets",
    description: "AI-generated code snippets with clear explanations to make understanding and reusing code effortless.",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full h-full bg-white rounded-2xl overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 80% 60% at 60% 20%, rgba(147, 51, 234, 0.50), transparent 65%),
                radial-gradient(ellipse 70% 60% at 20% 80%, rgba(59, 130, 246, 0.45), transparent 65%),
                radial-gradient(ellipse 60% 50% at 60% 65%, rgba(255, 255, 255, 0.43), transparent 62%),
                radial-gradient(ellipse 65% 40% at 50% 60%, rgba(139, 92, 246, 0.48), transparent 68%),
                linear-gradient(180deg, #ede9fe 0%, #dbeafe 100%)
              `,
            }}
          />
          <div className="absolute top-6 left-0 right-0 bottom-[45%] p-2">
            <div className="relative w-full rounded-2xl overflow-hidden h-[130%] bg-white p-3">
              <div className="relative w-full h-full">
                <Image 
                  src="/xx.png" 
                  alt="Code Snippets"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "Step by Step Guides", 
    description: "Step-by-step AI explanations that break down complex codebases into simple, clear guidance.",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 p-4">
        <div className="relative w-full h-full bg-white rounded-2xl p-2 overflow-auto">
          <div className="absolute inset-0">
            <Image 
              src="/aicode.jpg" 
              alt="Step by Step Guides Background"
              fill
              className="object-cover "
            />
          </div>
  
          {/* Text Content */}
          <div className="relative w-full h-[300px] text-gray-800 p-4 bg-white mb-4 text-[15px] rounded-2xl mt-4">
            <h2 className="text-md font-medium mb-2">
              React Server Components and tRPC Hydration
            </h2>
  
            <div className="border-t border-gray-200 my-2" />
  
            <p className="mb-6 leading-relaxed">
              <code className="bg-gray-100 px-2 py-1 rounded text-[10px]">src/trpc/server.ts<br/></code> sets up the tRPC context for React Server Components (RSC). 
              It uses <code className="bg-gray-100 px-2 py-1 rounded text-[10px]">createHydrationHelpers</code> to prefetch data on the server and hydrate the client, 
              improving performance. The 
              <code className="bg-gray-100 px-2 py-1 rounded text-sm ml-1 text-[10px]">HydrateClient</code> <br/>component is crucial for passing the server-side data to the client.
            </p>
          </div>
        </div>
      </div>
    ),
  }
  
  
];

export function BentoGridD() {
  return (
    <BentoGrid className="max-w-7xl mx-auto">
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  );
}