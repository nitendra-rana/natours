/**
 * We mostly write middleware in this file.
 */
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const tourRouter = require('./src/routes/tourRoute');
const userRouter = require('./src/routes/userRoute');
const AppError = require('./src/utils/appError');
const globalErrorHandler = require('./src/controllers/errorController');
/*constants */
const app = express();

//SECURE HTTP HEADERS
app.use(helmet());
/** */
/*Middlewares : executes in the order they are defined in the code.*/
//DEVELOPMENT LOGGING
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  console.log(`we are in prod`);
}
//BODY PARSER
app.use(express.json({ limit: '10kb' }));
app.use(express.static(`${__dirname}/public`));

//Global Middleware function.
//APPLY RATE LIMIT TO CURRENT REQUEST.
const limitter = rateLimit({
  max: 100,
  windwoMs: 60 * 60 * 1000,
  message: 'Too many request from this account, please try again in an hour.',
});
app.use('/api', limitter);
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next(); //never forget to use the next function
});
/** */

/* Routes */

// Mounting the new routers.
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//Error handeling.

//Operational Error Handler
app.all('*', (req, res, next) => {
  //Using Custom Error class
  next(new AppError(`Can't find the ${req.originalUrl} on the server.`, 404));
});
//Global error handeler
app.use(globalErrorHandler);

/**Start Server */

module.exports = app;
