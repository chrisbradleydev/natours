const path = require('path');
const crypto = require('crypto');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');
const viewRouter = require('./routes/viewRoutes');

const app = express();
app.locals.env = {
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
};

// heroku proxies all incoming requests
app.enable('trust proxy');

// set view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// global middleware
// enable cors for all sites and routes
// Access-Control-Allow-Origin: *
app.use(cors());
// app.use(cors({
//     origin: 'https://natours.test',
// }));

// enable cors pre-flight
app.options('*', cors());
// app.options('/api/v1/tours/:id', cors());

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// set security HTTP headers
app.use((req, res, next) => {
    res.locals.nonce = crypto.randomBytes(16).toString('base64');
    next();
});
const allowedHosts = ['https://*.mapbox.com/', 'https://js.stripe.com/'];
const selfAllowed = ["'self'", ...allowedHosts];
const strictNonceSrc = ["'strict-dynamic'", (req, res) => `'nonce-${res.locals.nonce}'`];
app.disable('x-powered-by');
app.use(
    helmet({
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
        contentSecurityPolicy: {
            // useDefaults: true,
            directives: {
                baseUri: ["'self'"],
                childSrc: ["'self'"],
                connectSrc: selfAllowed,
                defaultSrc: ["'self'"],
                fontSrc: ["'self'"],
                formAction: ["'self'"],
                frameAncestors: ["'self'"],
                frameSrc: selfAllowed,
                imgSrc: ['data:', ...selfAllowed],
                manifestSrc: ["'self'"],
                mediaSrc: ["'self'"],
                objectSrc: ["'none'"],
                prefetchSrc: ["'self'"],
                // reportUri: '/csp-violation',
                scriptSrc: strictNonceSrc,
                scriptSrcAttr: selfAllowed,
                scriptSrcElem: selfAllowed,
                styleSrc: strictNonceSrc,
                styleSrcAttr: selfAllowed,
                styleSrcElem: selfAllowed,
                workerSrc: ['blob:', ...selfAllowed],
            },
            // reportOnly: true,
        },
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy
        crossOriginEmbedderPolicy: false,
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Resource-Policy
        crossOriginResourcePolicy: {
            policy: 'cross-origin',
        },
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
        hsts: {
            maxAge: 60 * 60 * 24 * 365,
            includeSubDomains: true,
            preload: true,
        },
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
        referrerPolicy: {
            policy: ['no-referrer', 'strict-origin-when-cross-origin'],
        },
    }),
);
// app.route('/csp-violation').post((req, res) => {
//     console.log('CSP Violation: ', req.body || 'No request body');
//     res.status(200).send();
// });

// development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// limit requests
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests, please try again in one hour.',
});
app.use('/api', limiter);

// we are doing this here because we need the request body in raw format
app.post('/webhook-checkout', express.raw({ type: 'application/json' }), bookingController.webhookCheckout);

// body parser, reading data from body into req.body
const limit = '10kb';
app.use(express.json({ limit }));
app.use(express.urlencoded({ extended: true, limit }));
app.use(cookieParser());

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// data sanitization against XSS
app.use(xss());

// prevent parameter pollution
app.use(
    hpp({
        whitelist: ['difficulty', 'duration', 'maxGroupSize', 'price', 'ratingsAverage', 'ratingsQuantity'],
    }),
);

// compression middleware
app.use(compression());

// test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);
    // console.log(req.cookies);
    next();
});

// routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/', viewRouter);

// handle unknown routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// error handling middleware
app.use(globalErrorHandler);

module.exports = app;
