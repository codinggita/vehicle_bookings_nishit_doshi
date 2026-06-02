const ApiResponse = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('[Error Stack]:', err.stack || err);
  } else {
    console.error(`[Error]: ${err.message || err}`);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errorDetails = null;

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Input Validation Failed';
    errorDetails = Object.values(err.errors).map((val) => val.message);
  }

  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate entry for field: ${field}. Please use another value.`;
    errorDetails = err.keyValue;
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found with format error on field: ${err.path}`;
    errorDetails = { value: err.value, expectedType: err.kind };
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token expired, please log in again';
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  }

  return ApiResponse.error(res, message, errorDetails || err, statusCode);
};

module.exports = errorHandler;
