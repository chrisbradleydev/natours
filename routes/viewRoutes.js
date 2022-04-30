const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

router.get('/tour/:slug', viewController.getTour);
router.get('/login', viewController.getLoginForm);
router.get('/', viewController.getIndex);

module.exports = router;
