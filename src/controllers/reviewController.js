const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

const { createOne, updateOne, deleteOne, getOne, getAll } = factory;

exports.setTourUserIds = async (req, res, next) => {
  //!Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};


exports.getAllReviews = getAll(Review);
exports.getReview = getOne(Review, { path: 'user' });
exports.createTourReview = createOne(Review);
exports.updateReview = updateOne(Review);
exports.deleteReview = deleteOne(Review);
