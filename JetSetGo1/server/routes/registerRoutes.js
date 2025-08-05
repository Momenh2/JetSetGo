const express = require('express');
const {registerTourist,registerTourGuide,registerAdvertiser, registerSeller,uploadDoc } = require('../controllers/RegisterController');
const router = express.Router();

// Guest Registration
router.post('/registerTourist',registerTourist );
router.post('/registerTourGuide', uploadDoc.array('documents'), registerTourGuide);
router.post('/registerAdvertiser', uploadDoc.array('documents'), registerAdvertiser);
router.post('/registerSeller', uploadDoc.array('documents'), registerSeller);



module.exports = router;
