const express = require('express');
const {
    checkBody,
    checkId,
    createTour,
    deleteTour,
    getAllTours,
    getTour,
    updateTour,
} = require('../controllers/tourController');

const router = express.Router();

router.param('id', checkId);
router.route('/').get(getAllTours).post(checkBody, createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
