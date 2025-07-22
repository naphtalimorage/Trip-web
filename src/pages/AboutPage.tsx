import React from 'react';
import { MapPin, Camera, Mountain, Trees } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Nyandarua County</h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Discover the hidden gems of Kenya's highland county, known for its stunning landscapes, 
              cool climate, and rich cultural heritage.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">The Land of Rolling Hills</h2>
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  Nyandarua County, located in the central highlands of Kenya, offers some of the most 
                  breathtaking scenery in the country. With its rolling hills, lush forests, and cool 
                  climate, it's the perfect destination for a refreshing getaway from the hustle and bustle 
                  of city life.
                </p>
                <p>
                  The county is home to the Aberdare Mountain Range, dense forests, and pristine rivers 
                  that create a paradise for nature lovers and adventure seekers alike. From hiking trails 
                  to scenic viewpoints, every corner of Nyandarua tells a story of natural beauty.
                </p>
                <p>
                  Our trip will take us through some of the most spectacular locations, offering opportunities 
                  for photography, relaxation, and bonding with nature and friends.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Places We'll Visit</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mountain className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Aberdare National Park</h4>
                    <p className="text-gray-600">Experience wildlife and stunning mountain views</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Trees className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Bamboo Forests</h4>
                    <p className="text-gray-600">Walk through mystical bamboo groves</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Camera className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Scenic Viewpoints</h4>
                    <p className="text-gray-600">Capture breathtaking panoramic views</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Cultural Sites</h4>
                    <p className="text-gray-600">Learn about local Kikuyu heritage and traditions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Photo Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Camera className="h-12 w-12 mx-auto mb-2" />
                  <p>Nyandarua Landscape</p>
                </div>
              </div>
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Camera className="h-12 w-12 mx-auto mb-2" />
                  <p>Rolling Hills View</p>
                </div>
              </div>
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Camera className="h-12 w-12 mx-auto mb-2" />
                  <p>Forest Trail</p>
                </div>
              </div>
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Camera className="h-12 w-12 mx-auto mb-2" />
                  <p>Mountain Peak</p>
                </div>
              </div>
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Camera className="h-12 w-12 mx-auto mb-2" />
                  <p>Local Wildlife</p>
                </div>
              </div>
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Camera className="h-12 w-12 mx-auto mb-2" />
                  <p>Group Activities</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Location Map</h2>
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg">Interactive Map of Nyandarua County</p>
                <p className="text-sm mt-2">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255281.17089853395!2d36.4!3d-0.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f46f7ab825251%3A0x8b8a0a0a0a0a0a0a!2sNyandarua%20County%2C%20Kenya!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                    width="100%"
                    height="300"
                    style={{ border: 0, borderRadius: '8px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;