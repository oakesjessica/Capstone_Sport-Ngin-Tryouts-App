/**
* This is the router for all partial views
* Initial url is /app/view/[partial file]
*/
var router = require('express').Router();
var path = require('path');
var jade = require('jade');
var Tryout = require('../../models/tryout');

router.get('/', function(req, res){
  if(req.isAuthenticated()){
    res.render(path.join(__dirname, '../public/views/partials/tryoutManagement.jade'));
  } else {
    res.render(path.join(__dirname, '../public/views/partials/login.jade'));
  }
});


router.get('/new', function(req, res) {
  res.render(path.join(__dirname, '../public/views/partials/newTryout.jade'));
});

router.post('/new', function(req, res) {
  console.log(req.body, req.user.id);
  
});

router.get('/archives', function(req, res){
  res.render(path.join(__dirname, '../public/views/partials/archives.jade'));
});
module.exports = router;
