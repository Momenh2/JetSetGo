// import { Link } from "react-router-dom"
import { useEffect , useState } from "react"


//components 
import Myactivitieselement from '../components/myactivitiescomponent.js'
import axios from "axios"


const Myactivitiespage = () =>{
    const [ tags , get_tags ] = useState(null)

    useEffect (()=>{
        const fetchtags = async () =>{
            const response = await axios.get('http://localhost:8000/api/guests/getUpcomingActivities')
            const json = await response.json
            console.log("kokokokokok",response);
            if (response.ok){
                get_tags(response);
                console.log(tags)
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
                    //  <tagelement tag={tag}/>}
                    <Myactivitieselement tag={tag}/>
                ))}
            </div>
        </div>
     )
}


export default Myactivitiespage