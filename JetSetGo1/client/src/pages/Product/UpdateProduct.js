import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // useParams to get the model and ID from the URL
import ProductListing from './productsPage';

const UpdateProducts = ({usertype}) => {
  const location= useLocation()
  
  // const { id } = useParams(); // Extract the profile ID and model from the URL
  let productId=useParams().id
  const id=location.state.id
  console.log(location.state)
  // Replacing formValues with individual state variables
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantityAvailable, setQuantityAvailable] = useState('');
  const [seller, setSeller] = useState('');
  const [picture, setPicture] = useState('');
  const [ratings, setRatings] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // For navigation after the update

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log(productId);
        const response = await fetch(`/api/${usertype}/getSingleProduct/${productId}`); // Fetch the product data
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch product');
        }
        const data = await response.json();
        console.log(data);
  
        // Assuming data is an array with one element
        const product = data[0]; 
  
        // Set individual state variables with the fetched data
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setQuantityAvailable(product.quantityAvailable);
        setSeller(product.seller);
        setPicture(product.picture);
        setRatings(product.ratings);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, [productId]);
  
  
  // Handle input changes for individual variables
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'price':
        setPrice(value);
        break;
      case 'quantityAvailable':
        setQuantityAvailable(value);
        break;
      case 'seller':
        setSeller(value);
        break;
      case 'picture':
        setPicture(value);
        break;
      case 'ratings':
        setRatings(value);
        break;
      default:
        break;
    }
  };
  console.log(name)
  // Handle form submission to update product
  const handleUpdateProfile = async () => {
    try {
      const updatedProduct = {
        name,
        description,
        price,
        quantityAvailable,
        seller,
        picture,
        ratings,
      };
      const response = await fetch(`/api/${usertype}/product/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update product');
      }

      navigate(`/${usertype}/products`,{state:{id}}); // Redirect back to the products page after a successful update
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="update-Product">
      <h2>Update Your Product</h2>
      <form className="Product-form">
        <div className="form-group">
          <label htmlFor="name">Name <span className="required">*</span></label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleInputChange}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description <span className="required">*</span></label>
          <input
            type="text"
            id="description"
            name="description"
            value={description}
            onChange={handleInputChange}
            placeholder="Enter product description"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price <span className="required">*</span></label>
          <input
            type="number"
            id="price"
            name="price"
            value={price}
            onChange={handleInputChange}
            placeholder="Enter product price"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantityAvailable">Quantity Available <span className="required">*</span></label>
          <input
            type="number"
            id="quantityAvailable"
            name="quantityAvailable"
            value={quantityAvailable}
            onChange={handleInputChange}
            placeholder="Enter quantity available"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="seller">Seller <span className="required">*</span></label>
          <input
            type="text"
            id="seller"
            name="seller"
            value={seller}
            onChange={handleInputChange}
            placeholder="Enter product seller"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="picture">Picture URL <span className="required">*</span></label>
          <input
            type="text"
            id="picture"
            name="picture"
            value={picture}
            onChange={handleInputChange}
            placeholder="Enter product picture URL"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="ratings">Ratings <span className="required">*</span></label>
          <input
            type="number"
            id="ratings"
            name="ratings"
            value={ratings}
            onChange={handleInputChange}
            placeholder="Enter product ratings"
            required
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleUpdateProfile}>Save Changes</button>
          <button type="button" onClick={() => navigate(`../pages/productsPage`)}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProducts;
