/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React from 'react'
import Link from "next/link";
const MobileNav = ({scrollToSection , closeMenu , user }) => {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 mx-4 bg-white rounded-2xl shadow-xl border border-gray-200 lg:hidden z-50">
    <ul className="py-4">
      <li>
        <button 
          onClick={() => scrollToSection('home')}
          className="block w-full text-left px-6 py-3 text-gray-700 hover:text-purple-600 hover:bg-gray-50 font-medium transition-colors duration-200"
        >
          Home
        </button>
      </li>
      <li>
        <button 
          onClick={() => scrollToSection('features')}
          className="block w-full text-left px-6 py-3 text-gray-700 hover:text-purple-600 hover:bg-gray-50 font-medium transition-colors duration-200"
        >
          Features
        </button>
      </li>
      <li>
        <button 
          onClick={() => scrollToSection('ai')}
          className="block w-full text-left px-6 py-3 text-gray-700 hover:text-purple-600 hover:bg-gray-50 font-medium transition-colors duration-200"
        >
          AI Features
        </button>
      </li>
      <li>
        <button 
          onClick={() => scrollToSection('how-it-works')}
          className="block w-full text-left px-6 py-3 text-gray-700 hover:text-purple-600 hover:bg-gray-50 font-medium transition-colors duration-200"
        >
          How It Works
        </button>
      </li>
      <li>
        <button 
          onClick={() => scrollToSection('testimonials')}
          className="block w-full text-left px-6 py-3 text-gray-700 hover:text-purple-600 hover:bg-gray-50 font-medium transition-colors duration-200"
        >
          Testimonials
        </button>
      </li>
      <li className="px-6 py-3">
        <Link 
          href="/sign-in"
          onClick={closeMenu}
          className="block w-full text-center bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200 shadow-md"
        >
          {user  ? "Dashboard" : "Get Started"}
        </Link>


      </li>
    </ul>
  </div>
  )
}

export default MobileNav