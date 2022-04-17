const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// route middleware
const aliasTop5Cheap = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = 'price,-ratingsAverage';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

const createTour = factory.createOne(Tour);
const deleteTour = factory.deleteOne(Tour);
const getAllTours = factory.getAll(Tour);
const getTour = factory.getOne(Tour, { path: 'reviews' });
const updateTour = factory.updateOne(Tour);

const getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' },
            },
        },
        {
            $addFields: { month: '$_id' },
        },
        {
            $project: {
                _id: 0,
            },
        },
        {
            $sort: { numTourStarts: -1 },
        },
        {
            $limit: 12,
        },
    ]);

    res.status(200).json({
        status: 'success',
        data: { plan },
    });
});

const getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } },
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                avgPrice: { $avg: '$price' },
                avgRating: { $avg: '$ratingsAverage' },
                maxPrice: { $max: '$price' },
                minPrice: { $min: '$price' },
                numRatings: { $sum: 1 },
                numTours: { $sum: 1 },
            },
        },
        {
            $sort: { avgPrice: 1 },
        },
    ]);

    res.status(200).json({
        status: 'success',
        data: { stats },
    });
});

module.exports = {
    aliasTop5Cheap,
    createTour,
    deleteTour,
    getAllTours,
    getMonthlyPlan,
    getTour,
    getTourStats,
    updateTour,
};
