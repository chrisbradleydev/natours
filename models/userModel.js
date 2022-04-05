const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name field is required'],
    },
    email: {
        type: String,
        required: [true, 'email field is required'],
        unique: true,
        lowercase: true,
        valudate: [validator.isEmail, 'email must be a valid email'],
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'password field is required'],
        minlength: 8,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'password confirm field is required'],
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
