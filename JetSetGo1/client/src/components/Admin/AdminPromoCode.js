import { useEffect, useState, useRef } from "react";
import './adminpromo.css'; // Import the custom CSS for the modal

const PromoCodespage = () => {
    const [promocodes, setPromocodes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newPromocode, setNewPromocode] = useState({ discount: '' });
    const [modalError, setModalError] = useState(null);

    const modalRef = useRef(null); // Create a ref for the modal

    const fetchPromoCodes = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/admin/PromoCodes');
            const data = await response.json();

            if (data && Array.isArray(data.promocodes)) {
                setPromocodes(data.promocodes);
            } else {
                console.error('Unexpected response format:', data);
                setPromocodes([]);
            }
            setError(null);
        } catch (error) {
            setError("Failed to fetch Promo Codes. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchPromoCodes();

        const handleOutsideClick = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setShowModal(false);
                setModalError(null);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const handleAddTPromoCode = async (e) => {
        e.preventDefault(); // Prevent page refresh

        if (!newPromocode.discount) {
            setModalError('Please fill out the required field.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/admin/createPromoCode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPromocode),
            });

            if (!response.ok) {
                throw new Error('Failed to add new promo code');
            }

            const createdPromocode = await response.json();
            setPromocodes([...promocodes, createdPromocode]);
            setShowModal(false);
            setNewPromocode({ discount: '' });
            setModalError(null);
        } catch (error) {
            console.error('Error adding Promo Code:', error);
            setModalError('Failed to add promo code. Please try again.');

            if (newPromocode.discount > 100 || newPromocode.discount < 0) {
                setModalError('Discount has to be within range (0-100)');
            }
        }
    };

    const cancelCreate = () => {
        setShowModal(false); // Close the modal without deleting
        setModalError(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="d-flex justify-content-center mt-4">
            <div className="container mt-4">
                <h1 className="mb-4 text-center">Promo Codes</h1>

                <button
                    className="btn btn-primary custom-add-button-adpc"
                    onClick={() => setShowModal(true)}
                >
                    +
                </button>

                <div className="d-flex justify-content-center mt-4">
                    <table className="table table-striped text-center w-75">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Discount</th>
                                <th>Created At</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {promocodes.map((promocode) => (
                                <tr key={promocode._id} className="table-row-adpc">
                                    <td>{promocode._id}</td>
                                    <td>{promocode.discount}</td>
                                    <td>{new Date(promocode.createdAt).toLocaleDateString()}</td>
                                    {/* <td className=" date"></td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showModal && (
                    <div className="modal-overlay-adpc">
                        <div className="modal-adpc" ref={modalRef}>
                            <h2>Add New PromoCode</h2>

                            <div className="mb-3">
                                <label className="form-label">Discount %</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newPromocode.discount}
                                    onChange={(e) => setNewPromocode({ discount: e.target.value })}
                                />
                            </div>
                            <div className="modal2-actions-adpc">
                                {modalError && <div className="alert alert-danger">{modalError}</div>}
                                <button className="btn-adpc btn-primary-adpc submit-btn-adpc" onClick={(e) => handleAddTPromoCode(e)}>
                                    Submit
                                </button>
                                <button className="btn-adpc btn-secondary-adpc cancel-btn-adpc" onClick={cancelCreate}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PromoCodespage;