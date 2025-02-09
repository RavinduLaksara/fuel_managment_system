//apple navbar

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Added import

export default function Navbar({ brand, links }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuVariants = {
    initial: { height: 0, opacity: 0, scale: 0.95 },
    animate: {
      height: "auto",
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      height: 0,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  return (
    <nav className="bg-black/80 backdrop-blur-xl text-white fixed top-0 left-0 w-full z-50">
      <div className="max-w-[980px] mx-auto px-4 py-2">
        <div className="flex h-12 items-center justify-between">
          {/* Brand */}
          <Link to="/" className="text-3xl font-medium tracking-tight">
            {brand}
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 transition-all duration-200  text-3xl mb-2  hover:opacity-50"
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
                className={`px-2 py-1 text-base font-medium transition-all duration-200 hover:opacity-50 ${
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
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden border-white/10 pb-4 overflow-hidden origin-top"
              variants={menuVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {links?.map((link) => (
                <div key={link.path}>
                  <Link
                    to={link.path}
                    className={`block px-4 py-3 text-sm transition-all duration-200 ${
                      location.pathname === link.path
                        ? "text-white bg-white/10 rounded-md"
                        : "text-white/80 hover:text-white rounded-md hover:bg-white/10"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.icon && <span className="mr-2">{link.icon}</span>}
                    {link.label}
                  </Link>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
