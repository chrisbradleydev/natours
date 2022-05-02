const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// route middleware
const createBooking = factory.createOne(Booking);
const deleteBooking = factory.deleteOne(Booking);
const getAllBookings = factory.getAll(Booking);
const getBooking = factory.getOne(Booking);
const updateBooking = factory.updateOne(Booking);

const createBookingCheckout = catchAsync(async (req, res, next) => {
    // temporary solution, not secure, anyone can make a booking without paying
    const { price, tour, user } = req.query;

    if (!price && !tour && !user) {
        return next();
    }

    await Booking.create({
        price,
        tour,
        user,
    });

    res.redirect(req.originalUrl.split('?')[0]);
});

const getCheckoutSession = catchAsync(async (req, res, next) => {
    // get booked tour
    const tour = await Tour.findById(req.params.tourId);

    // create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        // temporary solution, not secure, anyone can make a booking without paying
        success_url: `${process.env.APP_URL}/?price=${tour.price}&tour=${req.params.tourId}&user=${req.user.id}`,
        cancel_url: `${process.env.APP_URL}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                name: `${tour.name} Tour`,
                description: tour.summary,
                images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
                amount: tour.price * 100,
                currency: 'usd',
                quantity: 1,
            },
        ],
    });

    // send session as response
    res.status(200).json({
        status: 'success',
        session,
    });
});

module.exports = {
    createBooking,
    createBookingCheckout,
    deleteBooking,
    getAllBookings,
    getBooking,
    getCheckoutSession,
    updateBooking,
};
