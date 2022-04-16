const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
        validate: [validator.isEmail, 'email must be a valid email'],
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'password field is required'],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'password confirm field is required'],
        validate: {
            // this only works on save and create
            validator: function (el) {
                return el === this.password;
            },
            message: 'password and password confirm must match',
        },
    },
});

userSchema.pre('save', async function (next) {
    // only run this function if password was modified
    if (!this.isModified('password')) {
        return;
    }
    // hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    // delete the passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

// instance method
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
