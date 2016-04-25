const router = require('express').Router();
//const bodyParser = require('body-parser');
var User = require('../models/user.js');

router.get('/signup', function(req, res) {
  res.render('accounts/signup', {
    errors: req.flash('errors')
  });
});

router.post('/signup', function(req, res, next) {
  var user = new User();
  user.profile.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;

  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      req.flash('errors', "Account already existed")
      return res.redirect('/signup');
    } else {
      user.save(function(err, user) {
        if (err) return next(err);
        return res.redirect('/');
      });
    }
  });
});

module.exports = router;
