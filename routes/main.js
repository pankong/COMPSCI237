const router = require('express').Router();

router.get('/', function(req, res) {
  res.render('main/home');
});

router.get('/about', function(req, res) {
  res.render('main/about');
});

router.get('/ride', function(req, res) {
  res.json("This page will request rider's location and then return the cloest driver's location and time required to arrive");
});

router.post('/ride', function(req, res, next) {
  next();
})

router.get('/drive', function(req, res) {
  res.json("This page will periodically request driver's location")
})

router.post('drive', function(req, res) {
  next();
})

module.exports = router;
