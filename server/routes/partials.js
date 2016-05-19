var router = require('express').Router()
var path = require('path')

router.get('/login', function(req, res){
  res.render(path.join(__dirname, '..public/views/login.jade'));
})

module.exports = router;
