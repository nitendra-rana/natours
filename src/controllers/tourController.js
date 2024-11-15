const Tour = require('../models/tourModal');

/**controllers or handlers*/

exports.getAllTours = async (req, res) => {
  try {
    /**
     * BUILD QUERY
     *
     */

    //1. Filtering

    const queryObject = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObject[el]);

    //2. Advance Filtering
    /*
     * {difficulty:'easy', duration:{ $gte:5 }} //Query to be applied
     * {difficulty:'easy', duration:{ $gte:5 }} // Recived Query
     * gte, gt, lte, lt //these are the operators that we can recieve
     * We should write the documentation to let user know which operation is allowed or not.
     */
    let queryString = JSON.stringify(queryObject);
    queryString = JSON.parse(
      queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`), // Regular expression to replace gte => $gte
    );
    /** */

    let query = Tour.find(queryString);

    //3. Sorting the items

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy); // to sort in descending, include minus in query.
    }
    //4) Field limiting

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v'); // minus means we are excluding the fields.
    }

    //5) Pagination
    /**
     * page=5&limit=10
     * Skip: no of items to skip [40]
     * limit: no of items to pe send over.[10]
     */
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments(); //To get total document we need to execute query by this method.
      if (skip >= numTours) {
        throw new Error('This page dose not exists.');
      }
    }
    //Final query is something chain  query.sort().select().skip().limit()

    //EXECUTE QUERY

    /** */
    const tours = await query;
    res.status(200).json({
      status: 'success',
      data: {
        count: tours.length,
        tours,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 'fail',
      message: 'failed to get tours',
    });
  }
};

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

exports.deleteTour = async (req, res) => {
  try {
    const { id } = req.params;
    await Tour.findByIdAndDelete(id);
    res.status(200).json({
      status: 'success',
      message: 'item deleted sucessfuly',
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 'fail',
      message: 'failed to delete item.',
    });
  }
};
