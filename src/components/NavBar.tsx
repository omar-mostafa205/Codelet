import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { ShineBorder } from "./ShineBorder";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll events
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

  return (
    <nav className={`fixed top-5 -mt-2 left-0 right-0 z-30 mx-4 md:mx-[70px] flex flex-row justify-between items-center py-4 px-4 rounded-2xl transition-all duration-300 ease-in-out ${
      isScrolled 
        ? 'backdrop-blur-md bg-white/80 shadow-lg border border-white/20' 
        : 'bg-transparent'
    }`}>
      <div className="flex flex-row gap-1 items-center">
        <Image 
          src="/final.png" 
          alt="Logo" 
          width={30} 
          height={30} 
          className="rounded-[10px]"
        />
        <h1 className="text-2xl font-semibold text-gray-900">Codelet</h1>
      </div>

      <ul className="hidden md:flex flex-row items-center gap-8">
        <li>
          <Link 
            href="/" 
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
          >
            Home
          </Link>
        </li>
        <li>
          <Link 
            href="/how-it-works" 
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
          >
            How It Works
          </Link>
        </li>
      </ul>

      
      <div className="relative rounded-full">
        <Link href="/upload-repo" className="relative z-10 bg-black text-white rounded-full px-6 py-2">
          Get Started
        </Link>
        <ShineBorder
          shineColor={["#FF6FD8", "#3813C2", "#FF6FD8"]} // example colors
          borderWidth={16}
          duration={8}
          className="rounded-full"
        />
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X className="h-6 w-6 text-gray-700" />
        ) : (
          <Menu className="h-6 w-6 text-gray-700" />
        )}
      </button>

      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={closeMenu}
          />
          <div className="absolute top-full left-0 right-0 mt-2 mx-4 bg-white rounded-2xl shadow-xl border border-gray-200 md:hidden">
            <ul className="py-4">
              <li>
                <Link 
                  href="/"
                  onClick={closeMenu}
                  className="block px-6 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/how-it-works"
                  onClick={closeMenu}
                  className="block px-6 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium transition-colors duration-200"
                >
                  How It Works
                </Link>
              </li>
              <li className="px-6 py-3">
                <Link 
                  href="/sign-up"
                  onClick={closeMenu}
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200 shadow-md"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>
        </>
      )}
    </nav>
  );
}