require('dotenv').config();
const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

const uri = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(uri).then(
    () => {
        console.log('db connection successful');
    },
    err => {
        console.error(err);
    },
);

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

// import data
const importData = async () => {
    try {
        await Tour.create(tours);
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews);
        console.log('data successfully loaded');
    } catch (err) {
        console.error(err);
    }
    process.exit();
};

// delete data
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('data successfully deleted');
    } catch (err) {
        console.error(err);
    }
    process.exit();
};

if (process.argv[2] === '--import' || process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '--delete' || process.argv[2] === '-d') {
    deleteData();
}
