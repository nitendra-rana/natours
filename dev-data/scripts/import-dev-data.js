const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../src/models/tourModal');

dotenv.config({ path: '../../config.env' });

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

// read json file
const dataDirectory = `${__dirname}/../data`;
const filePath = 'tours-simple.json';
const tours = JSON.parse(fs.readFileSync(`${dataDirectory}/${filePath}`));
// const tours = fs.readFileSync(filePath, 'utf8');
/** */
//Import Data to DB
const importData = async () => {
  try {
    await Tour.create(tours); //takes input as js object
    console.log('Data created successfuly');
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany(); //takes input as js object
    console.log('Data deleted successfuly');
  } catch (error) {
    console.log(error);
  }
};
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
/** */
