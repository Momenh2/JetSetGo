import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const TouristOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelError, setCancelError] = useState(null); // For cancel-specific errors
    const [successMessage, setSuccessMessage] = useState(null); // For successful cancellations
    const navigate = useNavigate();

    // Decode the token to get the tourist ID
    const token = Cookies.get('auth_token');
    const decodedToken = jwtDecode(token);
    const touristID = decodedToken.id;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                console.log(touristID); // Check the touristID to ensure it's correct

                const response = await fetch('http://localhost:8000/api/tourist/getOrdersByTourist', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ touristID }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();
                setOrders(data.orders);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Failed to fetch orders. Please try again.');
                setLoading(false);
            }
        };

        fetchOrders();
    }, [touristID]);

    const waitAndCallApi = async (delay, apiUrl, requestBody) => {
        // Wait for the specified time
        await new Promise(resolve => setTimeout(resolve, delay));

        // Call the API after the wait
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody), // Send the request body as a JSON string
            });

            if (!response.ok) {
                throw new Error('Failed to change order status');
            }

            const data = await response.json();
            console.log(data); // Handle the API response here
        } catch (error) {
            console.error('Error calling API:', error);
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            setCancelError(null); // Clear any previous errors
            setSuccessMessage(null); // Clear any previous success messages

            const response = await fetch(`http://localhost:8000/api/tourist/cancelOrder/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to cancel order');
            }

            // Update the order status in the state
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? { ...order, orderStatus: 'Cancelled' } : order
                )
            );
            setSuccessMessage('Order cancelled successfully.');
        } catch (error) {
            console.error('Error cancelling order:', error);
            setCancelError(error.message || 'Failed to cancel order. Please try again.');
        }
    };

    const handleChangeOrderStatus = (orderId, newStatus) => {
        const requestBody = {
            id: orderId,
            newStatus: newStatus,
        };

        // Wait 3 seconds before calling the API
        waitAndCallApi(3000, 'http://localhost:8000/api/tourist/changeOrderStatus', requestBody)
            .then(() => {
                // Once the API call is successful, update the order status in the state
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId ? { ...order, orderStatus: newStatus } : order
                    )
                );
                setSuccessMessage(`Order status changed to ${newStatus}.`);
            })
            .catch((error) => {
                console.error('Error changing order status:', error);
                setCancelError('Failed to change order status. Please try again.');
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Account</h1>
            <div className="row">
                <div className="col-md-9">
                    <h2>Orders</h2>

                    {cancelError && <div className="alert alert-danger">{cancelError}</div>}
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}

                    {/* Check if there are no orders */}
                    {orders.length === 0 ? (
                        <div>No orders available</div>
                    ) : (
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Order</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Total</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td>
                                            <a href={`#`}>#{order._id}</a>
                                        </td>
                                        <td>{new Date(order.date).toLocaleDateString()}</td>
                                        <td
                                            className={
                                                order.orderStatus === 'Cancelled'
                                                    ? 'text-danger'
                                                    : 'text-success'
                                            }
                                        >
                                            {order.orderStatus}
                                        </td>
                                        <td>
                                            {order.totalPrice.toFixed(2)} EGP for {order.products.length}{' '}
                                            item{order.products.length > 1 ? 's' : ''}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-dark btn-sm me-2"
                                                onClick={() => navigate(`/tourist/order-details/${order._id}`)}
                                            >
                                                View
                                            </button>
                                            {order.orderStatus !== 'Cancelled' &&
                                                order.orderStatus !== 'Shipped' &&
                                                order.orderStatus !== 'Delivered' && (
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleCancelOrder(order._id)}
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            {/* Change order status button */}
                                            {order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Shipped' && (
                                                <button
                                                    className="btn btn-info btn-sm"
                                                    onClick={() => handleChangeOrderStatus(order._id, 'Delivered')}
                                                >
                                                    Mark as Delivered
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TouristOrders;
