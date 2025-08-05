import { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import "./addproduct.css";
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie


const ProductForm = ({usertype}) => {
    const token = Cookies.get("auth_token");
    const decodedToken = jwtDecode(token);
    const id = decodedToken.id;
    const modelName = decodedToken.userType;
    
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
        formData.append('seller', id);
        formData.append('ratings', ratings);

        // Adjust the URL based on user type
        
        const response = await fetch(`/api/${usertype}/createProduct` , {
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

        const navigate = useNavigate();
      
        const handleBack = () => {
          // Navigate to the specific path (replace '/specific-path' with your desired path)
          navigate('/Seller/products');
        };

    return (
        <form className="create-product" onSubmit={handleAddProduct}>
            <h3 className="titleheaded"> ADD a New Product</h3>
            <label className="descriptionofproduct">Product Name</label>
            <input
                type="text" placeholder="Enter Product Name"
                className="picturetaken"
                onChange={(e) => setname(e.target.value)}
                value={name}
                required
            />
            <label className="descriptionofproduct">Product Description</label>
            <input
                type="text" placeholder="Enter Product Description"
                className="picturetaken"
                onChange={(e) => setdescription(e.target.value)}
                value={description}
                required
            />
            <label className="descriptionofproduct">Product Price</label>
            <input
                type="number" placeholder="Enter Product Price"
                className="picturetaken"
                onChange={(e) => setprice(e.target.value)}
                value={price}
                required
            />
            <label className="descriptionofproduct">Product Quantity Available</label>
            <input
                type="number" placeholder="Enter Product Quantity Available"
                className="picturetaken"
                onChange={(e) => setquantity(e.target.value)}
                value={quantityAvailable}
                required
            />
            <label className="descriptionofproduct">Product Picture</label>
            <input
                type="file" // Change to file input
                accept="image/*" // Optional: only accept image files
                className="picturetaken"
                onChange={(e) => setpicture(e.target.files[0])} // Get the first selected file
                required
            />
            {/* Image preview */}
            {picture && (
                <div className="image-preview">
                    <img 
                        src={URL.createObjectURL(picture)} 
                        alt="Preview" 
                        className="product-image2" 
                    />
                </div>
            )}
            {console.log(picture)}
            
            {/* <label>Product Seller</label> */}
            {/* <input
                type="text" placeholder="Enter Product Seller_Id"
                onChange={(e) => setseller(e.target.value)}
                value={seller}
                required
            /> */}
            {/* <label>Product Ratings</label>
            <input
                type="number" placeholder="Enter Product Description"
                onChange={(e) => setratings(e.target.value)}
                value={ratings}
            /> */}
            <div className="buuttons"> 
                <button className="buttonadd" type="cancel" onClick={handleBack}  style={{ backgroundColor: 'red', color: 'white' }}>
                    Cancel
                </button>
                <button className="buttonadd" type="submit" onClick={handleAddProduct}>Add Product</button>
            </div>
            {error && alert({error})}
        </form>
    );
};

export default ProductForm;