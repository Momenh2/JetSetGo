import { useState } from 'react'

const Categoryform = () => {
  const [name, setTitle] = useState('')
  const [description, setLoad] = useState('')
  const [error, setError] = useState(null)

  const addcategory = async (e) => {
    e.preventDefault()

    const category = {name: name, description: description}
    
    const response = await fetch('http://localhost:8000/api/admin/create_category', {
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
      setLoad('')
      console.log('new category added:', json)
    }

  }

  const uodate = async (e) => {
    e.preventDefault()

    const category = {name: name, description: description}
    
    const response = await fetch('http://localhost:8000/api/admin/update_category', {
      method: 'PATCH',
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
      setLoad('')
      console.log('category updated:', json)
    }
  }

  return (
    <form className="create" onSubmit={addcategory}> 
      <h3>Add a New category</h3>

      <label>category name:</label>
      <input 
        type="title" 
        onChange={(e) => setTitle(e.target.value)} 
        value={name}
      />

      <label>description:</label>
      <input 
        type="description" 
        onChange={(e) => setLoad(e.target.value)} 
        value={description}
      />

      <button>Add category</button>
      <button onClick={uodate}>update</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default Categoryform