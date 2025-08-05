import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../Tourist/Checkout.css";
import { useLocation } from "react-router-dom";

const CheckoutItinerary = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("wallet"); // Default to "Wallet"
  const [addresses, setAddresses] = useState([]); // List of saved addresses
  const [selectedAddressId, setSelectedAddressId] = useState(""); // Selected address ID
  const [promoCode, setPromoCode] = useState("");  // State for promo code
  const [promoDiscount, setPromoDiscount] = useState(0);  // State for the promo discount
  const [promoError, setPromoError] = useState("");  // State for promo code error
  const [newAddress, setNewAddress] = useState(""); // New address input
  const [newAddressLabel, setNewAddressLabel] = useState(""); // New address label input
  const [showAddAddressForm, setShowAddAddressForm] = useState(false); // Toggle form visibility
  const [cardName, setCardName] = useState(""); // For card payment
  const [cardNumber, setCardNumber] = useState(""); // For card payment
  const [expiryDate, setExpiryDate] = useState(""); // For card payment
  const [cvv, setCvv] = useState(""); // For card payment
  let [total, setTotal] = useState(0); // Total with discount
  const navigate = useNavigate();
  const location = useLocation();

  const { eventId} = location.state || {};
     const  eventType = location.state.eventType
 console.log("evv locc ID" ,location.state )



  const token = Cookies.get("auth_token");
  let touristId = null;

  if (token) {
    const decodedToken = jwtDecode(token);
    touristId = decodedToken.id;
  } else {
    console.error("No auth token found!");
  }

  
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId || !eventType) {
        setError("Event ID or type is missing.");
        setLoading(false);
        return;
      }
  
      try {
        setLoading(true);
  
        // Determine the API endpoint based on eventType
        const apiEndpoint =
          eventType === "itinerary"
            ? `http://localhost:8000/api/tourist/getSingleItinerary`
            : `http://localhost:8000/api/tourist/activity/${eventId}`;
  
        // Prepare the request options
        const options = {
          method: eventType === "itinerary" ? "POST" : "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: eventType === "itinerary" ? JSON.stringify({ itineraryId: eventId }) : null,
        };
  
        const response = await fetch(apiEndpoint, options);
  
        if (!response.ok) {
          throw new Error(`Failed to fetch event: ${response.statusText}`);
        }
  
        const data = await response.json();
        console.log("Fetched event:", data); // Debug log
  
        // Set the event data as the cart item
        setCartItems([data]); // Assuming the API returns a single event object
        setLoading(false);
      } catch (err) {
        console.error(err.message || "Failed to load event");
        setError(err.message || "Failed to load event");
        setLoading(false);
      }
    };
  
    fetchEvent();
  }, [eventId, eventType, token]);



