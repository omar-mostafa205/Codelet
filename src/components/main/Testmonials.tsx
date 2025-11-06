/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TestimonialsSection() {

  const testimonials = [
    {
      text: "Codelet makes understanding our massive codebase effortless. The AI-generated diagrams and explanations save our developers hours every week.",
      name: "Sarah J.",
      role: "Software Engineer, DevWorks",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    },
    {
      text: "Our onboarding process has completely transformed. New engineers can now grasp the code structure in days instead of weeks, thanks to Fluence AI’s step-by-step guides.",
      name: "Michael Chen",
      role: "Engineering Manager, CodeFlow Inc",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    },
    {
      text: " Codelet helps us align product and engineering teams. The visualized workflows and clear code explanations make collaboration smooth and fast.",
      name: "Emily Rodriguez",
      role: "Product Lead, InnovateTech",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
    }
  ]

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div 
      className="min-h-screen w-[97vw] flex flex-col items-center justify-center px-5 py-16 relative mx-auto rounded-2xl"
      style={{
        backgroundImage: 'url(/bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
              <div className='inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-purple-500 mb-4 '>
              WALL OF LOVE
      </div>

      {/* Title */}
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-16 text-center">
        What they're Saying
      </h1>

      {/* Testimonial Card */}
      <div className="relative max-w-2xl w-full mb-20">
        {/* Navigation Buttons */}
        <button
          onClick={prevTestimonial}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        <button
          onClick={nextTestimonial}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>

        {/* Card */}
        <div className="bg-white rounded-3xl p-10 shadow-xl">
          <p className="text-xl text-gray-800 leading-relaxed mb-8">
            "{testimonials[currentIndex].text}"
          </p>

          <div className="flex items-center gap-4">
            <img
              src={testimonials[currentIndex].avatar}
              alt={testimonials[currentIndex].name}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <div className="font-semibold text-gray-900">
                {testimonials[currentIndex].name}
              </div>
              <div className="text-sm text-gray-600">
                {testimonials[currentIndex].role}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap justify-center gap-16 mb-16">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900 mb-2">100+</div>
          <div className="text-sm text-gray-700">Businesses are Happy</div>
        </div>
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900 mb-2">5000+</div>
          <div className="text-sm text-gray-700">Data-driven decisions</div>
        </div>
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900 mb-2">98%</div>
          <div className="text-sm text-gray-700">Customer Satisfied</div>
        </div>
      </div>

      {/* Company Logos */}
      <section className="bg-transparent py-16">
            <div className="mx-auto max-w-5xl px-6">
                <h2 className="text-center text-4xl font-semibold -mb-10">Devlopers from these companies use Codelet</h2>
                <div className="mx-auto mt-20 flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-12 text-gray-500">
                <img className="h-5 w-fit grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" src="https://html.tailus.io/blocks/customers/nvidia.svg" alt="Nvidia Logo" height="20" width="auto" />
                    <img className="h-5 w-fit grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"src="https://html.tailus.io/blocks/customers/column.svg" alt="Column Logo" height="16" width="auto" />
                    <img className="h-5 w-fit grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"src="https://html.tailus.io/blocks/customers/github.svg" alt="GitHub Logo" height="16" width="auto" />
                    <img className="h-5 w-fit grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"src="https://html.tailus.io/blocks/customers/nike.svg" alt="Nike Logo" height="20" width="auto" />
                    <img className="h-5 w-fit grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" src="https://html.tailus.io/blocks/customers/laravel.svg" alt="Laravel Logo" height="16" width="auto" />
                    <img className="h-5 w-fit grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"src="https://html.tailus.io/blocks/customers/lilly.svg" alt="Lilly Logo" height="28" width="auto" />
                    <img className="h-5 w-fit grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg" alt="Lemon Squeezy Logo" height="20" width="auto" />
                    <img className="h-5 w-fit grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" src="https://html.tailus.io/blocks/customers/openai.svg" alt="OpenAI Logo" height="24" width="auto" />
                    <img className="h-5 w-fit grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"src="https://html.tailus.io/blocks/customers/tailwindcss.svg" alt="Tailwind CSS Logo" height="16" width="auto" />
                    <img className="h-5 w-fit grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" src="https://html.tailus.io/blocks/customers/vercel.svg" alt="Vercel Logo" height="20" width="auto" />
                    <img className="h-5 w-fit grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" src="https://html.tailus.io/blocks/customers/zapier.svg" alt="Zapier Logo" height="20" width="auto" />
                </div>
            </div>
        </section>
    
 
    </div>
  );
}