const AppError = require('../utils/appError');

const handleCastErrorDb = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const value = err.errorResponse.errmsg.match(/(["'])(\\?.)*?\1/)[0]; //Regular expression to get string form error.
  const message = `Duplicate field value : ${value}. Please use another value.`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data.${errors.join('. ')}.`;
  return new AppError(message, 400);
};
const handleJwtError = () =>
  new AppError('Invalid token please login again.', 401);
const prodErrorResponse = (err) => {
  if (err.isOperational) {
    //OPERATIONAL ERROR :SEND TO CLIENT
    return {
      status: err.status,
      message: err.message,
    };
  }
  // console.error(err);
  return {
    statusCode: 500,
    status: 'error',
    message: 'something went wrong please contact customer support.',
  };
};

const devErrorResponse = (err) => ({
  status: err.status,
  message: err.message,
  error: err,
  stack: err.stack,
});

const sendErrorRes = (err, res) => {
  let error = { ...err };
  let responseData = {};
  if (process.env.NODE_ENV === 'development') {
    responseData = devErrorResponse(err);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') error = handleCastErrorDb(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationError(error);
    if (err.name === 'JsonWebTokenError') error = handleJwtError(error);
    if (err.name === 'JsonWebTokenError') error = handleJwtError(error);

    responseData = prodErrorResponse(error);
  }
  res.status(error.statusCode).json(responseData);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'errror';
  sendErrorRes(err, res);
};
