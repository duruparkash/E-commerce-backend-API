const fs = require('fs');
const ApiError = require('../utils/ApiError');

// validate(schema, 'body' | 'query')
const validate = (schema, property = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[property], { abortEarly: false, stripUnknown: true });

  if (error) {
    // Don't leave an uploaded temp file behind when validation fails
    if (req.file) fs.unlink(req.file.path, () => {});
    const details = error.details.map((d) => ({ field: d.path.join('.'), message: d.message.replace(/"/g, '') }));
    return next(new ApiError(400, 'Validation failed', details));
  }

  req[property] = value;
  next();
};

module.exports = validate;
