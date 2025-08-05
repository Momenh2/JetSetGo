import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { userId } from '../components/accountBox/signupForm'; // Ensure this path is correct
// import { useState } from 'react'


function Activity({ activity, onDelete, onEdit }) {

  return (
    <div className="activity">
      <h3>{activity.title} - {activity.date} - {activity.time}</h3>
      <p>{activity.location.address}</p>
      <p>Price: {activity.price}</p>
      <p>Category: {activity.category}</p>
      <p>Tags: {activity.tags.join(', ')}</p>
      <p>Special Discounts: {activity.specialDiscounts}</p>
      <p>Booking Open: {activity.isBookingOpen ? 'Yes' : 'No'}</p>
      <button onClick={() => onEdit(activity)}>Edit</button>
      <button onClick={() => onDelete(activity.id)}>Delete</button>
    </div>
  );
}

function ActivityList({ activities, onDelete, onEdit }) {
  return (
    <div>
      {activities.map((activity) => (
        <Activity key={activity.id} activity={activity} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
}

function AddActivityForm({ onAdd }) {
  const [formData, setFormData] = useState({

    title: '', // Add title to the form data
    date: '',
    time: '',
    location: '',
    price: '',
    category: '',
    tags: [],
    specialDiscounts: '',
    isBookingOpen: false,
    advertiser: '', // Add advertiserId directly from userId
    // advertiser: '',
    id: '',
  });
  console.log(formData);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleTagsChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      tags: value.split(',').map(tag => tag.trim()),
    }));
  };

  const handleDiscountsChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      specialDiscounts: value.split(',').map(discount => discount.trim()),
    }));
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    console.log("lat:", lat, "lng", lng);
    const addr = String(lat) + String(lng);
    setFormData(prevData => ({
      ...prevData,
      location: addr, // Set a default address
    }));


  };
  const handleEditActivity = async (event) =>{
    // Implement edit functionality here if needed
    console.log("weselna hena ");
    console.log("weselna hena:", formData.id);
    console.log("fifo",formData);
    const response = await fetch(`http://localhost:8000/api/advertisers/update/${formData.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',  // Make sure to specify the content type
      },
      body: JSON.stringify(formData),
    })
    console.log(response);
    


  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch('http://localhost:8000/api/advertisers/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const newActivity = await response.json();
      // onAdd(newActivity); // Call the onAdd function passed from the parent to update the activities
      setFormData({
        title: '',
        date: '',
        time: '',
        location: '',
        price: '',
        category: '',
        tags: [],
        specialDiscounts: '',
        isBookingOpen: false,
        advertiser: userId, // Reset to the advertiserId again after submission
        // advertiser: '',
        id: '',
      });
    } else {
      // Handle error
      console.error('Failed to add activity:', await response.text());
    }
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        
        <input type="time" name="time" value={formData.time} onChange={handleChange} required />
        <input
          type="text"
          name="location.address"
          value={formData.location.address}
          readOnly
          placeholder="Location"
        />
        <input type="text" name="price" value={formData.price} onChange={handleChange} placeholder="Price" required />
        <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" required />
        <input type="text" name="tags" value={formData.tags.join(', ')} onChange={handleTagsChange} placeholder="Tags (comma separated)" />
        <input type="text" name="specialDiscounts" value={formData.specialDiscounts} onChange={handleChange} placeholder="Special Discounts" />
        <input type="text" name="advertiser" value={formData.advertiser} onChange={handleChange} placeholder="advertiser" />
        <input type="text" name="id" value={formData.id} onChange={handleChange} placeholder="id(in case of update bas)" />

        <label>
          Booking Open:
          <input type="checkbox" name="isBookingOpen" checked={formData.isBookingOpen} onChange={handleChange} />
        </label>
        <button type="submit">Add Activity</button>


      </form>
      <button onClick={handleEditActivity}>Update ISA</button>


      {/* Google Map for selecting location */}
      <LoadScript googleMapsApiKey="AIzaSyB2wxAEQ6Uo7AgEIt0_4kCJgNMPNEjqjO0">
        <GoogleMap
          mapContainerStyle={{ height: "300px", width: "100%" }}
          center={{ lat: formData.location.lat || 0, lng: formData.location.lng || 0 }}
          zoom={10}
          onClick={handleMapClick}
        >
          {formData.location.lat && formData.location.lng && (
            <Marker position={{ lat: formData.location.lat, lng: formData.location.lng }} />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

function ActivitiesPage() {
  const [activities, setActivities] = useState([]);

  const fetchActivities = async () => {
    const response = await fetch('http://localhost:8000/api/advertisers/');
    const data = await response.json();
    // fata = data;
    setActivities(data);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleAddActivity = (newActivity) => {
    setActivities((prevActivities) => [...prevActivities, newActivity]);
  };

  const handleDeleteActivity = async (id) => {
    await fetch(`http://localhost:8000/api/advertiser/${id}`, { method: 'DELETE' });
    setActivities((prevActivities) => prevActivities.filter(activity => activity.id !== id));
  };



  return (
    <div>
      {/* <AddActivityForm onAdd={handleAddActivity} /> */}
      <h2>nk;jnkjnjknkj;n;kjjn;kjnkj bjhjkllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll</h2>

      <ActivityList activities={activities} onDelete={handleDeleteActivity} />
    </div>
  );
}

export { ActivitiesPage, ActivityList, AddActivityForm };

//AIzaSyB2wxAEQ6Uo7AgEIt0_4kCJgNMPNEjqjO0