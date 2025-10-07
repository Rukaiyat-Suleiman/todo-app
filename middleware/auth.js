module.exports = function requireAuth(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    req.flash('error_msg', 'Please log in first');
    return res.redirect('/auth/login');
  }
  next();
};
