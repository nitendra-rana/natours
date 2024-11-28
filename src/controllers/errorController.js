module.exports = (err, res, resp, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'errror';

  resp.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
