require('dotenv').config();
const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');

const uri = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(uri).then(
    () => {
        console.log('db connection successful');
    },
    error => {
        console.error(error);
    },
);

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// import data
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('data successfully loaded');
    } catch (error) {
        console.error(error);
    }
    process.exit();
};

// delete data
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('data successfully deleted');
    } catch (error) {
        console.error(error);
    }
    process.exit();
};

if (process.argv[2] === '--import' || process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '--delete' || process.argv[2] === '-d') {
    deleteData();
}
