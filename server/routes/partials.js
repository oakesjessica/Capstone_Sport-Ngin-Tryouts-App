/**
* This is the router for all partial views
* Initial url is /app/view/[partial file]
*/
var router = require('express').Router();
var path = require('path');
var jade = require('jade');
var Tryout = require('../../models/tryout');
var code = require('../../modules/randomCode');
var mongoose = require('mongoose');
var moment = require('moment');


router.get('/', function(req, res){
  if(req.isAuthenticated()){
    res.render(path.join(__dirname, '../public/views/partials/tryoutManagement.jade'));
  } else {
    res.render(path.join(__dirname, '../public/views/partials/login.jade'));
  }
});

router.get('/guestcode/:id', function(req, res){
  var newCode = code.createAccessCode();
  Tryout.findByIdAndUpdate({'_id':req.params.id},{'code': newCode}, {new: true}, function(err, tryout){
    if(err){
      console.log('err', err);
      res.sendStatus(500);
    } else {
      res.send(tryout);
    }
  });
});

router.get('/new', function(req, res) {
  res.render(path.join(__dirname, '../public/views/partials/newTryout.jade'));
});

router.post('/new', function(req, res) {
  console.log(req.body, req.user.id);
  var newTryout = new Tryout({
    title: req.body.title,
    date: req.body.date,
    time: req.body.time,
    categories: req.body.categories,
    user_id: req.user.id
  });
  newTryout.dateString = moment(newTryout.date).utcOffset(5).format('LL')
  newTryout.save(function(err) {
    if (err) {
      console.log('Error saving tryout to db', err);
      res.status(500).send(err);
    } else {
      console.log('Tryout successfully saved');
      res.sendStatus(200);
    }
  });
});

router.get('/archives', function(req, res){
  res.render(path.join(__dirname, '../public/views/partials/archives.jade'));
});
module.exports = router;
