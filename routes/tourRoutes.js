const express = require('express');
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

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/top-5-cheap').get(aliasTop5Cheap, getAllTours);
router.route('/tour-stats').get(getTourStats);

module.exports = router;
