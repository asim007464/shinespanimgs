import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
    { name: "Booking Calculator", href: "/BookingCalculator" },
    { name: "Pricing Guide", href: "/PricingGuide" },
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-sm font-jakarta">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20 gap-4">
          {/* Logo */}
          <div className="shrink-0 min-w-0">
            <NavLink to="/" className="block">
              <img
                className="h-12 sm:h-14 lg:h-16 w-auto max-w-[140px] sm:max-w-none object-contain"
                src="./websitelogo.png"
                alt="Shine & Span"
              />
            </NavLink>
          </div>

          {/* Nav Links (Centered) - hidden on mobile, shown from md */}
          <nav className="hidden md:flex items-center justify-center flex-1 min-w-0 px-4">
            <div className="flex items-center space-x-4 lg:space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `relative py-2 text-[13px] lg:text-[15px] transition-colors font-medium whitespace-nowrap ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-blue-600"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <span className="absolute -bottom-0.5 left-0 w-full h-[2px] bg-blue-600 rounded-full"></span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
            </div>
          </nav>

          {/* Action Buttons - hidden on mobile */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4 shrink-0 ml-6 lg:ml-10 pl-6 lg:pl-8 border-l border-gray-200">
            {isAdmin && (
              <NavLink
                to="/admin"
                className="px-3 lg:px-4 py-2 border border-purple-300 rounded-lg text-purple-700 font-semibold text-xs lg:text-sm hover:border-purple-500 hover:bg-purple-50 transition-all"
              >
                Admin
              </NavLink>
            )}
            {user ? (
              <button
                onClick={() => signOut()}
                className="px-4 lg:px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold text-xs lg:text-sm hover:border-red-500 hover:text-red-500 transition-all"
              >
                Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                className="px-4 lg:px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold text-xs lg:text-sm hover:border-blue-500 hover:text-blue-500 transition-all"
              >
                Login
              </NavLink>
            )}
            <NavLink
              to="/register"
              className="btn-shiny px-4 lg:px-7 py-2 lg:py-2.5 text-white rounded-lg font-bold bg-blue-600 text-xs lg:text-sm hover:bg-blue-800 transition-all active:scale-95"
            >
              Book Now
            </NavLink>
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden shrink-0">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 p-2 -mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-lg transition-all"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              <svg
                className="h-7 w-7 sm:h-8 sm:w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d={
                    isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 sm:top-20 bottom-0 bg-white border-t border-gray-100 p-6 overflow-y-auto shadow-2xl z-40">
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block py-3 px-4 rounded-lg text-base font-semibold transition-colors ${
                    isActive ? "text-blue-600 bg-blue-50" : "text-gray-800 hover:bg-gray-50"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
          <div className="flex flex-col gap-3 pt-6 mt-6 border-t border-gray-100">
            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="w-full py-3 border border-purple-300 rounded-xl font-bold text-center text-purple-700 hover:bg-purple-50 transition-colors"
              >
                Admin
              </NavLink>
            )}
            {user ? (
              <button
                onClick={() => { signOut(); setIsOpen(false); }}
                className="w-full py-3 border border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-colors"
              >
                Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full py-3 border border-gray-300 rounded-xl font-bold text-center hover:bg-gray-50 transition-colors"
              >
                Login
              </NavLink>
            )}
            <NavLink
              to="/register"
              onClick={() => setIsOpen(false)}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-center hover:bg-blue-700 transition-colors"
            >
              Book Now
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
