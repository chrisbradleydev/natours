const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const { createReview, getAllReviews } = require('../controllers/reviewController');

const router = express.Router();

router.route('/').get(getAllReviews).post(protect, restrictTo('user'), createReview);

module.exports = router;
