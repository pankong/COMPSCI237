"use strict";

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const engine = require('ejs-mate');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const MongoStore = require('connect-mongo/es5')(session);
const passport = require('passport');
var config = require('./config');

var port = process.env.PORT || 3000;

var User = require('./models/user.js');

var app = express();

// connect to MongoDB
mongoose.connect(config.getMongoDbConnectionString(), function(err) {
  if (err) console.log(err);
  else console.log("Connected to MongoDB");
})

// set static assets serving folder
app.use('/assets', express.static(__dirname + '/public'));
// add HTTP request logger middleware
app.use(morgan('dev'));
// add body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// add cookie parsing middleware
app.use(cookieParser());
// add session middleware
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.secretKey,
  store: new MongoStore({ url: config.getMongoDbConnectionString(), autoReconnect: true})
}));
// add flash messages middleware
app.use(flash());
// add authentication middleware
app.use(passport.initialize());
app.use(passport.session());
// set template engine
app.engine('ejs', engine);
app.set('view engine', 'ejs');
// create a middleware to add user to all routes
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');

app.use(mainRoutes);
app.use(userRoutes);


app.listen(port, function(err) {
  if (err) throw err;
  console.log("Server is Running on port " + port);
});
