require('dotenv').config();
var express = require('express');
var path = require('path');
var app = express();
var morgan = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var OAuth2Strategy = require('passport-oauth2').Strategy;
var router = require('./routes/router');

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
app.use(morgan('dev'));
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
// passport.serializeUser(function(user, done){
//   done(null, user.id);
// });
// passport.deserializeUser(function(id, done){
//   User.findById(id, function(err, user){
//     if(err){
//       done(err)
//     } else{
//       done(null, user);
//     }
//   });
// });
app.use(passport.initialize());
app.use(passport.session());

passport.use(new OAuth2Strategy({
    authorizationURL: 'https://user.sportngin.com/oauth/authorize',
    tokenURL: 'https://api-user.ngin.com/oauth/token',
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/sportngin/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ exampleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
    console.log(accessToken, refreshToken, profile, cb);
  }
));

////////////////////////////////////////////////////////////////////
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
