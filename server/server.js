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
var bodyParser = require('body-parser');
var router = require('./routes/router');
var User = require('../models/user');
var Tryout = require('../models/tryout');

/*------------------------------------------------------------------
                            MongoDB
------------------------------------------------------------------*/
var mongoUri = 'mongodb://localhost/sportNginDB';
var mongoDB = mongoose.connect(mongoUri).connection;
mongoDB.on('error', function(err){
  console.log('MongoDB connection error', err);
});
mongoDB.once('open', function(){
  console.log('MongoDB connection open.');
});

/*------------------------------------------------------------------
                            Config
------------------------------------------------------------------*/
// app.use(morgan('dev'));
app.use(express.static('server/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/*------------------------------------------------------------------
                            Passport
------------------------------------------------------------------*/
app.use(session({
  secret: 'sportNgin',
  resave: true,
  saveUninitialized: false,
  cookie: {maxAge: 6000000, secure: false}
}));

passport.serializeUser(function(user, done){
  done(null, user.id);
});
passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    if(err){
      done(err);
    } else{
      done(null, user);
    }
  });
});

app.use(passport.initialize());
app.use(passport.session());

passport.use(new OAuth2Strategy({
    authorizationURL: 'https://user.sportngin.com/oauth/authorize',
    tokenURL: 'https://api-user.ngin.com/oauth/token',
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/sportngin/callback'
  },
  function(accessToken, refreshToken, profile, fourth, cb) {
    console.log(accessToken);
    var url = "http://api-user.ngin.com/oauth/me?access_token=" + profile.access_token;
    // console.log(url);

    var options = {json: true};
    options.url = url;

    request.get(options, function(err, response, body){
      if(!err && response.statusCode == 200){

        var newUser = {};
        User.findOne({ 'nginId': body.metadata.current_user.id }, function (err, user) {
          if(err){
            console.log(err);
          } else if(user==="" || user === null){
            //  Code here, add user to database
            newUser = new User({
              username: body.metadata.current_user.user_name,
              first_name: body.metadata.current_user.first_name,
              last_name: body.metadata.current_user.last_name,
              nginId: body.metadata.current_user.id
            });
            newUser.save(function(err){
              if(err){
                console.log('Issue saving to database with error', err);
                return cb(err, user);
              } else {
                console.log('user saved successfully');
                User.findOne({ 'nginId': body.metadata.current_user.id }, function(err, user) {
                  return cb(err, user);
                }); //  User.findOne
              } //  else
            }); //  newUser.save
          } else {
            return cb(err, user);
          } //  else
        }); //  User.findOne
      }  // if(!err && response.sendStatus === 200)
    }); //  request.get
  } //  function(accessToken)
)); //  passport.use



/*------------------------------------------------------------------
                            Routers
------------------------------------------------------------------*/
app.use('/', router);

/*------------------------------------------------------------------
                            Server
------------------------------------------------------------------*/
var server = app.listen(process.env.PORT || 3000, function(){
  var port = server.address().port;
  console.log('Listening on port', port);
});
