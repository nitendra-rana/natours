const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
//review resource
/**
 * Every router have access to it own params,
 * if we want to gain access of other routes params we need to use  {mergeParams: true}
 */
const {
  getAllReviews,
  setTourUserIds,
  createTourReview,
  updateReview,
  deleteReview,
  getReview,
} = reviewController;
const { protect } = authController;
const router = express.Router({ mergeParams: true }); //mini application itself

router
  .route('/')
  .get(protect, getAllReviews)
  .post(protect, setTourUserIds, createTourReview);
/** */
router
  .route('/:id')
  .get(getReview)
  .patch(updateReview)
  .delete(protect, deleteReview);
/**/
module.exports = router;
