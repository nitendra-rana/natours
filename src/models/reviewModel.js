const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'tour',
    required: [true, 'Review must belong to a tour.'],
    strictPopulate: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: [true, 'Review must given by a user.'],
    strictPopulate: false,
  },
});
//Avoid duplicate reviews from same user to same tour.
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
/** */
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name',
  });
  /**
     * In the case we polulate tours, it will start the following chain
     * Populates tours inside reviews and also populate guides inside tour
     * which is not efficient.
     * and we don't necessarly need to populate reviews with tours.
     *
    .populate({
      path: 'tour',
      select: 'name, duration',
    });
  /** */
  next();
});

/** */

reviewSchema.statics.calculateAvergaeRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 },
        avgRatings: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingQuantity: stats[0].nRatings,
      ratingsAverage: stats[0].avgRatings,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calculateAvergaeRatings(this.tour);
});
//TODO: Apply update avgRatings for update and delete review.
//FindByIdAndUpdate
//findByIdAndDelete
/** */
/** *
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // Fetch the document to be updated or deleted and save it to `this.r`.
  this.r = await this.findOne();
  if (!this.r) {
    return next(new Error('Document not found'));
  }
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // Use `this.r` from the `pre` hook since `this.findOne` doesn't work in `post`.
  await this.r.constructor.calculateAvergaeRatings(this.r.tour);
});
/** */

const Review = mongoose.model('review', reviewSchema);

module.exports = Review;
