// const APIFeatures = require('../utils/apiFeatures');
const { filterObj } = require('../helper.js/usersHelper');
const User = require('../models/usersModel');
const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const { createOne, updateOne, deleteOne, getOne, getAll } = factory;
//handlers
exports.getUsers = catchAsync(async (req, res) => {
  const totalusers = await User.countDocuments();
  const features = await User.find();
  // new APIFeatures(User.find(), req.query).filter().sort().limit().paginate();

  // const users = await features.query;
  res.status(200).json({
    status: 'success',
    data: {
      users: features,
      count: totalusers,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  //1. create error is user try to update password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not to update password. please use updatePassword endpoint',
        404,
      ),
    );
  }
  //2. filter out unwanted field names that are not allowed to be updated.
  const filterBody = filterObj(req.body, 'name', 'email');

  //2. get user based on access token and update the user document.
  const updatedUser = await User.findByIdAndUpdate(id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ status: 'success', data: { user: updatedUser } });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  if (!id) {
    return next(new AppError('Unable to delete user', 404));
  }
  //1. get user based on access token and update the actitive flag in document.
  await User.findByIdAndUpdate(
    id,
    { active: false },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    status: 'success',
    data: { message: 'user deleted successfuly ' },
  });
});

exports.getMe = (req, res, next) => {
  req.prams.id = req.user.id;
  next();
};

exports.getUser = getOne(User);
exports.getAllUser = getAll(User);
exports.createNewUser = createOne(User);
exports.updateUser = updateOne(User);
exports.deleteUser = deleteOne(User);
