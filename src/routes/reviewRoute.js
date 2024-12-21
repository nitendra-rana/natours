const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
//review resource
const router = express.Router(); //mini application itself

router
  .route('/')
  .get(authController.protect, reviewController.getAllReviews)
  .post(reviewController.createTourReview);
/*
router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(authController.protect, reviewController.deleteReview);
*/
module.exports = router;
