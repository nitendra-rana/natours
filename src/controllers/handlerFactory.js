const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No Document fund with that Id', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    if (req.params.id) {
      const updatedDocument = await Model.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true, //This line will run validators again, in cas its false it won't run again.
      });
      if (!updatedDocument) {
        return next(new AppError('document not found', 404));
      }
      res.status(200).json({
        status: 'success',
        data: {
          data: updatedDocument,
        },
      });
    }
  });
