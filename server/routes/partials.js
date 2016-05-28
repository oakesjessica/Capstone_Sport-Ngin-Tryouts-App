/**
* This is the router for all partial views
* Initial url is /app/view/[partial file]
*/
var router = require('express').Router();
var path = require('path');
var jade = require('jade');
var Tryout = require('../../models/tryout');
var code = require('../../modules/randomCode');
var addCateg = require('../../modules/playerCategories');
var mongoose = require('mongoose');
var moment = require('moment');
var request = require('request');

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
      console.log('Successfully updated guest code');
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

router.get('/tryout', function(req, res){
  res.render(path.join(__dirname, '../public/views/partials/tryoutReviewPage.jade'));
});

router.get('/doTheThing', function(req, res){
  res.render(path.join(__dirname, '../public/views/partials/individualPlayer.jade'));
});

router.get('/players/testAPI', function(req, res){
  var options = {
    url: "https://api-user.ngin.com/oauth/token?grant_type=refresh_token&client_id=" + process.env.CLIENT_ID +
    "&client_secret=" + process.env.CLIENT_SECRET + "&refresh_token=" + process.env.REFRESH_TOKEN
  };
  request.post(options, function(err, response, body){
    /// Turn into JSON object
    body = JSON.parse(body);
    var access_token = body.access_token;


    var apiOptions = {
      url: "https://api.sportngin.com/surveys?site_id=11854",
      headers: {
        "Authorization": "Bearer " + access_token,
        "Accept" : "application/json",
        "NGIN-API-VERSION" : "0.1"
      },
    };

    request.get(apiOptions, function(err, response, body){
      var surveyId = JSON.parse(body)[1].id;

      var surveyOptions = {
        url: 'https://api.sportngin.com/surveys/'+ surveyId +'/report',
        headers: {
          "Authorization": "Bearer " + access_token,
          "Accept" : "application/json",
          "NGIN-API-VERSION" : "0.1"
        }
      } //  surveyOptions

      request.get(surveyOptions, function(err, response, body){
        res.send(JSON.parse(body));
      });
    });
  });
}); //Testing Api

router.put('/players/:id', function(req, res) {
  Tryout.findOne({'_id':req.params.id}, function(err, tryout) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      var playersWithCategs = addCateg.add(req.body, tryout.categories);

      Tryout.update({'_id':req.params.id}, {'players': playersWithCategs}, {new: true}, function(err, newTryout) {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        } else {
          console.log('Successfully added players to db');
          res.status(200).send(newTryout);
          // res.send(newTryout)
        }
      }); //  Tryout.update
    }
  }); //  Tryout.findOne
}); //  router.put('players')


router.post('/new', function(req, res) {
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

router.get('/tryout/get/:id', function(req,res){
  var id = req.params.id;
  console.log(id, "id");
  Tryout.findOne({'_id':id}, function(err, tryout){
    if(err){
      console.log(err);
      res.status(500).send(err);
    }else{
      console.log("Successfully retrieved");
      res.status(200).send(tryout);
    }
  });
});



router.get('/404', function(req, res) {
  res.render(path.join(__dirname, '../public/views/partials/404.jade'));
});


module.exports = router;
