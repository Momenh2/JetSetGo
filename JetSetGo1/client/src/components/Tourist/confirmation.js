import React from 'react';
import './confirmation.css';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

const Confirmation = () => {
    // Decode the token to get the tourist ID
    const token = Cookies.get('auth_token');
    const decodedToken = jwtDecode(token);
    const touristID = decodedToken.id;
    
  return (
    <div className="confirmation-page">
      <h1 className="thank-you-message">Thank you for purchasing with us!</h1>
      <p className="confirmation-details">
        Your order has been successfully placed. You will receive an email with your order details shortly. We appreciate your business!
      </p>
      <button className="continue-shopping-button">Continue Shopping</button>
    </div>
  );
};

export default Confirmation;