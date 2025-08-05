import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
//components
import MuseumDetails from "../components/MuseumDetails"

const Museums = ({filteredMuseum}) => {
    const [museums, setMuseums] = useState(null)
    const [tagId, setTagId] = useState(''); // State for tag ID

    useEffect(() => {
        fetchMuseums()
    }, [])

    const fetchMuseums = async () => {
        const response = await fetch('/api/guests/getMuseums')
        const json= await response.json()

        if (response.ok){
            setMuseums(json); // Initialize filtered museums with all museum
        }
    }


    const activitiesToShow = filteredMuseum || museums;

    return (
        <div className="museums">
            <nav>
                <ul>
                    <li><Link to="/activities">Activities</Link></li>
                    <li><Link to="/itineraries">Itineraries</Link></li>
                    <li><Link to="/museums">Museums</Link></li>
                    <li><Link to="/historicalLocations">Historical Locations</Link></li>
                </ul>
            </nav>
            

            <div className="upcomingMuseums">
            { activitiesToShow && activitiesToShow.length === 0 && 
                (
                <p>No results found</p>
                )}
            {activitiesToShow && activitiesToShow.map((museum) => (
                    <MuseumDetails key={museum._id} Museum={museum} />
                ))}
                {/* {(activitiesToShow || museums) && (activitiesToShow.length ? 
                    activitiesToShow.map((museum) => (
                        <MuseumDetails key={museum._id} Museum={museum} />
                    )) : <p>No museums found.</p>
                )} */}

             
            </div>
        </div>
    )
}

export default Museums;