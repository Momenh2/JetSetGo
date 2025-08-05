import React, { useState, useEffect } from 'react';
import "../components/adminflag.css"

const FlagItinerary = () => {
  const [itineraries, setItineraries] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch all itineraries on component mount
    const fetchItineraries = async () => {
      try {
        const response = await fetch('/api/admin/itineraries'); // Adjust this route as per your backend
        const data = await response.json();
        setItineraries(data.itineraries);
      } catch (error) {
        setErrorMessage('Error fetching itineraries');
      }
    };

    fetchItineraries();
  }, []);

  const handleFlagItinerary = async (itineraryId) => {
    setResponseMessage('');
    setErrorMessage('');

    try {
      const response = await fetch(`/api/admin/itineraries/${itineraryId}/flag`, {
        method: 'PATCH',
      });
      const data = await response.json();

      if (response.ok) {
        setResponseMessage(data.message);
        setItineraries(itineraries.map((itinerary) =>
          itinerary._id === itineraryId ? { ...itinerary, flagged: true } : itinerary
        ));
      } else {
        setErrorMessage(data.error || 'Error flagging itinerary');
      }
    } catch (error) {
      setErrorMessage('Error flagging itinerary');
    }
  };

  return (
    <div className="container">
      <h2 className="page-title">Flag Itineraries</h2>
      {responseMessage && <p className="success-message">{responseMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="card-grid">

        {itineraries.map((itinerary) => (
          <div className="card-adflag" key={itinerary._id}>
            <div className="card-body-adflag">
              <p className="card-title-adflag">{itinerary.title}</p>
              <button
                onClick={() => handleFlagItinerary(itinerary._id)}
                disabled={itinerary.flagged}
                className={`button-adflag ${itinerary.flagged ? 'button-disabled-adflag' : 'button-primary-adflag'}`}
              >
                {!itinerary.flagged && <i className="fas fa-flag"></i>} {/* Show icon only for active buttons */}
                {itinerary.flagged ? 'Already Flagged' : ' Flag'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlagItinerary;