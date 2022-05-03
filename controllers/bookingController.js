const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// helper function(s)
const createBookingCheckout = async session => {
    const user = (await User.findOne({ email: session.customer_email })).id;
    await Booking.create({
        price: session.display_items[0].amount / 100,
        tour: session.client_reference_id,
        user,
    });
};

// route middleware
const createBooking = factory.createOne(Booking);
const deleteBooking = factory.deleteOne(Booking);
const getAllBookings = factory.getAll(Booking);
const getBooking = factory.getOne(Booking);
const updateBooking = factory.updateOne(Booking);

// const createBookingCheckout = catchAsync(async (req, res, next) => {
//     // temporary solution, not secure, anyone can make a booking without paying
//     const { price, tour, user } = req.query;

//     if (!price && !tour && !user) {
//         return next();
//     }

//     await Booking.create({
//         price,
//         tour,
//         user,
//     });

//     res.redirect(req.originalUrl.split('?')[0]);
// });

const getCheckoutSession = catchAsync(async (req, res, next) => {
    // get booked tour
    const tour = await Tour.findById(req.params.tourId);

    // create checkout session
    const url = `${req.protocol}://${req.get('host')}`;
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        // temporary solution, not secure, anyone can make a booking without paying
        // success_url: `${url}/my-bookings?price=${tour.price}&tour=${req.params.tourId}&user=${req.user.id}`,
        success_url: `${url}/my-bookings?alert=booking`,
        cancel_url: `${url}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                name: `${tour.name} Tour`,
                description: tour.summary,
                images: [`${url}/img/tours/${tour.imageCover}`],
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

const webhookCheckout = (req, res, next) => {
    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            req.headers['stripe-signature'],
            process.env.STRIPE_WEBHOOK_SECRET,
        );
    } catch (err) {
        return res.status(400).send(`Stripe webhook error: ${err.message}`);
    }
    if (event.type === 'checkout.session.completed') {
        createBookingCheckout(event.data.object);
    }
    res.status(200).json({ received: true });
};

module.exports = {
    createBooking,
    createBookingCheckout,
    deleteBooking,
    getAllBookings,
    getBooking,
    getCheckoutSession,
    updateBooking,
    webhookCheckout,
};
