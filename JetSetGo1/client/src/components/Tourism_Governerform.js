import { useState } from 'react'

const Tourism_Governerform = () => {
    const [username, setTitle] = useState('')
    const [password, setpassword] = useState('')
    const [email, setmail] = useState('')
    const [error, setError] = useState(null)

    const addcategory = async (e) => {
        e.preventDefault()

        const category = { username: username, password: password, email: email }

        const response = await fetch('http://localhost:8000/api/admin/create_tourism_governer', {
            method: 'POST',
            body: JSON.stringify(category),
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
            setTitle('')
            setpassword('')
            setmail('')
            console.log('new Tourism_Governer added:', json)
        }

    }



    return (
        <form className="create" onSubmit={addcategory}>
            <h3>Add new Tourism Governer</h3>

            <label>username:</label>
            <input
                type="username"
                onChange={(e) => setTitle(e.target.value)}
                value={username}
            />

            <label>password:</label>
            <input
                type="password"
                onChange={(e) => setpassword(e.target.value)}
                value={password}
            />

            <label>mail:</label>
            <input
                type="email"
                onChange={(e) => setmail(e.target.value)}
                value={email}
            />

            <button>Add category</button>
            {/* <button onClick={uodate}>update</button> */}
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default Tourism_Governerform