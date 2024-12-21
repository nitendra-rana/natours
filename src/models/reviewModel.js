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
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: [true, 'Review must given by a user.'],
  },
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tour,users ',
    select: '-__v',
  });

  next();
});

const Review = mongoose.model('review', reviewSchema);

module.exports = Review;
