const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
// const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.use(viewController.alerts);

router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/me', authController.protect, viewController.getAccount);
router.get(
    '/my-bookings',
    // bookingController.createBookingCheckout,
    authController.protect,
    viewController.getMyBookings,
);
router.post('/submit-user-data', authController.protect, viewController.updateUserData);
router.get('/', authController.isLoggedIn, viewController.getIndex);

module.exports = router;
