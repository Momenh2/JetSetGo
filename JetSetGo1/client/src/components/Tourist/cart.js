import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import './cart.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Decode the token to extract touristId and user type
    const token = Cookies.get("auth_token");
    let touristId = null;

    if (token) {
        const decodedToken = jwtDecode(token);
        touristId = decodedToken.id;
    } else {
        console.error("No auth token found!");
    }

    // Fetch cart items using the fetch API
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
            setCartItems(data);
            setLoading(false);
        } catch (err) {
            setError(err.message || "Failed to load cart");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Function to remove an item from the cart
    const removeFromCart = async (productId) => {
        try {
            const response = await fetch(`/api/tourist/cart/${touristId}/remove/${productId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to remove item: ${response.statusText}`);
            }

            // Optimistically update the cart UI without needing to refetch
            setCartItems((prevItems) => prevItems.filter(item => item.product._id !== productId));

        } catch (err) {
            console.error(err.message || "Failed to remove item");
        }
    };

    const updateQuantity = async (productId, action, maxQuantity) => {
        // Skip update if we reach max capacity
        if (action === 'increase' && cartItems.find(item => item.product._id === productId).quantity >= maxQuantity) {
            return;
        }

        try {
            const response = await fetch(`/api/tourist/cart/${touristId}/update/${productId}/${action}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to update quantity: ${response.statusText}`);
            }

            // Optimistically update the cart UI
            setCartItems((prevItems) => 
                prevItems.map(item => {
                    if (item.product._id === productId) {
                        let updatedQuantity = item.quantity;
                        if (action === 'increase') updatedQuantity += 1;
                        if (action === 'decrease' && item.quantity > 1) updatedQuantity -= 1;
                        return { ...item, quantity: updatedQuantity };
                    }
                    return item;
                })
            );

        } catch (err) {
            console.error(err.message || "Failed to update quantity");
        }
    };


    const handleCheckout = async () => {
        // Check if the cart is empty
        if (cartItems.length === 0) {
            alert("You cannot proceed to checkout with an empty cart.");
            return; // Prevent proceeding to checkout if the cart is empty
        }
    
        try {
            // Prepare the payload for the order API
            const orderPayload = {
                touristID: touristId,
                products: cartItems.map((item) => ({
                    productID: item.product._id,
                    quantity: item.quantity,
                })),
                totalPrice: total,
            };
    
            // Send the order to the backend
            const orderResponse = await fetch("http://localhost:8000/api/tourist/createOrder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(orderPayload),
            });
    
            if (!orderResponse.ok) {
                throw new Error(`Order creation failed: ${orderResponse.statusText}`);
            }
    
            const orderData = await orderResponse.json();
            console.log("Order created successfully:", orderData);
    
            // Navigate to the confirmation page with the order ID
            navigate("/tourist/checkout", { state: { orderId: orderData.order._id } });
    
        } catch (error) {
            console.error(error.message || "Order creation failed");
            alert("Failed to create order. Please try again.");
        }
    };
    



    if (loading) return <p>Loading cart...</p>;
    if (error) return <p>Error: {error}</p>;

    const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
    const total = subtotal;

    return (
        <div className="cart-container">
            {/* Progress Bar */}
            <div className="cart-progress">
                <div className="active">
                    <span>1</span> Cart
                </div>
                <div className="line"></div>
                <div>
                    <span>2</span> Checkout
                </div>
                <div className="line"></div>
                <div>
                    <span>3</span> Confirmation
                </div>
            </div>

            {/* Cart Items */}
            <ul className="cart-list">
                {cartItems.map((item) => (
                    <li key={item.product._id} className="cart-item">
                        <img
                            src={`http://localhost:8000/uploads/products/${item.product.image}`}
                            alt={item.product.name}
                            className="cart-item-image"
                        />
                        <div className="cart-item-details">
                            <h4>{item.product.name}</h4>
                            <p>Card value: {item.product.description}</p>
                        </div>
                        <div className="cart-item-quantity">
                            {/* Button to decrease quantity */}
                            <button onClick={() => updateQuantity(item.product._id, 'decrease', item.product.maxQuantity)}>-</button>
                            <span>{item.quantity}</span>
                            {/* Button to increase quantity */}
                            <button
                                onClick={() => updateQuantity(item.product._id, 'increase', item.product.maxQuantity)}
                                disabled={item.quantity >= item.product.maxQuantity} // Disable button when max is reached
                                style={{
                                    color: item.quantity >= item.product.maxQuantity ? 'red' : 'initial', // Apply red color if max is reached
                                    cursor: item.quantity >= item.product.maxQuantity ? 'not-allowed' : 'pointer' // Change cursor to indicate button is disabled
                                }}
                            >
                                +
                            </button>
                        </div>
                        <p>{(item.quantity * item.product.price).toFixed(2)} EGP</p>

                        {/* Trash Bin Icon */}
                        <button className="remove-button" onClick={() => removeFromCart(item.product._id)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </li>
                ))}
            </ul>

            {/* Summary Section */}
            <div className="cart-summary">
                <h4>Summary</h4>
                <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>{subtotal.toFixed(2)} EGP</span>
                </div>
                <div className="summary-total">
                    <span>Total:</span>
                    <strong>{total.toFixed(2)} EGP</strong>
                </div>
                <button className="checkout-button" onClick={handleCheckout}>Proceed to checkout</button>
            </div>
        </div>
    );
};

export default Cart;
    