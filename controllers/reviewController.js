const Review = require('../models/reviewModel');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// route middleware
const setTourAndUserIds = (req, res, next) => {
    // allow nested routes
    if (!req.body.tour) {
        req.body.tour = req.params.tourId;
    }
    if (!req.body.user) {
        req.body.user = req.user.id;
    }
    next();
};

const createReview = factory.createOne(Review);
const deleteReview = factory.deleteOne(Review);
const getAllReviews = factory.getAll(Review);
const getReview = factory.getOne(Review);
const updateReview = factory.updateOne(Review);

module.exports = {
    createReview,
    deleteReview,
    getAllReviews,
    getReview,
    setTourAndUserIds,
    updateReview,
};
