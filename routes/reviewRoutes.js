const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

// protect all routes after this middleware
router.use(authController.protect);

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(authController.restrictTo('user'), reviewController.setTourAndUserIds, reviewController.createReview);
router
    .route('/:id')
    .get(reviewController.getReview)
    .patch(authController.restrictTo('admin', 'user'), reviewController.updateReview)
    .delete(authController.restrictTo('admin', 'user'), reviewController.deleteReview);

module.exports = router;
