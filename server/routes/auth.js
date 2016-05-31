var router = require('express').Router();
var passport = require('passport');
var Tryout = require('../../models/tryout');
var User = require('../../models/user');

router.get('/sportngin', passport.authenticate('oauth2'));


router.get('/sportngin/callback',
  passport.authenticate('oauth2', {failureRedirect: '/'}),
  function(req, res) {
    res.redirect('/');
  }
);

router.get('/logout', function(req, res){
  console.log('Logging out!!!!');
  req.logout();
  res.redirect('/');
});

router.get('/check', function(req, res) {
  if(req.isAuthenticated()) {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } else {
    res.status(200).json({
      success: false
    });
  }
});
//Access Code
router.post('/guest', function(req, res){
  var code = req.body.code;
  Tryout.findOne({'code': code }, function(err, guest){
    if(err){
      console.log('Error', err);
      res.status(500).json({
        success: false
      });
    } else if(guest === '' || guest === null){
      res.status(404).json({
        success: false
      });
      console.log('no code found');
    } else {
      console.log(guest);

      User.findOne({ username: code }, function(err, user) {
        if (err) {
          console.log(err);
        } else if(user == "" || user == null) {
          var newUser = new User({
            username: code,
            guest: true
          });

          newUser.save(function(err, user) {
            if (err) {
              console.log(err);
            } else {
              req.login(user, function(err) {
                if(err) {
                  console.log(err);
                } else {
                  res.redirect('/');
                }
              })
            }
          });
        } else {
          req.login(user, function(err) {
            if (err) {
              console.log(err);
            } else {
              res.redirect('/');
            }
          });
        }
      })
    }
  });
});


module.exports = router;
