const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const {
  protect,
  updatePassword,
  signup,
  login,
  forgotPassword,
  resetPassword,
} = authController;

const { getUsers, createNewUser, updateUser, deleteUser, getMe, getUser } =
  userController;
//users Resource
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updatePassword', protect, updatePassword);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.patch('/deleteMe', authController.protect, userController.deleteMe);

router.route('/').get(getUsers).post(createNewUser);
router.route('/:id?').patch(updateUser).delete(deleteUser);

router.route('/me').get(protect, getMe, getUser);
module.exports = router;
