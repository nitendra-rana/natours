const Tour = require('../models/tourModal');

/**controllers or handlers*/

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
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
      res.status(204).json({
        status: 'success',
        data: {
          tour: updatedTour,
        },
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
