const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// helper function(s)
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('The file you have selected is not an image.', 400), false);
    }
};

// to disk
// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/users');
//     },
//     filename: (req, file, cb) => {
//         // user-userid-timestamp.extension
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     },
// });

// in memory
const multerStorage = multer.memoryStorage();

const upload = multer({
    fileFilter: multerFilter,
    storage: multerStorage,
});

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

const resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) {
        next();
    }

    // updateMe expects req.file.filename to be set
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    // image processing
    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);

    next();
});

const updateMe = catchAsync(async (req, res, next) => {
    // create an error if user tries to update password
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates! Please use /updateMyPassword.', 400));
    }

    // filter unwanted properties from the request body
    const filteredBody = filterObj(req.body, 'name', 'email');
    if (req.file) {
        filteredBody.photo = req.file.filename;
    }

    // update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });
    res.status(200).json({
        status: 'success',
        data: { user: updatedUser },
    });
});

const uploadUserPhoto = upload.single('photo');

module.exports = {
    createUser,
    deleteMe,
    deleteUser,
    getAllUsers,
    getMe,
    getUser,
    resizeUserPhoto,
    updateMe,
    updateUser,
    uploadUserPhoto,
};
