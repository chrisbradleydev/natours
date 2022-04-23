const Tour = require('../models/tourModel');
const catchAsyc = require('../utils/catchAsync');

const getIndex = catchAsyc(async (req, res, next) => {
    const tours = await Tour.find();
    res.render('index', {
        title: 'All tours',
        tours,
    });
});

const getTour = (req, res) => {
    res.render('tour', {
        title: 'The Forest Hiker',
    });
};

module.exports = {
    getIndex,
    getTour,
};
