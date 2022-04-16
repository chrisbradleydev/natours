const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};

const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: '',
    });
};

const deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
        status: 'success',
        data: null,
    });
});

const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: '',
    });
};

const getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: { users },
    });
});

const getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: '',
    });
};

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

const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: '',
    });
};

module.exports = {
    createUser,
    deleteMe,
    deleteUser,
    getAllUsers,
    getUser,
    updateMe,
    updateUser,
};
