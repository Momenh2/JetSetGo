import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ActivityAdd.css';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:8000'; // Backend URL

/*const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 0,
  lng: 0
};*/

const API_BASE_URL = 'http://localhost:8000/api';

const ActivityForm = () => {
  const token = Cookies.get("auth_token");
  const decodedToken = jwtDecode(token);
  const advertiser_ID = decodedToken.id;
  const navigate = useNavigate(); // Initialize useNavigate
  const [categories, setCategories] = useState([]);
  

  const [activity, setActivity] = useState({
    title: '',
    description: '',
    date:'',
    time:'',
    //activities: { name: [], duration: [] },
    //timeline: [],  // Timeline added
    location: '',
    price: '', // Price field
    category: '', // Assuming 'category' is a single value
    tags: [], // This will hold selected tags
    //language: '',
    //availableDates: [{ date: '', times: [] }],
    //accessibility: '', // Accessibility dropdown
    //pickupLocation: '', // Pickup location
    //dropoffLocation: '', // Dropoff location
    //rating: 0,


    //avertiser: advertiser_ID,
    //isBooked: false,
    specialDiscounts: ''
  });

// State for fetched tags and country options
const [tags, setTags] = useState([]);
const [countryOptions] = useState([
  { value: 'US', label: 'United States' },
  { value: 'IN', label: 'India' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'IT', label: 'Italy' },
  { value: 'ES', label: 'Spain' },
  { value: 'BR', label: 'Brazil' },
  { value: 'JP', label: 'Japan' },
  { value: 'MX', label: 'Mexico' },
  { value: 'CN', label: 'China' },
  { value: 'RU', label: 'Russia' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'KR', label: 'South Korea' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'PK', label: 'Pakistan' },
  { value: 'SA', label: 'Saudi Arabia' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'EG', label: 'Egypt' },
  { value: 'KE', label: 'Kenya' },
  { value: 'PH', label: 'Philippines' },
  { value: 'TH', label: 'Thailand' },
  { value: 'ID', label: 'Indonesia' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'AR', label: 'Argentina' },
  { value: 'CL', label: 'Chile' },
  { value: 'CO', label: 'Colombia' },
  { value: 'PE', label: 'Peru' },
  { value: 'VE', label: 'Venezuela' },
  { value: 'TR', label: 'Turkey' },
  { value: 'SE', label: 'Sweden' },
  { value: 'NO', label: 'Norway' },
  { value: 'FI', label: 'Finland' },
  { value: 'DK', label: 'Denmark' },
  { value: 'PL', label: 'Poland' },
  { value: 'PT', label: 'Portugal' },
  { value: 'AT', label: 'Austria' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'BE', label: 'Belgium' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'GR', label: 'Greece' },
  { value: 'CZ', label: 'Czech Republic' },
  { value: 'SK', label: 'Slovakia' },
  { value: 'HU', label: 'Hungary' },
  { value: 'RO', label: 'Romania' },
  { value: 'BG', label: 'Bulgaria' },
  { value: 'HR', label: 'Croatia' },
  { value: 'SI', label: 'Slovenia' },
  { value: 'BA', label: 'Bosnia and Herzegovina' },
  { value: 'RS', label: 'Serbia' },
  { value: 'MK', label: 'North Macedonia' },
  { value: 'AL', label: 'Albania' },
  { value: 'ME', label: 'Montenegro' },
  { value: 'AM', label: 'Armenia' },
  { value: 'AZ', label: 'Azerbaijan' },
  { value: 'BY', label: 'Belarus' },
  { value: 'UA', label: 'Ukraine' },
  { value: 'MD', label: 'Moldova' },
  { value: 'LT', label: 'Lithuania' },
  { value: 'LV', label: 'Latvia' },
  { value: 'EE', label: 'Estonia' },
  { value: 'IS', label: 'Iceland' },
  { value: 'MT', label: 'Malta' },
  { value: 'LI', label: 'Liechtenstein' },
  { value: 'FO', label: 'Faroe Islands' },
  { value: 'IM', label: 'Isle of Man' },
  { value: 'JE', label: 'Jersey' },
  { value: 'GG', label: 'Guernsey' }
]);

 // Error and Success messages
 const [error, setError] = useState('');
 const [success, setSuccess] = useState('');
 // Fetch tags from the backend
 useEffect(() => {
  const fetchTags = async () => {
    try {
      const response = await axios.get('/api/admin/tag');
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
      setError('Failed to load tags.');
    }
  };
  fetchTags();
}, []);

  // Handle input changes
  // const handleChange = (e) => {
  //   setActivity({
  //     ...activity,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  const handleChange = (e) => {
    setActivity({
      ...activity,
      [e.target.name]: e.target.value,
    });
  };
  

  // Handle tag selection hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhheeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeellllllllllllllllllllllllllllpppppppppppppppppppppppppppppppppppppp
  const handleTagSelection = (tagId) => {
    setActivity((prevData) => {
      const selectedTags = prevData.tags.includes(tagId)
        ? prevData.tags.filter((id) => id !== tagId) // Remove tag if already selected
        : [...prevData.tags, tagId]; // Add tag if not selected
      return { ...prevData, tags: selectedTags };
    });
  };






      // Submit form (create itinerary)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // Correct URL format for your backend route
        await axios.post(`/api/advertisers/createActivity/${advertiser_ID}`,activity);
        setSuccess('Activity created successfully!');
        resetForm();
        setError('');
    } catch (error) {
        setError('Error submitting Activity');
    }
};





  // Reset form
  const resetForm = () => {
    setActivity({
    title: '',
    description: '',
    date:'',
    time:'',
    //activities: { name: [], duration: [] },
    //timeline: [],  // Timeline added
    location: '',
    price: '', // Price field
    tags: [], // This will hold selected tags
    //language: '',
    //availableDates: [{ date: '', times: [] }],
    //accessibility: '', // Accessibility dropdown
    //pickupLocation: '', // Pickup location
    //dropoffLocation: '', // Dropoff location
    //rating: 0,


    //avertiser: advertiser_ID,
    isBooked: false,
    specialDiscounts: ''
    });
  };

 // Handle Cancel button click (go back)
 const handleCancel = () => {
  navigate(-1); // Go back to the previous page
};



