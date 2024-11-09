// const fs = require('fs');
// const Tour = require('../models/tourModal');

// const { sendFailRequest } = require('../helper.js/toursHelper');
/** *
const dataDirectory = `${__dirname}/../dev-data/data`;
const fileName = 'tours-simple.json';

/** *
// helpers functions
/** *
exports.checkId = (req, res, next, val) => {
  if (req.params.id * 1 === 1000) {
    return sendFailRequest(req, res);
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return sendFailRequest(req, res);
  }
  next();
};

/** *
const writeFile = (data, res, returnData) => {
  fs.writeFile(`${dataDirectory}/${fileName}`, JSON.stringify(data), (err) => {
    if (err) throw err;
    sendWriteResponse(res, returnData);
  });
};
/** */
/** *
const tours = JSON.parse(fs.readFileSync(`${dataDirectory}/${fileName}`));
/** */

/**controllers or handlers*/

// exports.getTour = async (req, res) => {
//   // eslint-disable-next-line prefer-destructuring
//   const params = req.params;
//   const id = params.id * 1;
//   if (req.params.id) {
//     // let responseData = [].find((t) => t.id === id);
//     // res.status(200).json({
//     //   requestAt: req.requestTime,
//     //   status: 'success',
//     //   data: {
//     //     results: responseData.length ? responseData.length : 1,
//     //     tours: responseData,
//     //   },
//     // });
//   }
// };
