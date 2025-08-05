import { Link } from "react-router-dom";

const  HomePage = () =>  {
    return (
      <div className="homepage">
        <h1>Welcome to the Travel App</h1>
        <div className="navigation-buttons">
          <Link to="/delete/:role"><button>User List</button></Link>
          <Link to="/tour-guide/itineraryAdd"><button>Itinerary Manager</button></Link>
          <Link to="/admin/profile"><button>Admin Profile</button></Link>
          <Link to="/admin/delete-options"><button>Delete Options</button></Link>
          <Link to="/admin/add"><button>Add Admin</button></Link>
          <Link to="/edit/tourist/:id"><button>Edit Tourist</button></Link>
          <Link to="/profile/tourist/:id"><button>Tourist Profile</button></Link>
          <Link to="/create/tour-guides/:id"><button>Create Tour Guide Profile</button></Link>
          <Link to="/update-profile/tour-guides/:id"><button>Update Tour Guide Profile</button></Link>
          <Link to="/profile/tour-guides/:id"><button>Tour Guide Profile</button></Link>
          <Link to="/activities2"><button>Activities</button></Link>
          <Link to="/itineraries2"><button>Itineraries</button></Link>
          <Link to="/museums"><button>Museums</button></Link>
          <Link to="/historicalLocations"><button>Historical Locations</button></Link>
          {/* <Link to="/productPage"><button>Product Listing</button></Link> */}
          {/**/}
          <Link to="/seller/products"><button> seller Product Listing</button></Link>
          <Link to="/admin/products"><button> admin Product Listing</button></Link>
          <Link to="/tourist/products"><button> tourist Product Listing</button></Link>
          <Link to="/seller/addProduct"><button>seller add product</button></Link>
          <Link to="/admin/addProduct"><button>admin add product </button></Link>
          <Link to="/admin/getComplaints"><button>Admin View ALL complaints</button></Link>
          <Link to="/admin/viewComplaint"><button>Admin View complaint</button></Link>
          <Link to="/tourist/complaint/:userId"><button>Tourist File Complaint</button></Link>
          <Link to="/tourist/touristProfile/:id"><button>Tourist Profile Page</button></Link>
          <li>
          <Link to="/my_tags">My Tags</Link>
        </li>
        <li>
          <Link to="/my_category">My Category</Link>
        </li>
        <li>
          <Link to="/Tourism_Governer">Tourism Governor</Link>
        </li>
        <li>
          <Link to="/HL">HL</Link>
        </li>
        <li>
          <Link to="/Museum">Museum</Link>
        </li>
        <li>
          <Link to="/HLTags">HL Tags</Link>
        </li>
        <li>
          <Link to="/HLMs">HLMs</Link>
        </li>
        <li>
          <Link to="/Activities">Activities</Link>
        </li>
        <li>
          <Link to="/Itineraries">Itineraries</Link>
        </li>
        <li>
          <Link to="/historicalLocations">Historical Locations</Link>
        </li>

        <li>
          <Link to="/ActivitiesJohn">Go to Activities John</Link>
        </li>
        <li>
          <Link to="/Authentication">Go to Authentication</Link>
        </li>
        <li>
          <Link to="/profileJohn/:id">Go to Profile John</Link> {/* Replace 1 with the actual ID */}
        </li>

        </div>
      </div>
    );
  }

  export default HomePage