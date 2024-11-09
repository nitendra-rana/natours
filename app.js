/**
 * We mostly write middleware in this file.
 */
const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./src/routes/tourRoute');
const userRouter = require('./src/routes/userRoute');

/*constants */
const app = express();

/** */
/*Middlewares*/
//1st middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  console.log(`we are in prod`);
}
//
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
/* custom middleware applies to every single request* *
app.use((req, res, next) => {
  console.log('hello from middleware.');
  next(); //never forget to use thi next functio
});
/**/
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next(); //never forget to use the next function
});
/** */

/* Routes */

// Mounting the new routers.
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
/**Start Server */

module.exports = app;
