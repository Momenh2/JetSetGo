const { default: mongoose } = require('mongoose');
const Museum = require('../models/MuseumModel');
const HistoricalTag = require('../models/HistoricalTagModel');
const HistoricalLocation = require('../models/HistoricalLocationModel')




// // Create Museum
// const createMuseum = async (req, res) => {
//   const {name, description, location, openingHours, ticketPrices, pictures, tags, category,governor } = req.body;

//   try {
//     const newMuseum = await Museum.create({ name, description, location, openingHours, ticketPrices, pictures,tags, category, governor });
//     res.status(201).json(newMuseum);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// // Read Museum
// const getMuseum = async (req, res) => {
// // const { id } = req.params;

//   try {
//     const MuseumProfile = await Museum.find();
//     res.status(200).json(MuseumProfile);
//   } catch (err) {
//     res.status(404).json({ error: 'Museum not found' });
//   }
// };

// // Update Museum 
// const updateMuseum = async (req, res) => {
//   const { id } = req.params;
//   const updates = req.body;

//   try {
//     const updatedMuseum = await Museum.findByIdAndUpdate(id, updates, { new: true });
//     res.status(200).json(updatedMuseum);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// //Delete Museum
// const deleteMuseum = async (req, res) => {
//   const { id } = req.params;

//   try {
//       const deletedMuseum = await Museum.findByIdAndDelete(id);
      
//       if (!deletedMuseum) {
//           return res.status(404).json({ message: 'Museum not found' });
//       }
      
//       res.status(200).json({ message: 'Museum deleted successfully' });
//   } catch (err) {
//       res.status(500).json({ error: err.message });
//   }
// };



// Create Historical Location
const createHistoricalLocation = async (req, res) => {
  const {name, description, location, openingHours, ticketPrices, tags, category, governor } = req.body;

  try {
    const newHistoricalLocation = await HistoricalLocation.create({ name, description, location, openingHours, ticketPrices, tags, category, governor});
    res.status(201).json(newHistoricalLocation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read Historical Location
const getHistoricalLocation = async (req, res) => {
// const { id } = req.params;

  try {
    const HistoricalLocationProfile = await HistoricalLocation.find();
    res.status(200).json(HistoricalLocationProfile);
  } catch (err) {
    res.status(404).json({ error: 'Historical Location not found' });
  }
};

// Update Historical Location 
const updateHistoricalLocation = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedHistoricalLocation = await HistoricalLocation.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json(updatedHistoricalLocation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//Delete Historical Location
const deleteHistoricalLocation = async (req, res) => {
  const { id } = req.params;

  try {
      const deletedHistoricalLocation = await HistoricalLocation.findByIdAndDelete(id);
      
      if (!deletedHistoricalLocation) {
          return res.status(404).json({ message: 'Historical Location not found' });
      }
      
      res.status(200).json({ message: 'Historical Location deleted successfully' });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

const getAllTags = async (req, res) => {
  try {
    const tags = await HistoricalTag.find();
    res.status(200).json(tags);
  } catch (err) {
    res.status(404).json({ error: 'Tags not found' });
  }
};

// Create a tag
const createTag = async (req, res) => {
    const {type, historicalPeriod} = req.body;
  
    try {
      const newTag = await HistoricalTag.create({ type, historicalPeriod});
      res.status(201).json(newTag);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };


//Read my Museums and Historical Locations
  const showMyHistoricalPlaces = async(req,res) => {
   

    const {id} =  req.params;

    try{
      //const Museums = await Museum.find({governor:(govId)})
      console.log(id);
      const HistoricalLocations =await HistoricalLocation.find({governor:id})
      //const result = {Museums,HistoricalLocations}
      res.status(200).json(HistoricalLocations)
    }catch{
      res.status(400).json({error:"Id is required"})
    }


}
  


module.exports = { /*createMuseum, getMuseum, updateMuseum, deleteMuseum,*/ createHistoricalLocation, getHistoricalLocation, updateHistoricalLocation, deleteHistoricalLocation, createTag, showMyHistoricalPlaces,getAllTags};