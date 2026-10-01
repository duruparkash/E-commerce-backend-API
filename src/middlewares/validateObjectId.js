const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');

module.exports = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) return next(new ApiError(400, 'Invalid id format'));
  next();
};
