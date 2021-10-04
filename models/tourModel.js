const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    description: {
        type: String,
        trim: true,
    },
    difficulty: {
        type: String,
        required: [true, 'tour difficulty required'],
    },
    duration: {
        type: Number,
        required: [true, 'tour duration required'],
    },
    imageCover: {
        type: String,
        required: [true, 'tour cover image required'],
    },
    images: [String],
    maxGroupSize: {
        type: Number,
        required: [true, 'tour max group size required'],
    },
    name: {
        type: String,
        required: [true, 'tour name required'],
        unique: true,
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'tour price required'],
    },
    priceDiscount: {
        type: Number,
    },
    ratingsAverage: {
        type: Number,
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    startDate: [Date],
    summary: {
        type: String,
        trim: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;