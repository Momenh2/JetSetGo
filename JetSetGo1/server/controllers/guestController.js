//const Guest = require('../models/GuestModel'); // Assuming the Guest model covers all user types
const Itinerary = require('../models/ItineraryModel');
const Activity = require('../models/AdvertiserActivityModel');
const Museum = require('../models/MuseumModel');
const HistoricalLocation = require('../models/HistoricalLocationModel');


// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find(); // Retrieve all categories
    res.status(200).json(categories); // Send categories as JSON
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching categories' });
  }
};

// Fetch activities by category
const getActivitiesByCategory = async (req, res) => {
  const { categoryId } = req.params; // Extract category ID from the request params

  try {
    // Query activities where the category matches the provided categoryId
    const activities = await Activity.find({ category: categoryId }).populate(
      "category"
    ); // Optionally populate category details

    if (activities.length === 0) {
      return res
        .status(404)
        .json({ error: "No activities found for this category" });
    }

    res.status(200).json(activities);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching activities" });
  }
};

//Seach Itinerary by budget
const searchItineraryByBudget = async (req,res) =>{
  const budget = req.body
  try{
    const itinerary = await Itinerary.find()
    if (itinerary.length === 0) {
      return res.status(404).json({ error: "No itineraries found within this budget" });
    }
    const result = itinerary.filter(el => el.price <= budget.price)

    res.status(200).json(result)
  }
  catch(error){
    res.status(500).json({ error: "An error occurred while searching for itineraries" });
  }
};

//Search Itinerary By date

const searchItineraryByDate = async (req, res) => {
  const { availableDates } = req.body; // Extracting availableDates from request body

  try {
      // Extract the date from the availableDates array (it should match any of the dates in the DB)
      const searchDate = new Date(availableDates[0].date);  // Assuming the request contains one date

      // Find all itineraries where any availableDates in the array matches the search date
      const itineraries = await Itinerary.find({
          'availableDates.date': searchDate  // Check all availableDates in each itinerary
      });

      if (itineraries.length === 0) {
          return res.status(404).json({ error: "No itineraries found for the given date" });
      }

      res.status(200).json(itineraries);
  } catch (error) {
      res.status(500).json({ error: "An error occurred while searching for itineraries" });
  }
};

//Search Itinerary By Language
const searchItineraryByLanguage = async (req,res) =>{
    const languageReq = req.body
    try{
      const itinerary = await Itinerary.find(languageReq)
      if (itinerary.length === 0) {
        return res.status(404).json({ error: "No itineraries found" });
      }
      res.status(200).json(itinerary)
    }
    catch(error){
      res.status(404).json({error:"Itinerary not found"})
    }
};

//Seach Activity by category 
const searchActivityByCategory = async (req,res) =>{
  const categoryName = req.body
  try{
    const activty = await Activity.find(categoryName)
    if (activty.length === 0) {
      return res.status(404).json({ error: "No activties found" });
    }
    res.status(200).json(activty)
  }
  catch(error){
    res.status(404).json({error:"Activity not found"})
  }
};

//Seach Activity by date 
const searchActivityByDate = async (req,res) =>{
  const dateReq = req.body
  try{
    const activty = await Activity.find(dateReq)
    if (activty.length === 0) {
      return res.status(404).json({ error: "No activties found" });
    }
    res.status(200).json(activty)
  }
  catch(error){
    res.status(404).json({error:"Activity not found"})
  }
};

//Seach Activity by rating 
const searchActivityByRating = async (req,res) =>{
  const ratingReq = req.body
  try{
    const activty = await Activity.find(ratingReq)
    if (activty.length === 0) {
      return res.status(404).json({ error: "No activties found" });
    }
    res.status(200).json(activty)
  }
  catch(error){
    res.status(404).json({error:"Activity not found"})
  }
};

//Seach Activity by budget
const searchActivityByBudget = async (req,res) =>{
  const budget = req.body
  
  try{
    const activty = await Activity.find()
    if (activty.length === 0) {
      return res.status(404).json({ error: "No activties found" });
    }
    const result = activty.filter(el => el.price <= budget.price)

    res.status(200).json(result)
  }
  catch(error){
    res.status(404).json({error:"Activity not found"})
  }
};

