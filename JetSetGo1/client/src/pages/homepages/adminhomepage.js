import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Admin/sidebar';
import Navbar from '../../components/Admin/navbarr';
import './adminhomepage.css'; // Style the dashboard

function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersThisMonth, setUsersThisMonth] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    // Fetch stats when the component mounts
    const fetchStats = async () => {
      try {
        // Fetching the stats from the API using fetch
        const response = await fetch('/api/admin/users'); // Adjust the API route if necessary
        const data = await response.json();

        // Destructure the data to get the stats
        const { totalUsers, usersThisMonth } = data;

        // Set the state with the fetched stats
        setTotalUsers(totalUsers);
        setUsersThisMonth(usersThisMonth);
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    fetchStats();
  }, []); // Empty dependency array means this runs once after component mounts


  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/showUsers');
      const data = await response.json();
  
      // Check if the response contains the `users` property
      if (data && Array.isArray(data.users)) {
        setUsers(data.users); // Use the `users` array from the response
      } else {
        console.error('Unexpected response format:', data);
        setUsers([]); // Set an empty array if the response format is unexpected
      }
      setError(null);
    } catch (error) {
      setError("Failed to fetch users. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchUsers();
}, []);

if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;


  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="dashboard-data">
          <h2>Admin Dashboard</h2>
          <div className="stats">
            <div className="stat-card">
              <h3>Sales</h3>
              <p>$50,000</p>
            </div>
            <div className="stat-card">
              <h3>New Complaints</h3>
              <p>3</p>
            </div>
            <div className="stat-card">
              <h3>Total Products</h3>
              <p>120</p>
            </div>
            <div className="stat-card">
              <h3>Active Admins</h3>
              <p>5</p>
            </div>

            <div className="stat-card">
              <h3>All Users</h3>
              <p>{totalUsers}</p>
            </div>

            <div className="stat-card">
              <h3>Users this month</h3>
              <p>{usersThisMonth}</p>
            </div>

          </div>
        </div>

        <div className="d-flex justify-content-center mt-4">
                    <table className="table table-striped text-center w-75">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Password</th>
                                <th>Role</th>
                                <th>Created at</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="table-row">


                                    <td>{user.username}</td>
                                    <td>{user.password}</td>
                                    <td>{user.userType}</td>
                                    <td>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>




      </div>
    </div>
  );
}

export default AdminDashboard;
