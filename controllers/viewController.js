const getIndex = (req, res) => {
    res.render('index', {
        title: 'All tours',
    });
};

const getTour = (req, res) => {
    res.render('tour', {
        title: 'The Forest Hiker',
    });
};

module.exports = {
    getIndex,
    getTour,
};
