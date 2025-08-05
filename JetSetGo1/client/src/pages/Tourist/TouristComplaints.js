import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import './TouristComplaints.css';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const statusClasses = {
  resolved: 'status-resolved',
  pending: 'status-pending',
};

function TouristComplaint() {
  const location = useLocation(); // Access the location object
  const navigate = useNavigate();
  const token = Cookies.get("auth_token");
  const decodedToken = jwtDecode(token);
  const id = decodedToken.id;
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("Recent");
  const [statusFilter, setStatusFilter] = useState("All");

  
  // const { id } = useParams();
  console.log(id);

  useEffect(() => {
    fetchComplaints();
  }, [dateFilter, statusFilter]); // Re-fetch complaints when filters change

  const fetchComplaints = async () => {
    const response = await fetch(`/api/tourist/getComplaints/${id}`);
    const json = await response.json();

    if (response.ok) {
      let filteredComplaints = json;

      // Filter by status if a specific status is selected
      if (statusFilter !== "All") {
        filteredComplaints = filteredComplaints.filter(complaint => complaint.status === statusFilter);
      }

      // Sort complaints based on the date filter
      const sortedComplaints = filteredComplaints.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateFilter === "Recent" ? dateB - dateA : dateA - dateB;
      });

      setComplaints(sortedComplaints);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="header-box">
        <div className="back-link" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} className="back-arrow" />
          <span className="text">Back</span>
        </div>
        <button
          onClick={() => navigate(`/tourist/addComplaint`, { state: { id } })}
          className="backy-button"
        >
          Add Complaint
        </button>
      </div>
      <div className="table-container">
        <div className="table-controls">
          <div className="date-filter">
            <span>Date:</span>
            <select
              className="date-select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="Recent">Recent</option>
              <option value="Oldest">Oldest</option>
            </select>
          </div>

          <div className="status-filter">
            <span>Status:</span>
            <select
              className="status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Title</th>
                <th>Status</th>
                <th>Date</th>
                <th>Body</th>
                <th>Response</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr
                  onClick={() => window.location.href = `http://localhost:3000/api/admin/viewComplaint?complaintId=${complaint._id}`}
                  key={complaint._id}
                >
                  <td>{complaint.userId ? complaint.userId.username : "N/A"}</td> {/* Display the username */}
                  <td>{complaint.title}</td>
                  <td>
                    <span className={`status-badge ${statusClasses[complaint.status]}`}>
                      {complaint.status.toUpperCase()}
                    </span>
                  </td>
                  <td>{new Date(complaint.date).toLocaleDateString()}</td> {/* Format date */}
                  <td>{complaint.body}</td>
                  <td>{complaint.adminResponse}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="table-pagination">
            {/* <span>Page 1 of 4</span>
            <div className="pagination-controls">
              <button className="pagination-button">Show 5</button>
              <button className="pagination-button">❮</button>
              <button className="pagination-button">❯</button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TouristComplaint;