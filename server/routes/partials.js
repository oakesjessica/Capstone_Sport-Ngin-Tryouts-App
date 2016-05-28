/**
* This is the router for all partial views
* Initial url is /app/view/[partial file]
*/
var router = require('express').Router();
var path = require('path');
var jade = require('jade');
var mongoose = require('mongoose');
var moment = require('moment');
var request = require('request');
var code = require('../../modules/alphaNumRandomizer');
var addCateg = require('../../modules/playerCategories');
var Tryout = require('../../models/tryout');

router.get('/', function(req, res){
  if(req.isAuthenticated()){
    res.render(path.join(__dirname, '../public/views/partials/tryoutManagement.jade'));
  } else {
    res.render(path.join(__dirname, '../public/views/partials/login.jade'));
  }
}); //  router.get('/')

router.get('/new', function(req, res) {
  res.render(path.join(__dirname, '../public/views/partials/newTryout.jade'));
}); //  router.get('/new')

router.get('/edit', function(req, res) {
  res.render(path.join(__dirname, '../public/views/partials/editTryout.jade'));
}); //  router.get('/edit')

router.get('/players', function(req, res) {
  res.render(path.join(__dirname, '../public/views/partials/players.jade'));
}); //  router.get('/players')

router.get('/tryout', function(req, res){
  res.render(path.join(__dirname, '../public/views/partials/tryoutReviewPage.jade'));
}); //  router.get('/tryout')

router.get('/scoreplayer', function(req, res){
  res.render(path.join(__dirname, '../public/views/partials/scorePlayer.jade'));
}); //  router.get('/scoreplayer')

router.get('/archives', function(req, res){
  res.render(path.join(__dirname, '../public/views/partials/archives.jade'));
}); //  router.get('/archives')

router.get('/404', function(req, res) {
  res.render(path.join(__dirname, '../public/views/partials/404.jade'));
}); //  router.get('/404')

router.get('/scoreplayer/input', function(req, res) {
  var tryout_id = req.query.tryout_id;
  var player_id = req.query.player_id;

  Tryout.findOne({'_id': tryout_id}).select({'players': { $elemMatch: { 'player_id': player_id}}}).exec(function(err, player) {
    if (err) {
      console.log('Error retrieving player to evaluate');
      res.status(500).send(err);
    } else {
      console.log('Successfully retrieved player to evaluate');
      res.status(200).send(player);
    }
  }); //  Tryout.findOne
}); //  router.get('/scoreplayer/input')

router.put('/scoreplayer/:id', function(req, res) {
  var tryout_id = req.params.id;
  var player_id = req.body.player_id;
  var playerInfo = req.body;

  Tryout.update({
    '_id': tryout_id, 'players.player_id': player_id}, {
      '$set': {
        'players.$.categories': req.body.categories,
        'players.$.total': req.body.total
      }
    }, { new: true }, function(err, player) {
      if (err) {
        console.log('Error updating player scores', err);
        res.status(500).send(err);
      } else {
        res.status(200).send(player);
      }
    });
}); //  router.put('/scoreplayer')

router.delete('/:id', function(req, res) {
  if(req.isAuthenticated()) {
    var id = req.params.id;
    Tryout.findOneAndRemove({'_id': id}, function(err, tryout) {
      if (err) {
        console.log('Error deleting tryout', err);
        res.status(500).send(err);
      } else {
        console.log('Successfully deleted tryout');
        res.status(200).send(tryout);
      }
    }); //  Tryout.findOneAndRemove
  } //  if(req.isAuthenticated)
}); //  router.delete('/:id')

router.get('/guestcode/:id', function(req, res){
  var newCode = code.createRandomCodeString();

  Tryout.findByIdAndUpdate({'_id':req.params.id},{'code': newCode}, {new: true}, function(err, tryout){
    if(err){
      console.log('Error updating guest code', err);
      res.status(500).send(err);
    } else {
      console.log('Successfully updated guest code');
      res.status(200).send(tryout);
    }
  }); //  Tryout.findByIdAndUpdate
}); //  router.get('/guestcode/:id')

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
      },  //  headers
    };  //  apiOptions

    request.get(apiOptions, function(err, response, body){
      var surveyId = JSON.parse(body)[1].id;

      var surveyOptions = {
        url: 'https://api.sportngin.com/surveys/'+ surveyId +'/report',
        headers: {
          "Authorization": "Bearer " + access_token,
          "Accept" : "application/json",
          "NGIN-API-VERSION" : "0.1"
        } //  headers
      }; //  surveyOptions

      request.get(surveyOptions, function(err, response, body){
        res.send(JSON.parse(body));
      }); //  request.get(surveyOptions)
    }); //  request.get(apiOptions)
  }); //  request.post
}); //Testing Api


router.put('/players/:id', function(req, res) {
  Tryout.findOne({'_id':req.params.id}, function(err, tryout) {
    if (err) {
      console.log('Error saving players to db', err);
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
        } //  else
      }); //  Tryout.update
    } //  else
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

router.get('/tryout/get/:id', function(req,res){
  var id = req.params.id;

  Tryout.findOne({'_id':id}, function(err, tryout){
    if(err){
      console.log(err);
      res.status(500).send(err);
    } else{
      console.log("Successfully retrieved tryout");
      res.status(200).send(tryout);
    } //  else
  }); //  Tryout.findOne
}); //  request.get('/tryout/get/:id')


module.exports = router;
