const prodErrorResponse = (err) => {
  if (err.isOperational) {
    //OPERATIONAL ERROR :SEND TO CLIENT
    return {
      status: err.status,
      message: err.message,
    };
  }
  console.error(err);
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
  let responseData = {};
  if (process.env.NODE_ENV === 'development') {
    responseData = devErrorResponse;
  } else if (process.env.NODE_ENV === 'production') {
    responseData = prodErrorResponse(err);
  }
  res.status(err.statusCode).json(responseData);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'errror';
  sendErrorRes(err, res);
};
