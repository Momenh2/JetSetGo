const mongoose= require('mongoose')
const Product= require('../models/Product')


// get all products
const getProducts= async (req,res) => {
    const products = await Product.find({}).sort({createdAt: -1})
    res.status(200).json(products)
}

const getSingleProduct= async (req,res) => {
    const {id}= req.params

    const product = await Product.findById(id)
    res.status(200).json(product)
}

// Add new product
const createProduct = async (req, res) =>{
    const {name, description, price, quantityAvailable, picture, seller, ratings} = req.body

    try{
        const product= await Product.create({name, description, price, quantityAvailable, seller, picture,ratings})
        res.status(200).json(product)
    } catch(error){
        res.status(400).json({error: error.message})
    }

    res.json({mssg: 'added a new product'})
}

//  update a product
const updateProduct = async (req, res) =>{
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such product'})
    }

    const product = await Product.findOneAndUpdate({_id:id},{
        ...req.body
    })

    if(!product){
        return res.status(404).json({error:'No such product'})
    }

    res.status(200).json(product)
}

const filterProducts = async(req,res) => {
    
    const{min, max}= req.body

    try{
        const query = {
            price: {
              $gte: min, // Greater than or equal to minPrice
              $lte: max, // Less than or equal to maxPrice
            },
          };
        const products = await Product.find(query)
        res.status(200).json(products)
    } catch(error){
        res.status(400).json({error: error.message})
    }
}

const sortByRate = async(req,res) => {
    const{flag}=req.body
    try {
        // Get sorted products by ratings in descending order
        const products = await Product.find().sort({ ratings: flag }); // Change to 1 for ascending order and -1 for desc
    
        res.status(200).json(products); // Send the sorted products as JSON
      } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching products');
      }
}

const searchProductName = async(req,res) => {

    const { name } = req.body;
    
    
    try{
        // Use RegEx to match the substring in the product's name (case-insensitive)
        const productname = await Product.find({name: { $regex: name, $options: 'i' }})
        res.status(200).json(productname)
    }catch(error){
        res.status(400).json({error:error.message})
    }

}
module.exports = {getProducts, createProduct, updateProduct, filterProducts, sortByRate, searchProductName,getSingleProduct}