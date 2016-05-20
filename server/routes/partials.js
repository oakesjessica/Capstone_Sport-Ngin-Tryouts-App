var router = require('express').Router();
var path = require('path');

router.get('/login', function(req, res){
  res.render(path.join(__dirname, '../public/views/partials/login.jade'));
});

router.get('/manage', function(req, res) {
  res.render(path.join(__dirname, '../public/views/partials/management.jade'));
});

module.exports = router;
