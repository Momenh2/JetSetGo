import { useState } from 'react'

const HistoricalLocationForm = () => {
  const [ID, setId] = useState('')
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

  const addhistoricallocation = async (e) => {
    e.preventDefault()

    const historicallocation = { name: name, description: description, location: location, openingHours: openingHours, ticketPrices: { foreigner: ticketPricesF, native: ticketPricesN, student: ticketPricesS }, pictures: pictures, tags: tags, category: category, governor: governor }

    const response = await fetch('http://localhost:8000/api/tourism-governer/newHL', {
      method: 'POST',
      body: JSON.stringify(historicallocation),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const json = await response.json()

    if (!response.ok) {
      setError(json.error)
    }
    if (response.ok)
    setId('')
    setName('')
    setDescription('')
    setLocation('')
    setOpeningHours('')
    setTicketPricesF('')
    setTicketPricesN('')
    setTicketPricesS('')
    setPictures('')
    setTags('')
    setCategory('')
    setGovernor('')
    setError(null)
    console.log('new historical location added:', json)
  }



  const updatehistoricallocation = async (e) => {
    e.preventDefault()

    const historicallocation = { name: name, description: description, location: location, openingHours: openingHours, ticketPrices: { foreigner: ticketPricesF, native: ticketPricesN, student: ticketPricesS }, pictures: pictures, tags: tags, category: category, governor: governor }

    const response = await fetch('http://localhost:8000/api/tourism-governer/updateHL/'+ ID, {
      method: 'PATCH',
      body: JSON.stringify(historicallocation),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const json = await response.json()
    if (!response.ok) {
      setError(json.error)
    }
    if (response.ok) {
      setId('')
      setName('')
      setDescription('')
      setLocation('')
      setOpeningHours('')
      setTicketPricesF('')
      setTicketPricesN('')
      setTicketPricesS('')
      setPictures('')
      setTags('')
      setCategory('')
      setGovernor('')
      setError(null)
      console.log('historical location updated:', json)
    }
  }

  return (
    <form className="create" onSubmit={addhistoricallocation}>
      <h3>Add a New Historical Location</h3>

      <label>ID:(for updating bas mashy 5aly balak)</label>
      <input
        type="text"
        onChange={(e) => setId(e.target.value)
        }
        value={ID}
      />


      <label > HistoricalLocation Name:</label>
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />


      <label>Description:</label>
      <input
        type="text"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
      />

      <label>Location:</label>
      <input
        type="text"
        onChange={(e) => setLocation(e.target.value)}
        value={location}
      />

      <label>Opening Hours:</label>
      <input
        type="text"
        onChange={(e) => setOpeningHours(e.target.value)}
        value={openingHours}
      />

      <label>Ticket Prices:</label>
      <label>Foreigners:</label>
      <input
        type="number"
        onChange={(e) => setTicketPricesF(e.target.value)}
        value={ticketPricesF}
      />
      <label>Natives:</label>
      <input
        type="number"
        onChange={(e) => setTicketPricesN(e.target.value)}
        value={ticketPricesN}
      />
      <label>Students:</label>
      <input
        type="number"
        onChange={(e) => setTicketPricesS(e.target.value)}
        value={ticketPricesS}
      />


      <label>Pictures:</label>
      <input
        type="text"
        onChange={(e) => setPictures(e.target.value)}
        value={pictures}
      />

      <label>Tags:</label>
      <input
        type="text"
        onChange={(e) => setTags(e.target.value)}
        value={tags}
      />

      <label>Category:</label>
      <input
        type="text"
        onChange={(e) => setCategory(e.target.value)}
        value={category}
      />

      <label>Governor:</label>
      <input
        type="text"
        onChange={(e) => setGovernor(e.target.value)}
        value={governor}
      />

      <button>Add Historical Location</button>
      <button onClick={updatehistoricallocation}>update</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default HistoricalLocationForm
