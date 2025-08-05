// import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie

//components 
import HLMselement from '../components/HLMscomponent.js'
import HistoricalLocationElement from '../components/RDHistoricalLocations.js'
import MuseumElement from '../components/RDMuseum.js'
import { useLocation } from 'react-router-dom';


const HLMSpage = () => {
    const [tags, get_tags] = useState(null)
    const [hl, get_hl] = useState(null)
    const location = useLocation(); // Access the location object
    //const { id } = location.state || {}; 
    const token = Cookies.get("auth_token");
    const decodedToken = jwtDecode(token);
    const id = decodedToken.id;
    console.log("id:",id);
    const modelName = decodedToken.userType;
    console.log("modelName:",modelName);


    useEffect(() => {
        const fetchtags = async () => {
            const response = await fetch(`http://localhost:8000/api/tourism-governer/showAll?govId=${id}`)
            const data = await response.json();

            // Access the arrays from the parsed JSON
            const museumsArray = data.Museums;
            const historicalLocationsArray = data.HistoricalLocations;

            // const json2 = await historicalLocationsArray.json()
            // const json = museumsArray.concat(historicalLocationsArray);
            console.log("kokokokokok", museumsArray , historicalLocationsArray);
            if (response.ok) {
                get_tags(museumsArray);
                get_hl(historicalLocationsArray);
            }
        }
        fetchtags()
    }, [])

    console.log("kokokokokok", tags);
    return (
        <div className="home">
            <div className="tags">
                {tags && tags.map((tag) => (
                    // <p key={tag.tag_name}>{tag.tag_name}</p>
                    // <tagelement tag={tag}/>
                    <MuseumElement tag={tag} />
                ))}
                {hl && hl.map((tag) => (
                    // <p key={tag.tag_name}>{tag.tag_name}</p>
                    // <tagelement tag={tag}/>
                    <HistoricalLocationElement tag={tag} />
                ))}
            </div>
        </div>
    )
}


export default HLMSpage