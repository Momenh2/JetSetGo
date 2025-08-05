import React from 'react';

function UserCard({ userId, username, documents, modelName, onStatusChange }) {
  const handleAccept = async () => {
    try {
      await fetch(`http://localhost:8000/api/admin/accept/${userId}/${modelName}`, {
        method: 'PATCH',
      });
      onStatusChange();
    } catch (error) {
      console.error("Failed to accept user:", error);
    }
  };

  const handleReject = async () => {
    try {
      await fetch(`http://localhost:8000/api/admin/reject/${userId}/${modelName}`, {
        method: 'PATCH',
      });
      onStatusChange();
    } catch (error) {
      console.error("Failed to reject user:", error);
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '15px', margin: '10px 0' }}>
      <h4>{username}</h4>
      <p><strong>Documents:</strong></p>
      <ul>
        {documents.map((doc, index) => (
          <li key={index}><a href={`/uploads/${doc}`} target="_blank" rel="noopener noreferrer">{doc}</a></li>
        ))}
      </ul>
      <button onClick={handleAccept} style={{ marginRight: '10px' }}>Accept</button>
      <button onClick={handleReject}>Reject</button>
    </div>
  );
}

export default UserCard;
