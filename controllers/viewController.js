const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsyc = require('../utils/catchAsync');

const getIndex = catchAsyc(async (req, res, next) => {
    const tours = await Tour.find();
    res.render('index', {
        title: 'All tours',
        tours,
    });
});

const getTour = catchAsyc(async (req, res, next) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'rating review user',
    });

    if (!tour) {
        return next(new AppError('There is no tour with that name.', 404));
    }

    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour,
    });
});

module.exports = {
    getIndex,
    getTour,
};