//Search Itinerary By tag
const searchItineraryByTag = async (req, res) => {
  const { tagId } = req.body;  // Extract tagId from the request body (already an ObjectId)

  try {
    // Step 1: Find itineraries that have the tagId in their tags array
    const itineraries = await Itinerary.find({ tags: tagId }).populate('tags');  // Optional: populate 'tags' to return tag details

    if (itineraries.length === 0) {
      return res.status(404).json({ error: "No itinerary found for this tag" });
    }

    // Step 2: Return the list of itineraries
    res.status(200).json(itineraries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while searching for itineraries" });
  }
};

const getUpcomingActivities = async (req, res) => {
  try {
    const currentDate = new Date(); // Get the current date
    const upcomingActivities = await Activity.find({
      date: { $gte: currentDate } // Find activities with a date greater than or equal to the current date
    });

    res.status(200).json(upcomingActivities);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const sortActivityByPrice = async (req, res) => {
  try {
    const currentDate = new Date(); // Get the current date
    const sortedActivityByPrice = await Activity.find({
      date: { $gte: currentDate } // Find activities with a date greater than or equal to the current date
    }).sort({price: 1});
    res.status(200).json(sortedActivityByPrice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const sortActivityByRating = async (req, res) => {
  try {
    const currentDate = new Date(); // Get the current date
    const sortedActivityByRating = await Activity.find({
      date: { $gte: currentDate } // Find activities with a date greater than or equal to the current date
    }).sort({rating: 1});
    res.status(200).json(sortedActivityByRating);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getUpcomingItineraries = async (req, res) => {
  try {
    const currentDate = new Date(); // Get the current date

    const upcomingItineraries = await Itinerary.find({
      availableDates: {
        $elemMatch: {
          date: { $gte: currentDate } // Check if at least one date is greater than or equal to the current date
        }
      }
    });

    res.status(200).json(upcomingItineraries);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const sortItineraryByPrice = async (req, res) => {
  try {
    const currentDate = new Date(); // Get the current date
    const sortedItineraryByPrice = await Itinerary.find({
      availableDates: {
        $elemMatch: {
          date: { $gte: currentDate } // Check if at least one date is greater than or equal to the current date
        }
      }
    }).sort({price: 1});
    res.status(200).json(sortedItineraryByPrice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const sortItineraryByRating = async (req, res) => {
  try {
    const currentDate = new Date(); // Get the current date
    const sortedItineraryByRating = await Itinerary.find({
      availableDates: {
        $elemMatch: {
          date: { $gte: currentDate } // Check if at least one date is greater than or equal to the current date
        }
      }
    }).sort({rating: 1});
    res.status(200).json(sortedItineraryByRating);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getMuseums = async (req, res) => {
  try {
    const museum = await Museum.find();
    res.status(200).json(museum);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const filterMuseumsByTag = async (req, res) => {
  try {
    const { id } = req.params;

    // Query museums where the tags array contains the given tagId
    const museums = await Museum.find({ tags: id });

    if (museums.length === 0) {
      return res.status(404).json({ message: 'No museums found with the given tag' });
    }

    res.status(200).json(museums);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getHistoricalLocations = async (req, res) => {
  try {
    const historicalLocation = await HistoricalLocation.find();
    res.status(200).json(historicalLocation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const filterHistoricalLocationsByTag = async (req, res) => {
  try {
    const { id } = req.params;
    // Query historical locations where the tags array contains the given tagId
    const historicalLocations = await HistoricalLocation.find({ tags: id });

    if (historicalLocations.length === 0) {
      return res.status(404).json({ message: 'No historical locations found with the given tag' });
    }

    res.status(200).json(historicalLocations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {searchActivityByBudget,searchActivityByDate,searchActivityByCategory,searchActivityByRating,searchItineraryByTag, 
  searchItineraryByDate, searchItineraryByBudget, searchItineraryByLanguage, getUpcomingActivities, sortActivityByPrice, sortActivityByRating, getUpcomingItineraries,
   sortItineraryByPrice, sortItineraryByRating, getMuseums, filterMuseumsByTag, getHistoricalLocations, filterHistoricalLocationsByTag,getActivitiesByCategory,getCategories};