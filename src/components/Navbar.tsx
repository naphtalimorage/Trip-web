import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Mountain } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/register', label: 'Register' },
    { path: '/participants', label: 'Participants' },
    { path: '/donations', label: 'Donations' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-green-100 to-emerald-200 p-2 rounded-xl">
              <Mountain className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-800">Nyandarua Trip</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 ${
                  isActive(link.path)
                    ? 'text-white bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg'
                    : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200 transform hover:scale-110"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="px-4 pt-4 pb-6 space-y-2 bg-white/95 backdrop-blur-md border-t border-gray-100">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 text-base font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 ${
                    isActive(link.path)
                      ? 'text-white bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg'
                      : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;