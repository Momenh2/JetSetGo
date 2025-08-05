import { useState, useEffect } from 'react';
import SearchBar from './Searchbar';

const MuseumFilter = ({ onFilter }) => {
    // States for search terms
    const [name, setName] = useState('');
    const [tagName, setTagName] = useState(''); // Use tagName for input
    const [selectedCategories, setSelectedCategories] = useState([]); // Track selected categories

    const [categoryList, setCategoryList] = useState([]); // Categories list for display

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

    // Fetch the tag ID based on the tag name
    const fetchTagIdByName = async (tagName) => {
        try {
            const response = await fetch('/api/tourist/getTagIdByName', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: tagName }),
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

                if (response.ok) {
                    const json = await response.json();
                    return json;
                } else {
                    return [];
                }
            } else {
                const response = await fetch('/api/tourist/getMuseums');
                const json = await response.json();
                return json;
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

        // Fetch museums by name
        const results = await fetchResults(name, 'name', '/api/tourist/searchMuseumByName');

        // Fetch tag ID if tagName is provided
        const tagId = tagName ? await fetchTagIdByName(tagName) : null;
        console.log("Tag ID retrieved in handleSubmit:", tagId);

        // Fetch results by tag if tagId is available
        const resultsByTag = tagId ? await fetchResults(tagId, 'tagId', '/api/tourist/searchItineraryByTag') : results;

        let resultsByCategory = results; // Start with the default results (by name)
        if (selectedCategories.length > 0) {
            for (let categoryId of selectedCategories) {
                const categoryResults = await fetchResults(categoryId, 'category', '/api/tourist/searchActivityByCategory');
                resultsByCategory = resultsByCategory.filter(item => categoryResults.some(cat => cat._id === item._id));
            }
        }

        // Combine the results by filtering for items that match both tag and category
        const filteredResults = resultsByCategory.filter((item) =>
            resultsByTag.some((tag) => tag._id === item._id)
        );

        // Update the common results
        setCommonResults(filteredResults);
        if (filteredResults.length !== 0) {
            onFilter(filteredResults);
        } else {
            onFilter([]);
        }

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
            <h1>Search for Museums</h1>

            {/* Search bars for each search field */}
            <SearchBar label="Name" value={name} onChange={setName} />
            <SearchBar label="Tag Name" value={tagName} onChange={setTagName} /> {/* Use tag name input */}
            
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

            {/* Submit button */}
            <button onClick={handleSubmit}>Search</button>

            {/* Loading indicator */}
            {loading && <p>Loading...</p>}
        </div>
    );
};

export default MuseumFilter;
