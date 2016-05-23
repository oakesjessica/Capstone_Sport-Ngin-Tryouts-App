/**
* This is the router for all partial views
* Initial url is /app/view/[partial file]
*/
var router = require('express').Router();
var path = require('path');
var jade = require('jade');

router.get('/login', function(req, res){
  res.render(path.join(__dirname, '../public/views/partials/login.jade'));
}); //  login

router.get('/management', function(req, res){
  res.render(path.join(__dirname, '../public/views/partials/tryoutManagement.jade'));
}); //  management

router.get('/information', function(req, res) {
  res.render(path.join(__dirname, '../public/views/partials/tryoutInformation.jade'));
});

module.exports = router;
