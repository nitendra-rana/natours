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
  restrictTo,
} = authController;

const {
  getUsers,
  createNewUser,
  updateUser,
  deleteUser,
  getMe,
  getUser,
  updateMe,
  deleteMe,
} = userController;
//users Resource
const router = express.Router();
//open routes for all
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

//protected for logged in user
router.use(protect);
router.patch('/updatePassword', updatePassword);
router.patch('/updateMe', updateMe);
router.patch('/deleteMe', deleteMe);
router.route('/').get(getUsers).post(createNewUser);
router.route('/me').get(getMe, getUser);

//restricted to admin only
router.use(restrictTo('admin'));
router.route('/:id?').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
