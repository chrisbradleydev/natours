const express = require('express');
const {
    createUser,
    deleteMe,
    deleteUser,
    getAllUsers,
    getUser,
    updateMe,
    updateUser,
} = require('../controllers/userController');
const {
    forgotPassword,
    login,
    protect,
    resetPassword,
    signup,
    updatePassword,
} = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updatePassword);
router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
