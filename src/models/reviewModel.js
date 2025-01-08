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
  const stats = await this.aggegrate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 },
        avgRatings: { $avg: 'ratings' },
      },
    },
  ]);
  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRatings,
    ratingsAverage: stats[0].avgRatings,
  });
};

reviewSchema.post('save', function () {
  this.constructor.calculateAvergaeRatings(this.tour);
});
//FindByIdAndUpdate
//findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  /**
   *save the id the review top pass id to post middleware
   */
  this.r = await this.findOne();
  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  /**
   * this.findOne doesn't work here becase querry is already executed.
   */
  await this.r.constructor.calculateAvergaeRatings(this.r.tour);
});
const Review = mongoose.model('review', reviewSchema);

module.exports = Review;
