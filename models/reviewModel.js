const mongoose = require('mongoose');
const Tour = require('./tourModel');

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
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: [true, 'review must belong to a tour'],
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'review must belong to a user'],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

// compound index, each user can only review a tour once
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// statics are used to create methods on the model
reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        { $match: { tour: tourId } },
        {
            $group: {
                _id: '$tour',
                numRating: { $sum: 1 },
                avgRating: { $avg: '$rating' },
            },
        },
    ]);
    // console.log(stats);

    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: stats[0].avgRating,
            ratingsQuantity: stats[0].numRating,
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: 4.5,
            ratingsQuantity: 0,
        });
    }
};

// document middleware, runs before .save() and .create()
// use post instead of pre because we want to run after the review has been saved
reviewSchema.post('save', function () {
    // this points to the current review
    this.constructor.calcAverageRatings(this.tour);
});

// query middleware
reviewSchema.pre(/^find/, function (next) {
    this.populate([
        // { path: 'tour', select: 'name' },
        { path: 'user', select: 'name photo' },
    ]);
    next();
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
    // get and set the document using clone, document will be used in post
    // @see https://mongoosejs.com/docs/migrating_to_6.html#duplicate-query-execution
    this.tempReview = await this.findOne().clone();
    // console.log(this.tempReview);
    next();
});

reviewSchema.post(/^findOneAnd/, async function () {
    // after the document has been updated, calculate the new average
    await this.tempReview.constructor.calcAverageRatings(this.tempReview.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
