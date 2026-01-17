function errorHandler(error, req, res, next) {
  // eslint-disable-next-line no-console
  console.error('[Error]', error);

  const status = error.status || 500;
  const message = status === 500 ? 'Something went wrong. Please try again later.' : error.message;

  res.status(status).json({ message });
}

module.exports = errorHandler;
