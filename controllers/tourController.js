const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

const aliasTop5Cheap = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = 'price,-ratingsAverage';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

const createTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        data: { tour },
    });
});

const deleteTour = catchAsync(async (req, res, next) => {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

const getAllTours = catchAsync(async (req, res, next) => {
    // construct query using APIFeatures class
    const features = new APIFeatures(Tour.find(), req.query).filter().limit().paginate().sort();
    const tours = await features.query;
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: { tours },
    });
});

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

const getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: { tour },
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

const updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(201).json({
        status: 'success',
        data: { tour },
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
