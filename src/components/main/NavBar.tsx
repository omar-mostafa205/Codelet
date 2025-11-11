"use client"
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { ShineBorder } from "../ShineBorder";
import MobileNav from "./MobileNav";
import { useUser } from '@clerk/nextjs'


export default function NavBar() {
  const user = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 30);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    closeMenu();
  };
  return (
    <nav className={`fixed top-5 -mt-2 left-0 right-0 z-50 mx-4 md:mx-[70px] transition-all duration-300 ease-in-out ${
      isScrolled 
        ? 'backdrop-blur-md bg-white/80 shadow-lg border border-white/20' 
        : 'bg-transparent'
    } rounded-2xl`}>
      <div className="flex flex-row justify-between items-center py-4 px-4">
        <div className="flex flex-row gap-1 items-center">
          <Image 
            src="/final.png" 
            alt="Logo" 
            width={30} 
            height={30} 
            className="rounded-[10px]"
          />
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Codelet</h1>
        </div>

        <ul className="hidden lg:flex flex-row items-center gap-8">
          <li>
            <button 
              onClick={() => scrollToSection('home')}
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 cursor-pointer"
            >
              Home
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 cursor-pointer"
            >
              Features
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('ai')}
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 cursor-pointer"
            >
              AI Features
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 cursor-pointer"
            >
              How It Works
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('testimonials')}
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 cursor-pointer"
            >
              Testimonials
            </button>
          </li>
        </ul>

{       !user ?
        <div className="relative rounded-full hidden lg:block">
        <Link href="/sign-in" className="relative z-10 bg-black text-white rounded-full px-6 py-2 block">
          Get Started
        </Link>
        <ShineBorder
          shineColor={["#FF6FD8", "#3813C2", "#FF6FD8"]}
          borderWidth={21}
          duration={8}
          className="rounded-full"
        />
      </div>
      :(       <div className="relative rounded-full hidden lg:block cursor-pointer">
        <Link href="/dashboard" className="relative z-10 bg-black cursor-pointer text-white rounded-full px-6 py-2  flex flex-row gap-2 justify-center items-center">
          Dashboard
          <ArrowUpRight className="w-5 h-5" />
        </Link>
        <ShineBorder
          shineColor={["#FF6FD8", "#3813C2", "#FF6FD8"]}
          borderWidth={21}
          duration={8}
          className="rounded-full"
        />
      </div> )
}  

        <button
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </div>

      {isMenuOpen && (
          <MobileNav  scrollToSection ={scrollToSection} closeMenu ={closeMenu} user={user}/> 
      )}
    </nav>
  );
}