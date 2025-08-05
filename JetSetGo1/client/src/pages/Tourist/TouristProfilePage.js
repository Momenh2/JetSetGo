import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge1 from '../../assets/images/Badge1.jpg';
import Badge2 from '../../assets/images/Badge2.jpg';
import Badge3 from '../../assets/images/Badge3.jpg';
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie
import MyPrefs from "../my_prefrences"
import styled from 'styled-components'; // Import styled-components

function TouristProfilePage() {
    const token = Cookies.get("auth_token");
    const decodedToken = jwtDecode(token);
    const id = decodedToken.id;
    const modelName = decodedToken.userType;
    const navigate = useNavigate();

    const [tourist, setTourist] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch tourist data
        const fetchTouristData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/tourist/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch tourist data');
                const data = await response.json();
                setTourist(data);
            } catch (error) {
                console.error('Error fetching tourist data:', error);
            }
        };
        fetchTouristData();
    }, [id]);

    // Function to update points to wallet
    const handleUpdatePointsToWallet = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/tourist/updatePointsToWallet/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setMessage(data.message);
            setTourist(data.tourist); // Update tourist data after wallet update
        } catch (error) {
            console.error('Error updating wallet:', error);
        }
    };

    // Render level-specific image
    const renderLevelImage = (level) => {
        switch (level) {
            case 1:
                return <img src={Badge1} alt="Level 1 Badge" className="badge-image" style={{ width: '150px', height: '150px' }} />;
            case 2:
                return <img src={Badge2} alt="Level 2 Badge" className="badge-image" style={{ width: '150px', height: '150px' }} />;
            case 3:
                return <img src={Badge3} alt="Level 3 Badge" className="badge-image" style={{ width: '150px', height: '150px' }} />;
            default:
                return null;
        }
    };

    if (!tourist) {
        return <p>Loading...</p>; // Show a loading message until data is fetched
    }

    return (
        <div className="profile-container">
            {/* Header Section */}
            <div className="profile-header">
                {/* Update Profile Button */}
                <div>{renderLevelImage(tourist.Level)}</div> {/* Render badge/image */}
                <button
                    onClick={() => navigate(`/update-profile/tour-guides/${id}`)}
                    className="update-profile-btn"
                >
                    <i className="fas fa-pencil-alt"></i>
                </button>

                <h1 className="UserName">{tourist.username}</h1>
            </div>

            {/* Main Content */}
            <div className="profile-content">
                <h2>🔎 About</h2>
                <p><strong>📧 Email:</strong> {tourist.email}</p>
                <p><strong>📞 Mobile:</strong> {tourist.mobile || "N/A"}</p>
                <p><strong>💼 Previous Work:</strong> {tourist.previousWork || "N/A"}</p>
                <p><strong>Nationality:</strong> {tourist.nationality}</p>
                <p><strong>Date of Birth:</strong> {new Date(tourist.dob).toLocaleDateString()}</p>
                <p><strong>Job:</strong> {tourist.job}</p>
                <p><strong>Total Points:</strong> {tourist.TotalPoints}</p>
                <p><strong>Points:</strong> {tourist.Points}</p>
                <p><strong>Level:</strong> {tourist.Level}</p>

                <button onClick={handleUpdatePointsToWallet}>Update Wallet with Points</button>
                <p>{message}</p>
                <MyPrefs />

                {/* Wallet Section */}
                <WalletContainer>
                    <h3>💰 Wallet</h3>
                    <p><strong>Balance: </strong>${tourist.wallet?.balance || '0'}</p>

                    {/* Transaction History */}
                    <TransactionList>
                        <h4>Transaction History</h4>
                        {tourist.wallet?.transactions.length === 0 ? (
                            <p>No transactions found.</p>
                        ) : (
                            tourist.wallet.transactions.map((transaction, index) => (
                                <TransactionItem key={index}>
                                    <TransactionDetail>
                                        <strong>Order ID:</strong> {transaction.orderId}
                                    </TransactionDetail>
                                    <TransactionDetail>
                                        <strong>Amount:</strong> ${transaction.amount}
                                    </TransactionDetail>
                                    <TransactionDetail>
                                        <strong>Type:</strong> {transaction.type}
                                    </TransactionDetail>
                                    <TransactionDetail>
                                        <strong>Order Type:</strong> {transaction.orderType}
                                    </TransactionDetail>
                                    <TransactionDetail>
                                        <strong>Created At:</strong> {new Date(transaction.createdAt).toLocaleDateString()}
                                    </TransactionDetail>
                                </TransactionItem>
                            ))
                        )}
                    </TransactionList>
                </WalletContainer>

                {/* Action buttons */}
                <ActionButtons>
                    <ChangePasswordButton
                        onClick={() => navigate(`/tourist/change-password/${id}/tourist`)}
                    >
                        Change Password
                    </ChangePasswordButton>
                    <RequestDeleteButton
                        onClick={() => navigate(`/tourist/RequestDelete/tourist/${id}`)}
                    >
                        Request Delete Account
                    </RequestDeleteButton>
                </ActionButtons>
            </div>
        </div>
    );
}
const WalletContainer = styled.div`
  margin-top: 40px;
  padding: 20px;
  background-color: #f1f1f1;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TransactionList = styled.div`
  margin-top: 20px;
  max-height: 300px; /* Set the max height for the scrollable area */
  overflow-y: auto; /* Enable vertical scrolling */
  padding-right: 10px; /* Add space to accommodate the scrollbar */
`;

const TransactionItem = styled.div`
  background-color: #fff;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TransactionDetail = styled.p`
  margin: 5px 0;
  font-size: 14px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;

const ChangePasswordButton = styled.button`
  background-color: #00796b;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #004d40;
  }

  &:focus {
    outline: none;
  }
`;

const RequestDeleteButton = styled.button`
  background-color: #d32f2f;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #b71c1c;
  }

  &:focus {
    outline: none;
  }
`;

export default TouristProfilePage;