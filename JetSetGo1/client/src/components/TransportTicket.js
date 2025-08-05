import React, { useState } from 'react';
import { Plane, Bus, Calendar, Clock, MapPin, DollarSign, X } from 'lucide-react';

export default function TransportTicket({ booking, details, onLoadDetails, onCancel }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-4 transition-all duration-300 ease-in-out hover:shadow-xl">
      <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {details?.vehicle === 'Flight' ? <Plane className="h-6 w-6" /> : <Bus className="h-6 w-6" />}
          <span className="font-bold text-lg">{details?.vehicle || 'Transport'}</span>
        </div>
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-white hover:text-blue-200">
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      <div className={`p-4 ${isExpanded ? 'block' : 'hidden'}`}>
        {details ? (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span>{new Date(booking.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span>{details.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <span>{details.cLocation}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-gray-500" />
                <span>${details.price}</span>
              </div>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600">Vehicle: {details.carModel}</p>
              <p className="text-sm text-gray-600">Days: {details.days.join(', ')}</p>
            </div>
          </>
        ) : (
          <button onClick={onLoadDetails} className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Load Details
          </button>
        )}
      </div>
      <div className="p-4 bg-gray-100 flex justify-end">
        <button onClick={onCancel} className="flex items-center space-x-1 text-red-500 hover:text-red-700 transition-colors">
          <X className="h-4 w-4" />
          <span>Cancel Booking</span>
        </button>
      </div>
    </div>
  );
}