// const APIFeatures = require('../utils/apiFeatures');
const { filterObj } = require('../helper.js/usersHelper');
const User = require('../models/usersModal');
const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

//handlers
exports.getUsers = catchAsync(async (req, res) => {
  const features = await User.find();
  // new APIFeatures(User.find(), req.query).filter().sort().limit().paginate();

  // const users = await features.query;
  res.status(200).json({
    status: 'success',
    data: {
      users: features,
      // count: users.length,
    },
  });
});

exports.createNewUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined.',
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  const { id } = req.user.id;
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

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined.',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined.',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined.',
  });
};
