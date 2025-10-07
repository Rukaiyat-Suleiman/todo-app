// Basic auth controller (kept minimal — routes implement most behavior)
const User = require('../models/User');

exports.register = async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    req.flash('error_msg', 'Passwords do not match');
    return res.redirect('/auth/register');
  }

  try {
    const existing = await User.findOne({ username });
    if (existing) {
      req.flash('error_msg', 'Username already exists');
      return res.redirect('/auth/register');
    }

    const user = new User({ username, password });
    await user.save();
    req.flash('success_msg', 'Registration successful! Please log in.');
    res.redirect('/auth/login');
  } catch (err) {
    console.error('Registration error:', err.message);
    req.flash('error_msg', 'An error occurred. Please try again.');
    res.redirect('/auth/register');
  }
};
