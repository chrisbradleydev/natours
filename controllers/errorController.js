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

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        isOperational: err.isOperational,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        // send operational error to client
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        // withhold unknown errors from client
        console.error('💥💥💥', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!',
        });
    }
};

module.exports = (err, req, res, next) => {
    // console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let errObj = { ...err };
        if (err.name === 'CastError') {
            errObj = handleCastErrorDB(err);
        }
        if (err.code === 11000) {
            errObj = handleDuplicateFieldsDB(err);
        }
        if (err.name === 'ValidationError') {
            errObj = handleValidationErrorDB(err);
        }
        sendErrorProd(errObj, res);
    }
};
