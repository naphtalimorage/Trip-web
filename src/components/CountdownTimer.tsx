import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const tripDate = new Date('2025-08-24T08:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = tripDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 rounded-2xl p-6 sm:p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-center mb-4">
        <Clock className="h-6 w-6 mr-2 animate-pulse" />
        <h3 className="text-xl sm:text-2xl font-bold">Trip Countdown</h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3 sm:p-4 transform hover:bg-opacity-30 transition-all duration-200">
          <div className="text-xl sm:text-3xl font-bold animate-pulse">{timeLeft.days}</div>
          <div className="text-sm opacity-90">Days</div>
        </div>
        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3 sm:p-4 transform hover:bg-opacity-30 transition-all duration-200">
          <div className="text-xl sm:text-3xl font-bold animate-pulse">{timeLeft.hours}</div>
          <div className="text-sm opacity-90">Hours</div>
        </div>
        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3 sm:p-4 transform hover:bg-opacity-30 transition-all duration-200">
          <div className="text-xl sm:text-3xl font-bold animate-pulse">{timeLeft.minutes}</div>
          <div className="text-sm opacity-90">Minutes</div>
        </div>
        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3 sm:p-4 transform hover:bg-opacity-30 transition-all duration-200">
          <div className="text-xl sm:text-3xl font-bold animate-pulse">{timeLeft.seconds}</div>
          <div className="text-sm opacity-90">Seconds</div>
        </div>
      </div>

      <div className="flex items-center justify-center mt-6 text-center">
        <Calendar className="h-5 w-5 mr-2" />
        <span className="text-lg sm:text-xl font-semibold">August 24, 2025</span>
      </div>
    </div>
  );
};

export default CountdownTimer;