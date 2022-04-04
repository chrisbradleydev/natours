require('dotenv').config();
const mongoose = require('mongoose');

// handle uncaught exceptions
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥💥💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

const app = require('./app');

const uri = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
const port = process.env.PORT || 3000;

mongoose.connect(uri).then(
    () => {
        console.log('db connection successful');
    },
    err => {
        console.error(err);
    },
);

const server = app.listen(port, () => {
    console.log(`app is running in ${process.env.NODE_ENV} on port ${port}`);
});

// handle unhandled promise rejections
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥💥💥 Shutting down...');
    console.log(err.name, err.message);
    // gracefully shutdown server
    server.close(() => {
        process.exit(1);
    });
});
