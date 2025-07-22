import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, MapPin, Users, Camera } from 'lucide-react';
import CountdownTimer from '../components/CountdownTimer';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 py-16 sm:py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-green-500 rounded-full animate-bounce"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-emerald-500 rounded-full animate-ping"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative z-10">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              Nyandarua Adventure
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
              Join us for an unforgettable journey to the scenic highlands of Nyandarua County. 
              Experience nature, friendship, and adventure like never before!
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12 animate-fade-in-up animation-delay-400">
              <Link
                to="/register"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center group"
              >
                Register Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <a
                href="https://wa.me/2547XXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center group"
              >
                <MessageCircle className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-200" />
                Join WhatsApp Group
              </a>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto animate-fade-in-up animation-delay-600">
            <CountdownTimer />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What to Expect
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get ready for an amazing experience filled with adventure, scenic views, and unforgettable memories.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center group transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-green-100 to-emerald-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:rotate-3 transition-all duration-300">
                <MapPin className="h-10 w-10 text-green-600 group-hover:scale-110 transition-transform duration-200" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Scenic Locations</h3>
              <p className="text-gray-600 leading-relaxed">
                Explore breathtaking landscapes, rolling hills, and pristine natural environments in Nyandarua County.
              </p>
            </div>
            
            <div className="text-center group transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-100 to-cyan-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:rotate-3 transition-all duration-300">
                <Users className="h-10 w-10 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Great Company</h3>
              <p className="text-gray-600 leading-relaxed">
                Bond with friends and make new connections while enjoying activities and shared experiences together.
              </p>
            </div>
            
            <div className="text-center group transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-orange-100 to-amber-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:rotate-3 transition-all duration-300">
                <Camera className="h-10 w-10 text-orange-600 group-hover:scale-110 transition-transform duration-200" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Photo Opportunities</h3>
              <p className="text-gray-600 leading-relaxed">
                Capture stunning photos and create lasting memories with picture-perfect moments throughout the trip.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 py-16 sm:py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full "></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Ready for Adventure?
          </h2>
          <p className="text-lg sm:text-xl text-green-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Don't miss out on this incredible journey. Secure your spot today and join us for an unforgettable experience.
          </p>
          <Link
            to="/register"
            className="bg-white text-green-600 hover:bg-gray-50 font-semibold py-4 px-10 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 inline-flex items-center group"
          >
            Register Now
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;