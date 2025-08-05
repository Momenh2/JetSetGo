import { useState } from 'react'

const HLTagform = ({id}) => {
    const [type, setType] = useState('')
    const [historicalPeriod, sethistoricalPeriod] = useState('')
    const [error, setError] = useState(null)

    const addhltag = async (e) => {
        e.preventDefault()

        const hltag = { type: type, historicalPeriod: historicalPeriod }

        const response = await fetch('http://localhost:8000/api/tourism-governer/newTag', {
            method: 'POST',
            body: JSON.stringify(hltag),
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
            setType('')
            sethistoricalPeriod('')
            console.log('new historical tag added:', json)
        }

    }



    return (
        <form className="create" onSubmit={addhltag}>
            <h3>Add a New tag</h3>

            <label>Type:</label>
            <select onChange={(e) => setType(e.target.value)} value={type}>
                <option value="">Select Type</option>
                <option value="Monuments">Monuments</option>
                <option value="Museums">Museums</option>
                <option value="Religious Sites">Religious Sites</option>
                <option value="Palaces/Castles">Palaces/Castles</option>
            </select>

            <label>Historical Period:</label>
            <input
                type="historicalPeriod"
                onChange={(e) => sethistoricalPeriod(e.target.value)}
                value={historicalPeriod}
            />

            <button>Add Tag</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default HLTagform