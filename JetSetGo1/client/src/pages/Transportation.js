// import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie

//components 
import Transportationform from '../components/TransportationForm.js';
import TransportationComponent from '../components/TransportationComponent.js';

const Transportationpage = () => {
    const [transports, get_transports] = useState(null)
    const location = useLocation();
    const token = Cookies.get("auth_token");
    const decodedToken = jwtDecode(token);
    const id = decodedToken.id;
    console.log("id:", id);
    const modelName = decodedToken.userType;
    console.log("modelName:", modelName);
    // const { id } = location.state || {}; // Access the id from state

    useEffect(() => {
        const fetchtransports = async () => {
            const response = await fetch('http://localhost:8000/api/advertisers/showTransportation')
            const json = await response.json()
            if (response.ok) {
                get_transports(json);
            }
        }
        fetchtransports()
    }, [])

    console.log("kokokokokok", transports);
    return (
        <div className="home">
            <div className="tags">
                {transports && transports.map((transport) => (
                    // <p key={tag.tag_name}>{tag.tag_name}</p>
                    // <tagelement tag={tag}/>
                    <TransportationComponent transport={transport} />
                ))}
            </div>
            <Transportationform />
        </div>
    )
}


export default Transportationpage