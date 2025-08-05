//import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import IT from "../../assets/images/hs.jpg";
import styles from  "./tourismgovernerhome.module.css";
import Filter from "../../components/Filterbox.js";

const TourismGovernerHomepage = () => {
    const [histlocs, setHistLocs] = useState([]);
    const [loadingTags, setLoadingTags] = useState(true);
    const [tags, setTags] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState(""); // State for search input
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [showModal, setShowModal] = useState(false); // State for controlling the modal
    const [deletingId, setDeletingId] = useState(null); // State to store the id of the item to be deleted
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newLocation, setNewLocation] = useState({
        name: "",
        description: "",
        location: "",
        openingHours: { from: "", to: "" },
        ticketPrices: { foreigner: "", native: "", student: "" },
        tags: "",

    });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState(null);
    const [modalError, setModalError] = useState(null);

    const modalRef = useRef(null); // Create a ref for the modal


    const token = Cookies.get("auth_token");
    const decodedToken = jwtDecode(token);
    const id = decodedToken.id;

    useEffect(() => {
        const fetchHistLocs = async () => {
            try {
                const response = await fetch(`/api/tourism-governer/showAll/${id}`);
                const data = await response.json();
                console.log("Fetched Historical Locations:", data); // Log the response
                setHistLocs(data);
            } catch (error) {
                setError('You don’t have any posts yet.');
            }
        };
        fetchHistLocs();
    }, [id]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch('/api/tourism-governer/tags');
                const data = await response.json();
                console.log("Fetched Tags:", data); // Log the tags
                setTags(data);
            } catch (error) {
                console.error('Error fetching tags:', error);
            } finally {
                setLoadingTags(false);
            }
        };
        fetchTags();
        const handleOutsideClick = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setShowModal(false);
                setDeletingId(null);
                setModalError(null);
                setNewLocation({
                    name: "",
                    description: "",
                    location: "",
                    openingHours: { from: "", to: "" },
                    ticketPrices: { foreigner: "", native: "", student: "" },
                    tags: "",
            
                });
                setIsEditModalOpen(false);
                setIsCreateModalOpen(false);
                setEditingLocation(null);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);


    const handleDelete = async (id) => {
        console.log('Deleting ID:', id);

        try {
            const response = await fetch(`/api/tourism-governer/deleteHL/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Update the state to remove the deleted post
                setHistLocs((prevHistLocs) => prevHistLocs.filter((loc) => loc._id !== id));
                setShowModal(false); // Close the modal
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
        setShowModal(true); // Show the confirmation modal
    };

    const confirmDelete = () => {
        if (deletingId) {
            handleDelete(deletingId); // Perform the delete operation
        }
    };

    const cancelDelete = () => {
        setShowModal(false); // Close the modal without deleting
        setDeletingId(null); // Clear the stored ID
    };

    const cancelCreate = () =>{
        setNewLocation({
            name: "",
            description: "",
            location: "",
            openingHours: { from: "", to: "" },
            ticketPrices: { foreigner: "", native: "", student: "" },
            tags: "",
    
        });
        setIsCreateModalOpen(false)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log("Input Change - Name:", name, "Value:", value); // Log inputs

        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setNewLocation((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        } else {
            setNewLocation((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
        console.log("Updated newLocation:", newLocation); // Log the updated state
    };



    const handleCreate = async () => {
        const Location = {
            ...newLocation,
            governor: id,
        };

        console.log("Location object before validation:", Location);

    // Log the individual fields
    console.log("Location name:", Location.name);
    console.log("Location description:", Location.description);
    console.log("Location location:", Location.location);
    console.log("Location openingHours:", Location.openingHours);
    console.log("Location ticketPrices:", Location.ticketPrices);
    console.log("Location tags:", Location.tags);
    console.log("Location governor:", Location.governor);

        if (!Location.name || !Location.description || !Location.location || !Location.openingHours.from || !Location.openingHours.to || !Location.ticketPrices.foreigner || !Location.ticketPrices.native || !Location.ticketPrices.student || !Location.tags || !Location.governor) {
            setModalError('Please fill out all fields.');
            return;
        }
        try {
           
            console.log(Location);
            const response = await fetch(`/api/tourism-governer/newHL`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(Location),
            });

            if (response.ok) {
                const createdLocation = await response.json();
                setHistLocs((prevHistLocs) => [...prevHistLocs, createdLocation]);
                setIsCreateModalOpen(false); // Close the modal
                console.log("Location created successfully");
                setModalError(null);
            } else {
                console.error("Error creating location");
                setModalError('Failed to add Post. Please try again.');

            }
        } catch (error) {
            console.error("Error:", error);
            setModalError('Failed to add Post. Please try again.');

        }
    };

    const handleEditClick = (location) => {
        console.log("Editing Location Selected:", location); // Verify the correct object is passed
        setEditingLocation({
            ...location, // Copy the entire location object
            openingHours: location.openingHours || { from: "", to: "" }, // Ensure nested fields are handled
            ticketPrices: location.ticketPrices || { foreigner: "", native: "", student: "" },
        });
        console.log("Initialized editingLocation:", {
            ...location,
            openingHours: location.openingHours || { from: "", to: "" },
            ticketPrices: location.ticketPrices || { foreigner: "", native: "", student: "" },
        }); // Log the correct structure
        setIsEditModalOpen(true);
    };


    const handleEditInputChange = (e) => {
        const { name, value } = e.target;

        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setEditingLocation((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        } else {
            setEditingLocation((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleEditSave = async () => {

        if (!editingLocation.name || !editingLocation.description || !editingLocation.location || !editingLocation.openingHours.from || !editingLocation.openingHours.to || !editingLocation.ticketPrices.foreigner || !editingLocation.ticketPrices.native || !editingLocation.ticketPrices.student || !editingLocation.tags || !editingLocation.governor) {
            setModalError('Please fill out all fields.');
            return;
        }

        try {
            const response = await fetch(`/api/tourism-governer/updateHL/${editingLocation._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editingLocation),
            });

            if (response.ok) {
                const updatedLocation = await response.json();
                setHistLocs((prevHistLocs) =>
                    prevHistLocs.map((loc) =>
                        loc._id === updatedLocation._id ? updatedLocation : loc
                    )
                );
                setIsEditModalOpen(false); // Close the modal
                setModalError(null);
                console.log("Location updated successfully");
            } else {
                console.error("Error updating location");
                setModalError('Failed to add tag. Please try again.');
            }
        } catch (error) {
            console.error("Error:", error);
            setModalError('Failed to add tag. Please try again.');

        }
    };




    const filteredHistLocs = histlocs.filter((histloc) =>
        histloc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles["home-gov"]}>
            {/* Page Title */}
            <div className={styles["header-container-gov"]}>
                <h1 className={styles["page-title-gov"]}>Historical Locations</h1>
                <button className={styles["add-button-gov"]} onClick={() => setIsCreateModalOpen(true)}> + </button></div>

            <div className={styles["SearchBarAndFiletr-gov"]}>
                {/* Search Bar */}
                <div className={styles["search-bar-gov"]}>
                    <input
                        type="text"
                        placeholder="Search for Historical Locations                                                                                                               🔍"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className={styles["search-icon-gov"]}>
                        <i className="fas fa-search"></i>
                    </span>

                </div>

                {/* <Filter isFilterOpen={isFilterOpen} toggleFilter={setIsFilterOpen} /> */}
            </div>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className={styles["modal-overlay-gov"]}>
                    {console.log("Current newLocation State:", newLocation)} {/* Log before displaying */}
                    <div className={styles["modal2-gov"]} ref={modalRef}>
                        <h2>Create Historical Location</h2>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={newLocation.name}
                            onChange={handleInputChange}
                        />
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={newLocation.description}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={newLocation.location}
                            onChange={handleInputChange}
                        />
                        <input
                            type="number"
                            name="openingHours.from"
                            placeholder="Open From"
                            value={newLocation.openingHours.from}
                            onChange={handleInputChange}
                        />
                        <input
                            type="number"
                            name="openingHours.to"
                            placeholder="Open To"
                            value={newLocation.openingHours.to}
                            onChange={handleInputChange}
                        />
                        <input
                            type="number"
                            name="ticketPrices.foreigner"
                            placeholder="Price for Foreigners"
                            value={newLocation.ticketPrices.foreigner}
                            onChange={handleInputChange}
                        />
                        <input
                            type="number"
                            name="ticketPrices.native"
                            placeholder="Price for Natives"
                            value={newLocation.ticketPrices.native}
                            onChange={handleInputChange}
                        />
                        <input
                            type="number"
                            name="ticketPrices.student"
                            placeholder="Price for Students"
                            value={newLocation.ticketPrices.student}
                            onChange={handleInputChange}
                        />
                        <select
                            name="tags"
                            value={newLocation.tags}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Tag</option>
                            {tags.map((tag) => (
                                <option key={tag._id} value={tag._id}>
                                    {tag.type} - {tag.historicalPeriod}
                                </option>
                            ))}
                        </select>
                        <div className={styles["modal2-actions-gov"]}>
                        {modalError && <div className={styles["alert alert-danger-gov"]}>{modalError}</div>}

                            <button onClick={handleCreate}>Create</button>
                            <button onClick={cancelCreate}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {isEditModalOpen && (
                <div className={styles["modal-overlay-gov"]}>
                    {console.log("Editing Location State:", editingLocation)} {/* Log before displaying */}
                    <div className={styles["modal2-gov"]} ref={modalRef}>
                        <h2>Edit Historical Location</h2>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={editingLocation.name}
                            onChange={(e) => handleEditInputChange(e)}
                        />
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={editingLocation.description}
                            onChange={(e) => handleEditInputChange(e)}
                        />
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={editingLocation.location}
                            onChange={(e) => handleEditInputChange(e)}
                        />
                        <input
                            type="number"
                            name="openingHours.from"
                            placeholder="Open From"
                            value={editingLocation.openingHours.from}
                            onChange={(e) => handleEditInputChange(e)}
                        />
                        <input
                            type="number"
                            name="openingHours.to"
                            placeholder="Open To"
                            value={editingLocation.openingHours.to}
                            onChange={(e) => handleEditInputChange(e)}
                        />
                        <input
                            type="number"
                            name="ticketPrices.foreigner"
                            placeholder="Price for Foreigners"
                            value={editingLocation.ticketPrices.foreigner}
                            onChange={(e) => handleEditInputChange(e)}
                        />
                        <input
                            type="number"
                            name="ticketPrices.native"
                            placeholder="Price for Natives"
                            value={editingLocation.ticketPrices.native}
                            onChange={(e) => handleEditInputChange(e)}
                        />
                        <input
                            type="number"
                            name="ticketPrices.student"
                            placeholder="Price for Students"
                            value={editingLocation.ticketPrices.student}
                            onChange={(e) => handleEditInputChange(e)}
                        />
                        <select
                            name="tags"
                            value={editingLocation.tags}
                            onChange={(e) => handleEditInputChange(e)}
                        >
                            <option value="">Select Tag</option>
                            {tags.map((tag) => (
                                <option key={tag._id} value={tag._id}>
                                    {tag.type} - {tag.historicalPeriod}
                                </option>
                            ))}
                        </select>
                        <div className={styles["modal2-actions-gov"]}>
                        {modalError && <div className={styles["alert alert-danger-gov"]}>{modalError}</div>}

                            <button onClick={handleEditSave}>Save</button>
                            <button onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}



            {/* Modal for Deletion */}
            {showModal && (

                <div className={styles["modal-overlay-gov"]}>
                    <div className={styles["modal-gov"]} ref={modalRef}>
                        <h2>Confirm Deletion</h2>
                        <p>Are you sure you want to delete this location?</p>
                        <div className={styles["modal-actions-gov"]}>
                        {modalError && <div className={styles["alert alert-danger-gov"]}>{modalError}</div>}

                            <button onClick={confirmDelete}>Delete</button>
                            <button onClick={cancelDelete}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}


            {/* Historical Locations Section */}
            <div className={styles["tags-gov"]}>
                <div className={styles["histloc-card-container-gov"]}>
                    {console.log("Rendering histlocs:", filteredHistLocs)} {/* Log filtered data */}
                    {filteredHistLocs.map((histloc) => (
                        <div className={styles["histloc-card-gov"]} key={histloc._id}>
                       <div className={styles["card-header-gov"]}>
    <img src={IT} alt={histloc.name} className={styles["card-image-gov"]} />
    <div className={styles["card-actions-container"]}>
    <a className={`${styles["card-action-gov"]} ${styles["delete-btn"]}`} 
       href="#" 
       onClick={() => handleDeleteClick(histloc._id)}>
        <i className="fa fa-trash"></i>
    </a>
    <a className={`${styles["card-action-gov"]} ${styles["edit-btn"]}`} 
       href="#" 
       onClick={() => handleEditClick(histloc)}>
        <i className="fa-solid fa-pen"></i>
    </a>
</div>

</div>

                            <div className={styles["card-content-gov"]}>
                                <div className={styles["card-title-gov"]}>{histloc.name || "Untitled Historical Location"}</div>
                                <div className={styles["card-rating-gov"]}>

                                </div>
                                <div className={styles["card-description-gov"]}>
                                    {histloc.description || "No description available."}
                                </div>
                                <div className={styles["card-location-gov"]}>
                                    <strong>Location: </strong>
                                    {histloc.location || "No location available."}
                                </div>
                                <div className={styles["card-location-gov"]}>
                                    <strong>Opening Hours: </strong>

                                    {histloc.openingHours.from} - {histloc.openingHours.to}
                                </div>
                                <div className={styles["card-tags-gov"]}>
                                    <strong>🏷 Tag:  </strong>
                                    {loadingTags ? (
                                        <span>Loading tag...</span>
                                    ) : (
                                        histloc.tags ? (
                                            (() => {
                                                const tagItem = tags.find((tag) => tag._id === histloc.tags);
                                                return tagItem ? ` ${tagItem.type} - ${tagItem.historicalPeriod}` : "Tag not found";
                                            })()
                                        ) : (
                                            <span>No tag available</span>
                                        )
                                    )}
                                </div>
                                <div className={styles["card-price-gov"]}>


                                    <ul>
                                        <li>
                                            <strong> $ Foreigners: </strong> {histloc.ticketPrices.foreigner || "N/A"}
                                        </li>
                                        <li>
                                            <strong> $ Natives: </strong> {histloc.ticketPrices.native || "N/A"}
                                        </li>
                                        <li>
                                            <strong> $ Students: </strong> {histloc.ticketPrices.student || "N/A"}
                                        </li>
                                    </ul>
                                </div>


                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default TourismGovernerHomepage;