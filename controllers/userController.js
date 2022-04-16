const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: '',
    });
};

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

const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: '',
    });
};

module.exports = {
    createUser,
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
};
