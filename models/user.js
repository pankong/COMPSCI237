"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

/* the user schema */
var UserSchema = new mongoose.Schema({
  email: {type: String, unique: true, lowercase: true},
  password: String,
  profile: {
    name: {type: String, default: ''},
    picture: {type: String, default: ''}
  }
});

/* use bcrypt-nodejs to encrypt the password before saving to database */
UserSchema.pre('save', function(next) {
  var user = this;
  var saltLengh = 10;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(saltLengh, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

/* compare password in the database with the password user typed in */
UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(this.password, password);
};

module.exports = mongoose.model('User', UserSchema);
