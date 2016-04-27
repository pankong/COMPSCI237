const router = require('express').Router();
const util = require('util');

router.get('/ride', function(req, res) {
  res.render('match/ride');
});

router.post('/ride', function(req, res, next) {
  res.write("You location is received by the server!\n");
  res.write("Latitude: " + req.body.Latitude + "\n");
  res.end("Longitude: " + req.body.Longitude + "\n");
  util.log("Rider " + req.user.profile.name + " requested a ride");
})

router.get('/drive', function(req, res) {
  res.render('match/drive');
})

router.post('/drive', function(req, res) {
  util.log("Driver " + req.user.profile.name + " sent in lcation udate");
})

module.exports = router;
