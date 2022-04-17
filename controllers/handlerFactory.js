const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

const createOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);
        res.status(201).json({
            status: 'success',
            data: { data: doc },
        });
    });

const deleteOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc) {
            return next(new AppError(`No document found with id ${req.params.id}`, 404));
        }

        res.status(204).json({
            status: 'success',
            data: null,
        });
    });

const getAll = Model =>
    catchAsync(async (req, res, next) => {
        // allow for nested reviews on tour (hack)
        let filter = {};
        if (req.params.tourId) {
            filter = { tour: req.params.tourId };
        }

        // construct query using APIFeatures class
        const features = new APIFeatures(Model.find(filter), req.query).filter().limit().paginate().sort();

        // output query execution stats
        // const doc = await features.query.explain();
        const doc = await features.query;

        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: { data: doc },
        });
    });

const getOne = (Model, populateOptions) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (populateOptions) {
            query = query.populate(populateOptions);
        }

        const doc = await query;
        if (!doc) {
            return next(new AppError(`No document found with id ${req.params.id}`, 404));
        }

        res.status(200).json({
            status: 'success',
            data: { data: doc },
        });
    });

const updateOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!doc) {
            return next(new AppError(`No document found with id ${req.params.id}`, 404));
        }

        res.status(201).json({
            status: 'success',
            data: { data: doc },
        });
    });

module.exports = {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
};
