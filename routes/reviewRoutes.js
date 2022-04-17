const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const {
    createReview,
    deleteReview,
    getAllReviews,
    getReview,
    setTourAndUserIds,
    updateReview,
} = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router.route('/').get(getAllReviews).post(protect, restrictTo('user'), setTourAndUserIds, createReview);
router.route('/:id').get(getReview).patch(updateReview).delete(deleteReview);

module.exports = router;
