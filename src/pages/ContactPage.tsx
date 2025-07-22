import React from 'react';
import { MessageCircle, Phone, Mail, MapPin, Calendar, Users } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Information</h1>
          <p className="text-lg text-gray-600">
            Get in touch with the trip organizers for any questions or concerns
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Details */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Phone</h3>
                  <p className="text-gray-600">+254 7XX XXX XXX</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">info@nyandaruatrip.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Meeting Point</h3>
                  <p className="text-gray-600">Details will be shared with registered participants</p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <a
                  href="https://wa.me/2547XXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Join WhatsApp Group
                </a>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Get instant updates and connect with other participants
                </p>
              </div>
            </div>
          </div>

          {/* Trip Information */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Trip Details</h2>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Date</h3>
                  <p className="text-gray-600">August 24, 2025</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Destination</h3>
                  <p className="text-gray-600">Nyandarua County, Kenya</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Group Size</h3>
                  <p className="text-gray-600">Friends and family welcome</p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">What's Included:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Transportation to and from destination
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Guided tours of scenic locations
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Group activities and entertainment
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Basic refreshments during the trip
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What should I bring?</h3>
              <p className="text-gray-600">
                Comfortable hiking shoes, weather-appropriate clothing, water bottle, camera, 
                and any personal items you might need. A detailed packing list will be shared 
                with registered participants.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is the trip suitable for all ages?</h3>
              <p className="text-gray-600">
                Yes! The itinerary includes activities suitable for all age groups. However, 
                some hiking trails may require basic physical fitness.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What if weather conditions are bad?</h3>
              <p className="text-gray-600">
                We monitor weather conditions closely. In case of severe weather, we'll adjust 
                the itinerary or reschedule if necessary. All participants will be notified in advance.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel my registration?</h3>
              <p className="text-gray-600">
                Please contact us as soon as possible if you need to cancel. Cancellation policies 
                will depend on how close we are to the trip date.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;