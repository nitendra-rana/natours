const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour Must have name'], //
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'The tour must have price'], //first is value and second is error.
  },
  difficulty: {
    type: String,
    default: 'easy',
  },
  duration: {
    type: Number,
    default: 0,
  },
});

const Tour = mongoose.model('tour', tourSchema);

module.exports = Tour;
