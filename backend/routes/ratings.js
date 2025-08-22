const express = require('express');
const { submitRating, getStoreRatings } = require('../controllers/ratingController');
const { auth, storeOwnerAuth } = require('../middleware/auth');
const { validateRating } = require('../middleware/validation');

const router = express.Router();

router.post('/', auth, validateRating, submitRating);
router.get('/store/:store_id', auth, storeOwnerAuth, getStoreRatings);

module.exports = router;