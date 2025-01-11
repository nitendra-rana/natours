const APIFeatures = require('../utils/apiFeatures');
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
    if (id) {
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

exports.createOne = (Model) =>
  catchAsync(async (req, res) => {
    const newDocumnet = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { data: newDocumnet },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    const { params } = req;
    const { id } = params;
    const query = Model.findById(id);
    if (populateOptions) query.populate(populateOptions);

    const docs = await query; //Shorthand for => Tour.findOne({_id:id});
    if (!docs) {
      return next(new AppError('Document not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: docs,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    //To allow for nested Get review on Tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    //EXECUTE QUERY
    const docLength = await Model.countDocuments();
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limit()
      .paginate();
    const doc = await features.query;
    /** */
    // const tours = await query;
    res.status(200).json({
      status: 'success',
      data: {
        count: docLength,
        data: doc,
      },
    });
  });