// Assuming `promoDiscount` contains the discount percentage (e.g., 10 for 10%)
const subtotal = cartItems.reduce(
    (acc, item) => acc +  item.price,
    0
  );
  
  // Apply promo code discount if available
  const discountAmount = promoDiscount ? (subtotal * promoDiscount) / 100 : 0;
  
  // Calculate the total after applying the discount
  total = subtotal - discountAmount; // Subtotal minus the discount
  
  
  
  const handleCheckout = async () => {
    console.log(promoDiscount)
    total = subtotal - (subtotal * (promoDiscount / 100));

  
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
  
    // Validate card details if payment method is card
    if (paymentMethod === "card") {
      if (!cardName || !cardNumber || !expiryDate || !cvv) {
        alert("Please fill in all the card details.");
        return;
      }
    }
  
    try {

      let PM = paymentMethod;
      if (paymentMethod === "card") {
        PM = "Visa";
      }
      if (paymentMethod === "wallet") {
        PM = "Wallet";
      }
  
      // Third API call: Handle wallet transaction (if payment method is wallet)
      if (paymentMethod === "card") {
        const walletResponse = await fetch(`http://localhost:8000/api/tourist/addWalletTransaction`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            touristId,
            orderId:eventId,
            amount: total, // Assuming `total` is the order amount
            type: "deduction",
            orderType: eventType, // Replace with the correct order type if needed
          }),
        });
        console.log("in card")
        if (!walletResponse.ok) {
          throw new Error(`Wallet transaction failed: ${walletResponse.statusText}`);
        }
  
        const walletData = await walletResponse.json();
        console.log("Wallet transaction successful:", walletData);
      }
  

      // Third API call: Handle wallet transaction (if payment method is wallet)
      if (paymentMethod === "wallet") {
        const walletResponse = await fetch(`http://localhost:8000/api/tourist/addWalletTransaction`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            touristId,
            orderId:eventId,
            amount: total, // Assuming `total` is the order amount
            type: "deduction",
            orderType: eventType, // Replace with the correct order type if needed
          }),
        });

        if (!walletResponse.ok) {
          throw new Error(`Wallet transaction failed: ${walletResponse.statusText}`);
        }
  
        const walletData = await walletResponse.json();
        console.log("Wallet transaction successful:", walletData);
      }

  

  

  

      // Navigate to the confirmation page
      navigate("/tourist/confirmation");
    } catch (err) {
      console.error(err.message || "Failed to complete checkout process");
      alert("An error occurred during the checkout process. Please try again.");
    }
  };
  
  
  
  

 // Update the total price after applying promo code
 const updateTotal = (discount) => {
    const newTotal = subtotal - (subtotal * (discount / 100));
    setTotal(newTotal);
  };


 // Handle promo code application
 const handleApplyPromoCode = async () => {
    try {
        console.log("Applying promo code:", promoCode);
      const response = await fetch("http://localhost:8000/api/tourist/apply-promo-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ promoCodeId: promoCode }),
      });
      console.log("DATA beforeee : ");
      const data = await response.json();
      console.log("DATA AFTER   : " ,  total);
      if (response.ok) {
        setPromoDiscount(data.promoCode.discount);  // Apply discount
        setPromoError(""); // Clear error if promo code is valid
        updateTotal(data.promoCode.discount);  // Update total with discount
        console.log(total)
      } else {
        setPromoError(data.error || "Invalid promo code.");
      }
    } catch (err) {
      setPromoError("An error occurred while applying the promo code.");
    }
  };




  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="checkout-container">
      {/* Progress Bar */}
      <div className="cart-progress">
        <div className="active">
          <span>1</span>
          <p>Checkout</p>
        </div>
        <div className="line"></div>
        <div>
          <span>2</span>
          <p>Confirmation</p>
        </div>
      </div>

      <div className="checkout-content">


        {/* Payment Method Selection */}
        <div className="payment-method-section">
          <h3>Payment Method</h3>
          <div className="payment-options">
            <label>
              <input
                type="radio"
                name="payment-method"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Visa/MasterCard
            </label>
            <label>
              <input
                type="radio"
                name="payment-method"
                value="wallet"
                checked={paymentMethod === "wallet"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Wallet
            </label>
          </div>

          {/* Visa/MasterCard Payment Fields */}
          {paymentMethod === "card" && (
            <div className="payment-details">
              <div className="row gx-3">
                <div className="col-12">
                  <div className="d-flex flex-column">
                    <p className="text mb-1">Person Name</p>
                    <input
                      className="form-control mb-3"
                      type="text"
                      placeholder="Name"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex flex-column">
                    <p className="text mb-1">Card number</p>
                    <input
                      className="form-control mb-3"
                      type="number"
                      placeholder="Card Number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex flex-column">
                    <p className="text mb-1">Expiry date</p>
                    <input
                      className="form-control mb-3"
                      type="text"
                      placeholder="Expiry Date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex flex-column">
                    <p className="text mb-1">CVV</p>
                    <input
                      className="form-control mb-3"
                      type="number"
                      placeholder="CVV"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
       
        {/* Promo Code Section */}
        <div className="promo-code-section">
          <h3>Apply Promo Code</h3>
          <div className="promo-code-input">
            <input
              type="text"
              placeholder=" Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button className= "apply-button" onClick={handleApplyPromoCode}>Apply</button>
          </div>
          {promoError && <p className="promo-error">{promoError}</p>}
          {promoDiscount > 0 && <p className="promo-success">Applied: {promoDiscount}% off</p>}
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h3>Your Order</h3>
          <ul>
            {cartItems
              .filter((item) => item && item._id ) // Filter out invalid cart items
              .map((item) => (
                <li key={item._id} className="order-item">
                  <span>{item.title}</span>
                  <span>{(item.price).toFixed(2)} EGP</span>
                </li>
              ))}
          </ul>

          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>{subtotal.toFixed(2)} EGP</span>
            </div>
            <div className="summary-total">
              <span>Total:</span>
              <strong>{total.toFixed(2)} EGP</strong>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <button className="checkout-button" onClick={handleCheckout}>
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default CheckoutItinerary;