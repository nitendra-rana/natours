const mongoose = require('mongoose');

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
  }).populate({
    path: 'tour',
    select: 'name, duration',
  });
  next();
});

/** */

const Review = mongoose.model('review', reviewSchema);

module.exports = Review;
