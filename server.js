require('dotenv').config();
const mongoose = require('mongoose');
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

app.listen(port, () => {
    console.log(`app is running in ${process.env.NODE_ENV} on port ${port}`);
});
