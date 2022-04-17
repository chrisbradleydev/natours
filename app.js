const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// global middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests, please try again in one hour.',
});
app.use('/api', limiter);

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// handle unknown routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// error handling middleware
app.use(globalErrorHandler);

module.exports = app;