useEffect(() => {
  const fetchcategories = async () => {
    try {
      const response = await axios.get('/api/admin/category');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching category:', error);
      setError('Failed to load category.');
    }
  };
  fetchcategories();
}, []);



  return (

    <div className="itinerary-manager">
    <h1 className="title">🌴 Create New Activity 🌴</h1>

    {error && <div className="error-message">{error}</div>}
    {success && <div className="success-message">{success}</div>}

    <form onSubmit={handleSubmit} className="itinerary-form">
      {/* Title and Description */}
      <input type="text" name="title" placeholder="Title" value={activity.title} onChange={handleChange} required />
      <textarea name="description" placeholder="Description" value={activity.description} onChange={handleChange} required />

      


      {/* Tags Selection */}
      <div className="tags-container">
        {tags.map((tag) => (
          <button
            key={tag._id}
            type="button"
            className={`tag-btn ${activity.tags.includes(tag._id) ? 'selected' : ''}`}
            onClick={() => handleTagSelection(tag._id)}
          >
            {tag.tag_name}
          </button>
        ))}
      </div>
      
      {/* Price */}
      <input type="number" name="price" placeholder="Price" value={activity.price} onChange={handleChange} required />
 
      <input type="date" name="date" placeholder="Date" value={activity.date} onChange={handleChange} required />
      <input type="text" name="time" placeholder="Time" value={activity.time} onChange={handleChange} required />    
      <input type="text" name="location" placeholder="location" value={activity.location} onChange={handleChange} required />

      {/* Category Dropdown */}
      <select name="category" value={activity.categories} onChange={handleChange} required>
        <option value="">Select Category</option>
        {categories.map((categories) => (
          <option key={categories._id} value={categories._id}>
            {categories.name}
          </option>
        ))}
      </select>
      
      <input type="text" name="specialDiscounts" placeholder="specialDiscounts" value={activity.specialDiscounts} onChange={handleChange} required />


      <div className="SubmitCancel">
          {/* Cancel Button */}
      <button className="cancel-button" type="button" onClick={handleCancel}>Cancel</button>
      {/* Submit Button */}
      <button className="SubmitButtonCreate" type="submit">Create</button>

    
      </div>
    </form>
  </div>
   

  );
 }


    {/* 
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl mb-6">Activities</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4 mb-4">
        <input
          type="text"
          name="title"
          value={activity.title}
          onChange={handleChange}
          placeholder="title"
          required={addMode}
          className="w-full p-2 border rounded"
        />
          <input
            type="date"
            name="date"
            value={activity.date}
            onChange={handleChange}
            required={addMode}
            className="flex-1 p-2 border rounded"
          />
          <input
            type="time"
            name="time"
            value={activity.time}
            onChange={handleChange}
            required={addMode}
            className="flex-1 p-2 border rounded"
          />
        </div>
        <input
          type="text"
          name="location"
          value={activity.location}
          onChange={handleChange}
          placeholder="Location"
          required={addMode}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="latitude"
          value={activity.latitude}
          onChange={handleChange}
          placeholder="Latitude"
          required={addMode}
          className="w-full p-2 border rounded"
          step="any"
        />
        <input
          type="number"
          name="longitude"
          value={activity.longitude}
          onChange={handleChange}
          placeholder="Longitude"
          required={addMode}
          className="w-full p-2 border rounded"
          step="any"
        />
        <input
          type="number"
          name="price"
          value={activity.price}
          onChange={handleChange}
          placeholder="Price"
          required={addMode}
          className="w-full p-2 border rounded"
          step="any"
        />
        <input
          type="text"
          name="category"
          value={activity.category}
          onChange={handleChange}
          placeholder="Category"
          required={addMode}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="tags"
          value={activity.tags}
          onChange={handleChange}
          placeholder="Tags (comma-separated)"
          className="w-full p-2 border rounded"
        />
        <textarea
          name="specialDiscounts"
          value={activity.specialDiscounts}
          onChange={handleChange}
          placeholder="Special Discounts"
          className="w-full p-2 border rounded"
        />
        <div className="flex items-center">
          <input
            type="checkbox"
            name="bookingOpen"
            checked={activity.bookingOpen}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="bookingOpen">Booking Open</label>
        </div>
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          {initialData ? 'Update Activity' : 'Add Activity'}
        </button>
      </form>
    </div>
  */}

