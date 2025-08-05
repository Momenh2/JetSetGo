import { useState } from 'react';
import SearchBar from './Searchbar';

const ItineraryFilter = ({ onFilter }) => {
    const [name, setName] = useState('');
    const [tagName, setTagName] = useState(''); // Change from tagId to tagName
    const [language, setLanguage] = useState('');
    const [date, setDate] = useState('');
    const [budget, setBudget] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch the tag ID based on the tag name
    const fetchTagIdByName = async (tagName) => {
        try {
            const response = await fetch('/api/tourist/getTagIdByName', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name : tagName }),
            });
            if (response.ok) {
                const { tagId } = await response.json();
                return tagId;
            }
            return null;
        } catch (error) {
            console.error('Error fetching tag ID:', error);
            return null;
        }
    };

    // General function to fetch results based on the field and query
    const fetchResults = async (query, field, route) => {
        setLoading(true);
        try {

            if(query.length != 0)
            {
            const requestData = field === 'availableDates'
                ? { availableDates: [{ date: query }] }
                : { [field]: query };

            const response = await fetch(route, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                const json = await response.json();
                return json;
            }
            return [];
        }
        else
        {
            const response = await fetch('/api/tourist/getUpcomingItineraries');
            const json = await response.json();
            return json;
        }
        } catch (error) {
            console.error(`Error fetching ${field} results:`, error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Handle submit when the user clicks the submit button
    const handleSubmit = async () => {
        setLoading(true);
        try {
            const results = await fetchResults(name, 'title', '/api/tourist/searchItineraryByName');
            
            // Fetch the tag ID by name and log the result
            const tagId = await fetchTagIdByName(tagName);
            console.log("Tag ID retrieved in handleSubmit:", tagId); 
            
            // Only call fetchResults for tag search if tagId is available
            const results2 = tagName  ? await fetchResults(tagId, 'tagId', '/api/tourist/searchItineraryByTag') : results;
            
            const results3 = await fetchResults(language, 'language', '/api/tourist/searchItineraryByLanguage');
            const results4 = await fetchResults(date, 'availableDates', '/api/tourist/searchItineraryByDate');
            const results5 = await fetchResults(budget, 'price', '/api/tourist/searchItineraryByBudget');
    
            // Log each result set to verify data is correctly fetched
            console.log("Results by name:", results);
            console.log("Results by tag ID:", results2);
            console.log("Results by language:", results3);
            console.log("Results by date:", results4);
            console.log("Results by budget:", results5);
    
            const commonResults = results.filter((item) =>
                (!tagId || results2.some((loc) => loc._id === item._id)) &&
                results3.some((lan) => lan._id === item._id) &&
                results4.some((dat) => dat._id === item._id) &&
                results5.some((bud) => bud._id === item._id)
            );

            console.log("Results of ANDING: ", commonResults)
    
            onFilter(commonResults.length !== 0 ? commonResults : []);
        } catch (error) {
            alert(`An error occurred: ${error.message}`);
            console.error('Error fetching search results:', error);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div>
            <h1>Search for Itinerary</h1>

            <SearchBar label="Name" value={name} onChange={setName} />
            <SearchBar label="Tag Name" value={tagName} onChange={setTagName} /> {/* Use tag name input */}
            <SearchBar label="Language" value={language} onChange={setLanguage} />

            <div>
                <label>Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            <div>
                <label>Budget: {budget} USD</label>
                <input
                    type="range"
                    min="0"
                    max="1000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                />
            </div>

            <button onClick={handleSubmit}>Search</button>

            {loading && <p>Loading...</p>}
        </div>
    );
};

export default ItineraryFilter;
