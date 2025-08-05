import { useState } from "react";
// import axios from 'axios'

const ProductForm = ({usertype}) => {
    const [name, setname] = useState('');
    const [description, setdescription] = useState('');
    const [price, setprice] = useState('');
    const [quantityAvailable, setquantity] = useState('');
    const [picture, setpicture] = useState(null); // Change to hold file
    const [seller, setseller] = useState('');
    const [ratings, setratings] = useState('');
    const [error, seterror] = useState(null);

    const handleAddProduct = async (e) => {
        e.preventDefault()
        
        const formData = new FormData(); // Create a FormData object
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('quantityAvailable', quantityAvailable);
        if (picture) {
            formData.append('picture', picture); // Append the file
        }
        formData.append('seller', seller);
        formData.append('ratings', ratings);

        // Adjust the URL based on user type
        const response = await fetch(`/api/admin/createProduct` , {
            method: 'POST',
            body: formData, // Send FormData
        });
       

        const json = await response.json();

        if (!response.ok) {
            seterror(json.error);
        }
        if (response.ok) {
            setname('');
            setdescription('');
            setprice('');
            setquantity('');
            setpicture(null); // Reset the file input
            setseller('');
            setratings('');
            seterror(null);
            console.log('New product added');
        }
    };

    return (
        <form className="create-product" onSubmit={handleAddProduct}>
            <h3>ADD a New Product</h3>
            <label>Product Name</label>
            <input
                type="text"
                onChange={(e) => setname(e.target.value)}
                value={name}
                required
            />
            <label>Product Description</label>
            <input
                type="text"
                onChange={(e) => setdescription(e.target.value)}
                value={description}
                required
            />
            <label>Product Price</label>
            <input
                type="number"
                onChange={(e) => setprice(e.target.value)}
                value={price}
                required
            />
            <label>Product Quantity Available</label>
            <input
                type="number"
                onChange={(e) => setquantity(e.target.value)}
                value={quantityAvailable}
                required
            />
            <label>Product Picture</label>
            <input
                type="file" // Change to file input
                accept="image/*" // Optional: only accept image files
                onChange={(e) => setpicture(e.target.files[0])} // Get the first selected file
                required
            />
            {console.log(picture)}
            
            <label>Product Seller</label>
            <input
                type="text"
                onChange={(e) => setseller(e.target.value)}
                value={seller}
                required
            />
            <label>Product Ratings</label>
            <input
                type="number"
                onChange={(e) => setratings(e.target.value)}
                value={ratings}
            />
            <button type="submit" onClick={handleAddProduct}>Add Product</button>
            {error && <div className="error">{error}</div>}
        </form>
    );
};

export default ProductForm;
