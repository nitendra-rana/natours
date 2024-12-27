const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
//review resource
/**
 * Every router have access to it own params,
 * if we want to gain access of other routes params we need to use  {mergeParams: true}
 */
const router = express.Router({ mergeParams: true }); //mini application itself

router
  .route('/')
  .get(authController.protect, reviewController.getAllReviews)
  .post(authController.protect, reviewController.createTourReview);
/** */
router
  .route('/:id')
  // .get(reviewController.getReview)
  // .patch(reviewController.updateReview)
  .delete(authController.protect, reviewController.deleteReview);
/**/
module.exports = router;
