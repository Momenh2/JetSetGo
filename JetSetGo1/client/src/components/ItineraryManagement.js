import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode"; 
import Cookies from "js-cookie"; 
import EditableField from './EditableField'; // Import the EditableField component

const ItineraryManagement = () => {
  const [itineraries, setItineraries] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [expandedItinerary, setExpandedItinerary] = useState(null); // Track expanded itinerary
  const [tags, setTags] = useState([]); // State to store all available tags
  const [loadingTags, setLoadingTags] = useState(true); 
 const [itineraryData, setItineraryData] = useState({ tags: [] });
  const [showTagSelector, setShowTagSelector] = useState(false); // Control tag selector visibility

  const token = Cookies.get("auth_token");
  const decodedToken = jwtDecode(token);
  const id = decodedToken.id;
  const modelName = decodedToken.userType;

  useEffect(() => {
    // Fetch all itineraries on component mount
    const fetchItineraries = async () => {
      try {
        const response = await fetch(`/api/tour-guides/showAll?guideId=${id}`);
        const data = await response.json();
        setItineraries(data);
      } catch (error) {
        setError('You dont have itineraries yet');
      }
    };

    fetchItineraries();
  }, []);


  
  const updateItinerary = async (updatedItinerary) => {
    try {
      const response = await fetch(`/api/tour-guides/updateItinerary/${updatedItinerary._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItinerary),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setItineraries(itineraries.map(itinerary =>
          itinerary._id === updatedItinerary._id ? updatedItinerary : itinerary
        ));
      } else {
        setError(data.message || 'Error updating itinerary');
      }
    } catch (error) {
      setError('Error updating itinerary');
    }
  };
  const handleTagClick = (tagId) => {
    // Create a copy of the current tags array
    let updatedTags;

    // If tag is already selected, remove it; otherwise, add it
    if (itineraryData.tags.includes(tagId)) {
      updatedTags = itineraryData.tags.filter(t => t !== tagId);
    } else {
      updatedTags = [...itineraryData.tags, tagId];
    }

    setItineraryData({ ...itineraryData, tags: updatedTags });
  };  

  const handleTagSave = () => {
    // You can implement saving the selected tags back to the server here
    console.log('Saving selected tags:', itineraryData.tags);
    setShowTagSelector(false); // Hide the tag selector after saving
  };
  useEffect(() => {
    // Fetch all tags when the component mounts
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/admin/tag'); // Adjust the API route as needed
        const data = await response.json();
        setTags(data); // Assuming the data contains the tags array
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setLoadingTags(false);
      }
    };
  
    fetchTags();
  }, []);



  const handleMoreInfoClick = (itineraryId) => {
    // Toggle the expanded state for this itinerary
    if (expandedItinerary === itineraryId) {
      setExpandedItinerary(null); // Collapse if it's already expanded
    } else {
      setExpandedItinerary(itineraryId); // Expand the clicked itinerary
    }
  };

  // Activate or deactivate an itinerary
  const toggleItineraryStatus = async (id, activate) => {
    setMessage('');
    setError('');
    

    try {
      const response = await fetch(`/api/tour-guides/itineraries/${activate ? 'activate' : 'deactivate'}/${id}`, {
        method: 'PATCH',
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setItineraries(itineraries.map(itinerary =>
          itinerary._id === id ? { ...itinerary, active: activate } : itinerary
        ));
      } else {
        setError(data.message || 'Error updating itinerary status');
      }
    } catch (error) {
      setError('Error updating itinerary status');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h2>Itinerary Management</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {itineraries.map((itinerary) => (
          <li key={itinerary._id} style={{ padding: '10px', borderBottom: '1px solid #ccc', position: 'relative' }}>
            {/* "More Info" button at the top right */}
            <button 
              onClick={() => handleMoreInfoClick(itinerary._id)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                padding: '8px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px', // Rounded corners for the button
                cursor: 'pointer',
                fontSize: '18px',
                textAlign: 'center',
                lineHeight: '1.2',
                height: '30px', // Adjust the height of the button
                width: '30px', // Adjust the width of the button
              }}
            >
              
              <div style={{ fontSize: '20px', lineHeight: '4px' }}>
                <div>-</div>
                <div>-</div>
                <div>-</div>
              </div>
            </button>
            
            <div>
              <strong>Title:</strong> 
              <EditableField 
                value={itinerary.title} 
                onSave={(newTitle) => updateItinerary({ ...itinerary, title: newTitle })
              } 
              />
            </div>
            <div>
              <strong>Active:</strong> {itinerary.active ? 'Yes' : 'No'}
              
              
            </div>
            <div>
              <strong>Booked:</strong> {itinerary.isBooked ? 'Yes' : 'No'}
            </div>
            <button
              onClick={() => toggleItineraryStatus(itinerary._id, true)}
              disabled={itinerary.active}
              style={{
                marginTop: '10px',
                padding: '8px 12px',
                backgroundColor: itinerary.active ? '#ccc' : '#28a745',
                color: '#fff',
                border: 'none',
                cursor: itinerary.active ? 'not-allowed' : 'pointer',
              }}
            >
              {itinerary.active ? 'Already Active' : 'Activate'}
            </button>
            <button
              onClick={() => toggleItineraryStatus(itinerary._id, false)}
              disabled={!itinerary.active}
              style={{
                marginTop: '10px',
                marginLeft: '10px',
                padding: '8px 12px',
                backgroundColor: !itinerary.active ? '#ccc' : '#dc3545',
                color: '#fff',
                border: 'none',
                cursor: !itinerary.active ? 'not-allowed' : 'pointer',
              }}
            >
              {!itinerary.active ? 'Already Deactivated' : 'Deactivate'}
            </button>
            
            {/* Conditionally render additional info when 'More Info' is clicked */}
            {expandedItinerary === itinerary._id && (
              <div style={{ marginTop: '10px' }}>
                <div>
                  <strong>Description:</strong> 
                  <EditableField 
                    value={itinerary.description} 
                    onSave={(newDescription) => updateItinerary({ ...itinerary, description: newDescription })} 
                  />
                </div>
                <div>
                  <strong>Activities:</strong> 
                  <EditableField 
                    value={itinerary.activities.name.join(', ')} 
                    onSave={(newActivities) => updateItinerary({ 
                      ...itinerary, activities: { ...itinerary.activities, name: newActivities.split(', ') } 
                    })} 
                  />
                </div>
                <div>
                  <strong>Locations:</strong> 
                  <EditableField 
                    value={itinerary.locations.join(', ')} 
                    onSave={(newLocations) => updateItinerary({ 
                      ...itinerary, locations: newLocations.split(', ') 
                    })} 
                  />
                </div>
                <div>
                  <strong>Timeline:</strong> 
                  <EditableField 
                    value={itinerary.timeline.join(', ')} 
                    onSave={(newTimeline) => updateItinerary({ 
                      ...itinerary, timeline: newTimeline.split(', ') 
                    })} 
                  />
                </div>
                <div>
                  <strong>Language:</strong> 
                  <EditableField 
                    value={itinerary.language} 
                    onSave={(newLanguage) => updateItinerary({ ...itinerary, language: newLanguage })} 
                  />
                </div>
                <div>
                  <strong>Price:</strong> 
                  <EditableField 
                    value={itinerary.price} 
                    onSave={(newPrice) => updateItinerary({ ...itinerary, price: parseFloat(newPrice) })} 
                    inputType="number" // Ensure it's a number input
                  />
                </div>
                <div>
                  <strong>Accessible:</strong> 
                  <EditableField 
                    value={itinerary.accessibility} 
                    onSave={(newAccessibility) => updateItinerary({ 
                      ...itinerary, accessibility: newAccessibility 
                    })} 
                  />
                </div>
                <div>
                  <strong>Pickup Location:</strong> 
                  <EditableField 
                    value={itinerary.pickupLocation} 
                    onSave={(newPickupLocation) => updateItinerary({ 
                      ...itinerary, pickupLocation: newPickupLocation 
                    })} 
                  />
                </div>
                <div>
                  <strong>Dropoff Location:</strong> 
                  <EditableField 
                    value={itinerary.dropoffLocation} 
                    onSave={(newDropoffLocation) => updateItinerary({ 
                      ...itinerary, dropoffLocation: newDropoffLocation 
                    })} 
                  />
                </div>
                <div>
      <strong>Tags:</strong>
      {loadingTags ? (
        <span>Loading tags...</span> // Show loading message until tags are fetched
      ) : (
        itinerary.tags && Array.isArray(itinerary.tags) && itinerary.tags.length > 0 ? (
          <EditableField 
            value={itinerary.tags
              .map(tagId => {
                const tag = tags.find(t => t._id === tagId); // Find the tag by ID
                return tag ? tag.tag_name : ''; // Return tag_name if found
              })
              .join(', ')} 
            onSave={(newTags) => {
              const updatedTags = newTags.split(', ').map(tagName => {
                const existingTag = tags.find(t => t.tag_name === tagName);
                return existingTag ? existingTag._id : null; // Map back to IDs if tag exists
              });
              updateItinerary({ ...itinerary, tags: updatedTags });
            }} 
          />
        ) : (
          <span>No tags available</span>
        )
      )}
    </div>
              
                <div>
                  <strong>Ratings:</strong>
                  {/* Render and edit ratings if necessary */}
                </div>
                <div>
                  <strong>Comments:</strong>
                  {/* Render and edit comments if necessary */}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItineraryManagement;
