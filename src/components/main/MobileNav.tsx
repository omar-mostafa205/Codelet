/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import React from "react";
import Link from "next/link";

const MobileNav = ({ scrollToSection, closeMenu, user }) => {
  const NAV_ITEMS = [
    { label: "Home", section: "home" },
    { label: "Features", section: "features" },
    { label: "AI Features", section: "ai" },
    { label: "How It Works", section: "how-it-works" },
    { label: "Testimonials", section: "testimonials" },
    { label: "Pricing", section: "pricing" },
  ];

  return (
    <div className="absolute top-full left-0 right-0 mt-2 mx-4 bg-white rounded-2xl shadow-xl border border-gray-200 lg:hidden z-50">
      <ul className="py-4">

        {NAV_ITEMS.map((item) => (
          <li key={item.section}>
            <button
              onClick={() => {
                scrollToSection(item.section);
                closeMenu();
              }}
              className="block w-full text-left px-6 py-3 text-gray-700 hover:text-purple-600 hover:bg-gray-50 font-medium transition-colors duration-200"
            >
              {item.label}
            </button>
          </li>
        ))}

        <li className="px-6 py-3">
          <Link
            href={user ? "/dashboard" : "/sign-in"}
            onClick={closeMenu}
            className="block w-full text-center bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200 shadow-md"
          >
            {user ? "Dashboard" : "Get Started"}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default MobileNav;
