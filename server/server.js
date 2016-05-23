require('dotenv').config();
var express = require('express');
var app = express();
var session = require('express-session');
var mongoose = require('mongoose');
var morgan = require('morgan');
var path = require('path');
var passport = require('passport');
var OAuth2Strategy = require('passport-oauth2').Strategy;
var request = require('request');

var router = require('./routes/router');
var User = require('../models/user');

////////////////////////////////////////////////////////////////////
//MongoDB
////////////////////////////////////////////////////////////////////
var mongoUri = 'mongodb://localhost/sportNginDB';
var mongoDB = mongoose.connect(mongoUri).connection;
mongoDB.on('error', function(err){
  console.log('MongoDB connection error', err);
});
mongoDB.once('open', function(){
  console.log('MongoDB connection open.');
});

////////////////////////////////////////////////////////////////////
//Config
////////////////////////////////////////////////////////////////////
// app.use(morgan('dev'));
app.use(express.static('server/public'));

////////////////////////////////////////////////////////////////////
//Passport
////////////////////////////////////////////////////////////////////
app.use(session({
  secret: 'sportNgin',
  resave: true,
  saveUninitialized: false,
  cookie: {maxAge: 600000, secure: false}
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new OAuth2Strategy({
    authorizationURL: 'https://user.sportngin.com/oauth/authorize',
    tokenURL: 'https://api-user.ngin.com/oauth/token',
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/sportngin/callback'
  },
  function(accessToken, refreshToken, profile, cb, fifth) {
    // console.log('profile', profile);
    console.log('accessToken', accessToken, 'refreshToken', refreshToken, 'profile', profile, 'cb', cb, 'fifth', fifth);

    var url = "http://api-user.ngin.com/oauth/me?access_token=" + accessToken;
    // console.log(url);

    var options = {}

    request.get(url, function(err, response, body){
      console.log('body', body);
      console.log('code', response.statusCode);
    })
    User.findOne({ '_id': profile.id }, function (err, user) {
      console.log(accessToken, refreshToken, "profile", profile, "id", profile.id, "cb", cb, 'fifth', fifth);
      if(err){
        console.log(err);
      } else if(user===""){
        //  Code here, add user to database
      } else {
        // return cb(err, user);
      }
    });
  } //  function(accessToken)
)); //  passport.use

///////////////////////////////////////// ///////////////////////////
//Routers
////////////////////////////////////////////////////////////////////
app.use('/', router);

////////////////////////////////////////////////////////////////////
//Server
////////////////////////////////////////////////////////////////////
var server = app.listen(process.env.PORT || 3000, function(){
  var port = server.address().port;
  console.log('Listening on port', port);
})
