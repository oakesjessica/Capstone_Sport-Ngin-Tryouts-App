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

router.delete('/:id', function(req, res) {
  if(req.isAuthenticated()) {
    var id = req.params.id;
    Tryout.findOneAndRemove({'_id': id}, function(err, tryout) {
      if (err) {
        console.log('Error deleting tryout');
        res.status(500).send(err);
      } else {
        console.log('Successfully deleted tryout');
        res.status(200).send(tryout);
      }
    });
  }
});

router.get('/guestcode/:id', function(req, res){
  var newCode = code.createAccessCode();
  Tryout.findByIdAndUpdate({'_id':req.params.id},{'code': newCode}, {new: true}, function(err, tryout){
    if(err){
      console.log('Error updating guest code', err);
      res.status(500).send(err);
    } else {
      res.status(200).send(tryout);
    }
  });
});

router.get('/new', function(req, res) {
  res.render(path.join(__dirname, '../public/views/partials/newTryout.jade'));
});

router.get('/edit', function(req, res) {
  res.render(path.join(__dirname, '../public/views/partials/editTryout.jade'));
});

router.get('/edit/:id', function(req, res) {
  var tryoutId = req.params.id;

  Tryout.find({'_id': tryoutId}).exec(function(err, tryout) {
    if(err) {
      console.log('Error fetching tryout to edit', err);
      res.status(500).send(err);
    } else {
      res.status(200).send(tryout);
    }
  }); //  Tryout.find
}); //  router.get

router.get('/players', function(req, res) {
  res.render(path.join(__dirname, '../public/views/partials/players.jade'));
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
  newTryout.dateString = moment(newTryout.date).utcOffset(5).format('LL');

  newTryout.save(function(err, tryout) {
    if (err) {
      console.log('Error saving tryout to db', err);
      res.status(500).send(err);
    } else {
      console.log('Tryout successfully saved');
      res.status(200).send(tryout);
    }
  });
});

router.get('/archives', function(req, res){
  res.render(path.join(__dirname, '../public/views/partials/archives.jade'));
});
module.exports = router;
