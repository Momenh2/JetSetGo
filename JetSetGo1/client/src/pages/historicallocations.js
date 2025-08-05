//import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import IT from "../assets/images/hs.jpg";
import "./historicallocations.css";
import Filter from "../components/Filterbox.js";
//components
import HistoricalLocationDetails from "../components/HistoricalLocationDetails"

const HistoricalLocations = ({ filteredHistoricalPlace }) => {
    const [histlocs, setHistLocs] = useState([]);
    const [loadingTags, setLoadingTags] = useState(true);
    const [tags, setTags] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState(""); // State for search input
    const [selectedCategory, setSelectedCategory] = useState(""); // Selected category filter
    const [categoryList, setCategoryList] = useState([]);

    //const [isFilterOpen, setIsFilterOpen] = useState(false);
    //const [showModal, setShowModal] = useState(false); // State for controlling the modal
    //const [deletingId, setDeletingId] = useState(null); // State to store the id of the item to be deleted
    //const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    /*const [newLocation, setNewLocation] = useState({
        name: "",
        description: "",
        location: "",
        openingHours: { from: "", to: "" },
        ticketPrices: { foreigner: "", native: "", student: "" },
        tags: "",

    });*/
    //const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    //const [editingLocation, setEditingLocation] = useState(null);
    //const [modalError, setModalError] = useState(null);



    const token = Cookies.get("auth_token");
    const decodedToken = jwtDecode(token);
    const id = decodedToken.id;


    useEffect(() => {
        const fetchHistLocs = async () => {
            try {
                const response = await fetch(`/api/guests/getHistoricalLocations`);
                const data = await response.json();
                console.log("Fetched Historical Locations:", data); // Log the response
                setHistLocs(data);
            } catch (error) {
                setError('You don’t have any posts yet.');
            }
        };

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


        fetchHistLocs();
        fetchTags();
    }, [id]); 

    


        // Filtering Logic
    let filteredHistLocs = histlocs.filter((histloc) => {
        // Match by name or tag name
        const tag = tags.find((tag) => tag._id === histloc.tags);
        const tagName = tag ? `${tag.type} - ${tag.historicalPeriod}` : "";


    
        const matchesSearch = histloc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tagName.toLowerCase().includes(searchTerm.toLowerCase())
    
        return matchesSearch;
    });

    //filteredHistLocs = filteredHistoricalPlace || filteredHistLocs;


    return (
        <div className="home">
            {/* Page Title */}
            <div className="header-container">
                <h1 className="page-title">Historical Locations</h1>
            </div>

            <div className="SearchBarAndFiletr">
                {/* Search Bar */}
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search by Name or Tag "
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="search-icon">
                        <i className="fas fa-search"></i>
                    </span>

            </div>

            {/* <Filter isFilterOpen={isFilterOpen} toggleFilter={setIsFilterOpen} /> */}

                
        </div>

            




            {/* Historical Locations Section */}
            <div className="tags">
                <div className="histloc-card-container">
                    {console.log("Rendering histlocs:", filteredHistLocs)} {/* Log filtered data */}
                    {filteredHistLocs.map((histloc) => (
                        <div className="histloc-card" key={histloc._id}>
                            <div className="card-header">
                                <img src={IT} alt={histloc.name} className="card-image" />
                            </div>
                            <div className="card-content">
                                <div className="card-title">{histloc.name || "Untitled Historical Location"}</div>
                                <div className="card-rating">

                                </div>
                                <div className="card-description">
                                    {histloc.description || "No description available."}
                                </div>
                                <div className="card-location">
                                    <strong>Location: </strong>
                                    {histloc.location || "No location available."}
                                </div>
                                {/*<div className="card-location">
                                    <strong>Opening Hours: </strong>

                                    {histloc.openingHours.from} - {histloc.openingHours.to}
                                </div>*/}
                                <div className="card-tags">
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
                                <div className="card-price">


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

export default HistoricalLocations;