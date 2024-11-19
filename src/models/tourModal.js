const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const slugify = require('slugify');
/**
 * in Schema we can pass schema object as well as the schemaOptions object.
 */
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour Must have name'], //
      unique: true,
      trim: true,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    price: {
      type: Number,
      required: [true, 'The tour must have price.'], //first is value and second is error.
    },
    difficulty: {
      type: String,
      default: 'easy',
    },
    duration: {
      type: Number,
      required: [true, 'The tour must have duration.'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
    },
    summary: {
      type: String,
      trim: true, // remove whitespace from front and end
      required: [true, 'A tour must have a group description,'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover Image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    slug: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

/**
 * Virtual propery are the fields that are not be presisted(not to be saved in db).
 * it will be created each time we get the data, so that is why we use getter funstion(get).
 * in this case we pass the normal function so that we can utlise value of this object.
 * we can also calculate this in controllers after querying the data, but this is not the best practice.
 */
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
/**
 * Middleware in mongoose.
 * four type of middleware in Mongoode are : 1. query 2. Document 3. aggerate 4. Model.
 */
/**
 * Document Middleware.
 * .pre will before an actual event happens.
 * "save" event includes .save(), .create(), excluding-{.insterMany()}
 */
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post('save', function (doc, next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

const Tour = mongoose.model('tour', tourSchema);

module.exports = Tour;
