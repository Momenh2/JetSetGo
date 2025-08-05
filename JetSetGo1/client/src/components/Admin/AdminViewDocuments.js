import React, { useEffect, useState } from 'react';
import UserCard from '../../components/Admin/UserCard';
import "../../components/Admin/adminreview.css";


function AdminDocumentReview() {
  const [userDocuments, setUserDocuments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/admin/view-documents", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response)
      if (!response.ok) throw new Error("Failed to fetch documents");

      const data = await response.json();
      console.log(data)
      setUserDocuments(data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Document Review</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {Object.keys(userDocuments).map((userType) => (
        <div key={userType}>
          <h3>{userType.charAt(0).toUpperCase() + userType.slice(1)}</h3>
          <div>
            <div className="user-cards-container-adrev ">
              {userDocuments[userType].map((user) => (

                <UserCard
                  key={user.id}
                  username={user.username}
                  documents={user.documents}
                  Id={user.id}
                  modelName={userType.slice(0, -1)} // 'tourGuide', 'advertiser', 'seller'
                  onStatusChange={fetchDocuments} // Refresh list after status change
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminDocumentReview;