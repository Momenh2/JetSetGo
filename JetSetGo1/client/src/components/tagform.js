import { useState } from 'react'

const Tagform = () => {
  const [name, setTitle] = useState('')
  const [description, setLoad] = useState('')
  const [error, setError] = useState(null)

  const addtag = async (e) => {
    e.preventDefault()

    const tag = {tag_name: name, description: description}
    
    const response = await fetch('http://localhost:8000/api/admin/createtag', {
      method: 'POST',
      body: JSON.stringify(tag),
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
      console.log('new tag added:', json)
    }

  }

  const uodate = async (e) => {
    e.preventDefault()

    const tag = {tag_name: name, description: description}
    
    const response = await fetch('http://localhost:8000/api/admin/updatetag', {
      method: 'PATCH',
      body: JSON.stringify(tag),
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
      console.log('tag updated:', json)
    }
  }

  return (
    <form className="create" onSubmit={addtag}> 
      <h3>Add a New tag</h3>

      <label>Tag name:</label>
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

      <button>Add Tag</button>
      <button onClick={uodate}>update</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default Tagform