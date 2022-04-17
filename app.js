const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// global middleware
// set security HTTP headers
app.use(helmet());

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

// body parser, reading data from body into req.body
app.use(
    express.json({
        limit: '10kb',
    }),
);

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

// serve static files
app.use(express.static(`${__dirname}/public`));

// test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);
    next();
});

// routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// handle unknown routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// error handling middleware
app.use(globalErrorHandler);

module.exports = app;
