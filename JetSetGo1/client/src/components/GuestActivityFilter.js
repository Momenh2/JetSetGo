import { useState, useEffect } from 'react';
import SearchBar from './Searchbar';

const GuestActivityFilter = () => {
    // States for search terms
    const [selectedCategories, setSelectedCategories] = useState([]); // Track selected categories
    const [rating, setRating] = useState('');
    const [date, setDate] = useState('');
    const [budget, setBudget] = useState('');

    const [categoryList, setCategoryList] = useState([]);

    // State for results
    const [commonResults, setCommonResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch all categories from the backend
    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/admin/category');
            const json = await response.json();
            setCategoryList(json);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Function to fetch results from the backend
    const fetchResults = async (query, field, route) => {
        setLoading(true);
        try {
            if (query.length !== 0) {
                const response = await fetch(route, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ [field]: query }), // Send the search fields
                });

                const json = await response.json();
                return json; // Return the search results
            } else {
                // Default route to get all activities if no search term is provided
                const response = await fetch('/api/guests/getUpcomingActivities');
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

        let results = await fetchResults('', '', '/api/guests/getUpcomingActivities'); // Get all activities initially

        // Fetch results for each selected category one by one and filter
        if (selectedCategories.length > 0) {
            let resultsByCategory = results; // Start with all results
            for (let categoryId of selectedCategories) {
                const categoryResults = await fetchResults(categoryId, 'category', '/api/tourist/searchActivityByCategory');
                resultsByCategory = resultsByCategory.filter(item => categoryResults.some(cat => cat._id === item._id));
            }
            results = resultsByCategory; // Set filtered results by category
        }

        // Fetch results by rating
        const resultsByRating = rating !== '' ? await fetchResults(Number(rating), 'rating', '/api/tourist/searchActivityByRating') : results;

        // Fetch results by date
        const resultsByDate = date !== '' ? await fetchResults(date, 'date', '/api/tourist/searchActivityByDate') : results;

        // Fetch results by budget
        const resultsByBudget = budget !== '' ? await fetchResults(budget, 'price', '/api/tourist/searchActivityByBudget') : results;

        // Combine all filtered results
        const filteredResults = results.filter((item) =>
            resultsByRating.some((rat) => rat._id === item._id) &&
            resultsByDate.some((dat) => dat._id === item._id) &&
            resultsByBudget.some((bud) => bud._id === item._id)
        );

        setCommonResults(filteredResults); // Set the final filtered results
        setLoading(false);
    };

    // Handle category checkbox change
    const handleCategoryChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedCategories((prev) => [...prev, value]);
        } else {
            setSelectedCategories((prev) => prev.filter((category) => category !== value));
        }
    };

    // Fetch categories when the component mounts
    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div>
            <h1>Search for Activities or Museums</h1>

            {/* Categories selection */}
            <div>
                <h6>Categories</h6>
                {categoryList.length > 0 ? (
                    categoryList.map((category) => (
                        <div key={category._id}>
                            <label>
                                <input
                                    type="checkbox"
                                    value={category._id}
                                    onChange={handleCategoryChange}
                                    checked={selectedCategories.includes(category._id)}
                                />
                                {category.name}
                            </label>
                        </div>
                    ))
                ) : (
                    <p>Loading categories...</p>
                )}
            </div>

            {/* Rating selection */}
            <div>
                <label>Rating</label>
                <select value={rating} onChange={(e) => setRating(e.target.value)}>
                    <option value="">Select Rating</option>
                    {[0, 1, 2, 3, 4, 5].map((star) => (
                        <option key={star} value={star}>
                            {star} Star{star !== 1 ? 's' : ''}
                        </option>
                    ))}
                </select>
            </div>

            {/* Date selection */}
            <div>
                <label>Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            {/* Budget selection */}
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
                            <p>Tag: {result.tags}</p>
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

export default GuestActivityFilter;
