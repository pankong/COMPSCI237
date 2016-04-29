"use strict";

const router = require('express').Router();
const util = require('util');
const async = require('async');
const math = require('mathjs');
var User = require('../models/user.js');

router.get('/ride', function(req, res) {
  res.render('match/ride');
});

router.post('/ride', function(req, res, next) {
  util.log("Rider " + req.user.profile.name + " requested a ride");
  async.waterfall([
    function(callback) {
      User.find({type: 'driver'}).count(function(err, numDrivers) {
        callback(null, numDrivers);
      })
    },
    function(numDrivers, callback) {
      var minDist = Number.MAX_VALUE;
      var nearestDriver = null;
      var count = 0;
      User.find({type: 'driver'}, function(err, drivers) {
        drivers.forEach(function(driver) {
          var dist = math.sqrt(math.pow(req.body.latitude - driver.location.latitude, 2)
          + math.pow(req.body.longitude - driver.location.longitude, 2));
          if (dist < minDist) {
            minDist = dist;
            nearestDriver = driver;
          }
          count += 1;
          if (count === numDrivers) {
            callback(null, nearestDriver);
          }
        })
      });
    },
    function(nearestDriver, callback) {
      res.write("You location is received by the server!\n");
      res.write("   Latitude: " + req.body.latitude + "\n");
      res.write("   Longitude: " + req.body.longitude + "\n");
      if (nearestDriver) {
        res.end("Nearest Driver is: " + nearestDriver.profile.name + " \n");
      } else {
        res.end("No Driver has been found \n")
      }
    }
  ]);
});

router.get('/drive', function(req, res) {
  res.render('match/drive');
})

router.post('/drive', function(req, res, next) {
  User.findById(req.user._id, function(err, driver) {
    if (err) return next(err);
    driver.location.longitude = req.body.longitude;
    driver.location.latitude = req.body.latitude;
    console.log(req.body.longitude);
    console.log(driver.location.latitude);
    driver.save(function(err) {
      if (err) return next(err);
    });
    util.log("Driver " + driver.profile.name + " sent in lcation udate");
  });
})

module.exports = router;
