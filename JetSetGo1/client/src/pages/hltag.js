// import { Link } from "react-router-dom"
import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';


//components 
// import HLTagelement from '../components/hltagcomponent.js'
import HLTagform from '../components/hltagform.js'
import HLTagelement from '../components/hltagcomponent.js'
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie

const HLTags = () => {
    const [tags, setTags] = useState(null); // State to store tags
  const location = useLocation(); // Access the location object
//  const { id } = location.state || {}; // Access id from state

  const token = Cookies.get("auth_token");
const decodedToken = jwtDecode(token);
const id = decodedToken.id;
console.log("id:",id);
const modelName = decodedToken.userType;
console.log("modelName:",modelName);




    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/tourism-governer/tags'); // Adjust API URL as needed
                const json = await response.json();
                if (response.ok) {
                    setTags(json); // Set fetched tags in state
                }
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchTags();
    }, []); // Empty dependency array to run only on component mount

    console.log("kokokokokok", tags);
    return (
        <div className="home">
            <div className="tags">
                {tags && tags.map((tag) => (
                    // <p key={tag.tag_name}>{tag.tag_name}</p>
                    // <tagelement tag={tag}/>
                    <HLTagelement tag={tag} />
                ))}
            </div>
            <HLTagform />

        </div>
    )
}


export default HLTags