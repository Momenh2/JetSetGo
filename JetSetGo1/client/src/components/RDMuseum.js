
import { useState } from 'react'
const MuseumElement = ({ tag: museum }) => {

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [openingHours, setOpeningHours] = useState('')
  const [ticketPricesF, setTicketPricesF] = useState('')
  const [ticketPricesN, setTicketPricesN] = useState('')
  const [ticketPricesS, setTicketPricesS] = useState('')
  const [pictures, setPictures] = useState('')
  const [tags, setTags] = useState('')
  const [category, setCategory] = useState('')
  const [governor, setGovernor] = useState('')
  const [error, setError] = useState(null)

  const Delete = async () => {

    const response = await fetch('http://localhost:8000/api/tourism-governer/deleteMuseum/' + museum._id, {
      method: 'DELETE'
    });
    const json = await response.json();
    if (!response.ok) {
    }
    if (response.ok) {
      console.log('museum deleted:', json)
    }
  };




  console.log("inside the RD", museum)
  return (

    <div className="tag-details">
      <h4>{museum.title}</h4>
      <h4>{museum._id}</h4>
      <p><strong>Ticket Prices for Foreigners: </strong>{museum.ticketPrices.foreigner}</p>
      <p><strong>Ticket Prices for Natives: </strong>{museum.ticketPrices.native}</p>
      <p><strong>Ticket Prices for Students: </strong>{museum.ticketPrices.student}</p>
      <p><strong>Museum Name: </strong>{museum.name}</p>
      <p><strong>Description: </strong>{museum.description}</p>
      <p><strong>Location: </strong>{museum.location}</p>
      <p><strong>Opening Hours : </strong>{museum.openingHours}</p>
      <p><strong>Pictures: </strong>{museum.pictures}</p>
      <p><strong>Tags: </strong>{museum.tags}</p>
      <p><strong>Category: </strong>{museum.category}</p>
      <p><strong>Governor: </strong>{museum.governor}</p>

      <p>{museum.createdAt}</p>
      <span onClick={Delete} className='koko'>X</span>
      <br />
      {/* <span onClick={Update}>Edit</span> */}

    </div>
  );
};
export default MuseumElement;