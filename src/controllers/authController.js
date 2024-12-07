const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/usersModal');
const { catchAsync } = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const userDetails = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    photo: req.body.photo || '',
    passwordChangedAt: req.body.passwordChangedAt,
  };
  //! if we directly use req.body, then anyone can put nay data.
  const newUser = await User.create(userDetails);
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //! 1) check if email and password exists in request.
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  //! 2) check if the user exists and password is correct.
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  //!3) if everything okay the send token to

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    data: {
      token,
    },
  });

  //! 3) if everything ok send token to client.
});

exports.protect = catchAsync(async (req, res, next) => {
  //1. Getting token and check if it is there.
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('you are not logged in.', 401));
  }
  //2. verification of token.
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //3. check if user still exists.
  const freshUser = await User.findById(decode.id);
  if (!freshUser) {
    return next(new AppError('User no longer exists', 401));
  }
  //4. check if user changed password after the token issued.
  if (await freshUser.changedPasswordAfter(decode.iat)) {
    return next(
      new AppError('User recently chnaged password! please login again.', 401),
    );
  }

  //5. GRANT ACCESS TO PROTECTED ROUTE
  req.user = freshUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    //rolesp['admin', 'lead-guide']
    if (!roles.includes(req.user.role))
      next(
        new AppError('You do not have permission to perform this action', 403),
      );

    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1. get user based on posted email.
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  //2. Generate the random rest token.
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //3. send it to users email.
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forget your password ? Please confirm you password from below link.
                    ${resetUrl}.\n
                  If you didn't requsted for reset password please ignore this message.`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset link valid only for 10 mins.',
      message,
    });
    //4. send response to the api.
    res.status(200).json({
      status: 'success',
      message: 'Please check you email',
    });
  } catch (error) {
    user.passwodResetToken = undefined;
    user.passwordResetExpired = undefined;
    res.status(200).json({
      status: 'success',
      message: 'Please check you email',
    });
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There is the error sending email, please try again after some time.',
      ),
    );
  }
});

exports.updatePassword = (req, res, next) => {};
