const Review = require('../models/reviewModel');
const APIFeatures = require('../utils/apiFeatures');
const { catchAsync } = require('../utils/catchAsync');

exports.createTourReview = catchAsync(async (req, res, next) => {
  // const { review, rating, user, tour } = req.body;
  //!Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const review = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { review },
  });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const totalReviews = await Review.countDocuments();
  const features = new APIFeatures(Review.find(filter), req.query)
    .filter()
    .sort()
    .limit()
    .paginate();

  const reviews = await features.query;
  res.status(200).json({
    status: 'success',
    data: {
      reviews,
      count: totalReviews,
    },
  });
});
