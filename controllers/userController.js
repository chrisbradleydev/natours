const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// helper function
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};

// route middleware
const getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

const deleteUser = factory.deleteOne(User);
const getAllUsers = factory.getAll(User);
const getUser = factory.getOne(User);
// do not update passwords with this method
const updateUser = factory.updateOne(User);

const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined! Please use /signup instead.',
    });
};

const deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
        status: 'success',
        data: null,
    });
});

const updateMe = catchAsync(async (req, res, next) => {
    // create an error if user tries to update password
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates! Please use /updateMyPassword.', 400));
    }

    // filter unwanted properties from the request body
    const filteredBody = filterObj(req.body, 'name', 'email');

    // update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });
    res.status(200).json({
        status: 'success',
        data: { user: updatedUser },
    });
});

module.exports = {
    createUser,
    deleteMe,
    deleteUser,
    getAllUsers,
    getMe,
    getUser,
    updateMe,
    updateUser,
};
