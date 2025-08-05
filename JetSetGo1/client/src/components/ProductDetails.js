const ProductDetails = ({product}) => {
    return (
        <div className="Product-Details">
            <h4>{product.name}</h4>
            <p><strong>Description : </strong>{product.description}</p>
            <p><strong>Price: </strong>{product.price}</p>
            <p><strong>Quantity-Available: </strong>{product.quantityAvailable}</p>
            <p><strong>Picture: </strong>{product.picture}</p>
            <p><strong>Seller: </strong>{product.seller}</p>
            <p><strong>Ratings: </strong>{product.ratings}</p>
            <p>{product.createdAt}</p>
        </div>
    )
}

export default ProductDetails