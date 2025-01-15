const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
// const reviewController = require('../controllers/reviewController');

const { protect, restrictTo } = authController;
const {
  getAllTours,
  getTourStats,
  getMonthelyPlans,
  createNewtour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTour,
  getToursWithin,
} = tourController;
const reviewRouter = require('./reviewRoute');

//tours resource
const router = express.Router(); //mini application itself

/**/
//POST /tour/231/review
//GET /tour/231/review/43289
//GET /tour/231/reviews
router.use('/:tourId/reviews', reviewRouter);
/**/
// router.param('id', tourController.checkId);
router.route('/top-5-cheap').get(aliasTopTour, getAllTours);
router.route('/tour-stats').get(getTourStats);

router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthelyPlans);

router.route('/distances/:latlang/unit/:unit').get(getToursWithin);
//tours-within?distance=233&center=30.884033, -99.358821&unit=mi
//tours-within/233/center/30.884033, -99.358821/unit/mi'

router
  .route('/tours-within/:distance/center/:latlang/unit/:unit')
  .get(getToursWithin);
router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createNewtour);

router
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
