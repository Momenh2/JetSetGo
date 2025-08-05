import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminViewComplaintStyle.css';
import { useLocation } from 'react-router-dom';

const AdminViewComplaint = () => {
    const [complaint, setComplaint] = useState(null);
    const location = useLocation();
    // console.log(location.state )
    const complaintId = location.state || {};
    console.log(complaintId)
    

    const navigate = useNavigate();

    useEffect(() => {
        viewComplaint();
    }, []);

    const viewComplaint = async () => {
        const response = await fetch(`http://localhost:8000/api/admin/viewComplaint/${complaintId}`);
        const json = await response.json();
        if (response.ok) {
            setComplaint(json);
        }
    };

    const resolveComplaint = async (replyText) => {
        try {
            const response = await fetch('http://localhost:8000/api/admin/resolveComplaint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ complaintId, reply: replyText }),
            });
            if (response.ok) {
                navigate('/admin/complaints');
            }
        } catch (error) {
            console.error('Error resolving complaint:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const replyText = document.getElementById("response").value;
        resolveComplaint(replyText);
    };

    return (
        <div className="complaint-container">
            <div className="complaint-details">
                <h2>{complaint ? complaint.title : "Not found"}</h2>
                <p className="complaint-body">{complaint ? complaint.body : "Not found"}</p>
                <p className={`status ${complaint?.status?.toLowerCase()}`}>
                    {complaint ? complaint.status.toUpperCase() : "Not found"}
                </p>
                <p>{complaint ? new Date(complaint.date).toLocaleDateString() : "Not found"}</p>
            </div>
        <form onSubmit={handleSubmit} className="response-form">
            <label htmlFor="response" className="response-label">Admin Response:</label>
            <textarea
                id="response"
                className="response-textarea"
                placeholder="Enter your response here..."
            />
            <div className="form-actions">
                <button onClick={() => navigate(-1)} className="back-button">Go Back</button>
                <button type="submit" className="submit-button">Submit Response</button>
            </div>
        </form>

        </div>
    );
};

export default AdminViewComplaint;
