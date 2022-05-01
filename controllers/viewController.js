const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsyc = require('../utils/catchAsync');

const getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Account',
    });
};

const getIndex = catchAsyc(async (req, res, next) => {
    const tours = await Tour.find();
    res.status(200).render('index', {
        title: 'All tours',
        tours,
    });
});

const getLoginForm = catchAsyc(async (req, res, next) => {
    res.status(200).render('login', {
        title: 'Log in',
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

const updateUserData = catchAsyc(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: req.body.name,
            email: req.body.email,
        },
        {
            new: true,
            runValidators: true,
        },
    );
    res.status(200).render('account', {
        title: 'Account',
        user: updatedUser,
    });
});

module.exports = {
    getAccount,
    getIndex,
    getLoginForm,
    getTour,
    updateUserData,
};
