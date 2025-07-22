import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, Calendar } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-2 rounded-xl">
                <Mountain className="h-8 w-8 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold">Nyandarua Trip</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Join us for an unforgettable adventure exploring the beautiful highlands of Nyandarua County.
            </p>
            <div className="flex items-center space-x-3 text-green-400 bg-green-900/30 px-4 py-2 rounded-full w-fit">
              <Calendar className="h-5 w-5" />
              <span className="font-semibold">August 24, 2025</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-6">Quick Links</h3>
            <div className="space-y-3">
              <Link to="/" className="block text-gray-300 hover:text-green-400 transition-colors">
                Home
              </Link>
              <Link to="/about" className="block text-gray-300 hover:text-green-400 transition-colors">
                About
              </Link>
              <Link to="/register" className="block text-gray-300 hover:text-green-400 transition-colors">
                Register
              </Link>
              <Link to="/participants" className="block text-gray-300 hover:text-green-400 transition-colors">
                Participants
              </Link>
              <Link to="/donations" className="block text-gray-300 hover:text-green-400 transition-colors">
                Donations
              </Link>
              <Link to="/contact" className="block text-gray-300 hover:text-green-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-6">Contact Info</h3>
            <div className="space-y-3 text-gray-300">
              <p>Trip Organizer</p>
              <p>Email: info@nyandaruatrip.com</p>
              <p>Phone: +254 7XX XXX XXX</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Nyandarua Trip. Organized with ❤️ by the trip committee.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;