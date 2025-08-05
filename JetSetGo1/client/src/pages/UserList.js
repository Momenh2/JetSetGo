import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UserList = () => {
  const { role } = useParams(); // Get the role from the URL params
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/admin/${role}/list`);
        if (!response.ok) {
          const text = await response.text(); // Read the response as text
          console.error('Response text:', text); // Log the response text
          throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message);
      }
    };

    fetchUsers();
  }, [role]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/admin/delete/${role}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      // Remove deleted user from state
      setUsers(users.filter(user => user._id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.message);
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>{role.charAt(0).toUpperCase() + role.slice(1)} List</h2>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.username}
            <button onClick={() => handleDelete(user._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};

export default UserList;
