import { useState, useEffect } from 'react';
import SearchBar from './Searchbar';

const ActivityFilter = ({ onFilter }) => {
    const [name, setName] = useState('');
    const [tagName, setTagName] = useState(''); // Use tag name for input
    const [selectedCategories, setSelectedCategories] = useState([]); // Track selected categories
    const [rating, setRating] = useState('');
    const [date, setDate] = useState('');
    const [budget, setBudget] = useState(0);
    const [categoryList, setCategoryList] = useState([]); // List of all categories to use for checkbox
    const [loading, setLoading] = useState(false);

    // Fetch the tag ID by name from the backend
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

    // Fetch search results from the backend
    const fetchResults = async (query, field, route) => {
        setLoading(true);
        try {
            if (query !== '') {
                const response = await fetch(route, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ [field]: query }),
                });
                if (response.ok) {
                    const json = await response.json();
                    return json;
                } else {
                    return [];
                }
            } else {
                const response = await fetch('/api/tourist/getUpcomingActivities');
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

    // Handle form submission
    const handleSubmit = async () => {
        try {
            setLoading(true);

            // Fetch the search results
            const results = await fetchResults(name, 'title', '/api/tourist/searchActivityByName');

            // Fetch the tagId as an ObjectId
            const tagId = await fetchTagIdByName(tagName);
            console.log("Tag ID for given Tag name", tagId);
            const results2 = tagName ? await fetchResults(tagId, 'tagId', '/api/tourist/searchActivityByTag') : results;

            // Fetch results for each selected category one by one and merge
            let results3 = results; // Start with the default results
            if (selectedCategories.length > 0) {
                for (let categoryId of selectedCategories) {
                    const categoryResults = await fetchResults(categoryId, 'category', '/api/tourist/searchActivityByCategory');
                    results3 = results3.filter(item => categoryResults.some(cat => cat._id === item._id));
                }
            }

            const results4 = rating !== '' ? await fetchResults(Number(rating), 'rating', '/api/tourist/searchActivityByRating') : results;
            const results5 = await fetchResults(date, 'date', '/api/tourist/searchActivityByDate');
            const results6 = await fetchResults(budget, 'price', '/api/tourist/searchActivityByBudget');

            // Filter common results across all criteria
            const common = results.filter((item) =>
                (!tagName || results2.some((loc) => loc._id === item._id)) &&
                (selectedCategories.length === 0 || results3.some((cat) => cat._id === item._id)) &&
                (!rating || results4.some((rat) => rat._id === item._id)) &&
                (!date || results5.some((dat) => dat._id === item._id)) &&
                (!budget || results6.some((bud) => bud._id === item._id))
            );

            onFilter(common.length ? common : []);
        } catch (error) {
            alert(`An error occurred: ${error.message}`);
            console.error('Error fetching search results:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle checkbox change for categories
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
            <h1>Search for Activities</h1>

            <SearchBar label="Name" value={name} onChange={setName} />
            <SearchBar label="Tag Name" value={tagName} onChange={setTagName} />

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

export default ActivityFilter;
