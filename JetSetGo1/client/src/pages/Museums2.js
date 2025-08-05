
// import { Link } from "react-router-dom"
import { useEffect , useState } from "react"


//components 
import MuseumElement from '../components/RDMuseum.js'
import MuseumForm from '../components/CUMuseum.js'

const Museum = () =>{
    const [ tags , get_tags ] = useState(null)

    useEffect (()=>{
        const fetchtags = async () =>{
            const response = await fetch('http://localhost:8000/api/tourism-governer/showMuseum')
            const json = await response.json()
            // console.log("kokokokokok",json,"kikikik");
            if (response.ok){
                get_tags(json);
            }
        }
        fetchtags()
    }, [])

    // console.log("kokokokokok",tags);
     return(
        <div className="home">
            <div className="tags">
                {tags && tags.map((tag)=>(
                    // <p key={tag.tag_name}>{tag.tag_name}</p>
                    // <tagelement tag={tag}/>
                    <MuseumElement tag={tag}/>
                ))}
            </div>
            <MuseumForm/>
        </div>
     )
}


export default Museum