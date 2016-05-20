var express = require('express');
var path = require('path');
var app = express();
var router = require('./routes/router');
var morgan = require('morgan');
var mongoose = require('mongoose');
//Database
var mongoUri = 'mongodb://localhost/sportNginDB';
var mongoDB = mongoose.connect(mongoUri).connection;
mongoDB.on('error', function(err){
  console.log('MongoDB connection error', err);
});
mongoDB.once('open', function(){
  console.log('MongoDB connection open.');
});
//config
app.use(morgan('dev'));
app.use(express.static('server/public'));
// Router
app.use('/', router);

var server = app.listen(process.env.PORT || 3000, function(){
  var port = server.address().port;
  console.log('Listening on port', port);
})
