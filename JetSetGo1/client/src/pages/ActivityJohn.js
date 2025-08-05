import React, { useState, useEffect } from 'react';
import { ActivityList, AddActivityForm, ActivitiesPage } from '../components/Activiy'
import Act from '../components/act.js'


export default function ActivityPagejohn() {
  const [activities, setActivities] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      const response = await fetch(`http://localhost:8000/api/advertisers/`);

      const data = await response.json();
      console.log(data);
      setActivities(data);
    };

    fetchActivities();
  }, []);

  const handleAddActivity = async (newActivity) => {
    const response = await fetch(`/api/advertiser/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newActivity),
    });
    const addedActivity = await response.json();
    setActivities((prev) => [...prev, addedActivity]);
  };

  const handleEditActivity = async (activity) => {
    const response = await fetch(`/api/advertiser/activities/${activity.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity),
    });
    const updatedActivity = await response.json();
    setActivities((prev) => prev.map((a) => (a.id === updatedActivity.id ? updatedActivity : a)));
    setEditingActivity(null);
  };

  const handleDeleteActivity = async (id) => {
    await fetch(`/api/advertiser/activities/${id}`, { method: 'DELETE' });
    setActivities((prev) => prev.filter((activity) => activity.id !== id));
  };

  const fetchActivities = async () => {
    const response = await fetch('http://localhost:8000/api/advertisers/');
    const data = await response.json();
    setActivities(data);
  };
  console.log('rjorfkforko' + activities);

  return (
    <div>
      <h1>Activities</h1>
      <AddActivityForm
        onSubmit={editingActivity ? handleEditActivity : handleAddActivity}
        initialData={editingActivity}
      />
      <tag className="tag-details">
        {activities && activities.map((act) => (
          // <p key={tag.tag_name}>{tag.tag_name}</p>
          // <tagelement tag={tag}/>
          <Act act={act} />
        ))}
      </tag>


      {/* <ActivityList activities={activities} onDelete={handleDeleteActivity} onEdit={setEditingActivity} /> */}
    </div>
  );
}
