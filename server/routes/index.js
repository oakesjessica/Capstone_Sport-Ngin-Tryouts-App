var router = require('express').Router();
var path = require('path');
var request = require('request');
var Tryout = require('../../models/tryout.js');

router.get('/app/view/data', function(req, res){
  Tryout.find({'user_id' : req.user.id}).exec(function(err, tryouts){
    if(err){
      console.log('Error', err);
    }
    res.send(JSON.stringify(tryouts));
  });
});



router.get('/*', function(req, res){
  console.log('inside catch all');
  res.render(path.join(__dirname, '../public/views/app.jade'));
});

module.exports = router;
