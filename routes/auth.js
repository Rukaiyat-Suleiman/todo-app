const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

// Login
router.get('/login', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) return res.redirect('/');
  res.render('login', { title: 'Login' });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
  })(req, res, next);
});

// Register
router.get('/register', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) return res.redirect('/');
  res.render('register', { title: 'Register' });
});

router.post('/register', async (req, res) => {
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
});

// Logout
router.get('/logout', (req, res, next) => {
  if (req.logout.length === 0) {
    // passport >=0.6 may require callback; handle both
    req.logout();
    req.flash('success_msg', 'You are logged out.');
    return res.redirect('/auth/login');
  }

  req.logout(function(err) {
    if (err) return next(err);
    req.flash('success_msg', 'You are logged out.');
    res.redirect('/auth/login');
  });
});

module.exports = router;
