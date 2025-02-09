//apple navbar

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ brand, links }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-black/80 backdrop-blur-xl text-white fixed top-0 left-0 w-full z-50">
      <div className="max-w-[980px] mx-auto px-4">
        <div className="flex h-12 items-center justify-between">
          {/* Brand */}
          <Link to="/" className="text-xl font-medium tracking-tight">
            {brand}
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 transition-all duration-200 hover:opacity-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>

          {/* Desktop Links */}
          <div className="hidden space-x-8 md:flex">
            {links?.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-2 py-1 text-sm font-medium transition-all duration-200 hover:opacity-50 ${
                  location.pathname === link.path
                    ? "text-white"
                    : "text-white/80"
                }`}
              >
                {link.icon && <span className="mr-2">{link.icon}</span>}
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10">
            {links?.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 text-sm transition-all duration-200 ${
                  location.pathname === link.path
                    ? "text-white bg-white/10"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.icon && <span className="mr-2">{link.icon}</span>}
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
