// import { Link } from "react-router-dom"
import { useEffect, useState,useRef } from "react"
import './admintags.css'; // Import the custom CSS for the modal
//import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";



const Tagspage = () => {
    const [tags, setTags] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newTag, setNewTag] = useState({ tag_name: '', description: '' });
    const [modalError, setModalError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTag, setEditingTag] = useState(null);
    const [deletingId, setDeletingId] = useState(null); // State to store the id of the item to be deleted
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const modalRef = useRef(null); // Create a ref for the modal

    // const token = Cookies.get("auth_token");
    //const decodedToken = jwtDecode(token);
    //const id = decodedToken.id;


    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/admin/tag', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch tags');
                }

                const data = await response.json();
                setTags(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching tags:', error);
                setError('Failed to fetch tags. Please try again.');
                setLoading(false);
            }
        };

        fetchTags();

        const handleOutsideClick = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setShowModal(false);
                setIsEditModalOpen(false);
                setIsDeleteModalOpen(false);
                setEditingTag(null);
                setDeletingId(null)
                setNewTag({ tag_name: '', description: '' });
                setModalError(null);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const handleAddTag = async () => {
        if (!newTag.tag_name || !newTag.description) {
            setModalError('Please fill out all fields.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/admin/createtag', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTag),
            });

            if (!response.ok) {
                throw new Error('Failed to add new tag');
            }

            const createdTag = await response.json();
            setTags([...tags, createdTag]);
            setShowModal(false);
            setNewTag({ tag_name: '', description: '' });
            setModalError(null);
        } catch (error) {
            console.error('Error adding tag:', error);
            setModalError('Failed to add tag. Please try again.');
        }
    };


    const handleDelete = async (id) => {
        console.log('Deleting ID:', id);

        try {
            const response = await fetch(`/api/admin/deletetag/${id}`, {
                method: 'DELETE',
                headers: {
                    //'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Update the state to remove the deleted post
                setTags((prevTags) => prevTags.filter((tag) => tag._id !== id));
                setIsDeleteModalOpen(false); // Close the modal
                console.log('Post deleted successfully');
                setModalError(null);
            } else {
                const contentType = response.headers.get('Content-Type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    setModalError('Failed to Delete. Please Try Again');
                    console.error('Error deleting item:', data.message);
                } else {
                    const text = await response.text();
                    setModalError('Failed to Delete. Please Try Again');
                    console.error('Error deleting item (non-JSON response):', text);
                }
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            setModalError('Failed to Delete. Please Try Again');
        }
    };


    const handleDeleteClick = (id) => {
        setDeletingId(id); // Store the ID of the item to be deleted
        setIsDeleteModalOpen(true); // Show the confirmation modal
    };

    const confirmDelete = () => {
        if (deletingId) {
            handleDelete(deletingId); // Perform the delete operation
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false); // Close the modal without deleting
        setModalError(null);
        setDeletingId(null); // Clear the stored ID
    };

    const cancelEdit = () => {
        setIsEditModalOpen(false); // Close the modal without deleting
        setModalError(null);
    };

    const cancelCreate = () => {
        setShowModal(false); // Close the modal without deleting
        setModalError(null);
    };







    const handleEditClick = (tag) => {
        setEditingTag({
            ...tag, // Copy the entire location object
        });

        setIsEditModalOpen(true);
    };


    const handleEditInputChange = (e) => {
        const { name, value } = e.target;

        setEditingTag((prev) => ({
            ...prev,
            [name]: value,
        }));

    };

    const handleEditSave = async () => {

        if (!editingTag.tag_name || !editingTag.description) {
            setModalError('Please fill out all fields.');
            return;
        }

        try {
            const response = await fetch(`/api/admin/updatetag/${editingTag._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    //Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editingTag),
            });

            if (response.ok) {
                const updatedTag = await response.json();
                setTags((prevTags) =>
                    prevTags.map((tag) =>
                        tag._id === updatedTag._id ? updatedTag : tag
                    )
                );
                setIsEditModalOpen(false); // Close the modal
                setModalError(null);
                console.log("Tag updated successfully");
            } else {
                console.error("Error updating tag");
                setModalError('Failed to update tag. Please try again.');
            }
        } catch (error) {
            console.error("Error:", error);
            setModalError('Failed to update tag. Please try again.');

        }
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
                <h1 className="mb-4 text-center">Prefrence Tags</h1>

                {/* Button at the top right */}
                <button
                    className="btn btn-primary custom-add-button-adtag"
                    onClick={() => setShowModal(true)}
                >
                    +
                </button>

                {/* Center the table */}
                <div className="d-flex justify-content-center mt-4">
                    <table className="table table-striped text-center w-75">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Created At</th>
                                <th className="buttons-container-adtag"></th>

                            </tr>
                        </thead>
                        <tbody>
                            {tags.map((tag) => (
                                <tr key={tag._id} className="table-row-adtag">

                                    <td>{tag.tag_name}</td>
                                    <td>{tag.description}</td>
                                    <td>{new Date(tag.createdAt).toLocaleDateString()}</td>
                                    <td className="buttons-container-adtag">
                                        <div className="action-buttons-adtag">
                                            <button
                                                className="btn-adtag btn-sm-adtag btn-warning me-1"
                                                onClick={() => handleEditClick(tag)}
                                            >
                                                <i className="fa-regular fa-pen-to-square"></i>
                                            </button>
                                            {/* Correctly trigger Delete Modal */}
                                            
                                            <button
                                                className="btn-adtag btn-sm-adtag btn-danger"
                                                onClick={() => handleDeleteClick(tag._id)}
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

            {showModal && (
                <div className="modal-overlay-adtag">
                    <div className="modal-adtag"ref={modalRef}>
                        <h2>Add New Prefrence Tag</h2>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={newTag.tag_name}
                                onChange={(e) =>
                                    setNewTag({ ...newTag, tag_name: e.target.value })
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <input
                                type="text"
                                className="form-control"
                                value={newTag.description}
                                onChange={(e) =>
                                    setNewTag({ ...newTag, description: e.target.value })
                                }
                            />
                        </div>
                        <div className="modal2-actions-adtag">

                            {modalError && <div className="alert alert-danger">{modalError}</div>}
                            <button className="submit-btn-adtag " onClick={handleAddTag}>
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

            {isEditModalOpen && (
                <div className="modal-overlay-adtag">
                    <div className="modal-adtag"ref={modalRef}>

                        <h2>Edit Prefrence Tag</h2>


                        <div className="mb-3">
                            <label className="form-label">Name</label>

                            <input
                                type="text"
                                className="form-control"
                                name="tag_name"
                                placeholder="Name"
                                value={editingTag.tag_name}
                                onChange={(e) => handleEditInputChange(e)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <input
                                type="text"
                                className="form-control"
                                name="description"
                                placeholder="Description"
                                value={editingTag.description}
                                onChange={(e) => handleEditInputChange(e)}
                            />
                        </div>




                        <div className="modal2-actions-adtag">
                            {modalError && <div className="alert alert-danger">{modalError}</div>}

                            <button className="submit-btn-adtag " onClick={handleEditSave}>Save</button>
                            <button className="cancel-btn-adtag" onClick={cancelEdit}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}



            {/* Modal for Deletion */}
            {isDeleteModalOpen && (

                <div className="modal-overlay-adtag">
                    <div className="modal-adtag" ref={modalRef}>
                        <h2>Confirm Deletion</h2>
                        <p>Are you sure you want to delete this Tag?</p>
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

export default Tagspage