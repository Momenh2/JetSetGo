const express = require('express');
const {createHistoricalLocation, 
    getHistoricalLocation, updateHistoricalLocation, deleteHistoricalLocation, createTag, showMyHistoricalPlaces,getAllTags} = require('../controllers/tourismGovernerController');
const router = express.Router();


const { changePassword } = require("../controllers/PasswordController");
router.patch("/change-password/:id/:modelName", changePassword);


// router.post('/newMuseum', createMuseum )
// router.get('/showMuseum', getMuseum )
// router.patch('/updateMuseum/:id', updateMuseum)
// router.delete('/deleteMuseum/:id', deleteMuseum )

router.post('/newHL', createHistoricalLocation )
router.get('/showHL', getHistoricalLocation )
router.patch('/updateHL/:id', updateHistoricalLocation )
router.delete('/deleteHL/:id', deleteHistoricalLocation )



router.post('/newTag', createTag )
router.get('/tags', getAllTags);


router.get('/showAll/:id', showMyHistoricalPlaces )

module.exports = router;