import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      text: "Fluence AI has revolutionized the way we process data. The seamless integration and advanced analytics tools have saved us countless hours and improved our decision-making",
      name: "Sarah J.",
      role: "Data Analyst, TechCorp",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    },
    {
      text: "The platform's intuitive interface and powerful features have transformed our workflow. We've seen a 300% increase in productivity since implementing Fluence AI",
      name: "Michael Chen",
      role: "VP of Operations, DataFlow Inc",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    },
    {
      text: "Outstanding results! The AI-driven insights have helped us make strategic decisions faster and with greater confidence. Highly recommended for any data-driven organization",
      name: "Emily Rodriguez",
      role: "Chief Strategy Officer, InnovateTech",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
    }
  ];

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
      <div className="bg-white px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider mb-5 text-gray-800">
        Wall of Love
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
      <div className="flex flex-wrap items-center justify-center gap-12 opacity-60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-700/40 rotate-45 rounded-lg"></div>
          <span className="text-xl font-semibold text-gray-700">business</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-700/40 rounded-full border-4 border-gray-700/40"></div>
          <span className="text-xl font-semibold text-gray-700">logoipsum</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-700/40 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <span className="text-xl font-semibold text-gray-700">Logoipsum</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
            <path d="M2 12L8 6L14 12L20 6L22 8L14 16L8 10L4 14L2 12Z" fill="currentColor" className="text-gray-700/40"/>
          </svg>
          <span className="text-xl font-semibold text-gray-700">startup</span>
        </div>
      </div>
    </div>
  );
}