const Tour = require('../models/tourModal');
const APIFeatures = require('../utils/apiFeatures');
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
exports.getAllTours = async (req, res) => {
  try {
    //EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limit()
      .paginate();
    const tours = await features.query;
    /** */
    // const tours = await query;
    res.status(200).json({
      status: 'success',
      data: {
        count: tours.length,
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'failed to get tours',
    });
  }
};

/*
 * 2. get tour by id.
 */

exports.getTour = async (req, res) => {
  try {
    const { params } = req;
    const { id } = params;

    const tour = await Tour.findById(id); //Shorthand for => Tour.findOne({_id:id});
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Failed to get tour',
    });
  }
};

/*
 * 3. create new tour.
 */
exports.createNewtour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.errorResponse.errmsg,
    });
  }
};

/*
 * 4. update tour by id.
 */
exports.updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.params.id) {
      const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      res.status(200).json({
        status: 'success',
        data: updatedTour,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'failed to update document',
    });
  }
};

/*
 * 5. delete tour by id.
 */
exports.deleteTour = async (req, res) => {
  try {
    const { id } = req.params;
    await Tour.findByIdAndDelete(id);
    res.status(200).json({
      status: 'success',
      message: 'item deleted sucessfuly',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'failed to delete item.',
    });
  }
};

/**
 * Aggrigration Pipeline : Matching and grouping
 */

exports.getTourStats = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'failed to fetch tours stats.',
    });
  }
};
exports.getMonthelyPlans = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'failed to fetch tours stats.',
    });
  }
};
