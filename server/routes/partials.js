var router = require('express').Router();
var path = require('path');
var jade = require('jade');

router.get('/login', function(req, res){
  res.render(path.join(__dirname, '../public/views/partials/login.jade'));
})
router.get('/tryoutManagement', function(req, res){
  res.render(path.join(__dirname, '../public/views/partials/tryoutManagement.jade'));
})
module.exports = router;
