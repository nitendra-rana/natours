const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../src/models/tourModel');
const User = require('../../src/models/usersModel');
const Review = require('../../src/models/reviewModel');

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
    .replace('<DB_NAME>', dbReplacements.DB_NAME);
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
const filePathTours = 'tours.json';
const filePathUsers = 'users.json';
const filePathReviews = 'reviews.json';

const tours = JSON.parse(fs.readFileSync(`${dataDirectory}/${filePathTours}`));
const users = JSON.parse(fs.readFileSync(`${dataDirectory}/${filePathUsers}`));
const reviews = JSON.parse(
  fs.readFileSync(`${dataDirectory}/${filePathReviews}`),
);
// const tours = fs.readFileSync(filePath, 'utf8');
/** */
//Import Data to DB
const importData = async () => {
  const allQueries = [
    Tour.create(tours), //takes input as js object
    User.create(users, { validateBeforeSave: false }),
    Review.create(reviews),
  ];
  try {
    await Promise.all(allQueries);
    console.log('Data created successfuly');
    process.exit(0); // Exit with code 0 (success)
  } catch (error) {
    console.log(error);
    // Exit with a non-zero code for error
    process.exit(1); // Exit with code 1 (error)
  }
};

const deleteData = async () => {
  try {
    const allDeleteQuery = [
      Tour.deleteMany({}),
      User.deleteMany({}),
      Review.deleteMany({}),
    ];

    await Promise.all(allDeleteQuery);

    console.log('Data deleted successfully');

    // Close the process after the operation is complete
    process.exit(0); // Exit with code 0 (success)
  } catch (error) {
    console.error('Error deleting data:', error);

    // Exit with a non-zero code for error
    process.exit(1); // Exit with code 1 (error)
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
/** */
