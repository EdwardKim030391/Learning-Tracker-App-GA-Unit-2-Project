const passport = require('passport');
const User = require('../models/User');

exports.registerUser = async (req, res) => {
  const { name, email, password, confirm_password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('register', { error_msg: 'Email is already registered' });
    }

    if (password !== confirm_password) {
      return res.render('register', { error_msg: "Passwords do not match" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.render('register', { error_msg: 'Error registering user' });
  }
};

exports.loginUser = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
};

exports.logoutUser = (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
};
