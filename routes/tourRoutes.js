const express = require('express');
const authController = require('../controllers/authController');
const tourController = require('../controllers/tourController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// route to review routes
router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(tourController.aliasTop5Cheap, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats);
router
    .route('/monthly-plan/:year')
    .get(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide', 'guide'),
        tourController.getMonthlyPlan,
    );
// /tours-within/400/center/34.111745,-118.113491/unit/mi
router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin);
// /distances/34.111745,-118.113491/unit/mi
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);
router
    .route('/')
    .get(tourController.getAllTours)
    .post(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.createTour);
router
    .route('/:id')
    .get(tourController.getTour)
    .patch(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.uploadTourImages,
        tourController.resizeTourImages,
        tourController.updateTour,
    )
    .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

module.exports = router;
