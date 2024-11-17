const express = require('express');
const tourController = require('../controllers/tourController');
//tours resource
const router = express.Router(); //mini application itself

// router.param('id', tourController.checkId);
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTour, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthelyPlans);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createNewtour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
