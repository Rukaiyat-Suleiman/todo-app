module.exports = function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).render('error', {
    title: 'Error',
    message: err.message || 'Internal Server Error'
  });
};
