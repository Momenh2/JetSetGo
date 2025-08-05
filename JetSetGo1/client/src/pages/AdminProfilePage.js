import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminProfilePage = () => {
  const navigate = useNavigate();

  const handleDeleteRedirect = () => {
    navigate('/delete-options'); // Redirect to the page with role options
  };

  return (
    <div>
      <h1>Admin Profile</h1>
      {/* Other profile information */}
      <button onClick= {() => navigate(`/admin/delete-options`)}>Delete Account</button>
      <button onClick={() => navigate(`/admin/add`)}>Add Admin</button> {/* New button for adding admin */}
    </div>
  );
};

export default AdminProfilePage;