// const ActivityItem = ({ activity, onEdit, onDelete }) => (
//   <div className="border p-4 mb-4 rounded bg-white">
//     <h3 className="font-bold">{activity.category}</h3>
//     <p>Date: {activity.date}</p>
//     <p>Time: {activity.time}</p>
//     <p>Location: {activity.location}</p>
//     <p>Price: ${activity.price}</p>
//     <p>Tags: {Array.isArray(activity.tags) ? activity.tags.join(', ') : activity.tags}</p>
//     <p>Special Discounts: {activity.specialDiscounts}</p>
//     <p>Booking: {activity.bookingOpen ? 'Open' : 'Closed'}</p>
//     <div className="mt-2">
//       <button onClick={() => onEdit(activity)} className="mr-2 p-1 bg-yellow-500 text-white rounded">Edit</button>
//       <button onClick={() => onDelete(activity._id)} className="p-1 bg-red-500 text-white rounded">Delete</button>
//     </div>
//   </div>
// );

// const MapComponent = ({ activities }) => {
//   return (
//     <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
//       <GoogleMap
//         mapContainerStyle={mapContainerStyle}
//         center={center}
//         zoom={2}
//       >
//         {activities.map((activity) => (
//           <Marker
//             key={activity._id}
//             position={{ 
//               lat: parseFloat(activity.latitude) || 0, 
//               lng: parseFloat(activity.longitude) || 0 
//             }}
//             title={activity.category}
//           />
//         ))}
//       </GoogleMap>
//     </LoadScript>
//   );
// };

// export default function ActivityPageJohn() {
//   const [activities, setActivities] = useState([]);
//   const [editingActivity, setEditingActivity] = useState(null);
//   const [error, setError] = useState(null);
//   const {id} = useParams();

//   useEffect(() => {
//     fetchActivities(id);
//   }, []);

//   const fetchActivities = async (id) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/advertisers/showAll/${ id }`);
//       setActivities(response.data);
//       setError(null);
//     } catch (error) {
//       console.error('Error fetching activities:', error);
//       setError('Failed to load activities. Please try again later.');
//     }
//   };

//   const handleAddActivity = async (newActivity) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/advertisers/create`, newActivity);
//       setActivities((prev) => [...prev, response.data]);
//       setError(null);
//     } catch (error) {
//       console.error('Error adding activity:', error);
//       setError('Failed to add activity. Please try again.');
//     }
//   };

//   const handleEditActivity = async (activity) => {
//     try {
//       console.log(activity)
//       const response = await axios.patch(`${API_BASE_URL}/advertisers/updateActivity/${activity._id}`, activity);
//       setActivities((prev) => 
//         prev.map((a) => (a._id === response.data._id ? response.data : a))
//       );
//       setEditingActivity(null);
//       setError(null);
//     } catch (error) {
//       console.error('Error updating activity:', error);
//       setError('Failed to update activity. Please try again.');
//     }
//   };

//   const handleDeleteActivity = async (id) => {
//     try {
//       await axios.delete(`${API_BASE_URL}/advertisers/deleteAct/delete/${id}`);
//       setActivities((prev) => prev.filter((activity) => activity._id !== id));
//       setError(null);
//     } catch (error) {
//       console.error('Error deleting activity:', error);
//       setError('Failed to delete activity. Please try again.');
//     }
//   };

  // return (
  //   <>
  //     <div className="container mx-auto p-4">
  //       <ActivityForm
  //         addMode={editingActivity ?  false:true}
  //         onSubmit={editingActivity ? handleEditActivity : handleAddActivity}
  //         initialData={editingActivity}
  //       />
  //     </div>
      
  //     {error && (
  //       <div className="container mx-auto p-4">
  //         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
  //           {error}
  //         </div>
  //       </div>
  //     )}

  //     <div className="container mx-auto p-4">
  //       <div className="bg-white rounded-lg shadow p-6">
  //         <h2 className="text-xl mb-4">Activity Map</h2>
  //         <MapComponent activities={activities} />
  //       </div>
  //     </div>

  //     <div className="container mx-auto p-4" style={{ maxHeight: '550px', overflowX: 'auto' }}>
  //       <h2 className="text-2xl font-bold mb-4">Activity List</h2>
  //       {activities.map((activity) => (
  //         <ActivityItem
  //           key={activity._id}
  //           activity={activity}
  //           onEdit={setEditingActivity}
  //           onDelete={handleDeleteActivity}
  //         />
  //       ))}
  //     </div>
  //   </>
  // );
//}

export default ActivityForm;
