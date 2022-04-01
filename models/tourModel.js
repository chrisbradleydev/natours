const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
    {
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false,
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
        secretTour: {
            type: Boolean,
            default: false,
        },
        slug: String,
        startDates: [Date],
        summary: {
            type: String,
            trim: true,
        },
        updatedAt: {
            type: Date,
            default: Date.now(),
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

// document middleware, runs before .save() and .create()
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// tourSchema.post('save', (doc, next) => {
//     console.log(doc);
//     next();
// });

// query middleware
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    next();
});

tourSchema.post(/^find/, function (docs, next) {
    console.log(`query took ${Date.now() - this.start} milliseconds`);
    next();
});

// aggregate middleware
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
