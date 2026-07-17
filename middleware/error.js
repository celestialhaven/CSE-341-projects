const asyncHandler = (handler) => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

const notFound = (message) => {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: statusCode === 500 ? 'Internal Server Error' : err.message,
    errors: err.errors
  });
};

module.exports = {
  asyncHandler,
  errorHandler,
  notFound
};
