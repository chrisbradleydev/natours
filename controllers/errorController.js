const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message.charAt(0).toUpperCase() + el.message.slice(1));
    const message = `Invalid input data. ${errors.join('. ')}.`;
    return new AppError(message, 400);
};

const handleJsonWebTokenError = () => new AppError('Invalid token! Please log in again.', 401);

const handleJsonWebTokenExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err, req, res) => {
    // a) api
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            isOperational: err.isOperational,
            stack: err.stack,
        });
    }
    // b) website
    console.error('💥💥💥', err);
    return res.status(err.statusCode).render('error', {
        title: 'Error',
        msg: err.message,
    });
};

const sendErrorProd = (err, req, res) => {
    // a) api
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            // send operational error to client
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }
        // withhold unknown errors from client
        console.error('💥💥💥', err);
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong!',
        });
    }
    // b) website
    if (err.isOperational) {
        // send operational error to client
        return res.status(err.statusCode).render('error', {
            title: 'Error',
            msg: err.message,
        });
    }
    // withhold unknown errors from client
    console.error('💥💥💥', err);
    return res.status(err.statusCode).render('error', {
        title: 'Error',
        msg: 'Please try again later.',
    });
};

module.exports = (err, req, res, next) => {
    // console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let errObj = {
            ...err,
            message: err.message,
        };

        if (err.name === 'CastError') {
            errObj = handleCastErrorDB(err);
        }
        if (err.code === 11000) {
            errObj = handleDuplicateFieldsDB(err);
        }
        if (err.name === 'ValidationError') {
            errObj = handleValidationErrorDB(err);
        }
        if (err.name === 'JsonWebTokenError') {
            errObj = handleJsonWebTokenError();
        }
        if (err.name === 'TokenExpiredError') {
            errObj = handleJsonWebTokenExpiredError();
        }

        sendErrorProd(errObj, req, res);
    }
};
