/**
 * stuff like DB config
 * error handling
 * env vars
 * anything that is ot related to express/app we will put it here.
 *
 */
const dotenv = require('dotenv');
const mongoose = require('mongoose');
/**
 * needs to be defined at top, because any error happening before this method,
 * won't get caught in event uncaughtException.
 */
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception ,shutting down the server.');
  console.info(err.name, err.message);
  process.exit(1);
});

const app = require('./app');

dotenv.config({ path: './config.env' });

const replaceUserNameAndPassword = (str) => {
  const dbReplacements = {
    USER: process.env.DB_USER_NAME,
    PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DATABASE_NAME,
  };
  return str
    .replace('<USER>', dbReplacements.USER)
    .replace('<PASSWORD>', dbReplacements.PASSWORD)
    .replace('<DATABASE_NAME>', dbReplacements.DB_NAME);
};
const DB = replaceUserNameAndPassword(process.env.DATABASE);

mongoose.connect(DB).then(() => {
  console.log('Database connected');
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.warn(`App running on port: ${PORT}......`);
});

process.on('unhandledRejection', (err) => {
  //unhandledRejection : will listen to all the unhandled rejected promises in  async code.
  console.error('Unhandled rejection,shutting down the server.');
  console.info(err);

  server.close(() => {
    /*
     *server.close:  will give time to finish all pending requests.
     *process.exit(1)  will immedately shuts down the server.Note: it is not a good idea to shut down the server.
     */
    process.exit(1);
  });
});
