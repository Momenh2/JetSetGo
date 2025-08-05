// import { Link } from "react-router-dom"
import { useEffect , useState } from "react"


//components 
import Myactivitieselement from '../components/myactivitiescomponent.js'

const Myactivitiespage = () =>{
    const [ tags , get_tags ] = useState(null)

    useEffect (()=>{
        const fetchtags = async () =>{
            const response = await fetch('http://localhost:8000/api/advertisers/showAll?AdvId=66ff03e2f99d83cc77b8cb27')
            const json = await response.json()
            console.log("kokokokokok",response);
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
                    <Myactivitieselement tag={tag}/>
                ))}
            </div>
        </div>
     )
}


export default Myactivitiespage