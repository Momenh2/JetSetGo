import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie

const PreferencesSelection = () => {
  const [tags, setTags] = useState([]); // Store tags fetched from the database
  const token = Cookies.get("auth_token");
  const decodedToken = jwtDecode(token);
  const id = decodedToken.id;
  console.log("id:", id);
  const modelName = decodedToken.userType;
  console.log("modelName:", modelName);
  const [selectedTags, setSelectedTags] = useState([]);
  const [budget, setBudget] = useState({ from: '', to: '' });

  // Get the ID from the state passed via useLocation
  const location = useLocation();
  // const { id } = location.state || {};
  console.log(id);
  // Fetch tags from the backend
  const fetchTags = async () => {
    try {
      const response = await axios.get('/api/admin/tag'); // Fetch tags
      setTags(response.data); // Set fetched tags
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  // Fetch tags when the component mounts
  useEffect(() => {
    fetchTags();
  }, []);

  // Toggle tag selection
  const handleTagClick = (tagId) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tagId) ? prevTags.filter((id) => id !== tagId) : [...prevTags, tagId]
    );
    console.log(selectedTags);
  };

  // Handle budget input changes
  const handleBudgetChange = (e) => {
    const { name, value } = e.target;
    setBudget((prevBudget) => ({ ...prevBudget, [name]: value }));
  };

  // Submit selected preferences
  const submitPreferences = async () => {
    const preferences = {
      tags: selectedTags,
      budget: {
        from: Number(budget.from),
        to: Number(budget.to),
      },
    };
    console.log(preferences);

    try {
      // Use the ID from the state for the API request
      const response = await axios.patch(`/api/tourist/selectPrefrences/${id}`, preferences);
      console.log('Preferences updated:', response.data);
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  return (
    <div>
      <h2>Select Your Preferences</h2>

      <div>
        <h3>Tags</h3>
        {tags.map((tag) => (
          <button
            key={tag._id}
            onClick={() => handleTagClick(tag._id)}
            style={{
              backgroundColor: selectedTags.includes(tag._id) ? 'blue' : 'gray',
              color: 'white',
              margin: '5px',
              padding: '10px',
            }}
          >
            {tag.tag_name}
          </button>
        ))}
      </div>

      <div>
        <h3>Budget</h3>
        <label>
          Lower Limit:
          <input
            type="number"
            name="from"
            value={budget.from}
            onChange={handleBudgetChange}
          />
        </label>
        <label>
          Upper Limit:
          <input
            type="number"
            name="to"
            value={budget.to}
            onChange={handleBudgetChange}
          />
        </label>
      </div>

      <button onClick={submitPreferences}>Save Preferences</button>
    </div>
  );
};

export default PreferencesSelection;
