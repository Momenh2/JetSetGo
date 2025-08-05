import React, { useState, useEffect } from 'react';
import './CategoriesAndActivities.css';

const CategoriesAndActivities = () => {
  const [categories, setCategories] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [isFetchingActivities, setIsFetchingActivities] = useState(false); // New state for fetch status

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/tourist/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = async (categoryId, categoryName) => {
    setSelectedCategoryId(categoryId);
    setSelectedCategoryName(categoryName);
    setIsFetchingActivities(true); // Set to true while fetching activities
    setActivities([]); // Clear previous activities

    try {
      const response = await fetch(`/api/tourist/activities/category/${categoryId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }

      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setActivities([]); // Clear activities if there's an error
    } finally {
      setIsFetchingActivities(false); // Set to false after fetching is done
    }
  };

  return (
    <div>
      <h2>Categories</h2>
      <div>
        {categories.map(category => (
          <button 
            key={category._id} 
            onClick={() => handleCategoryClick(category._id, category.name)}
            style={{ margin: '5px', padding: '10px 20px', cursor: 'pointer' }}>
            {category.name}
          </button>
        ))}
      </div>

      {selectedCategoryId && (
        <div>
          <h3>Activities for {selectedCategoryName}</h3>
          <div className="activities-container">
            {isFetchingActivities ? (
              <p>Loading activities...</p>
            ) : activities.length > 0 ? (
              activities.map(activity => (
                <div key={activity.id} className="activity-card">
                  <h4>{activity.title}</h4>
                  {/* Add more details like description, image, etc., if available */}
                </div>
              ))
            ) : (
              <p>No activities found for this category.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesAndActivities;
