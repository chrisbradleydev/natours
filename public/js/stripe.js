/* eslint-disable */
import 'dotenv/config';
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async tourId => {
    try {
        // get checkout session from api
        const { data } = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
        // create checkout form
        const stripe = Stripe(process.env.STRIPE_PUBLIC_KEY);
        await stripe.redirectToCheckout({
            sessionId: data.session.id,
        });
    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
};
