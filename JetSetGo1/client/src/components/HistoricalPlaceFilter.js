import { useState, useEffect } from 'react';
import SearchBar from './Searchbar';

import { useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie
const HistoricalPlaceFilter = ({ onFilter }) => {
    // States for search terms
    const location = useLocation(); // Access state passed via Link
    const token = Cookies.get("auth_token");
    const decodedToken = jwtDecode(token);
    const id = decodedToken.id;
    console.log("id:", id);
    const modelName = decodedToken.userType;
    console.log("modelName:", modelName);
    // const { id } = location.state || {}; // Access id from state

    const [name, setName] = useState('');
    const [tagName, setTagName] = useState(''); // Tag name input
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
                // Default route if query is empty (fetch all historical places)
                const response = await fetch('/api/tourist/getHistoricalLocations');
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

        // Fetch results by name
        const results = await fetchResults(name, 'name', '/api/tourist/searchHistoricalPlaceByName');
        const museumResults = await fetchResults(name, 'name', '/api/tourist/searchMuseumByName');

        // Fetch tag ID if tagName is provided
        const tagId = tagName ? await fetchTagIdByName(tagName) : null;
        console.log("Tag ID retrieved in handleSubmit:", tagId);

        // Fetch results by tag if tagId is available
        const resultsByTag = tagId ? await fetchResults(tagId, 'tags', '/api/tourist/searchHistoricalPlaceByTag') : results;
        const museumResultsByTag = tagId ? await fetchResults(tagId, 'tagId', '/api/tourist/searchMuseumByTag') : museumResults;

        let resultsByCategory = results; // Start with the default results (by name)
        if (selectedCategories.length > 0) {
            for (let categoryId of selectedCategories) {
                const categoryResults = await fetchResults(categoryId, 'category', '/api/tourist/searchHistoricalPlaceByCategory');
                resultsByCategory = resultsByCategory.filter(item => categoryResults.some(cat => cat._id === item._id));
            }
        }
        let museumResultsByCategory = museumResults; // Start with the default results (by name)
        if (selectedCategories.length > 0) {
            for (let categoryId1 of selectedCategories) {
                const categoryResults1 = await fetchResults(categoryId1, 'category', '/api/tourist/searchMuseumByCategory');
                museumResultsByCategory = museumResultsByCategory.filter(item => categoryResults1.some(cat => cat._id === item._id));
            }
        }


        // Combine the results by filtering for items that match both tag and category
        const filteredResults1 = resultsByCategory.filter((item) =>
            resultsByTag.some((tag) => tag._id === item._id)
        );
        const filteredResults2 = museumResultsByCategory.filter((item) =>
            museumResultsByTag.some((tag) => tag._id == item._id))

        const filteredResults = filteredResults1.concat(filteredResults2)

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
            {/*<h1>Search for Historical Places</h1>*/}

            {/* Search bars for each search field */}
            {/*<SearchBar label="Name" value={name} onChange={setName} />
            <SearchBar label="Tag Name" value={tagName} onChange={setTagName} />*/} {/* Use tag name input */}

            {/*<div>
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
            </div>*/}

            {/* Submit button */}
            {/*<button onClick={handleSubmit}>Search</button>*/}

            {/* Loading indicator */}
            {/*{loading && <p>Loading...</p>}*/}
        </div>
    );
};

export default HistoricalPlaceFilter;