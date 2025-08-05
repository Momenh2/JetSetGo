import React from 'react';
import "../../pages/Admin/AdminVeiwDocuments"
import "./adminreview.css";


function UserCard({ username, documents, Id, modelName, onStatusChange }) {
    console.log(Id)
    console.log(modelName)
    const handleAccept = async () => {
      try {
        

        const response = await fetch(`/api/admin/accept/${Id}/${modelName}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          
        });
  
        if (!response.ok) throw new Error('Failed to accept user');
  
        const data = await response.json();
        console.log(data.message); // Handle the response as needed
        onStatusChange(); // Refresh the document list
      } catch (error) {
        console.error(error);
      }
    };
  
    const handleReject = async () => {
      try {
        
        console.log(Id)

        const response = await fetch(`/api/admin/reject/${Id}/${modelName}`, {
          method: 'PATCH', // Assuming DELETE for reject
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) throw new Error('Failed to reject user');
  
        const data = await response.json();
        console.log(data.message); // Handle the response as needed
        onStatusChange(); // Refresh the document list
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
      <div className="user-card-adrev">
        <h4>{username}</h4>
        {documents.map((doc, index) => (
          <div key={index}>
            <h5>Document {index + 1}</h5>
            <a
              href={`http://localhost:8000/${doc}`} // Ensure this is the correct path
              download={doc} // This attribute triggers the download
              style={{ textDecoration: 'none', color: 'blue' }}
            >
              Download {doc}
            </a>
          </div>
        ))}
        <div className="user-card-actions-adrev">
          <button onClick={handleAccept} className="accept-btn-adrev">
            Accept
          </button>
          <button onClick={handleReject} className="reject-btn-adrev">
            Reject
          </button>
        </div>
      </div>
    );
  }
  

export default UserCard;
