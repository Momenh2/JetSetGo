import { useState } from 'react';
import SearchBar from './Searchbar';

const GuestItineraryFilter = () => {
    // States for search terms
    const [tagName, setTagName] = useState(''); // Change from tagId to tagName
    const [language, setLanguage] = useState('');
    const [date, setDate] = useState('');
    const [budget, setBudget] = useState('');

    // State for results
    const [commonResults, setCommonResults] = useState([]);
    const [loading, setLoading] = useState(false);


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

    // Function to fetch results from the backend
    const fetchResults = async ( query , field , rout ) => {
        setLoading(true);
        try {
            if(query.length != 0)
            {
                const response = await fetch(rout, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ [field]: query }), // Send the search fields
                });
                
            const json = await response.json();
            return json; // Return the search results
            }
            else
            {
                //THIS WILL CHANGE DEPENDING ON THE OBJECT (ACTIVITY, MUSUEM ..)
                const response = await fetch('/api/tourist/getUpcomingItineraries')
                
            const json = await response.json();
            return json; // Return the search results
            }

        } catch (error) {
            console.error('Error fetching search results:', error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Handle submit when the user clicks the submit button
    const handleSubmit = async () => {
        setLoading(true);
        //ROUTES CHANGE DEPENDING ON THE FUCNTION NEEDED
        // 'TITLE' CHANGES DEPENDING ON THE ATTIRBUTE IN THE SCHEMAAA
        //NAME DEPENDS ON THE STATE 

        const tagId = await fetchTagIdByName(tagName);
            
        // Only call fetchResults for tag search if tagId is available
        const results2 = tagName  ? await fetchResults(tagId, 'tagId', '/api/tourist/searchItineraryByTag') : results;

        const results3 = await fetchResults(language, 'language','/api/tourist/searchItineraryByLanguage');

        const results5 = await fetchResults(date, 'availableDates','/api/tourist/searchItineraryByDate');

        const results6 = await fetchResults(budget, 'price','/api/tourist/searchItineraryByBudget');

        const common = results2.filter((item) =>
            results3.some((lan) => lan._id === item._id) &&
            results5.some((dat) => dat._id === item._id) &&
            results6.some((bud) => bud._id === item._id)
        );
        setCommonResults(common);

        setLoading(false);
    };

    return (
        <div>
            <h1>Search for Activities or Museums</h1>

            {/* Search bars for each search field */}
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

            {/* Submit button */}
            <button onClick={handleSubmit}>Search</button>

            {/* Loading indicator */}
            {loading && <p>Loading...</p>}

            {/* Display the common results */}
            {!loading && commonResults.length > 0 && (
                <div>
                    <h2>Results:</h2>
                    {commonResults.map((result) => (
                        <div key={result._id}>
                            <h3>{result.title}</h3>
                            <p>TAG : {result.tags}</p>
                            <p>Location: {result.location}</p>
                            <p>Category: {result.category}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Display message if no results found */}
            {!loading && commonResults.length === 0 && (
                <p>No results found</p>
            )}
        </div>
    );
};

export default GuestItineraryFilter;
