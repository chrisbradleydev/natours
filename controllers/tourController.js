const Tour = require('../models/tourModel');

// controllers
const createTour = async (req, res) => {
    try {
        const tour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: { tour },
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error,
        });
    }
};

const deleteTour = async (req, res) => {
    await Tour.findByIdAndDelete(req.params.id);
    try {
        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error,
        });
    }
};

const getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find();
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: { tours },
        });
    } catch (error) {
        res.staaatus(400).json({
            status: 'fail',
            message: error,
        });
    }
};

const getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: { tour },
        });
    } catch (error) {
        res.staaatus(400).json({
            status: 'fail',
            message: error,
        });
    }
};

const updateTour = async (req, res) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    try {
        res.status(201).json({
            status: 'success',
            data: { tour },
        });
    } catch (error) {
        res.staaatus(400).json({
            status: 'fail',
            message: error,
        });
    }
};

module.exports = {
    createTour,
    deleteTour,
    getAllTours,
    getTour,
    updateTour,
};
