import React,{ useEffect, useState } from 'react';

const HistoricalLocationDetails = ({ HistoricalLocation }) => {
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        const fetchCategoryName = async () => {
            try {
                // Assuming `HistoricalLocation.categoryId` contains the category ID
                const response = await fetch(`/api/tourist/categoryName/${HistoricalLocation.category}`);
                const data = await response.json();

                if (response.ok) {
                    setCategoryName(data.name);
                } else {
                    console.error(data.error);
                }
            } catch (error) {
                console.error("Failed to fetch category name:", error);
            }
        };

        if (HistoricalLocation.category) { // Ensures HistoricalLocation.category is not undefined
            fetchCategoryName();
        }
    }, [HistoricalLocation.category]);

    return (
        <div className="historicalLocation-details">
            <h4>{HistoricalLocation.name}</h4>
            <p><strong>Description: </strong>{HistoricalLocation.description}</p>
            <p><strong>Location: </strong>{HistoricalLocation.location}</p>
            <p><strong>Opening Hours: </strong>{HistoricalLocation.openingHours}</p>
            <p><strong>Ticket Prices: </strong>
                <ul>
                    <li>Foreigner: {HistoricalLocation.ticketPrices.foreigner} EGP</li>
                    <li>Native: {HistoricalLocation.ticketPrices.native} EGP</li>
                    <li>Student: {HistoricalLocation.ticketPrices.student} EGP</li>
                </ul>
            </p>
            <p><strong>Tags: </strong>{HistoricalLocation.tags}</p>
            <p><strong>Category: </strong>{categoryName}</p> {/* Ensure to fetch category name if it's an ObjectId */}
            <p><strong>Governor: </strong>{HistoricalLocation.governor}</p> {/* Ensure to fetch governor name if it's an ObjectId */}
            <p><strong>Created At: </strong>{new Date(HistoricalLocation.createdAt).toLocaleDateString()}</p>
        </div>
    );
}

export default HistoricalLocationDetails;
