import React from 'react';
import { useNavigate } from 'react-router-dom';

const DeleteOptions = () => {
  const navigate = useNavigate();

  // Redirect to delete page for specific roles
  const handleDelete = (role) => {
    navigate(`/delete/${role}`); // Redirect to the delete page for each role
  };

  return (
    <div>
      <h2>Delete an Account</h2>
      <button onClick={() => handleDelete('admin')}>Admin</button>
      <button onClick={() => handleDelete('advertisers')}>Advertiser</button>
      <button onClick={() => handleDelete('seller')}>Seller</button>
      <button onClick={() => handleDelete('tourguides')}>Tour Guide</button>
      <button onClick={() => handleDelete('tourist')}>Tourist</button>
      <button onClick={() => handleDelete('tourismgoverner')}>Tourism Governer</button>
    </div>
  );
};

export default DeleteOptions;
