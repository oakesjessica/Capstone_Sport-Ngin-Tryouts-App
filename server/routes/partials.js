var router = require('express').Router();
var path = require('path');
var jade = require('jade');

router.get('/', function(req, res){
  if(req.isAuthenticated()){
    res.render(path.join(__dirname, '../public/views/partials/tryoutManagement.jade'));
  } else {
    res.render(path.join(__dirname, '../public/views/partials/login.jade'));
  }
})
// router.get('/management', function(req, res){
//   if(req.isAuthenticated()){
//     res.render(path.join(__dirname, '../public/views/partials/tryoutManagement.jade'));
//   } else {
//     res.render(path.join(__dirname, '../public/views/partials/login.jade'));
//   }
//
// })


module.exports = router;
