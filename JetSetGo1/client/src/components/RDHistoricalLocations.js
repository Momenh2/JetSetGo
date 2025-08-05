
import { useState } from 'react'
const HistoricalLocationElement = ({ tag: historicallocation }) => {

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

    const response = await fetch('http://localhost:8000/api/tourism-governer/deleteHL/' + historicallocation._id, {
      method: 'DELETE'
    });
    const json = await response.json();
    if (!response.ok) {
    }
    if (response.ok) {
      console.log('historical location deleted:', json)
    }
  };




  console.log("inside the RD", historicallocation)
  return (

    <div className="tag-details">
      <h4>{historicallocation.title}</h4>
      <h4>{historicallocation._id}</h4>
      <p><strong>Ticket Prices for Foreigners: </strong>{historicallocation.ticketPrices.foreigner}</p>
      <p><strong>Ticket Prices for Natives: </strong>{historicallocation.ticketPrices.native}</p>
      <p><strong>Ticket Prices for Students: </strong>{historicallocation.ticketPrices.student}</p>
      <p><strong>Historical_Location Name: </strong>{historicallocation.name}</p>
      <p><strong>Description: </strong>{historicallocation.description}</p>
      <p><strong>Location: </strong>{historicallocation.location}</p>
      <p><strong>Opening Hours : </strong>{historicallocation.openingHours}</p>
      <p><strong>Pictures: </strong>{historicallocation.pictures}</p>
      <p><strong>Tags: </strong>{historicallocation.tags}</p>
      <p><strong>Category: </strong>{historicallocation.category}</p>
      <p><strong>Governor: </strong>{historicallocation.governor}</p>

      <p>{historicallocation.createdAt}</p>
      <span onClick={Delete} className='koko'>X</span>
      <br />
      {/* <span onClick={Update}>Edit</span> */}

    </div>
  );
};
export default HistoricalLocationElement;