import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Tag, X } from 'lucide-react';

export default function ActivityTicket({ booking, details, onLoadDetails, onCancel }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-4 transition-all duration-300 ease-in-out hover:shadow-xl">
      <div className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Tag className="h-6 w-6" />
          <span className="font-bold text-lg">{booking.referenceType}</span>
        </div>
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-white hover:text-green-200">
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      <div className={`p-4 ${isExpanded ? 'block' : 'hidden'}`}>
        {details ? (
          <>
            <h3 className="font-bold text-xl mb-2">{details.title}</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span>{new Date(details.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span>{details.time || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <span>{details.location || 'N/A'}</span>
              </div>
            </div>
            {details.description && (
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">{details.description}</p>
              </div>
            )}
          </>
        ) : (
          <button onClick={onLoadDetails} className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
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