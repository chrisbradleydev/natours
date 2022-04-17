const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        review: {
            type: String,
            required: [true, 'review is required'],
        },
        tour: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Tour',
                required: [true, 'review must belong to a tour'],
            },
        ],
        user: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: [true, 'review must belong to a user'],
            },
        ],
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

// query middleware
reviewSchema.pre(/^find/, function (next) {
    this.populate([
        { path: 'tour', select: 'name' },
        { path: 'user', select: 'name photo' },
    ]);
    next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
