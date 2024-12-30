const Tour = require('../models/tourModel');
const { catchAsync } = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const { createOne, updateOne, deleteOne, getOne, getAll } = factory;
/**Middlewares  */
exports.aliasTopTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

/**controllers or handlers*/
/*
 * 1. get All tours.
 */
exports.getAllTours = getAll(Tour);

/*
 * 2. get tour by id.
 */

exports.getTour = getOne(Tour, { path: 'reviews' });

/*
 * 3. create new tour.
 */
exports.createNewtour = createOne(Tour);

/*
 * 4. update tour by id.
 */
exports.updateTour = updateOne(Tour);

/*
 * 5. delete tour by id.
 */
exports.deleteTour = deleteOne(Tour);

/**
 * Aggrigration Pipeline : Matching and grouping
 */

exports.getTourStats = catchAsync(async (req, res) => {
  //Aggrigration pipeline is a MongodbFeature, but mongoose gives it.
  //pass an array of stages. $match , $group
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 2 } },
    },
    {
      $group: {
        // _id: null,
        // _id: '$ratingsAverage', //_id hepls to group items into one.
        _id: '$difficulty',
        // _id: { $toUpper: '$difficulty' },
        num: { $sum: 1 }, //One will be added for each document
        numOfRatings: { $sum: '$ratingQuantity' },
        avergaeRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        mixPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: -1 },
    },

    // you can add match stage here again, but take care that the documents we receive are modified.
  ]);
  res.status(200).json({
    status: 'success',
    data: stats,
  });
});
exports.getMonthelyPlans = catchAsync(async (req, res) => {
  const year = req.params.year * 1;
  const monthlyData = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-1-1`),
          $lt: new Date(`${year + 1}-1-1`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStart: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numToursStart: -1,
      },
    },
    /** *
      {
        $limit: 6,
      },
      /** */
  ]);
  res.status(200).json({
    status: 'success',
    data: monthlyData,
  });
});
