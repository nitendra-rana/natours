const dotenv = require('dotenv');
const mongoose = require('mongoose');
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

mongoose
  .connect(DB)
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.log(err);
    console.log('Database Not connected');
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.warn(`App running on port: ${PORT}......`);
});

/**
 * stuff like DB config
 * error handling
 * env vars
 * anything that is ot related to express/app we will put it here.
 *
 */
