import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./Checkout.css";
import { useLocation } from "react-router-dom";

const Checkout = () => {
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
  const { orderId } = location.state || {};




  const token = Cookies.get("auth_token");
  let touristId = null;

  if (token) {
    const decodedToken = jwtDecode(token);
    touristId = decodedToken.id;
  } else {
    console.error("No auth token found!");
  }

  

  useEffect(() => {
    const fetchCart = async () => {
      if (!touristId) {
        setError("Tourist ID not found in token.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/tourist/cart/${touristId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch cart: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched cart items:", data); // Debug log
        setCartItems(data);
        setLoading(false);
      } catch (err) {
        console.error(err.message || "Failed to load cart");
        setError(err.message || "Failed to load cart");
        setLoading(false);
      }
    };

    fetchCart();
  }, [touristId, token]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch(`/api/tourist/checkout/${touristId}/addresses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch addresses");
        }

        const data = await response.json();
        console.log("Fetched addresses:", data); // Debug log
        setAddresses(data.addresses || []);
        setSelectedAddressId(data.addresses[0]?._id || ""); // Default to the first address if available
      } catch (err) {
        console.error(err.message);
        setError(err.message || "Failed to fetch addresses");
      }
    };

    fetchAddresses();
  }, [touristId, token]);
// Assuming `promoDiscount` contains the discount percentage (e.g., 10 for 10%)
const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.product.price,
    0
  );
  
  // Apply promo code discount if available
  const discountAmount = promoDiscount ? (subtotal * promoDiscount) / 100 : 0;
  
  // Calculate the total after applying the discount
  total = subtotal - discountAmount; // Subtotal minus the discount
  

  
  const handleCheckout = async () => {
    if (!selectedAddressId) {
      alert("Please select a delivery address.");
      return;
    }
  
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
      // First API call: Checkout process
      const checkoutResponse = await fetch(`/api/tourist/checkout/${touristId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          selectedAddressId, // Use selected address ID
          paymentMethod, // Include the selected payment method
          cardDetails: paymentMethod === "card" ? { cardName, cardNumber, expiryDate, cvv } : null,
        }),
      });
  
      if (!checkoutResponse.ok) {
        throw new Error(`Checkout failed: ${checkoutResponse.statusText}`);
      }
  

  
      // Get selected address details
      const selectedAddress = addresses.find((address) => address._id === selectedAddressId);
  
      let PM = paymentMethod;
      if (paymentMethod === "card") {
        PM = "Visa";
      }
      if (paymentMethod === "cash") {
        PM = "CoD";
      }
      if (paymentMethod === "wallet") {
        PM = "Wallet";
      }
  
      // Second API call: Update order details
      const updateOrderResponse = await fetch(`http://localhost:8000/api/tourist/updateOrderDetails`, {
        method: "POST", // This API is a POST method
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId, // Extracted from checkout API response
          deliveryAddress: selectedAddress.address,
          paymentMethod: PM,
          totalPrice: total,
        }),
      });
  
      if (!updateOrderResponse.ok) {
        throw new Error(`Order update failed: ${updateOrderResponse.statusText}`);
      }
  
      const updateOrderData = await updateOrderResponse.json();
      console.log("Order updated successfully:", updateOrderData);
  
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
            orderId,
            amount: total, // Assuming `total` is the order amount
            type: "deduction",
            orderType: "product", // Replace with the correct order type if needed
          }),
        });

        if (!walletResponse.ok) {
          throw new Error(`Wallet transaction failed: ${walletResponse.statusText}`);
        }
  
        const walletData = await walletResponse.json();
        console.log("Wallet transaction successful:", walletData);
      }
  
      // Fourth API call: Change order status to "processing"
      const changeStatusResponse = await fetch(`http://localhost:8000/api/tourist/changeOrderStatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: orderId,
          newStatus: "Paid",
        }),
      });
  
      if (!changeStatusResponse.ok) {
        throw new Error(`Order status change failed: ${changeStatusResponse.statusText}`);
      }
  
      const changeStatusData = await changeStatusResponse.json();
      console.log("Order status updated successfully:", changeStatusData);
  
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




  const handleAddAddress = async () => {
    if (!newAddress || !newAddressLabel) {
      alert("Please provide both address label and address.");
      return;
    }

    try {
      const response = await fetch(`/api/tourist/checkout/${touristId}/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          label: newAddressLabel,
          address: newAddress,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add address");
      }

      const data = await response.json();
      setAddresses((prevAddresses) => [...prevAddresses, data.newAddress]);
      setNewAddress("");
      setNewAddressLabel("");
      setShowAddAddressForm(false);

      // Automatically set the new address as the selected address
      setSelectedAddressId(data.newAddress._id);
    } catch (err) {
      console.error(err.message);
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
          <p>Cart</p>
        </div>
        <div className="line"></div>
        <div className="active">
          <span>2</span>
          <p>Checkout</p>
        </div>
        <div className="line"></div>
        <div>
          <span>3</span>
          <p>Confirmation</p>
        </div>
      </div>

      <div className="checkout-content">
        {/* Delivery Address Selection */}
        <div className="cart-summary">
          <h3>Delivery Address</h3>
          {addresses.length > 0 ? (
            <div className="address-options">
              <select
                value={selectedAddressId}
                onChange={(e) => setSelectedAddressId(e.target.value)}
                className="address-dropdown"
              >
                {addresses
                  .filter((address) => address && address._id) // Filter out invalid addresses
                  .map((address) => (
                    <option key={address._id} value={address._id}>
                      {address.label}: {address.address}
                    </option>
                  ))}
              </select>
              <button
                className="add-address-button"
                onClick={() => setShowAddAddressForm(!showAddAddressForm)}
              >
                +
              </button>
            </div>
          ) : (
            <p>No saved addresses found. Please add one from your profile page.</p>
          )}
        </div>

        {/* Add New Address Form */}
        {showAddAddressForm && (
          <div className="add-address-form">
            <input
              type="text"
              className="add-address-input"
              placeholder="Enter address label (e.g., Home, Office)"
              value={newAddressLabel}
              onChange={(e) => setNewAddressLabel(e.target.value)}
            />
            <textarea
              className="add-address-textarea"
              placeholder="Enter your address"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              rows="4"
            />
            <button className="save-address-button" onClick={handleAddAddress}>
              Save Address
            </button>
          </div>
        )}

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
            <label>
              <input
                type="radio"
                name="payment-method"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
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
              .filter((item) => item && item.product && item.product._id) // Filter out invalid cart items
              .map((item) => (
                <li key={item.product._id} className="order-item">
                  <span>{item.product.name}</span>
                  <span>{(item.quantity * item.product.price).toFixed(2)} EGP</span>
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

export default Checkout;