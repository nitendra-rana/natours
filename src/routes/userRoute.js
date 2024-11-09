const express = require('express');
const userController = require('../controllers/userController');

//users Resource
const router = express.Router();
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
