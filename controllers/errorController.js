const AppError = require('../utils/appError');

const handleCastError = error => {
    const message = `Invalid ${error.path}: ${error.value}.`;
    return new AppError(message, 400);
};

const sendErrorDev = (error, res) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        isOperational: error.isOperational,
        stack: error.stack,
    });
};

const sendErrorProd = (error, res) => {
    if (error.isOperational) {
        // send operational error to client
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        });
    } else {
        // withhold unknown errors from client
        console.error('💥💥💥', error);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!',
        });
    }
};

module.exports = (error, req, res, next) => {
    // console.log(error.stack);
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(error, res);
    } else if (process.env.NODE_ENV === 'production') {
        let errorObj = { ...error };
        if (error.name === 'CastError') {
            errorObj = handleCastError(error);
        }
        sendErrorProd(errorObj, res);
    }
};
