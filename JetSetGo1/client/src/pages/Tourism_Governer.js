import React, { useEffect, useState, useRef} from "react";
import { useLocation, useSearchParams } from 'react-router-dom';
import './admintags.css';
const UserManagement = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRole, setSelectedRole] = useState(searchParams.get('role') || 'admin');
    const [showModal1, setShowModal1] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ username: '', email: '', password: '' });
    const [newGov, setNewGov] = useState({ username: '', email: '', password: '' });
    const [modalOpened, setModalOpened] = useState(false);  // Flag to track modal state
    const [deletingId, setDeletingId] = useState(null); // State to store the id of the item to be deleted
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [modalError, setModalError] = useState(null);

    const modalRef = useRef(null); // Create a ref for the modal



    const roles = [
        { value: "admin", label: "Admin" },
        { value: "seller", label: "Seller" },
        { value: "tourguide", label: "Tour Guide" },
        { value: "tourist", label: "Tourist" },
        { value: "advertiser", label: "Advertiser" },
        { value: "tourismgoverner", label: "Tourism Governer" },
    ];

    useEffect(() => {
        // Check query parameters to determine if a modal should open
        const openModal = searchParams.get('openModal') === 'true';

        if (openModal && !modalOpened) {
            if (selectedRole === 'admin') {
                setShowModal1(true);
            } else if (selectedRole === 'tourismgoverner') {
                setShowModal2(true);
            }
            setModalOpened(true);
        }
    }, [searchParams, selectedRole, modalOpened]);



    const fetchUsers = async () => {
        if (!selectedRole) {
            setError("Please select a role to fetch users.");
            return;
        }

        const url = `http://localhost:8000/api/admin/${selectedRole}/list`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setUsers(data);
            setError(null);
        } catch (error) {
            setError("Failed to fetch users. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchUsers();

        const handleOutsideClick = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setShowModal1(false);
                setShowModal2(false);
                setNewAdmin({ username: '', email: '', password: '' });
                setNewGov({ username: '', email: '', password: '' });
                setIsDeleteModalOpen(false);
                setDeletingId(null)
                setModalError(null);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };



    }, [selectedRole]);

    const handleDeleteUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/admin/delete/${selectedRole}/${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete user");
            }
            setIsDeleteModalOpen(false); // Close the modal without deleting
            setUsers(users.filter((user) => user._id !== userId));
        } catch (error) {
            alert("Failed to delete user. Please try again.");
        }
    };

    const handleAddAdmin = async () => {
        if (!newAdmin.username || !newAdmin.email || !newAdmin.password) {
            setModalError('Please fill out all fields.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/admin/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAdmin),
            });

            if (!response.ok) {
                throw new Error('Failed to add new admin');
            }

            const result = await response.json(); // Extracting the full response
            const Admin = result.admin;
            setUsers([...users, Admin]);
            setShowModal1(false);
            setNewAdmin({ username: '', email: '', password: '' });
            setModalError(null);
        } catch (error) {
            console.error('Error adding admin:', error);
            setModalError('Failed to add admin. Please try again.');
        }
    };

    const handleAddGov = async () => {
        if (!newGov.username || !newGov.email || !newGov.password) {
            setModalError('Please fill out all fields.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/admin/create_tourism_governer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newGov),
            });

            if (!response.ok) {
                throw new Error('Failed to add new Tourism Governer');
            }


            const result = await response.json(); // Extracting the full response
            const Gov = result.tourism_governer;
            setUsers([...users, Gov]);
            setShowModal2(false);
            setNewGov({ username: '', email: '', password: '' });
            setModalError(null);
        } catch (error) {
            console.error('Error adding Tourism Governer:', error);
            setModalError('Failed to add Tourism Governer. Please try again.');
        }
    };

    const cancelCreate = () => {
        setShowModal2(false);
        setShowModal1(false); // Close the modal without deleting
        setModalError(null);
    };

    const handleDeleteClick = (id) => {
        setDeletingId(id); // Store the ID of the item to be deleted
        setIsDeleteModalOpen(true); // Show the confirmation modal
    };

    const confirmDelete = () => {
        if (deletingId) {
            handleDeleteUser(deletingId); // Perform the delete operation
        }
    };


    const cancelDelete = () => {
        setIsDeleteModalOpen(false); // Close the modal without deleting
        setModalError(null);
        setDeletingId(null); // Clear the stored ID
    };



    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="d-flex justify-content-center mt-4">
            <div className="container">
                <h1 className="mb-4 text-center">User Management</h1>

                <div className="d-flex justify-content-between mb-3">
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="form-select w-25"
                    >
                        {roles.map((role) => (
                            <option key={role.value} value={role.value}>
                                {role.label}
                            </option>
                        ))}
                    </select>

                    {(selectedRole === "admin") && (
                        <button
                            className="btn-adtag btn-primary-adtag "
                            onClick={() => setShowModal1(true)}
                        >
                            +
                        </button>
                    )}

                    {(selectedRole === "tourismgoverner") && (
                        <button
                            className="btn-adtag btn-primary-adtag"
                            onClick={() => setShowModal2(true)}
                        >
                            +
                        </button>
                    )}
                </div>

                <div className="d-flex justify-content-center mt-4">
                    <table className="table table-striped text-center w-75">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Password</th>
                                <th>Created at</th>
                                <th className="buttons-container-adtag"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="table-row-adtag">


                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.password}</td>
                                    <td>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="buttons-container-adtag">
                                        <div className="action-buttons-adtag">

                                            <button
                                                className="btn-del-adtag btn-sm-adtag btn-danger"
                                                onClick={() => handleDeleteClick(user._id)}
                                            >
                                                <i className="fa-regular fa-trash-can"></i>
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal1 && (
                <div className="modal-overlay-adtag">
                    <div className="modal-adtag" ref={modalRef}>
                        <h2>Add New Admin</h2>

                        <div className="mb-3">
                            <input
                                type="text"
                                placeholder="Username"
                                className="form-control"
                                value={newAdmin.username}
                                onChange={(e) =>
                                    setNewAdmin({ ...newAdmin, username: e.target.value })
                                }
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="text"
                                placeholder="Email"
                                className="form-control"
                                value={newAdmin.email}
                                onChange={(e) =>
                                    setNewAdmin({ ...newAdmin, email: e.target.value })
                                }
                            />
                        </div>


                        <div className="mb-3">
                            <input
                                type="text"
                                placeholder="Password"
                                className="form-control"
                                value={newAdmin.password}
                                onChange={(e) =>
                                    setNewAdmin({ ...newAdmin, password: e.target.value })
                                }
                            />
                        </div>
                        <div className="modal2-actions-adtag">

                            {modalError && <div className="alert alert-danger">{modalError}</div>}

                            <button className="submit-btn-adtag" onClick={handleAddAdmin}>
                                Submit
                            </button>
                            <button
                                className="cancel-btn-adtag"
                                onClick={cancelCreate}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showModal2 && (
                <div className="modal-overlay-adtag">
                    <div className="modal-adtag" ref={modalRef}>
                        <h2>Add New Tourism Governer</h2>
                        <div className="mb-3">
                            <input
                                type="text"
                                placeholder="Username"
                                className="form-control"
                                value={newGov.username}
                                onChange={(e) =>
                                    setNewGov({ ...newGov, username: e.target.value })
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="text"
                                placeholder="Email"
                                className="form-control"
                                value={newGov.email}
                                onChange={(e) =>
                                    setNewGov({ ...newGov, email: e.target.value })
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="text"
                                placeholder="Password"
                                className="form-control"
                                value={newGov.password}
                                onChange={(e) =>
                                    setNewGov({ ...newGov, password: e.target.value })
                                }
                            />
                        </div>
                        <div className="modal2-actions-adtag">

                        {modalError && <div className="alert alert-danger">{modalError}</div>}

                            <button className="submit-btn-adtag" onClick={handleAddGov}>
                                Submit
                            </button>
                            <button
                                className="cancel-btn-adtag"
                                onClick={cancelCreate}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Deletion */}
            {isDeleteModalOpen && (

                <div className="modal-overlay-adtag">
                    <div className="modal-adtag" ref={modalRef}>
                        <h2>Confirm Deletion</h2>
                        <p>Are you sure you want to delete this User?</p>
                        <div className="modal-actions-adtag">
                            {modalError && <div className="alert alert-danger">{modalError}</div>}

                            <button className="delete-btn-adtag" onClick={confirmDelete}>Delete</button>
                            <button className="cancel-btn-adtag" onClick={cancelDelete}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default UserManagement;