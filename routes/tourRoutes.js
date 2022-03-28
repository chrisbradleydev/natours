const express = require('express');
const {
    aliasTop5Cheap,
    createTour,
    deleteTour,
    getAllTours,
    getTour,
    updateTour,
} = require('../controllers/tourController');

const router = express.Router();

router.route('/top-5-cheap').get(aliasTop5Cheap, getAllTours);
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
