"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');

/* the user schema */
var UserSchema = new mongoose.Schema({
  email: {type: String, unique: true, lowercase: true},
  password: String,
  type: String,
  profile: {
    name: {type: String, default: ''},
    picture: {type: String, default: ''},
    address: {type: String, default: ''}
  },
  district: {type: Number, default: -1},
  location: {
    latitude: {type: Number, default: -1},
    longitude: {type: Number, default: -1}
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
  return bcrypt.compareSync(password, this.password);
};

/* create a unique default picture for each user using gravatar API*/
UserSchema.methods.gravatar = function() {
  var size = 200;
  if (!this.email) return 'https://gravatar.com/avatar/?s' + size + '&d=retro';
  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
}


module.exports = mongoose.model('User', UserSchema);
