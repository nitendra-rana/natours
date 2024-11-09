exports.sendWriteResponse = (res, data) =>
  res.status(201).json({
    status: 'success',
    data: {
      tours: data,
    },
  });

exports.sendFailRequest = (req, res) =>
  res.status(404).json({
    status: 'fail',
    message: 'Invalid ID',
  });
