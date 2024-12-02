// const APIFeatures = require('../utils/apiFeatures');
const User = require('../models/usersModal');
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
