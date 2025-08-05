import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/tourist/getOrderById', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ orderId }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch order details');
                }

                const data = await response.json();
                setOrder(data);

                const productPromises = data.products.map(async (product) => {
                    const productResponse = await fetch(`http://localhost:8000/api/tourist/getSingleProduct/${product.productID}`);
                    if (!productResponse.ok) {
                        throw new Error(`Failed to fetch product details for ID: ${product.productID}`);
                    }

                    const productData = await productResponse.json();
                    return { 
                        ...product, 
                        name: productData[0]?.name, 
                        price: productData[0]?.price
                    };
                });

                const productsWithNamesAndPrices = await Promise.all(productPromises);
                setProducts(productsWithNamesAndPrices);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching order or product details:', error);
                setError('Failed to fetch order details. Please try again.');
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    if (loading) {
        return <div className="text-center mt-3">Loading...</div>;
    }

    if (error) {
        return <div className="alert alert-danger text-center mt-3">{error}</div>;
    }

    if (!order) {
        return <div className="alert alert-warning text-center mt-3">No order details available.</div>;
    }

    return (
        <div className="container mt-3">
            <div className="card shadow-sm">
                <div className="card-body bg-primary text-white py-2">
                    <h5 className="mb-0">Order Details</h5>
                </div>
                <div className="card-body p-3">
                    <div className="row g-2 mb-2">
                        <div className="col-6">
                            <h6 className="mb-1">Order ID:</h6>
                            <p className="mb-0">{order._id}</p>
                        </div>
                        <div className="col-6">
                            <h6 className="mb-1">Status:</h6>
                            <p className={`mb-0 ${order.orderStatus === 'Cancelled' ? 'text-danger' : 'text-success'}`}>
                                {order.orderStatus}
                            </p>
                        </div>
                    </div>

                    <div className="row g-2 mb-2">
                        <div className="col-6">
                            <h6 className="mb-1">Order Date:</h6>
                            <p className="mb-0">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <div className="col-6">
                            <h6 className="mb-1">Total Price:</h6>
                            <p className="mb-0">{order.totalPrice.toFixed(2)} EGP</p>
                        </div>
                    </div>

                    <div className="row g-2 mb-2">
                        <div className="col-6">
                        <h6 className="mb-1">Delivery Address:</h6>
                        <p className="mb-0">{order.deliveryAddress}</p>
                        </div>

                        <div className="col-6">
                        <h6 className="mb-1">Payment Details:</h6>
                        <p className="mb-0"> {order.paymentMethod}</p>
                        </div>

                    </div>



                    <div>
                        <h6 className="mb-1">Products:</h6>
                        <table className="table table-sm table-bordered table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>Product Name</th>
                                    <th>Price (EGP)</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => (
                                    <tr key={index}>
                                        <td>{product.name || 'Unknown'}</td>
                                        <td>{product.price ? product.price.toFixed(2) : 'N/A'}</td>
                                        <td>{product.quantity}</td>
                                        <td>{(product.price * product.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
