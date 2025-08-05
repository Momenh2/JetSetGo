const express = require('express');
const { searchActivityByBudget,searchActivityByDate, searchActivityByRating,searchActivityByCategory, searchItineraryByTag,
searchItineraryByDate, searchItineraryByBudget, searchItineraryByLanguage,getUpcomingActivities, sortActivityByPrice,
 sortActivityByRating, getUpcomingItineraries, sortItineraryByPrice, sortItineraryByRating, getMuseums,
  filterMuseumsByTag, getHistoricalLocations, filterHistoricalLocationsByTag ,getActivitiesByCategory,getCategories} = require('../controllers/guestController');
const router = express.Router();


router.post('/searchActivityByRating',searchActivityByRating);
router.post('/searchActivityByDate',searchActivityByDate);
router.post('/searchActivityByCategory',searchActivityByCategory);
router.post('/searchActivityByBudget',searchActivityByBudget);

router.post('/searchItineraryByDate',searchItineraryByDate);
router.post('/searchItineraryByBudget',searchItineraryByBudget);
router.post('/searchItineraryByLanguage',searchItineraryByLanguage);
router.post('/searchItineraryByTag',searchItineraryByTag);




//choose category of activities
router.get("/activities/category/:categoryId", getActivitiesByCategory);

// Route to get all categories
router.get('/categories', getCategories);

router.get('/getUpcomingActivities', getUpcomingActivities);
router.get('/sortActivityByPrice', sortActivityByPrice);
router.get('/sortActivityByRating', sortActivityByRating);
router.get('/getUpcomingItineraries',getUpcomingItineraries);
router.get('/sortItineraryByPrice', sortItineraryByPrice);
router.get('/sortItineraryByRating', sortItineraryByRating);
router.get('/getMuseums', getMuseums);
router.get('/filterMuseumsByTag/:id', filterMuseumsByTag);
router.get('/getHistoricalLocations', getHistoricalLocations);
router.get('/filterHistoricalLocationsByTag/:id', filterHistoricalLocationsByTag);

module.exports = router;
