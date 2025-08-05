import { useEffect, useState } from 'react';
import "./ItineraryDetails.css"
import { FaStar } from 'react-icons/fa';


const ItineraryDetails = ({ Itinerary }) => {
    const [tagNames, setTagNames] = useState([]);

    useEffect(() => {
        const fetchTagNames = async () => {
            try {
                const tagIds = Itinerary.tags;
                const names = [];

                // Loop over each tag ID to fetch its name from the backend
                for (const tagId of tagIds) {
                    const response = await fetch(`/api/tourist/tagName/${tagId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    
                    
                    const data = await response.json();
                    if (response.ok) {
                        names.push(data.tag_name); // Assume the backend returns { tagName: "Tag Name" }
                        console.log(data.tag_name);
                    } else {
                        console.error(data.error);
                    }
                }

                setTagNames(names);
            } catch (error) {
                console.error("Failed to fetch tag names:", error);
            }
        };

        fetchTagNames();
    }, [Itinerary.tags]);


    

    
    return (
        <div className="product-grid">
            <div key={Itinerary._id } className="product-card"> 
            <h2 className="product-title">{Itinerary.title}</h2>
            <p className="product-description">{Itinerary.description}</p>
            {/*<p><strong>Tour Guide: </strong>{Itinerary.tourGuide}</p> {/* Assuming you fetch the name */}
            
            {/*<p><strong>Activities: </strong>
                {Itinerary.activities.name.map((activityName, index) => (
                    <div key={index}>
                        {activityName} - Duration: {Itinerary.activities.duration[index]}
                    </div>
                ))}
            </p>*/}
            
            {/* <p><strong>Locations: </strong>{Itinerary.locations.join(', ')}</p> */}
            {/* <p><strong>Timeline: </strong>{Itinerary.timeline.join(', ')}</p> */}
            {/* <p><strong>Language: </strong>{Itinerary.language}</p> */}
            <p className="product-price">${Itinerary.price}</p>
            
            {/* <p><strong>Available Dates: </strong>
                {Itinerary.availableDates.map((dateObj, index) => (
                    <div key={index}>
                        {dateObj.date.toString()}: {dateObj.times.join(', ')}
                    </div>
                ))}
            </p> */}

            {/* <p><strong>Accessibility: </strong>{Itinerary.accessibility}</p> */}
            {/* <p><strong>Pick Up Location: </strong>{Itinerary.pickupLocation}</p> */}
            {/* <p><strong>Drop Off Location: </strong>{Itinerary.dropoffLocation}</p> */}
            <div className="product-rating">
              <p  className='rating'>{Itinerary.rating}</p>
              <FaStar className="star-icon" />
            </div>
            <p className="product-description">#{tagNames.join(', #')}</p>
            {/* <p><strong>Is booked?: </strong>{Itinerary.isBooked ? 'Yes' : 'No'}</p> */}
            {/* <p><strong>Created At: </strong>{new Date(Itinerary.createdAt).toLocaleDateString()}</p> */}
            </div>
        </div>
    );
};

export default ItineraryDetails;
