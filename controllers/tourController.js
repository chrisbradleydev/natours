const fs = require('fs');

// constants
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
const validKeys = [
    'difficulty',
    'duration',
    'id',
    'imageCover',
    'images',
    'maxGroupSize',
    'name',
    'price',
    'ratingsAverage',
    'ratingsQuantity',
    'startDates',
    'summary',
];

// param middleware
const checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'missing name or price',
        });
    }
    next();
};

const checkId = (req, res, next, val) => {
    if (req.params.id * 1 > tours.length - 1) {
        return res.status(404).json({
            status: 'fail',
            message: 'invalid id',
        });
    }
    next();
};

// controllers
const createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = { ...req.body, id: newId };
    tours.push(newTour);
    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), () => {
        res.status(201).json({
            status: 'success',
            data: { tour: newTour },
        });
    });
};

const deleteTour = (req, res) => {
    const id = req.params.id * 1;
    tours.splice(
        tours.findIndex(o => o.id === id),
        1,
    );
    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), () => {
        res.status(204).json({
            status: 'success',
            data: null,
        });
    });
};

const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: { tours },
    });
};

const getTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(o => o.id === id);
    res.status(200).json({
        status: 'success',
        data: { tour },
    });
};

const updateTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(o => o.id === id);
    Object.keys(req.body).forEach(key => validKeys.includes(key) || delete req.body[key]);
    const updatedTour = { ...tour, ...req.body, id };
    tours[tours.findIndex(o => o.id === id)] = updatedTour;
    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), () => {
        res.status(201).json({
            status: 'success',
            data: { tour: updatedTour },
        });
    });
};

module.exports = {
    checkBody,
    checkId,
    createTour,
    deleteTour,
    getAllTours,
    getTour,
    updateTour,
};
