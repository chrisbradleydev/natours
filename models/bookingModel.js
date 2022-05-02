const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'A booking must belong to a tour.'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A booking must belong to a user.'],
    },
    price: {
        type: Number,
        required: [true, 'A booking must have a price.'],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    paid: {
        type: Boolean,
        default: true,
    },
});

// query middleware
bookingSchema.pre(/^find/, function (next) {
    this.populate([{ path: 'tour', select: 'name' }, { path: 'user' }]);
    next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
