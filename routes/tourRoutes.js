const express = require('express');
const { protect } = require('../controllers/authController');
const {
    aliasTop5Cheap,
    createTour,
    deleteTour,
    getAllTours,
    getMonthlyPlan,
    getTour,
    getTourStats,
    updateTour,
} = require('../controllers/tourController');

const router = express.Router();

router.route('/top-5-cheap').get(aliasTop5Cheap, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/').get(protect, getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
