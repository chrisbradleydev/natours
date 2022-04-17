const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

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
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'difficulty is either easy, medium or difficult',
            },
        },
        duration: {
            type: Number,
            required: [true, 'tour duration required'],
        },
        guides: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
            },
        ],
        imageCover: {
            type: String,
            required: [true, 'tour cover image required'],
        },
        images: [String],
        locations: [
            {
                type: {
                    type: String,
                    default: 'Point',
                    enum: ['Point'],
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number,
            },
        ],
        maxGroupSize: {
            type: Number,
            required: [true, 'tour max group size required'],
        },
        name: {
            type: String,
            required: [true, 'tour name required'],
            unique: true,
            trim: true,
            maxlength: [40, 'tour name must be less than or equal to 40 characters'],
            minlength: [10, 'tour name must be greater than or equal to 10 characters'],
            // validate: [validator.isAlpha, 'tour name must only contain characters'],
        },
        price: {
            type: Number,
            required: [true, 'tour price required'],
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    // this only points to current doc on new document creation
                    return val < this.price;
                },
                message: 'discount price ({VALUE}) must be less than the regular price',
            },
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            max: [5, 'tour rating must be less than or equal to 5.0'],
            min: [1, 'tour rating must be greater than or equal to 1.0'],
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
        startLocation: {
            // GeoJSON
            type: {
                type: String,
                default: 'Point',
                enum: ['Point'],
            },
            coordinates: [Number],
            address: String,
            description: String,
        },
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

// embedding users example
// tourSchema.pre('save', async function (next) {
//     const guidesPromises = this.guides.map(async id => await User.findById(id));
//     this.guides = await Promise.all(guidesPromises);
//     next();
// });

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

tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt',
    });
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
