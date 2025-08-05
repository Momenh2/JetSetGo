import { useState } from 'react'

const Transportationform = () => {
    const [ID, setId] = useState('')
    const [vehicle, setVehicle] = useState('');
    const [carModel, setModel] = useState('');
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [days, setDays] = useState('')
    const [time, setTime] = useState('')
   
    const [capacity, setCapacity] = useState('')
    const [cLocation, setCLocation] = useState('')
    const [price, setPrice] = useState('')
    const [advertiser, setAdvertiser] = useState('')
    const [error, setError] = useState(null)



    const addtransportation = async (e) => {
        e.preventDefault()

        const transport = {
            vehicle: vehicle,
            ...(vehicle === 'car' && { carModel: carModel }),
            ...(vehicle === 'bus' && { bLocation: { pickup, dropoff }, capacity: capacity }),
            days: days,
            time: time,
            ...(vehicle === 'car' && { cLocation: cLocation }),
            price: price,
            advertiser: advertiser
        }

        const response = await fetch('http://localhost:8000/api/advertisers/newTransportation', {
            method: 'POST',
            body: JSON.stringify(transport),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
        }
        if (response.ok) {
            setError(null)
            setId('')
            setModel('')
            setDays('')
            setTime('')
            setCapacity('')
            setVehicle('')
            setPickup('')
            setDropoff('')
            setCLocation('')
            setPrice('')
            setAdvertiser('')
            console.log('new transportation post added:', json)
        }

    }

    const update = async (e) => {
        e.preventDefault()

        const transport = {
            vehicle: vehicle,
            ...(vehicle === 'car' && { carModel: carModel }),
            ...(vehicle === 'bus' && { bLocation: { pickup, dropoff }, capacity: capacity }),
            days: days,
            time: time,
            ...(vehicle === 'car' && { cLocation: cLocation }),
            price: price,
            advertiser: advertiser
        }

        const response = await fetch('http://localhost:8000/api/advertisers/updateTransportation/' + ID, {
            method: 'PATCH',
            body: JSON.stringify(transport),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json()
        if (!response.ok) {
            setError(json.error)
        }
        if (response.ok) {
            setError(null)
            setId('')
            setModel('')
            setDays('')
            setTime('')
            setCapacity('')
            setVehicle('')
            setPickup('')
            setDropoff('')
            setCLocation('')
            setPrice('')
            setAdvertiser('')
            console.log('transportion post updated:', json)
        }
    }

    return (
        <form className="create" onSubmit={addtransportation}>
            <h3>Add a New Transportation Post</h3>

            <label>ID:(for updating bas mashy 5aly balak)</label>
            <input
                type="text"
                onChange={(e) => setId(e.target.value)
                }
                value={ID}
            />

            <label>Vehicle Type: </label>
            <select onChange={(e) => setVehicle(e.target.value)} value={vehicle}>
                <option value="">Select Vehicle Type</option>
                <option value="car">Car</option>
                <option value="bus">Bus</option>
            </select>

            {vehicle === 'car' && (
                <>
                    <label>Car Model: </label>
                    <input
                        type="text"
                        onChange={(e) => setModel(e.target.value)}
                        value={carModel}
                    />
                    <label>Car Location (Region): </label>
                    <input
                        type="text"
                        onChange={(e) => setCLocation(e.target.value)}
                        value={cLocation}
                    />
                    <label>Days Available: </label>
                    <input
                        type="days"
                        onChange={(e) => setDays(e.target.value)}
                        value={days}
                    />

                    <label>Timings Available: </label>
                    <input
                        type="string"
                        onChange={(e) => setTime(e.target.value)}
                        value={time}
                    />
                </>
            )}

            {vehicle === 'bus' && (
                <>
                    <label>Bus Pickup Location: </label>
                    <input
                        type="text"
                        onChange={(e) => setPickup(e.target.value)}
                        value={pickup}
                    />
                    <label>Bus Dropoff Location: </label>
                    <input
                        type="text"
                        onChange={(e) => setDropoff(e.target.value)}
                        value={dropoff}
                    />
                    <label>Bus Capacity: </label>
                    <input
                        type="number"
                        onChange={(e) => setCapacity(e.target.value)}
                        value={capacity}
                    />
                    <label>Departure Day: </label>
                    <input
                        type="days"
                        onChange={(e) => setDays(e.target.value)}
                        value={days}
                    />

                    <label>Departure Time: </label>
                    <input
                        type="string"
                        onChange={(e) => setTime(e.target.value)}
                        value={time}
                    />
                </>
            )}





            <label>Price: </label>
            <input
                type="price"
                onChange={(e) => setPrice(e.target.value)}
                value={price}
            />

            <label>Advertiser ID: </label>
            <input
                type="advertiser"
                onChange={(e) => setAdvertiser(e.target.value)}
                value={advertiser}
            />

            <button>Add Transport</button>
            <button onClick={update}>update</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default Transportationform