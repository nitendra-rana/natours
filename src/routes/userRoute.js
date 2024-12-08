const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

//users Resource
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/updatePassword/:token', authController.updatePassword);

router
  .route('/')
  .get(userController.getUsers)
  .post(userController.createNewUser);
router
  .route('/:id?')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
