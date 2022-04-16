const express = require('express');
const { createUser, deleteUser, getAllUsers, getUser, updateUser } = require('../controllers/userController');
const { forgotPassword, login, resetPassword, signup } = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
