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

router.get('/testAPI', function(req, res){
  var options = {
    url: "https://api-user.ngin.com/oauth/token?grant_type=refresh_token&client_id=" + process.env.CLIENT_ID +
    "&client_secret=" + process.env.CLIENT_SECRET + "&refresh_token=" + process.env.REFRESH_TOKEN
  };
  request.post(options, function(err, response, body){
    var apiOptions = {
      url: "https://api.sportngin.com/surveys?site_id=11854",
      headers: {
        "Authorization": "Bearer " + process.env.API_TOKEN,
        "Accept" : "application/json",
        "NGIN-API-VERSION" : "0.1"
      },
    };
    request.get(apiOptions, function(err, response, body){
      console.log(body);
      res.send(JSON.parse(body));
    });
  });
});
router.get('/*', function(req, res){
  res.render(path.join(__dirname, '../public/views/app.jade'));
});

module.exports = router;
