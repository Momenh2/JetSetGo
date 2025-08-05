// import { Link } from "react-router-dom"
import { useEffect , useState } from "react"


//components 
import HistoricalLocationElement from '../components/RDHistoricalLocations.js'
import HistoricalLocationForm from '../components/CUHistoricalLocation.js'

const HL = () =>{
    const [ tags , get_tags ] = useState(null)

    useEffect (()=>{
        const fetchtags = async () =>{
            const response = await fetch('http://localhost:8000/api/tourism-governer/showHL')
            const json = await response.json()
            console.log("kokokokokok",json,"kikikik");
            if (response.ok){
                get_tags(json);
            }
        }
        fetchtags()
    }, [])

    console.log("kokokokokok",tags);
     return(
        <div className="home">
            <div className="tags">
                {tags && tags.map((tag)=>(
                    // <p key={tag.tag_name}>{tag.tag_name}</p>
                    // <tagelement tag={tag}/>
                    <HistoricalLocationElement tag={tag}/>
                ))}
            </div>
            <HistoricalLocationForm/>
        </div>
     )
}


export default HL