import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function FluenceFooter() {
  return (
    <footer className="relative text-white overflow-hidden min-h-[70vh] -ml-1">

      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/footerPng.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <div className="absolute inset-0 flex items-end justify-center overflow-hidden pointer-events-none mx-auto">
        <span className="text-[280px] font-bold tracking-tight opacity-[0.08] leading-none -mb-15 -ml-8">Codelet</span>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-md" />
              <span className="text-2xl font-semibold">Codelet </span>
            </div>
            <p className="text-gray-300 mb-6">©2025 Codelet ,Inc.</p>
            
            {/* Social Icons */}
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center hover:border-white transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center hover:border-white transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center hover:border-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center hover:border-white transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Use Link Section */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Use Link</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Feature</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Testimonial</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">404</a></li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <address className="not-italic text-gray-300 leading-relaxed">
            Virtual Company
            </address>
          </div>
        </div>

      </div>
    </footer>
  );
}