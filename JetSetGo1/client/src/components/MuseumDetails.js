import React from 'react';

const MuseumDetails = ({ Museum }) => {
    return (
        <div className="museum-details">
            <h4>{Museum.name}</h4>
            <p><strong>Description: </strong>{Museum.description}</p>
            <p><strong>Location: </strong>{Museum.location}</p>
            <p><strong>Opening Hours: </strong>{Museum.openingHours}</p>
            <p><strong>Ticket Prices: </strong>
                <ul>
                    <li>Foreigner: {Museum.ticketPrices.foreigner} EGP</li>
                    <li>Native: {Museum.ticketPrices.native} EGP</li>
                    <li>Student: {Museum.ticketPrices.student} EGP</li>
                </ul>
            </p>
            <p><strong>Pictures: </strong>
                {Museum.pictures.length > 0 ? (
                    <ul>
                    {Museum.pictures.map((picture, index) => (
                        <li key={index}>
                            <img 
                                src={picture} 
                                alt={`Museum image ${index + 1}`}  // Updated alt attribute
                                style={{ width: '100px', height: 'auto' }} 
                            />
                        </li>
                    ))}
                    </ul>
                ) : (
                    <span>No pictures available</span>
                )}
            </p>

            {/*<p><strong>Pictures: </strong>{Museum.pictures}</p>*/}
            <p><strong>Tags: </strong>
                {Museum.tags.length > 0 ? (
                    <ul>
                        {Museum.tags.map((tag, index) => (
                            <li key={index}>{tag}</li> // Adjust if tag is an object with a name property
                        ))}
                    </ul>
                ) : 'No tags available'}
            </p>
            <p><strong>Category: </strong>{Museum.category}</p> {/* Ensure to fetch category name if it's an ObjectId */}
            <p><strong>Governor: </strong>{Museum.governor}</p> {/* Ensure to fetch governor name if it's an ObjectId */}
            <p><strong>Created At: </strong>{new Date(Museum.createdAt).toLocaleDateString()}</p>
        </div>
    );
}

export default MuseumDetails;
