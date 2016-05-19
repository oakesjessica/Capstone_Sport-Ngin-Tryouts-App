var express = require('express');
var path = require('path');
var app = express();
var router = require('./routes/router');
var morgan = require('morgan');
//config
app.use(morgan('dev'));
app.use(express.static('server/public'));
// Router
app.use('/', router);

var server = app.listen(process.env.PORT || 3000, function(){
  var port = server.address().port;
  console.log('Listening on port', port);
})
